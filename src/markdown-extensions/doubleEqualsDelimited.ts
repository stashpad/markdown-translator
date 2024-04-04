import { InlineContext, MarkdownConfig } from '@lezer/markdown';
import { Punctuation } from './common';

const DoubleEqualsDelim = { resolve: 'DoubleEquals', mark: 'DoubleEqualsMark' };

/**
 * @internal
 */
export const DoubleEqualsDelimited: MarkdownConfig = {
  defineNodes: [
    {
      name: 'DoubleEquals'
    },
    {
      name: 'DoubleEqualsMark'
    }
  ],
  parseInline: [
    {
      name: 'DoubleEquals',
      parse(cx: InlineContext, next: number, pos: number) {
        if (
          next != 61 /* '=' */ ||
          cx.char(pos + 1) != 61 ||
          cx.char(pos + 2) == 61
        )
          return -1;
        let before = cx.slice(pos - 1, pos),
          after = cx.slice(pos + 2, pos + 3);
        let sBefore = /\s|^$/.test(before),
          sAfter = /\s|^$/.test(after);
        let pBefore = Punctuation.test(before),
          pAfter = Punctuation.test(after);
        return cx.addDelimiter(
          DoubleEqualsDelim,
          pos,
          pos + 2,
          !sAfter && (!pAfter || sBefore || pBefore),
          !sBefore && (!pBefore || sAfter || pAfter)
        );
      }
    }
  ]
};
