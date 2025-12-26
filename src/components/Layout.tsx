import React from 'react';
import { MainNavbar } from './MainNavbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavbar = true,
  showFooter = true
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && (
        <header role="banner">
          <MainNavbar />
        </header>
      )}
      
      <div className="relative flex-1 animate-fade-in">
        {children}
      </div>
      
      {showFooter && (
        <footer role="contentinfo">
          <Footer />
        </footer>
      )}
    </div>
  );
};