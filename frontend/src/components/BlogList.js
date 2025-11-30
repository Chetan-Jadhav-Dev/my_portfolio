import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './BlogList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs?published=true`);
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="loading-blogs">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="blog-list-container" ref={ref}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="blog-list-header"
      >
        <h1>Blog</h1>
        <p>Thoughts, tutorials, and insights</p>
      </motion.div>

      {blogs.length === 0 ? (
        <div className="no-blogs">
          <p>No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              className="blog-card"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/blog/${blog.slug}`)}
            >
              {blog.banner_image_url && (
                <div className="blog-card-image">
                  <img src={blog.banner_image_url} alt={blog.title} />
                </div>
              )}
              <div className="blog-card-content">
                {blog.featured && <span className="blog-featured-badge">⭐ Featured</span>}
                <h2>{blog.title}</h2>
                {blog.excerpt && <p className="blog-excerpt">{blog.excerpt}</p>}
                <div className="blog-card-meta">
                  <span className="blog-author">{blog.author}</span>
                  <span className="blog-date">{formatDate(blog.published_at || blog.created_at)}</span>
                  {blog.reading_time && (
                    <span className="blog-reading-time">{blog.reading_time} min read</span>
                  )}
                </div>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags">
                    {blog.tags.map((tag, i) => (
                      <span key={i} className="blog-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;

