from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    detailed_description = db.Column(db.Text)  # Full description for project detail page
    technologies = db.Column(db.String(500), nullable=False)  # Comma-separated
    github_url = db.Column(db.String(500))
    live_url = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    screenshots = db.Column(db.Text)  # JSON array of screenshot URLs
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        import json
        screenshots_list = []
        if self.screenshots:
            try:
                screenshots_list = json.loads(self.screenshots)
            except:
                screenshots_list = []
        
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'detailed_description': self.detailed_description,
            'technologies': self.technologies.split(',') if self.technologies else [],
            'github_url': self.github_url,
            'live_url': self.live_url,
            'image_url': self.image_url,
            'screenshots': screenshots_list,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class About(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(200))
    bio = db.Column(db.Text)
    email = db.Column(db.String(200))
    github_url = db.Column(db.String(500))
    linkedin_url = db.Column(db.String(500))
    twitter_url = db.Column(db.String(500))
    profile_image_url = db.Column(db.String(500))
    hero_top_skills = db.Column(db.String(500))  # Comma-separated top 5 skills for hero section
    hero_short_description = db.Column(db.Text)  # Short description for hero section
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        hero_skills = []
        if self.hero_top_skills:
            hero_skills = [skill.strip() for skill in self.hero_top_skills.split(',')]
        
        return {
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'bio': self.bio,
            'email': self.email,
            'github_url': self.github_url,
            'linkedin_url': self.linkedin_url,
            'twitter_url': self.twitter_url,
            'profile_image_url': self.profile_image_url,
            'hero_top_skills': hero_skills,
            'hero_short_description': self.hero_short_description,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100))  # e.g., 'Frontend', 'Backend', 'Database'
    proficiency = db.Column(db.Integer, default=0)  # 0-100
    icon = db.Column(db.String(200))  # Icon name or URL (e.g., 'FaPython', 'SiJava')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'proficiency': self.proficiency,
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Analytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(200), nullable=False)
    event_type = db.Column(db.String(100), nullable=False)  # 'page_view', 'section_view', 'project_click', 'link_click', etc.
    section = db.Column(db.String(100))  # 'about', 'projects', 'skills', etc.
    item_id = db.Column(db.Integer)  # ID of project, skill, etc. if applicable
    item_name = db.Column(db.String(200))  # Name of the item clicked
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.String(500))
    country = db.Column(db.String(100))
    city = db.Column(db.String(100))
    referrer = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Integer)  # Time spent in seconds

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'event_type': self.event_type,
            'section': self.section,
            'item_id': self.item_id,
            'item_name': self.item_name,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'country': self.country,
            'city': self.city,
            'referrer': self.referrer,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'duration': self.duration
        }

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(200), nullable=False)
    position = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.String(50), nullable=False)  # e.g., "08/2023"
    end_date = db.Column(db.String(50))  # e.g., "01/2025" or "Present"
    location = db.Column(db.String(200))
    short_description = db.Column(db.Text)  # Brief description for timeline
    detailed_description = db.Column(db.Text)  # Full description for popup
    technologies = db.Column(db.String(500))  # Comma-separated
    company_logo_url = db.Column(db.String(500))
    order = db.Column(db.Integer, default=0)  # For ordering in timeline
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'position': self.position,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'location': self.location,
            'short_description': self.short_description,
            'detailed_description': self.detailed_description,
            'technologies': self.technologies.split(',') if self.technologies else [],
            'company_logo_url': self.company_logo_url,
            'order': self.order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'read': self.read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ActivityLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False)  # 'create', 'update', 'delete', 'undo'
    entity_type = db.Column(db.String(50), nullable=False)  # 'project', 'skill', 'experience', 'about', 'contact'
    entity_id = db.Column(db.Integer)
    entity_name = db.Column(db.String(200))  # Name/title of the entity
    admin_user = db.Column(db.String(100), nullable=False)
    data_snapshot = db.Column(db.Text)  # JSON snapshot of deleted/updated data for undo
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    undone = db.Column(db.Boolean, default=False)  # Whether this action was undone

    def to_dict(self):
        import json
        snapshot = None
        if self.data_snapshot:
            try:
                snapshot = json.loads(self.data_snapshot)
            except:
                snapshot = None
        
        return {
            'id': self.id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'entity_name': self.entity_name,
            'admin_user': self.admin_user,
            'data_snapshot': snapshot,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'undone': self.undone
        }

class GitHubSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    github_username = db.Column(db.String(200))
    github_token = db.Column(db.String(500))  # Encrypted token
    enabled = db.Column(db.Boolean, default=False)  # Show GitHub section on frontend
    selected_repos = db.Column(db.Text)  # JSON array of selected repo IDs/names
    last_sync = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        import json
        selected = []
        if self.selected_repos:
            try:
                selected = json.loads(self.selected_repos)
            except:
                selected = []
        
        return {
            'id': self.id,
            'github_username': self.github_username,
            'github_token': '***' if self.github_token else None,  # Don't expose token
            'enabled': self.enabled,
            'selected_repos': selected,
            'last_sync': self.last_sync.isoformat() if self.last_sync else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    slug = db.Column(db.String(500), unique=True, nullable=False)
    excerpt = db.Column(db.Text)  # Short description/preview
    banner_image_url = db.Column(db.String(500))  # Banner image for blog post
    content = db.Column(db.Text, nullable=False)  # HTML content with formatting
    author = db.Column(db.String(200), default='Admin')
    published = db.Column(db.Boolean, default=False)  # Draft/Published status
    featured = db.Column(db.Boolean, default=False)  # Featured blog
    show_on_homepage = db.Column(db.Boolean, default=False)  # Show on homepage
    tags = db.Column(db.String(500))  # Comma-separated tags
    reading_time = db.Column(db.Integer)  # Estimated reading time in minutes
    views = db.Column(db.Integer, default=0)  # View count
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime)  # When it was published

    def to_dict(self):
        import json
        tags_list = []
        if self.tags:
            tags_list = [tag.strip() for tag in self.tags.split(',')]
        
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'excerpt': self.excerpt,
            'banner_image_url': self.banner_image_url,
            'content': self.content,
            'author': self.author,
            'published': self.published,
            'featured': self.featured,
            'show_on_homepage': self.show_on_homepage,
            'tags': tags_list,
            'reading_time': self.reading_time,
            'views': self.views,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None
        }

class BlogLike(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False)
    user_ip = db.Column(db.String(100))
    user_agent = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)  # Notification read status

    def to_dict(self):
        return {
            'id': self.id,
            'blog_id': self.blog_id,
            'user_ip': self.user_ip,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'read': self.read
        }

class BlogComment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('blog_comment.id'), nullable=True)  # For replies
    author_name = db.Column(db.String(200), nullable=False)
    author_email = db.Column(db.String(200))
    content = db.Column(db.Text, nullable=False)
    user_ip = db.Column(db.String(100))
    user_agent = db.Column(db.String(500))
    approved = db.Column(db.Boolean, default=True)  # Auto-approve or moderate
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)  # Notification read status

    def to_dict(self):
        return {
            'id': self.id,
            'blog_id': self.blog_id,
            'parent_id': self.parent_id,
            'author_name': self.author_name,
            'author_email': self.author_email,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'approved': self.approved,
            'read': self.read
        }

