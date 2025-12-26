import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Skip Link Component for Accessibility
 * Allows keyboard users to skip to main content
 * WCAG 2.1 Compliance: Success Criterion 2.4.1
 */
export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="skip-link focus:not-sr-only"
      aria-label="Skip to main content"
    >
      {children}
    </a>
  );
};