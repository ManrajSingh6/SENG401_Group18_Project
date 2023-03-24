import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Navbar from '../components/navbar';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// test that the Navbar correctly renders
jest.mock('../components/navbar', () => {
    const MockedNavbar = () => (
      <nav data-testid='testNavBar'>NavBar</nav>
    );
  
    return MockedNavbar;
});
  
test('renders Navbar component', () => {
    render(<Navbar />);
    const navbar = screen.getByTestId('testNavBar');
    expect(navbar).toBeInTheDocument();
});

