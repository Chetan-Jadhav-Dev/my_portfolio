import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Analytics from './Analytics';
import BlogEditor from './BlogEditor';
import { ShowHideToggle } from './SlideToggle';
import './Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [undoStack, setUndoStack] = useState([]); // Store recent deletions for undo
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null, onCancel: null });
  const [githubSettings, setGithubSettings] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [notifications, setNotifications] = useState({ unread_likes: 0, unread_comments: 0, total_unread: 0 });
  
  // Load activeTab from localStorage, default to 'analytics'
  // Use function initializer to ensure it's only read once on mount
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedTab = localStorage.getItem('adminActiveTab');
      // Validate that saved tab is a valid tab name
      const validTabs = ['analytics', 'about', 'projects', 'skills', 'experience', 'contact', 'activity', 'github', 'blog', 'blog-editor', 'notifications'];
      if (savedTab && validTabs.includes(savedTab)) {
        return savedTab;
      }
    } catch (error) {
      console.error('Error reading adminActiveTab from localStorage:', error);
    }
    return 'analytics';
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const savedSidebarState = localStorage.getItem('adminSidebarOpen');
      return savedSidebarState !== null ? savedSidebarState === 'true' : true;
    } catch (error) {
      console.error('Error reading adminSidebarOpen from localStorage:', error);
      return true;
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('darkMode') === 'true';
    } catch (error) {
      console.error('Error reading darkMode from localStorage:', error);
      return false;
    }
  });
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    detailed_description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    image_url: '',
    screenshots: ''
  });
  
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: '',
    proficiency: 0,
    icon: ''
  });
  
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    position: '',
    start_date: '',
    end_date: 'Present',
    location: '',
    short_description: '',
    detailed_description: '',
    technologies: '',
    company_logo_url: '',
    order: 0
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Save activeTab to localStorage whenever it changes
  // This ensures the tab persists across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem('adminActiveTab', activeTab);
      console.log('Saved activeTab to localStorage:', activeTab);
    } catch (error) {
      console.error('Error saving adminActiveTab to localStorage:', error);
    }
  }, [activeTab]);
  
  // Verify activeTab is loaded correctly on mount (for debugging)
  useEffect(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab && savedTab !== activeTab) {
      console.log('Mismatch detected - localStorage has:', savedTab, 'but state has:', activeTab);
      // Restore from localStorage if there's a mismatch
      setActiveTab(savedTab);
    }
  }, []); // Only run on mount

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchData();
      fetchNotifications();
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/notifications`, { headers });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });
      const newToken = response.data.access_token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      setIsAuthenticated(true);
      setError('');
      fetchData();
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [aboutRes, projectsRes, skillsRes, expRes, contactsRes, activityRes, githubRes] = await Promise.all([
        axios.get(`${API_URL}/about`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/skills`),
        axios.get(`${API_URL}/experience`),
        axios.get(`${API_URL}/contact`, { headers }),
        axios.get(`${API_URL}/activity`, { headers }),
        axios.get(`${API_URL}/github/settings`, { headers }).catch(() => ({ data: null }))
      ]);
      
      setAbout(aboutRes.data);
      setProjects(projectsRes.data);
      setSkills(skillsRes.data);
      setExperience(expRes.data);
      setContacts(contactsRes.data);
      setActivityLogs(activityRes.data);
      if (githubRes.data) {
        setGithubSettings(githubRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchGithubRepos = async () => {
    if (!token) {
      toast.error('Please login first', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setLoadingRepos(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/github/repos`, { headers });
      const repos = response.data.repos || [];
      setGithubRepos(repos);
      if (repos.length > 0) {
        toast.success(`Successfully fetched ${repos.length} repositories!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.warning('No repositories found. Please check your GitHub username and token in settings.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('GitHub repos fetch error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch repositories. Check console for details.';
      toast.error(`Error: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoadingRepos(false);
    }
  };

  const updateGithubSettings = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Ensure selected_repos is a JSON string if it's an array
      const settingsToUpdate = {
        ...data,
        selected_repos: Array.isArray(data.selected_repos) 
          ? JSON.stringify(data.selected_repos) 
          : data.selected_repos
      };
      const response = await axios.put(`${API_URL}/github/settings`, settingsToUpdate, { headers });
      setGithubSettings(response.data);
      toast.success('GitHub settings updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      // Refresh repos list after saving
      if (settingsToUpdate.github_username) {
        fetchGithubRepos();
      }
    } catch (error) {
      console.error('Error updating GitHub settings:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update settings';
      toast.error(`Error: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const fetchBlogs = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/blogs/all`, { headers });
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error(`Error fetching blogs: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id);
    const blogTitle = blog?.title || 'Blog';
    
    showConfirmModal(
      `Are you sure you want to delete "${blogTitle}"?`,
      async () => {
        try {
          const response = await axios.delete(`${API_URL}/blogs/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchBlogs();
          toast.success(`${blogTitle} deleted successfully!`, {
            position: "top-right",
            autoClose: 5000,
          });
        } catch (error) {
          toast.error('Error deleting blog', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    );
  };

  const updateAbout = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      // Handle hero_top_skills - convert comma-separated string to array
      if (data.hero_top_skills) {
        data.hero_top_skills = data.hero_top_skills.split(',').map(s => s.trim()).filter(s => s).slice(0, 5).join(',');
      }
      
      await axios.put(`${API_URL}/about`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      toast.success('About information updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error updating about information', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const screenshots = projectForm.screenshots ? projectForm.screenshots.split(',').map(s => s.trim()).filter(s => s) : [];
      const data = {
        ...projectForm,
        technologies: projectForm.technologies.split(',').map(t => t.trim()),
        screenshots: screenshots
      };
      await axios.post(`${API_URL}/projects`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjectForm({
        title: '',
        description: '',
        detailed_description: '',
        technologies: '',
        github_url: '',
        live_url: '',
        image_url: '',
        screenshots: ''
      });
      fetchData();
      alert('Project created!');
    } catch (error) {
      alert('Error creating project');
    }
  };

  const updateProject = async (e) => {
    e.preventDefault();
    try {
      const screenshots = projectForm.screenshots ? projectForm.screenshots.split(',').map(s => s.trim()).filter(s => s) : [];
      const data = {
        ...projectForm,
        technologies: projectForm.technologies.split(',').map(t => t.trim()),
        screenshots: screenshots
      };
      await axios.put(`${API_URL}/projects/${editingProject.id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        detailed_description: '',
        technologies: '',
        github_url: '',
        live_url: '',
        image_url: '',
        screenshots: ''
      });
      fetchData();
      toast.success('Project updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error updating project', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const showConfirmModal = (message, onConfirm, onCancel = null) => {
    setConfirmModal({
      show: true,
      message,
      onConfirm: () => {
        setConfirmModal({ show: false, message: '', onConfirm: null, onCancel: null });
        onConfirm();
      },
      onCancel: () => {
        setConfirmModal({ show: false, message: '', onConfirm: null, onCancel: null });
        if (onCancel) onCancel();
      }
    });
  };

  const deleteProject = async (id) => {
    const project = projects.find(p => p.id === id);
    const projectName = project?.title || 'Project';
    
    showConfirmModal(
      `Are you sure you want to delete "${projectName}"?`,
      async () => {
        try {
          const response = await axios.delete(`${API_URL}/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Add to undo stack
          if (response.data.deleted_data) {
            setUndoStack(prev => [{
              activityId: response.data.activity_id || null,
              entityType: 'project',
              entityId: id,
              entityName: projectName,
              deletedData: response.data.deleted_data,
              timestamp: new Date()
            }, ...prev.slice(0, 9)]); // Keep last 10 items
          }
          
          fetchData();
          toast.success(`${projectName} deleted successfully!`, {
            position: "top-right",
            autoClose: 5000,
          });
        } catch (error) {
          toast.error('Error deleting project', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    );
  };
  
  const undoDelete = async (entityType, entityId, deletedData) => {
    try {
      // Find the activity log entry for this deletion
      const activity = activityLogs.find(a => 
        a.action === 'delete' && 
        a.entity_type === entityType && 
        a.entity_id === entityId &&
        !a.undone
      );
      
      if (activity) {
        await axios.post(`${API_URL}/activity/undo/${activity.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        toast.success(`${entityType} restored successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error('Unable to undo: Activity log not found', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error undoing deletion', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const createSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/skills`, skillForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkillForm({ name: '', category: '', proficiency: 0, icon: '' });
      fetchData();
      toast.success('Skill created successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error creating skill', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const updateSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/skills/${editingSkill.id}`, skillForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingSkill(null);
      setSkillForm({ name: '', category: '', proficiency: 0       });
      fetchData();
      toast.success('Skill updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error updating skill', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const deleteSkill = async (id) => {
    const skill = skills.find(s => s.id === id);
    const skillName = skill?.name || 'Skill';
    
    showConfirmModal(
      `Are you sure you want to delete "${skillName}"?`,
      async () => {
        try {
          const response = await axios.delete(`${API_URL}/skills/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Add to undo stack
          if (response.data.deleted_data) {
            setUndoStack(prev => [{
              activityId: response.data.activity_id || null,
              entityType: 'skill',
              entityId: id,
              entityName: skillName,
              deletedData: response.data.deleted_data,
              timestamp: new Date()
            }, ...prev.slice(0, 9)]);
          }
          
          fetchData();
          toast.success(`${skillName} deleted successfully!`, {
            position: "top-right",
            autoClose: 5000,
          });
        } catch (error) {
          toast.error('Error deleting skill', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    );
  };

  const startEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      detailed_description: project.detailed_description || '',
      technologies: project.technologies.join(', '),
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      image_url: project.image_url || '',
      screenshots: project.screenshots ? project.screenshots.join(', ') : ''
    });
  };

  const startEditSkill = (skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      category: skill.category || '',
      proficiency: skill.proficiency,
      icon: skill.icon || ''
    });
  };
  
  // Experience management functions
  const createExperience = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...experienceForm,
        technologies: experienceForm.technologies ? experienceForm.technologies.split(',').map(t => t.trim()) : []
      };
      await axios.post(`${API_URL}/experience`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExperienceForm({
        company: '',
        position: '',
        start_date: '',
        end_date: 'Present',
        location: '',
        short_description: '',
        detailed_description: '',
        technologies: '',
        company_logo_url: '',
        order: 0
      });
      fetchData();
      toast.success('Experience created successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error creating experience', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  const updateExperience = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...experienceForm,
        technologies: experienceForm.technologies ? experienceForm.technologies.split(',').map(t => t.trim()) : []
      };
      await axios.put(`${API_URL}/experience/${editingExperience.id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingExperience(null);
      setExperienceForm({
        company: '',
        position: '',
        start_date: '',
        end_date: 'Present',
        location: '',
        short_description: '',
        detailed_description: '',
        technologies: '',
        company_logo_url: '',
        order: 0
      });
      fetchData();
      toast.success('Experience updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error updating experience', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  const deleteExperience = async (id) => {
    const exp = experience.find(e => e.id === id);
    const expName = exp ? `${exp.position} at ${exp.company}` : 'Experience';
    
    showConfirmModal(
      `Are you sure you want to delete "${expName}"?`,
      async () => {
        try {
          const response = await axios.delete(`${API_URL}/experience/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Add to undo stack
          if (response.data.deleted_data) {
            setUndoStack(prev => [{
              activityId: response.data.activity_id || null,
              entityType: 'experience',
              entityId: id,
              entityName: expName,
              deletedData: response.data.deleted_data,
              timestamp: new Date()
            }, ...prev.slice(0, 9)]);
          }
          
          fetchData();
          toast.success(`${expName} deleted successfully!`, {
            position: "top-right",
            autoClose: 5000,
          });
        } catch (error) {
          toast.error('Error deleting experience', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    );
  };
  
  const startEditExperience = (exp) => {
    setEditingExperience(exp);
    setExperienceForm({
      company: exp.company,
      position: exp.position,
      start_date: exp.start_date,
      end_date: exp.end_date || 'Present',
      location: exp.location || '',
      short_description: exp.short_description || '',
      detailed_description: exp.detailed_description || '',
      technologies: exp.technologies ? exp.technologies.join(', ') : '',
      company_logo_url: exp.company_logo_url || '',
      order: exp.order || 0
    });
  };
  
  const markContactRead = async (id) => {
    try {
        await axios.put(`${API_URL}/contact/${id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        toast.success('Contact marked as read', {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        toast.error('Error marking contact as read', {
          position: "top-right",
          autoClose: 3000,
        });
      }
  };
  
  const deleteContact = async (id) => {
    const contact = contacts.find(c => c.id === id);
    const contactName = contact ? `Contact from ${contact.name}` : 'Contact';
    
    showConfirmModal(
      `Are you sure you want to delete "${contactName}"?`,
      async () => {
        try {
          const response = await axios.delete(`${API_URL}/contact/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Add to undo stack
          if (response.data.deleted_data) {
            setUndoStack(prev => [{
              activityId: response.data.activity_id || null,
              entityType: 'contact',
              entityId: id,
              entityName: contactName,
              deletedData: response.data.deleted_data,
              timestamp: new Date()
            }, ...prev.slice(0, 9)]);
          }
          
          fetchData();
          toast.success(`${contactName} deleted successfully!`, {
            position: "top-right",
            autoClose: 5000,
          });
        } catch (error) {
          toast.error('Error deleting contact', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Admin Login</h2>
          <form onSubmit={login}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="admin-nav">
        <div className="nav-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '☰' : '☰'}
          </button>
          <h1>Admin Dashboard</h1>
        </div>
        <div className="nav-right">
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="admin-layout">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="menu-icon">📊</span>
              <span className="menu-text">Analytics</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <span className="menu-icon">👤</span>
              <span className="menu-text">About</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <span className="menu-icon">💼</span>
              <span className="menu-text">Projects</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <span className="menu-icon">⚡</span>
              <span className="menu-text">Skills</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <span className="menu-icon">💼</span>
              <span className="menu-text">Experience</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <span className="menu-icon">📧</span>
              <span className="menu-text">Contact</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <span className="menu-icon">📋</span>
              <span className="menu-text">Activity Log</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'github' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('github');
                if (!githubSettings) {
                  fetchData();
                }
                if (githubSettings?.github_username) {
                  fetchGithubRepos();
                }
              }}
            >
              <span className="menu-icon">🐙</span>
              <span className="menu-text">GitHub</span>
            </button>
            <button 
              className={`menu-item ${activeTab === 'blog' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('blog');
                fetchBlogs();
              }}
            >
              <span className="menu-icon">📝</span>
              <span className="menu-text">Blogs</span>
            </button>
          </div>
        </aside>

        <main className={`admin-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {activeTab === 'analytics' && <Analytics token={token} />}
          
          {activeTab === 'about' && (
            <div className="admin-section">
              <h2>Edit About Information</h2>
              {!about ? (
                <p>Loading about information...</p>
              ) : (
              <form onSubmit={updateAbout} className="about-form">
                <div className="form-group full-width">
                  <label>Name *</label>
                  <input name="name" defaultValue={about?.name || ''} placeholder="Your Full Name" required />
                </div>
                <div className="form-group full-width">
                  <label>Title/Position</label>
                  <input name="title" defaultValue={about?.title || ''} placeholder="e.g., Senior Data Engineer" />
                </div>
                <div className="form-group full-width">
                  <label>Profile Image URL</label>
                  <input name="profile_image_url" defaultValue={about?.profile_image_url || ''} placeholder="https://example.com/profile.jpg" />
                  {about?.profile_image_url && (
                    <img src={about.profile_image_url} alt="Profile preview" className="profile-preview" />
                  )}
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea name="bio" defaultValue={about?.bio || ''} placeholder="Your bio/description" rows="5" />
                </div>
                <div className="form-group full-width">
                  <label>Short Description for Hero Section</label>
                  <textarea 
                    name="hero_short_description" 
                    defaultValue={about?.hero_short_description || ''} 
                    placeholder="A brief paragraph about yourself that will appear after your position in the hero section."
                    rows="3"
                  />
                  <small>This short description will appear after your position in the hero section.</small>
                </div>
                <div className="form-group full-width">
                  <label>Top 5 Skills for Hero Section (comma-separated)</label>
                  <input 
                    name="hero_top_skills" 
                    defaultValue={about?.hero_top_skills ? about.hero_top_skills.join(', ') : ''} 
                    placeholder="Python, SQL, ETL, DBT, Snowflake" 
                  />
                  <small>Enter up to 5 skills separated by commas. These will appear as tabs in the hero section.</small>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" defaultValue={about?.email || ''} placeholder="your.email@example.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input name="github_url" defaultValue={about?.github_url || ''} placeholder="https://github.com/username" />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input name="linkedin_url" defaultValue={about?.linkedin_url || ''} placeholder="https://linkedin.com/in/username" />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Twitter URL</label>
                  <input name="twitter_url" defaultValue={about?.twitter_url || ''} placeholder="https://twitter.com/username" />
                </div>
                <button type="submit" className="save-btn">Update About</button>
              </form>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="admin-section">
              <h2>Manage Projects</h2>
              <form onSubmit={editingProject ? updateProject : createProject}>
                <input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  placeholder="Title"
                  required
                />
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  placeholder="Description"
                  rows="5"
                  required
                />
                <textarea
                  value={projectForm.detailed_description}
                  onChange={(e) => setProjectForm({...projectForm, detailed_description: e.target.value})}
                  placeholder="Detailed Description (for project detail page)"
                  rows="5"
                />
                <input
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                  placeholder="Technologies (comma-separated)"
                  required
                />
                <input
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                  placeholder="GitHub URL"
                />
                <input
                  value={projectForm.live_url}
                  onChange={(e) => setProjectForm({...projectForm, live_url: e.target.value})}
                  placeholder="Live URL"
                />
                <input
                  value={projectForm.image_url}
                  onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})}
                  placeholder="Main Image URL"
                />
                <input
                  value={projectForm.screenshots}
                  onChange={(e) => setProjectForm({...projectForm, screenshots: e.target.value})}
                  placeholder="Screenshot URLs (comma-separated)"
                />
                <button type="submit">{editingProject ? 'Update Project' : 'Create Project'}</button>
                {editingProject && (
                  <button type="button" onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: '',
                      description: '',
                      detailed_description: '',
                      technologies: '',
                      github_url: '',
                      live_url: '',
                      image_url: '',
                      screenshots: ''
                    });
                  }}>
                    Cancel
                  </button>
                )}
              </form>

              <div className="admin-list">
                <h3>Existing Projects</h3>
                {projects.map(project => (
                  <div key={project.id} className="admin-item">
                    <div>
                      <strong>{project.title}</strong>
                      <p>{project.description.substring(0, 100)}...</p>
                    </div>
                    <div>
                      <button onClick={() => startEditProject(project)}>Edit</button>
                      <button onClick={() => deleteProject(project.id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="admin-section">
              <h2>Manage Skills</h2>
              <form onSubmit={editingSkill ? updateSkill : createSkill}>
                <input
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                  placeholder="Skill Name"
                  required
                />
                <input
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                  placeholder="Category"
                />
                <input
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({...skillForm, icon: e.target.value})}
                  placeholder="Icon Name (e.g., FaPython, SiJava, SiReact)"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({...skillForm, proficiency: parseInt(e.target.value)})}
                  placeholder="Proficiency (0-100)"
                  required
                />
                <button type="submit">{editingSkill ? 'Update Skill' : 'Create Skill'}</button>
                {editingSkill && (
                  <button type="button" onClick={() => {
                    setEditingSkill(null);
                    setSkillForm({ name: '', category: '', proficiency: 0, icon: '' });
                  }}>
                    Cancel
                  </button>
                )}
              </form>

              <div className="admin-list">
                <h3>Existing Skills</h3>
                {skills.map(skill => (
                  <div key={skill.id} className="admin-item">
                    <div>
                      <strong>{skill.name}</strong>
                      <p>{skill.category} - {skill.proficiency}%</p>
                    </div>
                    <div>
                      <button onClick={() => startEditSkill(skill)}>Edit</button>
                      <button onClick={() => deleteSkill(skill.id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="admin-section">
              <h2>Manage Experience</h2>
              <form onSubmit={editingExperience ? updateExperience : createExperience}>
                <input
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                  placeholder="Company Name"
                  required
                />
                <input
                  value={experienceForm.position}
                  onChange={(e) => setExperienceForm({...experienceForm, position: e.target.value})}
                  placeholder="Position"
                  required
                />
                <input
                  value={experienceForm.start_date}
                  onChange={(e) => setExperienceForm({...experienceForm, start_date: e.target.value})}
                  placeholder="Start Date (e.g., 08/2023)"
                  required
                />
                <input
                  value={experienceForm.end_date}
                  onChange={(e) => setExperienceForm({...experienceForm, end_date: e.target.value})}
                  placeholder="End Date (e.g., 01/2025 or Present)"
                />
                <input
                  value={experienceForm.location}
                  onChange={(e) => setExperienceForm({...experienceForm, location: e.target.value})}
                  placeholder="Location"
                />
                <textarea
                  value={experienceForm.short_description}
                  onChange={(e) => setExperienceForm({...experienceForm, short_description: e.target.value})}
                  placeholder="Short Description (for timeline)"
                  rows="3"
                />
                <textarea
                  value={experienceForm.detailed_description}
                  onChange={(e) => setExperienceForm({...experienceForm, detailed_description: e.target.value})}
                  placeholder="Detailed Description (for popup)"
                  rows="5"
                />
                <input
                  value={experienceForm.technologies}
                  onChange={(e) => setExperienceForm({...experienceForm, technologies: e.target.value})}
                  placeholder="Technologies (comma-separated)"
                />
                <input
                  value={experienceForm.company_logo_url}
                  onChange={(e) => setExperienceForm({...experienceForm, company_logo_url: e.target.value})}
                  placeholder="Company Logo URL"
                />
                <input
                  type="number"
                  value={experienceForm.order}
                  onChange={(e) => setExperienceForm({...experienceForm, order: parseInt(e.target.value)})}
                  placeholder="Order (for sorting)"
                />
                <button type="submit">{editingExperience ? 'Update Experience' : 'Create Experience'}</button>
                {editingExperience && (
                  <button type="button" onClick={() => {
                    setEditingExperience(null);
                    setExperienceForm({
                      company: '',
                      position: '',
                      start_date: '',
                      end_date: 'Present',
                      location: '',
                      short_description: '',
                      detailed_description: '',
                      technologies: '',
                      company_logo_url: '',
                      order: 0
                    });
                  }}>
                    Cancel
                  </button>
                )}
              </form>

              <div className="admin-list">
                <h3>Existing Experience</h3>
                {experience.map(exp => (
                  <div key={exp.id} className="admin-item">
                    <div>
                      <strong>{exp.position} at {exp.company}</strong>
                      <p>{exp.start_date} - {exp.end_date}</p>
                    </div>
                    <div>
                      <button onClick={() => startEditExperience(exp)}>Edit</button>
                      <button onClick={() => deleteExperience(exp.id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="admin-section">
              <h2>Contact Messages</h2>
              <div className="admin-list">
                {contacts.length === 0 ? (
                  <p>No contact messages yet.</p>
                ) : (
                  contacts.map(contact => (
                    <div key={contact.id} className={`admin-item ${!contact.read ? 'unread' : ''}`}>
                      <div>
                        <strong>{contact.name} ({contact.email})</strong>
                        <p className="contact-subject">Subject: {contact.subject || 'No subject'}</p>
                        <p className="contact-message">{contact.message}</p>
                        <p className="contact-date">
                          {new Date(contact.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        {!contact.read && (
                          <button onClick={() => markContactRead(contact.id)}>Mark Read</button>
                        )}
                        <button onClick={() => deleteContact(contact.id)} className="delete-btn">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="admin-section">
              <h2>Activity Log</h2>
              <div className="activity-log-container">
                {activityLogs.length === 0 ? (
                  <p>No activities yet.</p>
                ) : (
                  <div className="activity-list">
                    {activityLogs.map((activity) => (
                      <div key={activity.id} className={`activity-log-item ${activity.undone ? 'undone' : ''}`}>
                        <div className="activity-icon">
                          {activity.action === 'create' && '➕'}
                          {activity.action === 'update' && '✏️'}
                          {activity.action === 'delete' && '🗑️'}
                          {activity.action === 'undo' && '↩️'}
                        </div>
                        <div className="activity-content">
                          <div className="activity-header">
                            <span className="activity-action">{activity.action}</span>
                            <span className="activity-entity">{activity.entity_type}</span>
                            <span className="activity-name">{activity.entity_name}</span>
                          </div>
                          <div className="activity-meta">
                            <span className="activity-user">by {activity.admin_user}</span>
                            <span className="activity-time">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                            {activity.undone && <span className="activity-undone">(Undone)</span>}
                          </div>
                        </div>
                        {activity.action === 'delete' && !activity.undone && activity.data_snapshot && (
                          <button 
                            className="undo-button"
                            onClick={async () => {
                              try {
                                await axios.post(`${API_URL}/activity/undo/${activity.id}`, {}, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                fetchData();
                                toast.success(`${activity.entity_type.charAt(0).toUpperCase() + activity.entity_type.slice(1)} restored successfully!`, {
                                  position: "top-right",
                                  autoClose: 3000,
                                });
                              } catch (error) {
                                toast.error('Error undoing deletion', {
                                  position: "top-right",
                                  autoClose: 3000,
                                });
                              }
                            }}
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="admin-section">
              <h2>GitHub Integration</h2>
              
              <div className="github-settings">
                <h3>Connection Settings</h3>
                <div className="form-group">
                  <label>GitHub Username</label>
                  <input
                    type="text"
                    value={githubSettings?.github_username || ''}
                    onChange={(e) => setGithubSettings({...githubSettings, github_username: e.target.value})}
                    placeholder="your-username"
                  />
                </div>
                <div className="form-group">
                  <label>GitHub Personal Access Token (Optional)</label>
                  <input
                    type="password"
                    value={githubSettings?.github_token === '***' ? '' : (githubSettings?.github_token || '')}
                    onChange={(e) => setGithubSettings({...githubSettings, github_token: e.target.value})}
                    placeholder="ghp_xxxxxxxxxxxx"
                  />
                  <small>Create token at: https://github.com/settings/tokens (repo scope)</small>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Show GitHub section on frontend</span>
                    <ShowHideToggle 
                      checked={githubSettings?.enabled || false}
                      onChange={(checked) => setGithubSettings({...githubSettings, enabled: checked})}
                    />
                  </label>
                </div>
                <button 
                  onClick={() => updateGithubSettings(githubSettings)}
                  className="save-btn"
                >
                  Save Settings
                </button>
                {githubSettings?.github_username && (
                  <button 
                    onClick={fetchGithubRepos}
                    className="fetch-btn"
                    disabled={loadingRepos}
                  >
                    {loadingRepos ? 'Loading...' : 'Fetch Repositories'}
                  </button>
                )}
              </div>

              {githubRepos.length > 0 && (
                <div className="github-repos-selection">
                  <h3>Select Repositories to Display</h3>
                  <p>Select which repositories should be shown on the frontend:</p>
                  <div className="repos-list">
                    {githubRepos.map((repo) => {
                      const selectedRepos = githubSettings?.selected_repos || [];
                      const isSelected = selectedRepos.includes(repo.full_name) || selectedRepos.includes(repo.name);
                      
                      return (
                        <div key={repo.id} className={`repo-item ${isSelected ? 'selected' : ''}`}>
                          <label>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentSelected = githubSettings?.selected_repos || [];
                                let newSelected;
                                if (e.target.checked) {
                                  newSelected = [...currentSelected, repo.full_name];
                                } else {
                                  newSelected = currentSelected.filter(r => r !== repo.full_name && r !== repo.name);
                                }
                                setGithubSettings({...githubSettings, selected_repos: newSelected});
                              }}
                            />
                            <div className="repo-info">
                              <strong>{repo.name}</strong>
                              {repo.description && <p>{repo.description}</p>}
                              <div className="repo-meta">
                                {repo.language && <span>📝 {repo.language}</span>}
                                <span>⭐ {repo.stars}</span>
                                <span>🍴 {repo.forks}</span>
                                {repo.is_private && <span>🔒 Private</span>}
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => updateGithubSettings(githubSettings)}
                    className="save-btn"
                  >
                    Save Selected Repositories
                  </button>
                </div>
              )}

              {githubSettings?.last_sync && (
                <div className="github-sync-info">
                  <p>Last synced: {new Date(githubSettings.last_sync).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="admin-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Blog Management</h2>
                <button 
                  onClick={() => {
                    setEditingBlog(null);
                    setActiveTab('blog-editor');
                  }}
                  className="save-btn"
                >
                  + New Blog
                </button>
              </div>
              
              <div className="blogs-list">
                {blogs.length === 0 ? (
                  <p>No blogs yet. Create your first blog!</p>
                ) : (
                  blogs.map((blog) => (
                    <div key={blog.id} className="blog-item-admin">
                      <div className="blog-item-content">
                        {blog.banner_image_url && (
                          <img src={blog.banner_image_url} alt={blog.title} className="blog-thumbnail" />
                        )}
                        <div className="blog-item-info">
                          <h3>{blog.title}</h3>
                          <p className="blog-excerpt">{blog.excerpt || 'No excerpt'}</p>
                          <div className="blog-meta-admin">
                            <span className={blog.published ? 'status-published' : 'status-draft'}>
                              {blog.published ? '✓ Published' : 'Draft'}
                            </span>
                            {blog.featured && <span className="status-featured">⭐ Featured</span>}
                            <span>👁️ {blog.views || 0} views</span>
                            <span>📅 {new Date(blog.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="blog-actions">
                        <button onClick={() => {
                          setEditingBlog(blog);
                          setActiveTab('blog-editor');
                        }}>Edit</button>
                        <button onClick={() => deleteBlog(blog.id)} className="delete-btn">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'blog-editor' && (
            <BlogEditor 
              blog={editingBlog}
              token={token}
              onSave={() => {
                fetchBlogs();
                setActiveTab('blog');
              }}
              onCancel={() => {
                setEditingBlog(null);
                setActiveTab('blog');
              }}
            />
          )}

          {activeTab === 'notifications' && (
            <div className="admin-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Notifications</h2>
                <button 
                  onClick={async () => {
                    try {
                      const headers = { Authorization: `Bearer ${token}` };
                      await axios.post(`${API_URL}/notifications/mark-read`, { type: 'all' }, { headers });
                      fetchNotifications();
                      toast.success('All notifications marked as read', {
                        position: "top-right",
                        autoClose: 3000,
                      });
                    } catch (error) {
                      toast.error('Error marking notifications as read', {
                        position: "top-right",
                        autoClose: 3000,
                      });
                    }
                  }}
                  className="save-btn"
                >
                  Mark All as Read
                </button>
              </div>

              <div className="notifications-container">
                <div className="notification-section">
                  <h3>
                    New Likes ({notifications.unread_likes || 0})
                    {notifications.unread_likes > 0 && (
                      <button 
                        onClick={async () => {
                          try {
                            const headers = { Authorization: `Bearer ${token}` };
                            await axios.post(`${API_URL}/notifications/mark-read`, { type: 'likes' }, { headers });
                            fetchNotifications();
                          } catch (error) {
                            console.error('Error:', error);
                          }
                        }}
                        className="mark-read-btn"
                      >
                        Mark as Read
                      </button>
                    )}
                  </h3>
                  {notifications.recent_likes && notifications.recent_likes.length > 0 ? (
                    <div className="notifications-list">
                      {notifications.recent_likes.map((like) => (
                        <div key={like.id} className="notification-item">
                          <div className="notification-content">
                            <strong>❤️ New like</strong> on blog #{like.blog_id}
                            <span className="notification-time">
                              {new Date(like.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No new likes</p>
                  )}
                </div>

                <div className="notification-section">
                  <h3>
                    New Comments ({notifications.unread_comments || 0})
                    {notifications.unread_comments > 0 && (
                      <button 
                        onClick={async () => {
                          try {
                            const headers = { Authorization: `Bearer ${token}` };
                            await axios.post(`${API_URL}/notifications/mark-read`, { type: 'comments' }, { headers });
                            fetchNotifications();
                          } catch (error) {
                            console.error('Error:', error);
                          }
                        }}
                        className="mark-read-btn"
                      >
                        Mark as Read
                      </button>
                    )}
                  </h3>
                  {notifications.recent_comments && notifications.recent_comments.length > 0 ? (
                    <div className="notifications-list">
                      {notifications.recent_comments.map((comment) => (
                        <div key={comment.id} className="notification-item">
                          <div className="notification-content">
                            <strong>💬 {comment.author_name}</strong> commented on blog #{comment.blog_id}
                            <p className="notification-text">{comment.content}</p>
                            <span className="notification-time">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="notification-actions">
                            <button 
                              onClick={async () => {
                                try {
                                  const headers = { Authorization: `Bearer ${token}` };
                                  const replyContent = prompt('Enter your reply:');
                                  if (replyContent) {
                                    await axios.post(
                                      `${API_URL}/blogs/comments/${comment.id}/reply`,
                                      { content: replyContent, author_name: 'Admin' },
                                      { headers }
                                    );
                                    toast.success('Reply posted successfully!', {
                                      position: "top-right",
                                      autoClose: 3000,
                                    });
                                    fetchNotifications();
                                  }
                                } catch (error) {
                                  toast.error('Error posting reply', {
                                    position: "top-right",
                                    autoClose: 3000,
                                  });
                                }
                              }}
                              className="reply-notification-btn"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No new comments</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
      
      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="modal-overlay" onClick={confirmModal.onCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>{confirmModal.message}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={confirmModal.onCancel}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmModal.onConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
