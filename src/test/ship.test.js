import {
  shipCordinates, isHit, isSunk, isPositionValid,
} from '../index';

test('Horizontal cordinates return correctly', () => {
  const result = ['1a', '2a', '3a', '4a', '5a'];
  expect(shipCordinates('1a', 'horizontal', 5)).toStrictEqual(result);
});

test('Vertical cordinates return correctly', () => {
  const result = ['1a', '1b', '1c', '1d', '1e'];
  expect(shipCordinates('1a', 'vertical', 5)).toStrictEqual(result);
});

test('is Boat hit true?', () => {
  expect(isHit('10i')).toBe(true);
});

test('is Boat hit false?', () => {
  expect(isHit('1b')).toBe(false);
});

test('is sunk true?', () => {
  expect(isSunk(4)).toBe(true);
});

test('is sunk false?', () => {
  expect(isSunk(3)).toBe(undefined);
});

test('is position valid true', () => {
  expect(isPositionValid(1, 97, 'vertical', 5)).toBe(true);
});
