import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaGithub, FaLinkedin, FaEnvelope, FaRocket, FaCode, FaExternalLinkAlt
} from 'react-icons/fa';
import { trackPageView, trackSectionView, trackProjectClick, trackLinkClick } from '../utils/analytics';
import Contact from './Contact';
import DynamicIcon from './DynamicIcon';
import ParticleBackground from './ParticleBackground';
import './ModernHome.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Icon component wrapper
const getSkillIcon = (iconName) => {
  return (props) => <DynamicIcon iconName={iconName} {...props} />;
};

function ModernHome() {
  const navigate = useNavigate();
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [githubSettings, setGithubSettings] = useState(null);
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

  const fetchData = async () => {
    try {
      const [aboutRes, projectsRes, skillsRes, expRes, githubSettingsRes, githubRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/about`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/skills`),
        axios.get(`${API_URL}/experience`),
        axios.get(`${API_URL}/github/settings/public`).catch(() => ({ data: { enabled: false } })),
        axios.get(`${API_URL}/github/repos/public`).catch(() => ({ data: { repos: [] } })),
        axios.get(`${API_URL}/blogs?homepage=true`).catch(() => ({ data: [] }))
      ]);

      setAbout(aboutRes.data);
      setProjects(projectsRes.data || []);
      setSkills(skillsRes.data || []);
      setExperience(expRes.data || []);
      setGithubSettings(githubSettingsRes.data);
      setBlogs(blogsRes.data || []);

      if (githubSettingsRes.data?.enabled) {
        setGithubRepos(githubRes.data?.repos || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupSkillsByCategory = (skills) => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
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

  const skillsByCategory = groupSkillsByCategory(skills || []);

  return (
    <div className="modern-home">
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section" id="about" ref={aboutRef}>
        <ParticleBackground />
        <motion.div
          className="hero-slider-container"
          variants={staggerContainer}
          initial="hidden"
          animate={aboutInView ? "visible" : "hidden"}
        >
          {about?.profile_image_url && (
            <motion.div className="hero-profile-image" variants={fadeInUp}>
              <img src={about.profile_image_url} alt={about.name} />
            </motion.div>
          )}

          <motion.h1 className="hero-slider-text" variants={fadeInUp}>
            {about?.name || 'YOUR NAME'}
          </motion.h1>

          <motion.p className="hero-position" variants={fadeInUp}>
            {about?.title || 'Senior Data Engineer'}
          </motion.p>

          {about?.hero_short_description && (
            <motion.p className="hero-short-description" variants={fadeInUp}>
              {about.hero_short_description}
            </motion.p>
          )}

          {about?.hero_top_skills && (
            <motion.div className="hero-skills-tabs" variants={fadeInUp}>
              {about.hero_top_skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="hero-skill-tab">{skill}</span>
              ))}
            </motion.div>
          )}

          <motion.div className="hero-social-links" variants={fadeInUp} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {about?.github_url && (
              <motion.a href={about.github_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: '#fff' }} style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>
                <FaGithub />
              </motion.a>
            )}
            {about?.linkedin_url && (
              <motion.a href={about.linkedin_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: '#0077b5' }} style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>
                <FaLinkedin />
              </motion.a>
            )}
            {about?.email && (
              <motion.a href={`mailto:${about.email}`} whileHover={{ scale: 1.2, color: '#ea4335' }} style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>
                <FaEnvelope />
              </motion.a>
            )}
          </motion.div>

          <motion.a
            href="#projects"
            className="hero-cta-button"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VIEW WORK
          </motion.a>
        </motion.div>
      </section>

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <section className="experience-section" id="experience" ref={experienceRef}>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={experienceInView ? { opacity: 1, y: 0 } : {}}
          >
            Experience
          </motion.h2>
          <div className="timeline-container">
            {experience.map((exp, index) => (
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
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={projectsInView ? { opacity: 1, y: 0 } : {}}
        >
          Featured Projects
        </motion.h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
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
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={skillsInView ? { opacity: 1, y: 0 } : {}}
        >
          Technical Skills
        </motion.h2>
        <div className="skills-container">
          {Object.entries(skillsByCategory).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              className="skill-category"
              initial={{ opacity: 0, y: 30 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h3>{category}</h3>
              <div className="skills-tags">
                {categorySkills.map((skill, skillIndex) => {
                  const IconComponent = getSkillIcon(skill.icon);
                  return (
                    <motion.div
                      key={skill.id}
                      className="skill-tag"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: skillIndex * 0.05 }}
                    >
                      <div className="skill-tag-content">
                        <div className="skill-icon-wrapper">
                          <IconComponent className="skill-icon-small" />
                        </div>
                        <span className="skill-name-tag">{skill.name}</span>
                        <div className="skill-bar-bg" style={{ width: '100%', height: '4px', background: 'var(--bg-card-hover)', marginTop: '0.5rem', borderRadius: '2px' }}>
                          <motion.div
                            className="skill-bar-fill"
                            initial={{ width: 0 }}
                            animate={skillsInView ? { width: `${skill.proficiency}%` } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                            style={{ height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }}
                          />
                        </div>
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
      {githubSettings?.enabled && githubRepos.length > 0 && (
        <section className="github-section" id="github" ref={githubRef} style={{ padding: '6rem 2rem', background: 'var(--bg-secondary)' }}>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={githubInView ? { opacity: 1, y: 0 } : {}}
          >
            Open Source
          </motion.h2>
          <div className="github-repos-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {githubRepos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel"
                style={{ padding: '1.5rem', display: 'block', textDecoration: 'none' }}
                whileHover={{ y: -5, borderColor: 'var(--accent-primary)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={githubInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  <FaGithub />
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{repo.name}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', height: '3rem', overflow: 'hidden' }}>
                  {repo.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>⭐ {repo.stars}</span>
                  <span>🍴 {repo.forks}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {/* Featured Blogs */}
      {blogs.length > 0 && (
        <section className="blogs-section" style={{ padding: '6rem 2rem' }}>
          <h2 className="section-title">Latest Articles</h2>
          <div className="blogs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                className="glass-panel"
                style={{ overflow: 'hidden', cursor: 'pointer' }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/blog/${blog.slug}`)}
              >
                {blog.banner_image_url && (
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img src={blog.banner_image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{blog.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{blog.excerpt}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Read More →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <div id="contact" style={{ background: 'var(--bg-secondary)' }}>
        <Contact />
      </div>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
        <p>&copy; {new Date().getFullYear()} {about?.name || 'Portfolio'}. Built with React & Flask.</p>
      </footer>
    </div>
  );
}

// Sub-components
const ExperienceItem = ({ experience, index, inView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="timeline-content">
          <div className="timeline-date">{experience.start_date} - {experience.end_date}</div>
          <h3>{experience.position}</h3>
          <h4>{experience.company}</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {experience.short_description}
          </p>
        </div>
        <div className="timeline-dot" />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <ExperienceModal experience={experience} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

const ExperienceModal = ({ experience, onClose }) => (
  <motion.div
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="modal-content"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="modal-close" onClick={onClose}>×</button>
      <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{experience.position}</h2>
      <h3 style={{ marginBottom: '1rem' }}>{experience.company}</h3>
      <div style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        {experience.detailed_description}
      </div>
      {experience.technologies && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {experience.technologies.map((tech, i) => (
            <span key={i} className="tech-badge">{tech}</span>
          ))}
        </div>
      )}
    </motion.div>
  </motion.div>
);

const ProjectCard = ({ project, index, inView, onClick }) => (
  <motion.div
    className="project-card"
    initial={{ opacity: 0, y: 30 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    onClick={onClick}
  >
    <div className="project-image-container">
      {project.image_url ? (
        <img src={project.image_url} alt={project.title} className="project-image" />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaCode style={{ fontSize: '3rem', color: 'var(--text-secondary)' }} />
        </div>
      )}
      <div className="project-overlay">
        <span style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          View Details <FaExternalLinkAlt />
        </span>
      </div>
    </div>
    <div className="project-content">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-technologies">
        {project.technologies?.slice(0, 3).map((tech, i) => (
          <span key={i} className="tech-badge">{tech}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ModernHome;
