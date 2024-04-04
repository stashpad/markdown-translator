import { MarkdownConfig } from '@lezer/markdown';
import { parseSingleCharDelim } from './common';

/**
 * @internal
 */
export const SingleTildeDelimited: MarkdownConfig = {
  defineNodes: [{ name: 'SingleTilde' }, { name: 'SingleTildeMark' }],
  parseInline: [
    {
      name: 'SingleTilde',
      parse: parseSingleCharDelim(126, 'SingleTilde', 'SingleTildeMark')
    }
  ]
};
