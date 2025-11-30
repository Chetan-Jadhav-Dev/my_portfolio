import React from 'react';

function TestHome() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>Portfolio Test</h1>
      <p>If you see this, React is working!</p>
      <p>Check browser console (F12) for errors</p>
    </div>
  );
}

export default TestHome;

