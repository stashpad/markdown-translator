import { parser as commonMarkParser } from '@lezer/markdown';
import { ChangeSpec, EditorState } from '@codemirror/state';
import { DoubleEqualsDelimited } from './markdown-extensions/doubleEqualsDelimited';
import { TreeCursor } from '@lezer/common';
import { DoubleTildeDelimited } from './markdown-extensions/doubleTildeDelimited';
import { SingleTildeDelimited } from './markdown-extensions/singleTildeDelimited';

/**
 * Convert a Bear markdown flavored document to a Stashpad markdown flavored
 * document.
 *
 * @param text The Bear markdown flavored document.
 * @returns The Stashpad markdown flavored document.
 *
 * @beta
 */
export function bearToStashpad(text: string): string {
  const parser = commonMarkParser.configure([
    DoubleTildeDelimited,
    DoubleEqualsDelimited,
    SingleTildeDelimited
  ]);
  const tree = parser.parse(text);
  const state = EditorState.create({ doc: text });
  const changes: ChangeSpec[] = [];

  let cursor = tree.cursor();
  do {
    switch (cursor.name) {
      // convert double tilde strikethrough to single tilde strikethrough
      case 'DoubleTildeMark':
        _generateStrikethroughChanges(cursor, changes);
        break;

      // convert double equals highlight to single equals highlight
      case 'DoubleEqualsMark':
        generateHighlightChanges(cursor, changes);
        break;

      // remove single tilde underlines
      case 'SingleTildeMark':
        generateUnderlineChanges(cursor, changes);
        break;

      // convert image metadata
      case 'Comment':
        generateImageChanges(cursor, state, changes);
        break;
    }
  } while (cursor.next());

  const transaction = state.update({ changes });
  return transaction.state.doc.toString();
}

/**
 * @internal
 */
function _generateStrikethroughChanges(
  cursor: TreeCursor,
  changes: ChangeSpec[]
) {
  changes.push({
    from: cursor.from,
    to: cursor.to,
    insert: '~'
  });
}

function generateHighlightChanges(cursor: TreeCursor, changes: ChangeSpec[]) {
  changes.push({
    from: cursor.from,
    to: cursor.to,
    insert: '='
  });
}

function generateUnderlineChanges(cursor: TreeCursor, changes: ChangeSpec[]) {
  changes.push({
    from: cursor.from,
    to: cursor.to,
    insert: ''
  });
}

function generateImageChanges(
  cursor: TreeCursor,
  state: EditorState,
  changes: ChangeSpec[]
) {
  if (cursor.name === 'Comment') {
    const curs = cursor.node.cursor();
    if (!curs.prevSibling()) {
      return;
    }
    if (curs.name === 'Image') {
      // remove the comment
      changes.push({
        from: cursor.from,
        to: cursor.to,
        insert: ''
      });

      // extract the comment metadata
      const comment = state.doc.sliceString(cursor.from, cursor.to);
      const match = /<!--(.*?)-->/.exec(comment);
      if (!match) return;
      const meta = JSON.parse(match[1]);
      const width = meta['width'];
      if (!width) return;

      const url = curs.node.getChild('URL');
      if (!url) return;
      changes.push({
        from: url.to,
        insert: ` | width=${width}`
      });
    }
  }
}
