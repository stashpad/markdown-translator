import bear0 from './data/bear-0.md?raw';
import bear1 from './data/bear-1.md?raw';
import sp0 from './data/sp-0.md?raw';
import sp1 from './data/sp-1.md?raw';
import { describe, expect, test } from 'vitest';
import { bearToStashpad } from '../../src/bear';

const simpleTests: [string, string][] = [
  ['~underlines~', 'underlines'],
  ['~~strikethrough~~', '~strikethrough~'],
  ['==highlight==', '=highlight='],
  ['![](chef-tent.png)', '![](chef-tent.png)'],
  ['![](chef-tent.png)<!-- {"width":10} -->', '![](chef-tent.png | width=10)']
];

const fileTests = [
  [bear0, sp0],
  [bear1, sp1]
];

describe('Bear', () => {
  describe('Simple Tests', () => {
    simpleTests.forEach(([bear, sp]) => {
      test(bear, () => {
        expect(bearToStashpad(bear)).toEqual(sp);
      });
    });
  });
  describe('Full file tests', () => {
    fileTests.forEach(([bear, sp], index) => {
      test(`File set ${index + 1}`, () => {
        expect(bearToStashpad(bear)).toEqual(sp);
      });
    });
  });
});
