import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    # Use absolute path for database to avoid issues
    _base_dir = os.path.dirname(os.path.abspath(__file__))
    _db_path = os.path.join(_base_dir, 'instance', 'portfolio.db')
    # Ensure instance directory exists
    os.makedirs(os.path.dirname(_db_path), exist_ok=True)
    
    # Handle Supabase Direct Connection (PostgreSQL)
    # SQLAlchemy requires postgresql:// (not postgres://)
    _db_url = os.environ.get('DATABASE_URL')
    if _db_url:
        # Convert postgres:// to postgresql:// (required by SQLAlchemy)
        if _db_url.startswith('postgres://'):
            _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
        
        # Configure Supabase connection (supports both direct and pooler connections)
        if 'supabase.co' in _db_url or 'supabase.com' in _db_url:
            from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
            parsed = urlparse(_db_url)
            query_params = parse_qs(parsed.query)
            
            # Add SSL mode if not present (required for Supabase)
            if 'sslmode' not in query_params:
                query_params['sslmode'] = ['require']
            
            # Add pgbouncer mode for Session Pooler connections
            # Session Pooler is required for IPv4 networks (like Render free tier)
            if '.pooler.supabase.com' in _db_url or ':6543' in _db_url:
                # For Session Pooler, use transaction mode to avoid connection issues
                if 'pgbouncer' not in query_params:
                    query_params['pgbouncer'] = ['true']
            
            # Add connection parameters
            if 'connect_timeout' not in query_params:
                query_params['connect_timeout'] = ['10']
            
            # Reconstruct URL with parameters
            new_query = urlencode(query_params, doseq=True)
            _db_url = urlunparse(parsed._replace(query=new_query))
        
    SQLALCHEMY_DATABASE_URI = _db_url or f'sqlite:///{_db_path}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME') or 'admin'
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'admin123'
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
    
    # Email configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or os.environ.get('MAIL_USERNAME')
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL') or os.environ.get('MAIL_USERNAME')

