import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export enum ThemeModes  {
  auto = '',
  light = 'duck',
  dark = 'duck_dark',
};

export const darkModeAtom = atomWithStorage('darkMode', ThemeModes.auto);
