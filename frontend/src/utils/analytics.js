// Analytics tracking utility
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
};

// Track event
export const trackEvent = async (eventType, data = {}) => {
  try {
    const sessionId = getSessionId();
    await fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        event_type: eventType,
        ...data
      })
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track page view
export const trackPageView = () => {
  trackEvent('page_view', {
    section: 'home',
    timestamp: new Date().toISOString()
  });
};

// Track section view
export const trackSectionView = (section) => {
  trackEvent('section_view', {
    section: section,
    timestamp: new Date().toISOString()
  });
};

// Track project click
export const trackProjectClick = (projectId, projectName) => {
  trackEvent('project_click', {
    section: 'projects',
    item_id: projectId,
    item_name: projectName,
    timestamp: new Date().toISOString()
  });
};

// Track link click
export const trackLinkClick = (linkType, url) => {
  trackEvent('link_click', {
    section: 'links',
    item_name: linkType,
    referrer: url,
    timestamp: new Date().toISOString()
  });
};

// Track time spent
export const trackTimeSpent = (section, duration) => {
  trackEvent('time_spent', {
    section: section,
    duration: duration,
    timestamp: new Date().toISOString()
  });
};

