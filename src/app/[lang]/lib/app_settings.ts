import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// '' = automatic
// 'duck' = light mode
// 'duck_dark' = dark mode
export const darkModeAtom = atomWithStorage('darkMode', '');
