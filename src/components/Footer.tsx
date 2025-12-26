import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/20 bg-card/50 backdrop-blur-sm py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-foreground font-bold">© 2025 SmartApply AI</span>
          </div>
          <div className="flex space-x-6">
            <a 
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Home
            </a>
            <a 
              href="/assessment"
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Career Discovery
            </a>
            <a 
              href="/resume-upload"
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Resume Optimizer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};