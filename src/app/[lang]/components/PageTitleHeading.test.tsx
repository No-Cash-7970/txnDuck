import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({get: () => 'foo'})
}));

import PageTitleHeading from './PageTitleHeading';

describe('PageTitleHeading Component', () => {

  it('has heading', () => {
    render(<PageTitleHeading>Hello!</PageTitleHeading>);
    expect(screen.getByRole('heading')).toHaveTextContent('Hello!');
  });

  it('has badge with preset name if `showTxnPreset` is true', async() => {
    render(<PageTitleHeading showTxnPreset={true}></PageTitleHeading>);
    expect(await screen.findByText('foo.heading')).toBeInTheDocument();
  });

  it('does not have badge with preset name if `showTxnPreset` is false', () => {
    render(<PageTitleHeading showTxnPreset={false}></PageTitleHeading>);
    expect(screen.queryByText('foo.heading')).not.toBeInTheDocument();
  });

});
