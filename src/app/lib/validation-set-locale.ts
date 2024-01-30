import { setLocale } from 'yup';
import { ValidationMessage } from './utils';

// Run function to set how validation messages are formatted
setLocale({
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
