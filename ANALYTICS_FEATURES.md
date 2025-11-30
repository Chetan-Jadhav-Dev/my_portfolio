# Analytics & Dashboard Features

## Overview

Your portfolio website now includes a comprehensive analytics system and an enhanced admin dashboard with modern UI features.

## New Features

### 1. Enhanced Admin Dashboard

#### Sidebar Menu
- **Collapsible Sidebar**: Click the hamburger menu (☰) to hide/show the sidebar
- **Menu Items**: 
  - 📊 Analytics (default view)
  - 👤 About
  - 💼 Projects
  - ⚡ Skills
- **Active State**: Current page is highlighted with a colored border

#### Dark/Light Mode
- **Theme Toggle**: Click the sun/moon icon (☀️/🌙) in the top navigation
- **Persistent**: Your theme preference is saved in localStorage
- **Smooth Transitions**: All colors transition smoothly when switching themes

### 2. Analytics System

#### What's Tracked
- **Page Views**: Every time someone visits your portfolio
- **Section Views**: When users scroll to different sections (About, Projects, Skills)
- **Project Clicks**: When users click on project links (GitHub, Live Demo)
- **Link Clicks**: Social media and email link clicks
- **User Locations**: City and country based on IP address
- **Session Tracking**: Unique visitor identification

#### Analytics Dashboard Features

**Real-time Stats (Last Hour)**
- Visitors count
- Page views count
- Recent locations

**Overall Statistics**
- Total visitors
- Total page views
- Number of top projects
- Number of countries

**Charts & Graphs**
1. **Hourly Traffic Chart**: Line chart showing traffic over the last 24 hours
2. **Section Views Pie Chart**: Shows which sections are viewed most
3. **Visitors by Country Bar Chart**: Top 10 countries with most visitors
4. **Top Projects List**: Most clicked projects with click counts

**Location Data**
- Recent visitor locations (city and country)
- Visitor count per location
- Top 20 cities displayed

**Recent Activity Feed**
- Real-time activity log
- Shows event type, section, location, and timestamp
- Last 20 activities displayed

### 3. Database Schema

The analytics data is stored in the `Analytics` table with the following fields:
- `session_id`: Unique identifier for each visitor session
- `event_type`: Type of interaction (page_view, section_view, project_click, etc.)
- `section`: Which section of the portfolio (about, projects, skills)
- `item_id`: ID of the clicked item (project ID, etc.)
- `item_name`: Name of the clicked item
- `ip_address`: Visitor's IP address
- `user_agent`: Browser information
- `country`: Visitor's country
- `city`: Visitor's city
- `referrer`: Where the visitor came from
- `timestamp`: When the event occurred
- `duration`: Time spent (in seconds)

## How to Use

### Accessing Analytics

1. Login to admin dashboard: `http://localhost:3000/admin`
2. Default credentials:
   - Username: `admin`
   - Password: `admin123`
3. The Analytics tab is the default view when you login

### Viewing Analytics

- **Auto Refresh**: Toggle auto-refresh to update stats every 30 seconds
- **Real-time Data**: See live visitor activity
- **Historical Data**: View trends and patterns over time

### Querying Analytics Data

You can query the analytics data directly from the database:

```python
from app import app, db
from models import Analytics

with app.app_context():
    # Get all page views
    page_views = Analytics.query.filter_by(event_type='page_view').all()
    
    # Get visitors from a specific country
    us_visitors = Analytics.query.filter_by(country='United States').all()
    
    # Get most viewed sections
    from sqlalchemy import func
    section_stats = db.session.query(
        Analytics.section,
        func.count(Analytics.id).label('count')
    ).group_by(Analytics.section).all()
```

## API Endpoints

### Track Event (Public)
```
POST /api/analytics/track
Body: {
  "session_id": "string",
  "event_type": "page_view|section_view|project_click|link_click",
  "section": "string",
  "item_id": number,
  "item_name": "string",
  "duration": number
}
```

### Get Analytics Stats (Admin Only)
```
GET /api/analytics/stats
Headers: Authorization: Bearer <token>
Returns: Complete analytics statistics
```

### Get Real-time Stats (Admin Only)
```
GET /api/analytics/realtime
Headers: Authorization: Bearer <token>
Returns: Last hour statistics
```

## Privacy & GDPR

- IP addresses are stored for location tracking
- Consider adding a privacy policy if required by your jurisdiction
- You can anonymize IP addresses by hashing them before storage
- Session IDs are stored in localStorage on the client side

## Location Tracking

The system uses the free `ipapi.co` service for IP geolocation:
- Free tier: 1,000 requests per day
- For production, consider upgrading or using a paid service
- Location data may not be 100% accurate

## Performance Considerations

- Analytics tracking is asynchronous and won't block page loads
- Database queries are optimized with indexes
- Consider adding database indexes for frequently queried fields:
  ```python
  # In models.py
  __table_args__ = (
      db.Index('idx_timestamp', 'timestamp'),
      db.Index('idx_event_type', 'event_type'),
      db.Index('idx_country', 'country'),
  )
  ```

## Future Enhancements

Potential improvements:
- Export analytics data to CSV/JSON
- Email reports (daily/weekly summaries)
- Custom date range filtering
- User journey tracking
- Heatmaps
- A/B testing support
- Conversion tracking

## Troubleshooting

### Analytics not showing data
- Make sure the Analytics table exists in the database
- Check that tracking events are being sent (check browser console)
- Verify API endpoints are accessible

### Location data showing "Unknown"
- IP geolocation service may be rate-limited
- Localhost IPs (127.0.0.1) won't resolve to locations
- Check network connectivity

### Charts not rendering
- Ensure recharts library is installed: `npm install recharts`
- Check browser console for errors
- Verify data is being returned from API

## Security Notes

- Analytics endpoints require admin authentication
- Public tracking endpoint doesn't require auth (by design)
- Consider rate limiting the tracking endpoint to prevent abuse
- Sanitize all user inputs before storing in database

