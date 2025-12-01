import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTwitter, FaLinkedin, FaFacebookF, FaLink } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import Prism components in correct order (dependencies first)
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

// Import line numbers plugin
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

import './BlogPost.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ author_name: '', author_email: '', content: '' });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyForm, setReplyForm] = useState({ author_name: '', content: '' });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (blog) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        try {
          Prism.highlightAll();
        } catch (error) {
          console.error('Error highlighting code:', error);
        }
      }, 100);
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/slug/${slug}`);
      setBlog(response.data);
      if (response.data) {
        fetchLikes(response.data.id);
        fetchComments(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async (blogId) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${blogId}/likes`);
      setLikes(response.data.count || 0);
      setLiked(response.data.liked || false);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchComments = async (blogId) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${blogId}/comments`);
      const commentsData = response.data || [];
      setComments(commentsData);
      
      // Fetch like status for all comments and replies
      const commentLikesMap = {};
      for (const comment of commentsData) {
        try {
          const likeResponse = await axios.get(`${API_URL}/comments/${comment.id}/likes`);
          commentLikesMap[comment.id] = likeResponse.data.liked || false;
        } catch (error) {
          console.error(`Error fetching likes for comment ${comment.id}:`, error);
        }
        
        // Fetch likes for replies
        if (comment.replies && comment.replies.length > 0) {
          for (const reply of comment.replies) {
            try {
              const replyLikeResponse = await axios.get(`${API_URL}/comments/${reply.id}/likes`);
              commentLikesMap[reply.id] = replyLikeResponse.data.liked || false;
            } catch (error) {
              console.error(`Error fetching likes for reply ${reply.id}:`, error);
            }
          }
        }
      }
      setCommentLikes(commentLikesMap);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!blog || liked) return; // Prevent double-liking
    try {
      const response = await axios.post(`${API_URL}/blogs/${blog.id}/like`);
      setLiked(true);
      // Update count from response
      if (response.data.count !== undefined) {
        setLikes(response.data.count);
      } else {
        setLikes(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error liking blog:', error);
      // If already liked, update state
      if (error.response?.status === 200 && error.response?.data?.liked) {
        setLiked(true);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!blog || !commentForm.content.trim()) return;

    try {
      await axios.post(`${API_URL}/blogs/${blog.id}/comments`, commentForm);
      setCommentForm({ author_name: '', author_email: '', content: '' });
      fetchComments(blog.id);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!blog || !replyForm.content.trim()) return;

    try {
      await axios.post(`${API_URL}/blogs/${blog.id}/comments`, {
        ...replyForm,
        parent_id: parentId
      });
      setReplyForm({ author_name: '', content: '' });
      setReplyingTo(null);
      fetchComments(blog.id);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this blog post';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const handleCommentLike = async (commentId) => {
    if (!blog) return;

    try {
      const response = await axios.post(`${API_URL}/comments/${commentId}/like`);
      
      // Update like status
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: response.data.liked
      }));

      // Update comment like count in comments array
      setComments(prevComments => {
        const updateCommentLikes = (comments) => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, like_count: response.data.count || 0 };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === commentId) {
                    return { ...reply, like_count: response.data.count || 0 };
                  }
                  return reply;
                })
              };
            }
            return comment;
          });
        };
        return updateCommentLikes(prevComments);
      });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const loadMoreComments = () => {
    setVisibleComments(prev => prev + 5);
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
      <div className="blog-post-container">
        <div className="loading-post">Loading blog post...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-post-container">
        <div className="error-post">
          <h2>Blog Not Found</h2>
          <button onClick={() => navigate('/blog')}>Back to Blogs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        {blog.banner_image_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="blog-banner"
          >
            <img src={blog.banner_image_url} alt={blog.title} />
          </motion.div>
        )}

        <div className="blog-post-content">
          <motion.header
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="blog-post-header"
          >
            {blog.featured && <span className="blog-featured-badge">⭐ Featured</span>}
            <h1>{blog.title}</h1>
            <div className="blog-post-meta">
              <span className="blog-author">{blog.author}</span>
              <span className="blog-date">{formatDate(blog.published_at || blog.created_at)}</span>
              {blog.reading_time && (
                <span className="blog-reading-time">{blog.reading_time} min read</span>
              )}
              <span className="blog-views">👁️ {blog.views || 0} views</span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="blog-tag">{tag}</span>
                ))}
              </div>
            )}
          </motion.header>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="blog-post-body"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Facebook-Style Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="blog-action-bar"
          >
            <div className="action-stats">
              <span className="stat-item">
                <FaHeart style={{ color: liked ? '#8b5cf6' : 'var(--text-secondary)' }} />
                {likes > 0 && <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>}
              </span>
              <span className="stat-item">
                {comments.length > 0 && <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>}
              </span>
            </div>

            <div className="action-buttons">
              <motion.button
                onClick={handleLike}
                className={`action-btn like-action ${liked ? 'active' : ''}`}
                disabled={liked}
                whileHover={{ scale: liked ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {liked ? <FaHeart /> : <FaRegHeart />}
                <span>Like</span>
              </motion.button>

              <motion.button
                onClick={() => setShowComments(!showComments)}
                className="action-btn comment-action"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaComment />
                <span>Comment</span>
              </motion.button>

              <motion.div className="share-container">
                <motion.button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="action-btn share-action"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShare />
                  <span>Share</span>
                </motion.button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="share-dropdown"
                    >
                      <button onClick={() => handleShare('twitter')} className="share-option">
                        <FaTwitter style={{ color: '#1DA1F2' }} />
                        <span>Twitter</span>
                      </button>
                      <button onClick={() => handleShare('linkedin')} className="share-option">
                        <FaLinkedin style={{ color: '#0077B5' }} />
                        <span>LinkedIn</span>
                      </button>
                      <button onClick={() => handleShare('facebook')} className="share-option">
                        <FaFacebookF style={{ color: '#1877F2' }} />
                        <span>Facebook</span>
                      </button>
                      <button onClick={() => handleShare('copy')} className="share-option">
                        <FaLink style={{ color: '#8b5cf6' }} />
                        <span>Copy Link</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          {/* Comments Section - Now Collapsible */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="comments-section"
              >
                <h3>Comments ({comments.length})</h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={commentForm.author_name}
                      onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email (optional)"
                      value={commentForm.author_email}
                      onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
                    />
                  </div>
                  <textarea
                    placeholder="Write a comment..."
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    rows="4"
                    required
                  />
                  <button type="submit" className="submit-comment-btn">Post Comment</button>
                </form>

                {/* Comments List */}
                <div className="comments-list">
                  {comments.slice(0, visibleComments).map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar">
                        <div className="avatar-circle">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="comment-content-wrapper">
                        <div className="comment-bubble">
                          <div className="comment-header">
                            <strong>{comment.author_name}</strong>
                          </div>
                          <div className="comment-content">{comment.content}</div>
                        </div>

                        <div className="comment-actions">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className={`comment-action-btn like-btn ${commentLikes[comment.id] ? 'liked' : ''}`}
                          >
                            {commentLikes[comment.id] ? '👍' : '👍🏻'} Like
                            {comment.like_count > 1 && (
                              <span className="like-count">{comment.like_count}</span>
                            )}
                          </button>
                          <button
                            className="comment-action-btn reply-btn"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          >
                            Reply
                          </button>
                          <span className="comment-date">{formatDate(comment.created_at)}</span>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <form
                            className="reply-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleReplySubmit(comment.id);
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={replyForm.author_name}
                              onChange={(e) => setReplyForm({ ...replyForm, author_name: e.target.value })}
                              required
                            />
                            <textarea
                              placeholder="Write a reply..."
                              value={replyForm.content}
                              onChange={(e) => setReplyForm({ ...replyForm, content: e.target.value })}
                              rows="3"
                              required
                            />
                            <div className="reply-actions">
                              <button type="submit" className="submit-reply-btn">Post Reply</button>
                              <button
                                type="button"
                                className="cancel-reply-btn"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyForm({ author_name: '', content: '' });
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="replies">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="reply-item">
                                <div className="comment-avatar">
                                  <div className="avatar-circle small">
                                    {reply.author_name.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div className="comment-content-wrapper">
                                  <div className="comment-bubble">
                                    <div className="comment-header">
                                      <strong>{reply.author_name}</strong>
                                    </div>
                                    <div className="comment-content">{reply.content}</div>
                                  </div>
                                  <div className="comment-actions">
                                    <button
                                      onClick={() => handleCommentLike(reply.id)}
                                      className={`comment-action-btn like-btn ${commentLikes[reply.id] ? 'liked' : ''}`}
                                    >
                                      {commentLikes[reply.id] ? '👍' : '👍🏻'} Like
                                      {reply.like_count > 1 && (
                                        <span className="like-count">{reply.like_count}</span>
                                      )}
                                    </button>
                                    <span className="comment-date">{formatDate(reply.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* View More Comments Button */}
                  {comments.length > visibleComments && (
                    <button
                      onClick={loadMoreComments}
                      className="view-more-comments-btn"
                    >
                      View {Math.min(5, comments.length - visibleComments)} more comment{comments.length - visibleComments > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Blogs Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="back-to-blogs-container"
          >
            <button onClick={() => navigate('/blog')} className="back-to-blogs-btn">
              ← Back to Blogs
            </button>
          </motion.div>
        </div>
      </article>
    </div>
  );
}

export default BlogPost;
