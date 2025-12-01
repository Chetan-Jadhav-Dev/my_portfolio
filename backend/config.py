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
    
    # Handle Supabase/Render PostgreSQL URL format (SQLAlchemy requires postgresql://)
    _db_url = os.environ.get('DATABASE_URL')
    if _db_url:
        # Convert postgres:// to postgresql:// (required by SQLAlchemy)
        if _db_url.startswith('postgres://'):
            _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
        
        # Fix Supabase pooler connection to avoid "duplicate SASL authentication" error
        # The pooler (port 6543) can cause issues - automatically convert to direct connection
        if '.pooler.supabase.com' in _db_url or ':6543' in _db_url:
            from urllib.parse import urlparse, urlunparse
            try:
                parsed = urlparse(_db_url)
                
                # Convert pooler hostname to direct hostname
                if '.pooler.supabase.com' in parsed.hostname:
                    new_hostname = parsed.hostname.replace('.pooler.supabase.com', '.supabase.co')
                    new_port = 5432  # Use direct connection port
                    
                    # Reconstruct netloc with new hostname and port
                    auth_part = f"{parsed.username}:{parsed.password}@" if parsed.username else ""
                    new_netloc = f"{auth_part}{new_hostname}:{new_port}"
                    
                    # Rebuild URL
                    _db_url = urlunparse((
                        parsed.scheme,
                        new_netloc,
                        parsed.path,
                        parsed.params,
                        parsed.query if 'sslmode' in parsed.query else parsed.query + ('&' if parsed.query else '') + 'sslmode=require',
                        parsed.fragment
                    ))
                    print(f"✅ Converted Supabase pooler connection to direct connection")
            except Exception as e:
                print(f"⚠️  Warning: Could not automatically convert pooler URL: {e}")
                print(f"   Please use direct connection (port 5432) from Supabase dashboard")
        
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

