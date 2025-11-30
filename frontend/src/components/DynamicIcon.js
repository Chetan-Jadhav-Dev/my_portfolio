import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as GiIcons from 'react-icons/gi';
import * as FiIcons from 'react-icons/fi';
import { FaCode } from 'react-icons/fa';

/**
 * Dynamic Icon Component
 * Supports icons from multiple react-icons packages:
 * - Fa* (Font Awesome) - e.g., FaPython, FaGithub, FaAws
 * - Si* (Simple Icons) - e.g., SiApacheairflow, SiPython, SiReact, SiKubernetes
 * - Md* (Material Design)
 * - Io* (Ionicons 5)
 * - Gi* (Game Icons)
 * - Fi* (Feather Icons)
 * 
 * Usage: <DynamicIcon iconName="SiApacheairflow" />
 * 
 * Note: All Simple Icons are now supported! Just use the icon name from:
 * https://react-icons.github.io/react-icons/search/#q=apache
 */
const DynamicIcon = ({ iconName, className, ...props }) => {
  if (!iconName) {
    return <FaCode className={className} {...props} />;
  }

  // Determine which icon package based on prefix
  let IconComponent = null;

  try {
    if (iconName.startsWith('Fa')) {
      IconComponent = FaIcons[iconName];
    } else if (iconName.startsWith('Si')) {
      IconComponent = SiIcons[iconName];
    } else if (iconName.startsWith('Md')) {
      IconComponent = MdIcons[iconName];
    } else if (iconName.startsWith('Io')) {
      IconComponent = IoIcons[iconName];
    } else if (iconName.startsWith('Gi')) {
      IconComponent = GiIcons[iconName];
    } else if (iconName.startsWith('Fi')) {
      IconComponent = FiIcons[iconName];
    }
  } catch (error) {
    console.warn(`Error loading icon "${iconName}":`, error);
  }

  // If icon not found, return default
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found. Using default icon (FaCode). Available icons: https://react-icons.github.io/react-icons/`);
    return <FaCode className={className} {...props} />;
  }

  return <IconComponent className={className} {...props} />;
};

export default DynamicIcon;

