import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (paramName: string) => (paramName === 'preset' ? 'foo' : null)
  })
}));

import PageTitleHeading from './PageTitleHeading';

describe('PageTitleHeading Component', () => {

  it('has heading', () => {
    render(<PageTitleHeading>Hello!</PageTitleHeading>);
    expect(screen.getByRole('heading')).toHaveTextContent('Hello!');
  });

  it('has badge with preset name if `showTxnPreset` is true', async() => {
    render(<PageTitleHeading showTxnPreset={true}></PageTitleHeading>);
    expect(await screen.findByText(/foo\.heading/)).toBeInTheDocument();
  });

  it('does not have badge with preset name if `showTxnPreset` is false', () => {
    render(<PageTitleHeading showTxnPreset={false}></PageTitleHeading>);
    expect(screen.queryByText(/foo\.heading/)).not.toBeInTheDocument();
  });

  it('does not have badge if the "import" parameter is present in the URL', () => {
    render(<PageTitleHeading showTxnPreset={false}></PageTitleHeading>);
    expect(screen.queryByText(/foo\.heading/)).not.toBeInTheDocument();
  });

});
