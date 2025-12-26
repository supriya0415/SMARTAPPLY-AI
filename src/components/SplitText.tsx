import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: { [key: string]: any };
  to?: { [key: string]: any };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isAnimatedRef.current) return;

    // Split text into characters or words
    const splitText = (text: string, type: 'chars' | 'words' | 'lines') => {
      if (type === 'chars') {
        return text.split('').map((char, index) => (
          char === ' ' ? '\u00A0' : char // Replace spaces with non-breaking spaces
        ));
      } else if (type === 'words') {
        return text.split(' ');
      }
      return [text]; // Default to lines (single line)
    };

    const elements = splitText(text, splitType);
    
    // Clear container and create spans
    container.innerHTML = '';
    const spans: HTMLElement[] = [];
    
    elements.forEach((element, index) => {
      const span = document.createElement('span');
      span.textContent = element;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      
      // Apply initial 'from' styles
      Object.entries(from).forEach(([key, value]) => {
        if (key === 'opacity') {
          span.style.opacity = value.toString();
        } else if (key === 'y') {
          span.style.transform = `translateY(${value}px)`;
        } else if (key === 'x') {
          span.style.transform = `translateX(${value}px)`;
        } else if (key === 'scale') {
          span.style.transform = `scale(${value})`;
        }
      });
      
      container.appendChild(span);
      spans.push(span);
      
      // Add space after each word (except the last one)
      if (splitType === 'words' && index < elements.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        container.appendChild(space);
      }
    });

    // Create Intersection Observer for scroll-triggered animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimatedRef.current) {
            isAnimatedRef.current = true;
            
            // Animate each span with stagger
            spans.forEach((span, index) => {
              gsap.fromTo(
                span,
                from,
                {
                  ...to,
                  duration,
                  ease,
                  delay: delay / 1000 + index * 0.05, // Convert delay to seconds and add stagger
                  onComplete: index === spans.length - 1 ? onLetterAnimationComplete : undefined,
                }
              );
            });
            
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, onLetterAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        textAlign,
      }}
    />
  );
};

export default SplitText;