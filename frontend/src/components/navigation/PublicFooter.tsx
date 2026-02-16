import React from 'react';

const PublicFooter = () => {
  return (
    <footer>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/about">About</a></li>
        {/* Removed the line with 'Nosotros' */}
      </ul>
    </footer>
  );
};

export default PublicFooter;