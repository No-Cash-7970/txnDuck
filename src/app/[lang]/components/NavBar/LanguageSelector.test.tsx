import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/current/url/of/page',
  useSearchParams: () => ({toString: () => 'q=yes'})
}));

// Mock I18n settings
jest.mock('../../../../app/i18n/settings', () => ({
  supportedLangs: {
    foo: {
      name: 'Foo Language',
      listName: 'Foo Language (Machine-translated)',
      country: 'foo-o'
    },
    bar: {
      name: 'Bar Language',
      listName: 'Bar Language (42)',
      country: 'baz-z'
    }
  }
}));

import LanguageSelector from './LanguageSelector';

describe('Language Selector', () => {

  it('displays current language', () => {
    render(<LanguageSelector lng='foo' />);
    expect(screen.getByRole('button')).toHaveTextContent(/Foo Language/);
    expect(screen.getByRole('button')).toHaveTextContent(/FOO/);
  });

  it('displays list of languages in menu', async () => {
    render(<LanguageSelector />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Foo Language (Machine-translated)')).toBeInTheDocument();
    expect(screen.getByText('Bar Language (42)')).toBeInTheDocument();
  });

});
