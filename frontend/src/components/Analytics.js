import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Analytics.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Analytics({ token }) {
  const [stats, setStats] = useState(null);
  const [realtime, setRealtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRealtime();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchStats();
        fetchRealtime();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [token, autoRefresh]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const fetchRealtime = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/realtime`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRealtime(response.data);
    } catch (error) {
      console.error('Error fetching realtime stats:', error);
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  if (!stats) {
    return <div className="analytics-error">No analytics data available</div>;
  }

  // Prepare hourly traffic data
  const hourlyData = stats.hourly_traffic?.map(h => ({
    hour: `${h.hour}:00`,
    views: h.count
  })) || [];

  // Prepare section views data
  const sectionData = stats.section_views?.map(s => ({
    name: s.section || 'Unknown',
    value: s.count
  })) || [];

  // Prepare country data
  const countryData = stats.visitors_by_country?.slice(0, 10).map(c => ({
    country: c.country,
    visitors: c.count
  })) || [];

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <label className="auto-refresh-toggle">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto Refresh (30s)
        </label>
      </div>

      {/* Real-time Stats */}
      {realtime && (
        <div className="realtime-stats">
          <div className="stat-card">
            <h3>Visitors (Last Hour)</h3>
            <p className="stat-value">{realtime.visitors_last_hour}</p>
          </div>
          <div className="stat-card">
            <h3>Views (Last Hour)</h3>
            <p className="stat-value">{realtime.views_last_hour}</p>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Visitors</h3>
          <p className="stat-value">{stats.total_visitors}</p>
        </div>
        <div className="stat-card">
          <h3>Total Page Views</h3>
          <p className="stat-value">{stats.total_views}</p>
        </div>
        <div className="stat-card">
          <h3>Top Projects</h3>
          <p className="stat-value">{stats.top_projects?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Countries</h3>
          <p className="stat-value">{stats.visitors_by_country?.length || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Hourly Traffic Chart */}
        <div className="chart-container">
          <h3>Hourly Traffic (Last 24 Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Section Views Chart */}
        <div className="chart-container">
          <h3>Section Views</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sectionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Countries Chart */}
        <div className="chart-container">
          <h3>Visitors by Country</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visitors" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Projects */}
        <div className="chart-container">
          <h3>Top Projects</h3>
          <div className="top-projects-list">
            {stats.top_projects?.slice(0, 10).map((project, index) => (
              <div key={index} className="project-stat-item">
                <span className="project-rank">{index + 1}</span>
                <span className="project-name">{project.name}</span>
                <span className="project-count">{project.count} clicks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Data */}
      <div className="location-section">
        <h3>Recent Locations</h3>
        <div className="location-grid">
          {stats.visitors_by_city?.slice(0, 20).map((location, index) => (
            <div key={index} className="location-card">
              <span className="location-city">{location.city}</span>
              <span className="location-country">{location.country}</span>
              <span className="location-count">{location.count} visitors</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {stats.recent_activity?.slice(0, 20).map((activity, index) => (
            <div key={index} className="activity-item">
              <span className="activity-type">{activity.event_type}</span>
              <span className="activity-section">{activity.section || 'N/A'}</span>
              <span className="activity-location">{activity.city}, {activity.country}</span>
              <span className="activity-time">
                {new Date(activity.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;

