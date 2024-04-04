import { InlineContext, MarkdownConfig } from '@lezer/markdown';
import { Punctuation } from './common';

const DoubleTildeDelim = { resolve: 'DoubleTilde', mark: 'DoubleTildeMark' };

/**
 * @internal
 */
export const DoubleTildeDelimited: MarkdownConfig = {
  defineNodes: [
    {
      name: 'DoubleTilde'
    },
    {
      name: 'DoubleTildeMark'
    }
  ],
  parseInline: [
    {
      name: 'DoubleTilde',
      parse(cx: InlineContext, next: number, pos: number) {
        if (
          next != 126 /* '~' */ ||
          cx.char(pos + 1) != 126 ||
          cx.char(pos + 2) == 126
        )
          return -1;
        let before = cx.slice(pos - 1, pos),
          after = cx.slice(pos + 2, pos + 3);
        let sBefore = /\s|^$/.test(before),
          sAfter = /\s|^$/.test(after);
        let pBefore = Punctuation.test(before),
          pAfter = Punctuation.test(after);
        return cx.addDelimiter(
          DoubleTildeDelim,
          pos,
          pos + 2,
          !sAfter && (!pAfter || sBefore || pBefore),
          !sBefore && (!pBefore || sAfter || pAfter)
        );
      },
      after: 'Emphasis'
    }
  ]
};
