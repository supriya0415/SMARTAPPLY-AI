import React from 'react';
import { GlassNavbar } from '../components/GlassNavbar';

// Example usage of the GlassNavbar component
export const ExamplePage: React.FC = () => {
  const handleGetStarted = () => {
    console.log('Get Started clicked!');
    // Add your custom logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Glass Navbar */}
      <GlassNavbar onGetStarted={handleGetStarted} />
      
      {/* Main content with proper spacing for fixed navbar */}
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <section id="hero" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to SmartApply AI
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your AI-powered career mentor for personalized guidance
              </p>
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Your Journey
              </button>
            </div>
          </section>

          <section id="features" className="py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
              <p className="text-gray-600">Discover what makes our platform special</p>
            </div>
          </section>

          <section id="about" className="py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600">Learn more about our mission</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};