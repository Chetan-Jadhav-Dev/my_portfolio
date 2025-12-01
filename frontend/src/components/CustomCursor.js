import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const cursorDotRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;
        let cursorX = 0;
        let cursorY = 0;
        let dotX = 0;
        let dotY = 0;

        // Mouse move handler
        const handleMouseMove = (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        };

        // Mouse down/up handlers
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // Check if hovering over interactive elements
        const handleMouseOver = (e) => {
            const target = e.target;
            const className = target.className;

            // Check if className is a string (not SVGAnimatedString for SVG elements)
            const classNameStr = typeof className === 'string' ? className : className?.baseVal || '';

            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.onclick ||
                classNameStr.includes('clickable') ||
                classNameStr.includes('project-card') ||
                classNameStr.includes('skill-tag') ||
                target.closest('a') ||
                target.closest('button')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);

        // Animation loop for smooth cursor follow
        const animate = () => {
            // Smooth follow with easing
            dotX += (cursorX - dotX) * 0.15;
            dotY += (cursorY - dotY) * 0.15;

            if (cursor) {
                cursor.style.left = `${cursorX}px`;
                cursor.style.top = `${cursorY}px`;
            }

            if (cursorDot) {
                cursorDot.style.left = `${dotX}px`;
                cursorDot.style.top = `${dotY}px`;
            }

            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
            />
            <div
                ref={cursorDotRef}
                className={`custom-cursor-dot ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
            />
        </>
    );
};

export default CustomCursor;
