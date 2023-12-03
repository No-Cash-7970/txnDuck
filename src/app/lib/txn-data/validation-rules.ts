/** @file Declaration and initialization of validation rules */

import {
  number as YupNumber,
  string as YupString,
  mixed as YupMixed,
  setLocale as YupSetLocale,
} from 'yup';
import { ValidationMessage } from './types';
import { ADDRESS_LENGTH } from './constants';

// Set how validation messages are formatted
YupSetLocale({
  // use constant translation keys for messages without values
  mixed: {
    required: (): ValidationMessage => ({key: 'form.error.required'}),
  },
  string: {
    length: ({length}): ValidationMessage => (
      {key: 'form.error.string.length', dict: {count: length}}
    ),
    max: ({max}): ValidationMessage => ({key: 'form.error.string.max', dict: {count: max}}),
  },
  number: {
    min: ({min}): ValidationMessage => ({key: 'form.error.number.min', dict: {min}}),
    max: ({max}): ValidationMessage => ({key: 'form.error.number.max', dict: {max}}),
  }
});

/** Validation schema for wallet address */
export const addressSchema = YupString().trim().length(ADDRESS_LENGTH);
/** Validation schemea for asset/application IDs */
export const idSchema = YupNumber().min(1);

export {YupMixed, YupNumber, YupString};
