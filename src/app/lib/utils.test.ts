import '@testing-library/jest-dom';
import { baseUnitsToDecimal, decimalToBaseUnits, removeNonNumericalChars } from './utils';

describe('Utilities Functions', () => {
  describe('decimalToBaseUnits()', () => {

    it('converts whole number with no decimals', () => {
      expect(decimalToBaseUnits('25', 0)).toBe('25');
      expect(decimalToBaseUnits('025', 0)).toBe('25');
      expect(decimalToBaseUnits('250', 0)).toBe('250');
      expect(decimalToBaseUnits(250, 1)).toBe('2500');
      expect(decimalToBaseUnits('25')).toBe('25');
      expect(decimalToBaseUnits(42, 5)).toBe('4200000');
      expect(decimalToBaseUnits('0025', 3)).toBe('25000');
    });

    it('converts small (< 1) numbers', () => {
      expect(decimalToBaseUnits('.5')).toBe('0');
      expect(decimalToBaseUnits('00.001', 1)).toBe('0');
      expect(decimalToBaseUnits('.001', 1)).toBe('0');
      expect(decimalToBaseUnits('.25', 3)).toBe('250');
      expect(decimalToBaseUnits('.025', 3)).toBe('25');
      expect(decimalToBaseUnits('.0025', 3)).toBe('2');
      expect(decimalToBaseUnits('.0025000', 3)).toBe('2');
      expect(decimalToBaseUnits('0.0025', 3)).toBe('2');
    });

    it('converts medium-sized (> 1 and < 10_000_000) numbers', () => {
      expect(decimalToBaseUnits('2.5', 0)).toBe('2');
      expect(decimalToBaseUnits(2.5)).toBe('2');
      expect(decimalToBaseUnits('2.5', 3)).toBe('2500');
      expect(decimalToBaseUnits(2.5)).toBe('2');
      expect(decimalToBaseUnits(123.456, 7)).toBe('1234560000');
    });

    it("converts 0 and empty values to '0' base units", () => {
      expect(decimalToBaseUnits('0', 0)).toBe('0');
      expect(decimalToBaseUnits(0, 0)).toBe('0');
      expect(decimalToBaseUnits('0')).toBe('0');
      expect(decimalToBaseUnits('0', 10)).toBe('0');
      expect(decimalToBaseUnits('0.0', 10)).toBe('0');
      expect(decimalToBaseUnits('', 0)).toBe('0');
      expect(decimalToBaseUnits('')).toBe('0');
      expect(decimalToBaseUnits()).toBe('0');
    });

    it('can convert the output of baseUnitsToDecimal()', () => {
      expect(decimalToBaseUnits(baseUnitsToDecimal('42', 1), 3)).toBe('4200');
      expect(decimalToBaseUnits(baseUnitsToDecimal('420', 1), 3)).toBe('42000');
      expect(decimalToBaseUnits(baseUnitsToDecimal('00021', 10), 3)).toBe('0');
      expect(decimalToBaseUnits(baseUnitsToDecimal(41))).toBe('41');
    });

  });

  describe('baseUnitsToDecimal()', () => {

    it('convert numbers strings of various lengths', () => {
      expect(baseUnitsToDecimal('25', 0)).toBe('25');
      expect(baseUnitsToDecimal('25')).toBe('25');
      expect(baseUnitsToDecimal('250', 0)).toBe('250');
      expect(baseUnitsToDecimal('2500', 1)).toBe('250');
      expect(baseUnitsToDecimal('25000000', 6)).toBe('25');
      expect(baseUnitsToDecimal('250000000', 10)).toBe('0.025');
    });

    it('converts `number` types of various lengths', () => {
      expect(baseUnitsToDecimal(25000, 3)).toBe('25');
      expect(baseUnitsToDecimal(2500, 3)).toBe('2.5');
      expect(baseUnitsToDecimal(250, 3)).toBe('0.25');
      expect(baseUnitsToDecimal(25, 3)).toBe('0.025');
      expect(baseUnitsToDecimal(2, 3)).toBe('0.002');
      expect(baseUnitsToDecimal(4200000, 5)).toBe('42');
    });

    it('converts numbers with leading zeros', () => {
      expect(baseUnitsToDecimal('025', 0)).toBe('25');
      expect(baseUnitsToDecimal('00001', 1)).toBe('0.1');
      expect(baseUnitsToDecimal('001', 1)).toBe('0.1');
      expect(baseUnitsToDecimal('0010000', 2)).toBe('100');
    });

    it("converts 0 and empty values to '0'", () => {
      expect(baseUnitsToDecimal(0, 0)).toBe('0');
      expect(baseUnitsToDecimal('0')).toBe('0');
      expect(baseUnitsToDecimal('0', 10)).toBe('0');
      expect(baseUnitsToDecimal('00', 10)).toBe('0');
      expect(baseUnitsToDecimal('', 0)).toBe('0');
      expect(baseUnitsToDecimal('')).toBe('0');
    });

    it('converts `number` types of various lengths', () => {
      expect(baseUnitsToDecimal(25000, 3)).toBe('25');
      expect(baseUnitsToDecimal(2500, 3)).toBe('2.5');
      expect(baseUnitsToDecimal(250, 3)).toBe('0.25');
      expect(baseUnitsToDecimal(25, 3)).toBe('0.025');
      expect(baseUnitsToDecimal(2, 3)).toBe('0.002');
      expect(baseUnitsToDecimal(4200000, 5)).toBe('42');
    });

    it('can convert the output of decimalToBaseUnits()', () => {
      expect(baseUnitsToDecimal(decimalToBaseUnits('25', 3), 3)).toBe('25');
      expect(baseUnitsToDecimal(decimalToBaseUnits('.25', 3), 3)).toBe('0.25');
      expect(baseUnitsToDecimal(decimalToBaseUnits('0.025'))).toBe('0');
      expect(baseUnitsToDecimal(decimalToBaseUnits(4.2, 1), 3)).toBe('0.042');
    });

  });

  describe('removeNonNumericalChars()', () => {

    it('removes whitespace', () => {
      expect(removeNonNumericalChars('12 34\t5')).toBe('12345');
    });

    it('removes letters', () => {
      expect(removeNonNumericalChars('12hr34min5sec')).toBe('12345');
    });

    it('removes punctuation', () => {
      expect(removeNonNumericalChars('($12.34+5)')).toBe('12345');
    });

    it('removes non-ASCII characters', () => {
      expect(removeNonNumericalChars('©123🦆45°)')).toBe('12345');
    });

    it('does not remove any characters if all characters in given string are numbers', () => {
      expect(removeNonNumericalChars('12345')).toBe('12345');
    });

    it('removes all characters if given string has no numbers', () => {
      expect(removeNonNumericalChars('foobar')).toBe('');
    });

    it('returns empty string if given empty string', () => {
      expect(removeNonNumericalChars('')).toBe('');
    });

  });

});
