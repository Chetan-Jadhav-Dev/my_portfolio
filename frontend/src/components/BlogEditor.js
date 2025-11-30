import React, { useState, useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShowHideToggle, SlideToggle } from './SlideToggle';
import './BlogEditor.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function BlogEditor({ blog, token, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setSlug(blog.slug || '');
      setExcerpt(blog.excerpt || '');
      setBannerImageUrl(blog.banner_image_url || '');
      setContent(blog.content || '');
      setAuthor(blog.author || 'Admin');
      setPublished(blog.published || false);
      setFeatured(blog.featured || false);
      setShowOnHomepage(blog.show_on_homepage || false);
      setTags(blog.tags ? blog.tags.join(', ') : '');
    }
  }, [blog]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!blog && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[-\s]+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title, blog]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'code-block'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'script', 'indent', 'direction',
    'color', 'background', 'align',
    'link', 'image', 'video', 'code-block'
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter content', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
      
      const blogData = {
        title,
        slug: slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[-\s]+/g, '-'),
        excerpt,
        banner_image_url: bannerImageUrl,
        content,
        author,
        published,
        featured,
        show_on_homepage: showOnHomepage,
        tags: tagsArray
      };

      if (blog) {
        await axios.put(`${API_URL}/blogs/${blog.id}`, blogData, { headers });
        toast.success('Blog updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await axios.post(`${API_URL}/blogs`, blogData, { headers });
        toast.success('Blog created successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(`Error saving blog: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <h2>{blog ? 'Edit Blog' : 'New Blog'}</h2>
        <div className="editor-actions">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="editor-form">
        <div className="form-row">
          <div className="form-group full-width">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Banner Image URL</label>
          <input
            type="text"
            value={bannerImageUrl}
            onChange={(e) => setBannerImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {bannerImageUrl && (
            <img src={bannerImageUrl} alt="Banner preview" className="banner-preview" />
          )}
        </div>

        <div className="form-group full-width">
          <label>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short description of the blog"
            rows="3"
          />
        </div>

        <div className="form-group full-width">
          <label>Content *</label>
          <div className="quill-wrapper">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your blog content here..."
              className="blog-quill-editor"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="technology, programming, tutorial"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Published</span>
              <SlideToggle checked={published} onChange={setPublished} />
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Featured</span>
              <SlideToggle checked={featured} onChange={setFeatured} />
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Show on Homepage</span>
              <ShowHideToggle checked={showOnHomepage} onChange={setShowOnHomepage} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogEditor;

