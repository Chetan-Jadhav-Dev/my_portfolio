import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { trackPageView, trackSectionView, trackProjectClick, trackLinkClick } from '../utils/analytics';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRefs = useRef({});
  const sectionTimers = useRef({});

  useEffect(() => {
    fetchData();
    trackPageView();
    
    // Track section views when scrolling
    const handleScroll = () => {
      Object.keys(sectionRefs.current).forEach(section => {
        const element = sectionRefs.current[section];
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible && !sectionTimers.current[section]) {
            sectionTimers.current[section] = Date.now();
            trackSectionView(section);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [aboutRes, projectsRes, skillsRes] = await Promise.all([
        axios.get(`${API_URL}/about`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/skills`)
      ]);
      
      setAbout(aboutRes.data);
      setProjects(projectsRes.data);
      setSkills(skillsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    return <div className="loading">Loading...</div>;
  }

  const skillsByCategory = groupSkillsByCategory(skills);

  return (
    <div className="home">
      <nav>
        <div className="container">
          <h1>Portfolio</h1>
          <div>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="/admin">Admin</a>
          </div>
        </div>
      </nav>

      <section 
        className="hero" 
        id="about"
        ref={el => sectionRefs.current['about'] = el}
      >
        <div className="container">
          {about?.profile_image_url && (
            <img 
              src={about.profile_image_url} 
              alt={about.name}
              className="profile-image"
            />
          )}
          <h1>{about?.name || 'Your Name'}</h1>
          <p>{about?.title || 'Full Stack Developer'}</p>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            {about?.bio || 'Welcome to my portfolio!'}
          </p>
          <div className="social-links">
            {about?.github_url && (
              <a 
                href={about.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackLinkClick('github', about.github_url)}
              >
                GitHub
              </a>
            )}
            {about?.linkedin_url && (
              <a 
                href={about.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackLinkClick('linkedin', about.linkedin_url)}
              >
                LinkedIn
              </a>
            )}
            {about?.twitter_url && (
              <a 
                href={about.twitter_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackLinkClick('twitter', about.twitter_url)}
              >
                Twitter
              </a>
            )}
            {about?.email && (
              <a 
                href={`mailto:${about.email}`}
                onClick={() => trackLinkClick('email', about.email)}
              >
                Email
              </a>
            )}
          </div>
        </div>
      </section>

      <section 
        className="section" 
        id="projects"
        ref={el => sectionRefs.current['projects'] = el}
      >
        <div className="container">
          <h2>Projects</h2>
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                {project.image_url && (
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="project-image"
                  />
                )}
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="technologies">
                  {project.technologies?.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => trackProjectClick(project.id, project.title)}
                    >
                      GitHub →
                    </a>
                  )}
                  {project.live_url && (
                    <a 
                      href={project.live_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => trackProjectClick(project.id, project.title)}
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="section" 
        id="skills"
        ref={el => sectionRefs.current['skills'] = el}
      >
        <div className="container">
          <h2>Skills</h2>
          <div className="skills-container">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="skill-category">
                <h3>{category}</h3>
                {categorySkills.map(skill => (
                  <div key={skill.id} className="skill-item">
                    <div className="skill-name">
                      <span>{skill.name}</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress" 
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {about?.name || 'Portfolio'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;

