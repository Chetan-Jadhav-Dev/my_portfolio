import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGithub, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import './ProjectDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      setProject(response.data);
      if (response.data.screenshots && response.data.screenshots.length > 0) {
        setSelectedImage(response.data.screenshots[0]);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-error">
        <h2>Project not found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <motion.button
        className="back-button"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Back to Portfolio
      </motion.button>

      <motion.div
        className="project-detail-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="project-header">
          <h1>{project.title}</h1>
          <div className="project-links-header">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn"
              >
                <FaGithub /> GitHub
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            )}
          </div>
        </div>

        <div className="project-main">
          <div className="project-images">
            {selectedImage && (
              <motion.div
                className="main-image-container"
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img src={selectedImage} alt={project.title} className="main-image" />
              </motion.div>
            )}
            
            {project.screenshots && project.screenshots.length > 1 && (
              <div className="screenshot-thumbnails">
                {project.screenshots.map((screenshot, index) => (
                  <motion.img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className={`thumbnail ${selectedImage === screenshot ? 'active' : ''}`}
                    onClick={() => setSelectedImage(screenshot)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="project-info">
            <div className="project-description">
              <h2>Description</h2>
              <p>{project.detailed_description || project.description}</p>
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="project-technologies">
                <h2>Technologies</h2>
                <div className="tech-tags">
                  {project.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      className="tech-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProjectDetail;

