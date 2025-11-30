#!/usr/bin/env python3
"""Quick test script to verify backend can start"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app
    print("✓ App imported successfully")
    
    with app.app_context():
        from models import About, Project, Skill
        about_count = About.query.count()
        project_count = Project.query.count()
        skill_count = Skill.query.count()
        print(f"✓ Database connected")
        print(f"  - About records: {about_count}")
        print(f"  - Projects: {project_count}")
        print(f"  - Skills: {skill_count}")
    
    print(f"\n✓ Backend is ready to start!")
    print(f"  Run: python app.py")
    print(f"  Server will start on: http://localhost:5001")
    print(f"  Health check: http://localhost:5001/api/health")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

