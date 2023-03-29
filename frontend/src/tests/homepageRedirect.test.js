import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import Navbar from '../components/navbar';

describe('Navbar', () => {
  it('redirects to the homepage when the logo is clicked', () => {
    const { getByAltText, history } = render(
      <Router>
        <Navbar />
      </Router>
    );

    const logoImg = getByAltText('logo-img');
    fireEvent.click(logoImg);

    expect(history.location.pathname).toBe('/');
  });
});
