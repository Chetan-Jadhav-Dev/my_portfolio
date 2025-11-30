import React, { useState, useRef, useEffect } from 'react';
import './SlideToggle.css';

// Show/Hide Toggle (from codepen design)
export const ShowHideToggle = ({ checked, onChange, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const btnRef = useRef(null);
  const startXRef = useRef(0);
  const startLeftRef = useRef(0);

  useEffect(() => {
    if (checked && btnRef.current && sliderRef.current) {
      btnRef.current.style.left = `${sliderRef.current.offsetWidth - btnRef.current.offsetWidth - 2}px`;
    } else if (btnRef.current) {
      btnRef.current.style.left = '2px';
    }
  }, [checked]);

  const handleMouseDown = (e) => {
    if (!sliderRef.current || !btnRef.current) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startLeftRef.current = btnRef.current.offsetLeft;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !sliderRef.current || !btnRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      let newLeft = startLeftRef.current + deltaX;
      newLeft = Math.max(2, Math.min(newLeft, sliderRef.current.offsetWidth - btnRef.current.offsetWidth - 2));
      btnRef.current.style.left = `${newLeft}px`;
    };

    const handleMouseUp = () => {
      if (!isDragging || !sliderRef.current || !btnRef.current) return;
      setIsDragging(false);
      
      const threshold = sliderRef.current.offsetWidth - btnRef.current.offsetWidth - 10;
      if (btnRef.current.offsetLeft > threshold) {
        onChange(true);
        btnRef.current.style.left = `${sliderRef.current.offsetWidth - btnRef.current.offsetWidth - 2}px`;
      } else {
        onChange(false);
        btnRef.current.style.left = '2px';
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, onChange]);

  return (
    <div className="show-hide-slider-container" ref={sliderRef}>
      <div className="show-hide-slider-track">
        <div 
          className={`show-hide-slider-btn ${checked ? 'active' : ''}`}
          ref={btnRef}
          onMouseDown={handleMouseDown}
        >
          {checked ? '✓' : '✕'}
        </div>
      </div>
    </div>
  );
};

// Published/Featured Toggle (from local HTML design)
export const SlideToggle = ({ checked, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const btnRef = useRef(null);
  const startXRef = useRef(0);
  const startLeftRef = useRef(0);

  useEffect(() => {
    if (checked && btnRef.current && containerRef.current) {
      btnRef.current.style.left = `${containerRef.current.offsetWidth - btnRef.current.offsetWidth - 2}px`;
      containerRef.current.classList.add('published');
    } else if (btnRef.current && containerRef.current) {
      btnRef.current.style.left = '2px';
      containerRef.current.classList.remove('published');
    }
  }, [checked]);

  const handleMouseDown = (e) => {
    if (!containerRef.current || !btnRef.current) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startLeftRef.current = btnRef.current.offsetLeft;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current || !btnRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      let newLeft = startLeftRef.current + deltaX;
      newLeft = Math.max(2, Math.min(newLeft, containerRef.current.offsetWidth - btnRef.current.offsetWidth - 2));
      btnRef.current.style.left = `${newLeft}px`;
    };

    const handleMouseUp = () => {
      if (!isDragging || !containerRef.current || !btnRef.current) return;
      setIsDragging(false);
      
      const threshold = containerRef.current.offsetWidth - btnRef.current.offsetWidth - 10;
      if (btnRef.current.offsetLeft > threshold) {
        onChange(true);
        btnRef.current.style.left = `${containerRef.current.offsetWidth - btnRef.current.offsetWidth - 2}px`;
        containerRef.current.classList.add('published');
      } else {
        onChange(false);
        btnRef.current.style.left = '2px';
        containerRef.current.classList.remove('published');
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, onChange]);

  return (
    <div className="slide-container" ref={containerRef}>
      <div className="slider-track">
        <div 
          className="slider-btn" 
          ref={btnRef}
          onMouseDown={handleMouseDown}
        >
          →
        </div>
      </div>
    </div>
  );
};

