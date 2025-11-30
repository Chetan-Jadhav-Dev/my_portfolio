import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaRocket, FaCode
} from 'react-icons/fa';
// FaRocket is used in ProjectCard component
import { trackPageView, trackSectionView, trackProjectClick, trackLinkClick } from '../utils/analytics';
import Contact from './Contact';
import DynamicIcon from './DynamicIcon';
import './ModernHome.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Icon component wrapper for skills - now supports all icons dynamically
const getSkillIcon = (iconName) => {
  // Return a component that uses DynamicIcon
  return (props) => <DynamicIcon iconName={iconName} {...props} />;
};

function ModernHome() {
  const navigate = useNavigate();
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projectsRef, projectsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [githubRef, githubInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [experienceRef, experienceInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetchData();
    trackPageView();
  }, []);

  useEffect(() => {
    if (aboutInView) trackSectionView('about');
    if (projectsInView) trackSectionView('projects');
    if (skillsInView) trackSectionView('skills');
    if (experienceInView) trackSectionView('experience');
  }, [aboutInView, projectsInView, skillsInView, experienceInView]);

  const [githubSettings, setGithubSettings] = useState(null);

  const [blogs, setBlogs] = useState([]);

  const fetchData = async () => {
    try {
      const [aboutRes, projectsRes, skillsRes, expRes, githubSettingsRes, githubRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/about`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/skills`),
        axios.get(`${API_URL}/experience`),
        axios.get(`${API_URL}/github/settings/public`).catch((err) => {
          console.error('Error fetching GitHub settings:', err);
          return { data: { enabled: false } };
        }),
        axios.get(`${API_URL}/github/repos/public`).catch((err) => {
          console.error('Error fetching GitHub repos:', err);
          return { data: { repos: [] } };
        }),
        axios.get(`${API_URL}/blogs?homepage=true`).catch((err) => {
          console.error('Error fetching blogs:', err);
          return { data: [] };
        })
      ]);
      
      setAbout(aboutRes.data);
      setProjects(projectsRes.data || []);
      setSkills(skillsRes.data || []);
      setExperience(expRes.data || []);
      setGithubSettings(githubSettingsRes.data);
      setBlogs(blogsRes.data || []);
      // Only set repos if settings exist and enabled
      if (githubSettingsRes.data && githubSettingsRes.data.enabled) {
        const repos = githubRes.data?.repos || [];
        setGithubRepos(repos);
        if (repos.length === 0) {
          if (githubRes.data?.error) {
            console.warn('GitHub repos error:', githubRes.data.error);
          } else {
            console.warn('No GitHub repositories found. Make sure repositories are selected in admin settings.');
          }
        } else {
          console.log(`Loaded ${repos.length} GitHub repositories`);
        }
      } else {
        setGithubRepos([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent blank page
      setProjects([]);
      setSkills([]);
      setExperience([]);
      setGithubRepos([]);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const groupSkillsByCategory = (skills) => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Ensure we have at least empty arrays
  const safeProjects = projects || [];
  const safeSkills = skills || [];
  const safeExperience = experience || [];
  const skillsByCategory = groupSkillsByCategory(safeSkills);

  // Debug: Log data
  console.log('About:', about);
  console.log('Projects:', safeProjects);
  console.log('Skills:', safeSkills);
  console.log('Experience:', safeExperience);

  return (
    <div className="modern-home" style={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <motion.nav 
        className="modern-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCode /> Portfolio
          </motion.div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="/blog">Blog</a>
            <a href="#contact">Contact</a>
            {about?.github_url && (
              <a 
                href={about.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackLinkClick('github', about.github_url)}
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            )}
            {about?.linkedin_url && (
              <a 
                href={about.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackLinkClick('linkedin', about.linkedin_url)}
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            )}
            {about?.email && (
              <a 
                href={`mailto:${about.email}`}
                onClick={() => trackLinkClick('email', about.email)}
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section" id="about" ref={aboutRef}>
        <div className="hero-slider-container">
          <motion.div
            className="hero-text-slider"
            initial={{ opacity: 0 }}
            animate={aboutInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Image */}
            {about?.profile_image_url && (
              <motion.div
                className="hero-profile-image"
                initial={{ scale: 0, opacity: 0 }}
                animate={aboutInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img src={about.profile_image_url} alt={about.name} />
              </motion.div>
            )}
            
            {/* Name */}
            <motion.h1
              className="hero-slider-text"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={aboutInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ 
                duration: 1.2, 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
            >
              {about?.name || 'YOUR NAME'}
            </motion.h1>
            
            {/* Title/Position */}
            <motion.p
              className="hero-position"
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {about?.title || 'Senior Data Engineer'}
            </motion.p>
            
            {/* Short Description */}
            {about?.hero_short_description && (
              <motion.p
                className="hero-short-description"
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {about.hero_short_description}
              </motion.p>
            )}
            
            {/* Top Skills Tabs */}
            {about?.hero_top_skills && about.hero_top_skills.length > 0 && (
              <motion.div
                className="hero-skills-tabs"
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {about.hero_top_skills.slice(0, 5).map((skill, index) => (
                  <motion.span
                    key={index}
                    className="hero-skill-tab"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={aboutInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            )}
            
            <motion.a
              href="#projects"
              className="hero-cta-button"
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW WORK
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Experience Timeline */}
      {safeExperience.length > 0 && (
        <section className="experience-section" id="experience" ref={experienceRef}>
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={experienceInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Experience
          </motion.h2>
          <div className="timeline-container">
            {safeExperience.map((exp, index) => (
              <ExperienceItem 
                key={exp.id} 
                experience={exp} 
                index={index}
                inView={experienceInView}
              />
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      <section className="projects-section" id="projects" ref={projectsRef}>
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={projectsInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Projects
        </motion.h2>
        <div className="projects-grid">
          {safeProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
              inView={projectsInView}
              onClick={() => {
                trackProjectClick(project.id, project.title);
                navigate(`/project/${project.id}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section" id="skills" ref={skillsRef}>
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={skillsInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Skills
        </motion.h2>
        <div className="skills-container">
          {Object.entries(skillsByCategory).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              className="skill-category"
              initial={{ y: 50, opacity: 0 }}
              animate={skillsInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            >
              <h3>{category}</h3>
              <div className="skills-tags">
                {categorySkills.map((skill, skillIndex) => {
                  const IconComponent = getSkillIcon(skill.icon);
                  const circumference = 2 * Math.PI * 20; // radius = 20
                  const offset = circumference - (skill.proficiency / 100) * circumference;
                  
                  return (
                    <motion.div
                      key={skill.id}
                      className="skill-tag"
                      whileHover={{ scale: 1.05, y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                    >
                      <div className="skill-tag-content">
                        <div className="skill-icon-wrapper">
                          <IconComponent className="skill-icon-small" />
                          <svg className="skill-circle-progress" width="50" height="50">
                            <circle
                              className="skill-circle-bg"
                              cx="25"
                              cy="25"
                              r="20"
                              fill="none"
                              strokeWidth="3"
                            />
                            <motion.circle
                              className="skill-circle-fill"
                              cx="25"
                              cy="25"
                              r="20"
                              fill="none"
                              strokeWidth="3"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={skillsInView ? { strokeDashoffset: offset } : {}}
                              transition={{ duration: 1, delay: 0.5 + skillIndex * 0.1 }}
                            />
                          </svg>
                          <span className="skill-percentage-badge">{skill.proficiency}%</span>
                        </div>
                        <span className="skill-name-tag">{skill.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GitHub Section */}
      {githubSettings?.enabled && (
        <section className="github-section" id="github" ref={githubRef}>
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={githubInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            GitHub Repositories
          </motion.h2>
          {githubRepos.length > 0 ? (
            <div className="github-repos-container">
              {githubRepos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="github-repo-card"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={githubInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => trackLinkClick('github', repo.name, repo.html_url)}
              >
                <div className="repo-header">
                  <FaGithub className="repo-icon" />
                  <h3>{repo.name}</h3>
                </div>
                {repo.description && (
                  <p className="repo-description">{repo.description}</p>
                )}
                <div className="repo-stats">
                  {repo.language && (
                    <span className="repo-language">
                      <span className="language-dot"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="repo-star">⭐ {repo.stars}</span>
                  <span className="repo-fork">🍴 {repo.forks}</span>
                </div>
                <div className="repo-footer">
                  <span className="repo-link">View on GitHub →</span>
                </div>
              </motion.a>
              ))}
            </div>
          ) : (
            <div className="github-empty-state">
              <p>No repositories available. Please configure GitHub settings in the admin dashboard.</p>
            </div>
          )}
        </section>
      )}

      {/* Featured Blogs Section */}
      {blogs.length > 0 && (
        <section className="blogs-section" id="blogs">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Featured Blogs
          </motion.h2>
          <div className="blogs-grid">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                className="blog-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                whileHover={{ scale: 1.02 }}
              >
                {blog.banner_image_url && (
                  <div className="blog-image">
                    <img src={blog.banner_image_url} alt={blog.title} />
                  </div>
                )}
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  {blog.excerpt && <p className="blog-excerpt">{blog.excerpt}</p>}
                  <div className="blog-meta">
                    {blog.reading_time && <span>📖 {blog.reading_time} min read</span>}
                    {blog.views && <span>👁️ {blog.views} views</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <div id="contact">
        <Contact />
      </div>

      {/* Footer */}
      <footer className="modern-footer">
        <p>&copy; {new Date().getFullYear()} {about?.name || 'Portfolio'}. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Experience Timeline Item Component
const ExperienceItem = ({ experience, index, inView }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <motion.div
        className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
        initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="timeline-content">
          <div className="timeline-date">
            {experience.start_date} - {experience.end_date}
          </div>
          <h3>{experience.position}</h3>
          <h4>{experience.company}</h4>
          {experience.location && <p className="timeline-location">{experience.location}</p>}
          <p className="timeline-description">{experience.short_description}</p>
          <button className="timeline-button">View Details</button>
        </div>
        <div className="timeline-dot" />
      </motion.div>
      
      {isOpen && (
        <ExperienceModal 
          experience={experience} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
};

// Experience Modal Component
const ExperienceModal = ({ experience, onClose }) => {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{experience.position}</h2>
        <h3>{experience.company}</h3>
        <p className="modal-date">{experience.start_date} - {experience.end_date}</p>
        {experience.location && <p className="modal-location">{experience.location}</p>}
        <div className="modal-description">
          {experience.detailed_description?.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="modal-technologies">
            <h4>Technologies:</h4>
            <div className="tech-tags">
              {experience.technologies.map((tech, i) => (
                <span key={i} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index, inView, onClick }) => {
  return (
    <motion.div
      className="project-card"
      initial={{ y: 100, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
    >
      {project.image_url && (
        <div className="project-image-container">
          <img src={project.image_url} alt={project.title} className="project-image" />
          <div className="project-overlay">
            <FaRocket className="project-icon" />
          </div>
        </div>
      )}
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-technologies">
          {project.technologies?.slice(0, 3).map((tech, i) => (
            <span key={i} className="tech-badge">{tech}</span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="tech-badge">+{project.technologies.length - 3}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModernHome;

