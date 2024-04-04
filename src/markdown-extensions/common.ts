import { InlineContext } from '@lezer/markdown';

/**
 * @internal
 */
export const Punctuation =
  /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;

/**
 * @internal
 */
export function space(ch: number) {
  return ch == 32 || ch == 9 || ch == 10 || ch == 13;
}

/**
 * @internal
 */
export function parseSingleCharDelim(ch: number, node: string, mark: string) {
  return (cx: InlineContext, next: number, pos: number) => {
    if (next != ch || cx.char(pos + 1) == ch) return -1;
    let elts = [cx.elt(mark, pos, pos + 1)];
    for (let i = pos + 1; i < cx.end; i++) {
      let next = cx.char(i);
      if (next == ch)
        return cx.addElement(
          cx.elt(node, pos, i + 1, elts.concat(cx.elt(mark, i, i + 1)))
        );
      if (next == 92 /* '\\' */) elts.push(cx.elt('Escape', i, i++ + 2));
      if (space(next)) break;
    }
    return -1;
  };
}
