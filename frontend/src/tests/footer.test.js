import {render, screen} from '@testing-library/react';
import Footer from '../components/footer';
import '@testing-library/jest-dom';

test('renders footer with correct year', () => {
    render(<Footer />);
    const footer = screen.getByText(`© ${new Date().getFullYear()} The Loop`);
    expect(footer).toBeInTheDocument();
  });
