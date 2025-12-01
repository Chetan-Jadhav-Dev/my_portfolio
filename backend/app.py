from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from datetime import timedelta, datetime
from config import Config
from models import db, Project, About, Skill, Analytics, Experience, Contact, ActivityLog, GitHubSettings, Blog, BlogLike, BlogComment, CommentLike
import os
import requests
import uuid
import json
from sqlalchemy import func, desc

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)

jwt = JWTManager(app)
mail = Mail(app)
CORS(app, origins=app.config['CORS_ORIGINS'])

# Function to initialize database with sample data
def initialize_database():
    """Initialize database with sample data if empty (for first-time setup)"""
    try:
        # Check if auto-initialization is disabled via environment variable
        # Set AUTO_INIT_DB=false in Render to disable auto-initialization
        auto_init_enabled = os.environ.get('AUTO_INIT_DB', 'true').lower() in ['true', '1', 'yes']
        if not auto_init_enabled:
            print("=" * 60)
            print("ℹ️  Auto-initialization is DISABLED (AUTO_INIT_DB=false)")
            print("   Database will not be initialized automatically.")
            print("=" * 60)
            return
        
        # Use models already imported at top of file
        # Import additional modules needed
        from datetime import datetime, timedelta
        import json
        import uuid
        
        # Robust check: Verify database is truly empty by checking multiple tables
        # This prevents re-initialization on every deployment
        # Check ALL key tables - if ANY have data, skip initialization
        print("=" * 60)
        print("🔍 Checking database for existing data...")
        
        try:
            has_about = About.query.first() is not None
            has_projects = Project.query.first() is not None
            has_skills = Skill.query.first() is not None
            has_experience = Experience.query.first() is not None
            has_blogs = Blog.query.first() is not None
            has_analytics = Analytics.query.first() is not None
            
            print(f"   About: {has_about}, Projects: {has_projects}, Skills: {has_skills}")
            print(f"   Experience: {has_experience}, Blogs: {has_blogs}, Analytics: {has_analytics}")
        except Exception as query_error:
            print(f"⚠️  Error checking database: {query_error}")
            print("   Assuming database is empty and needs initialization...")
            has_about = has_projects = has_skills = has_experience = has_blogs = has_analytics = False
        
        # If ANY table has data, the database is initialized - DO NOT OVERWRITE
        if has_about or has_projects or has_skills or has_experience or has_blogs or has_analytics:
            print("✅ Database already contains data. Skipping initialization.")
            print("=" * 60)
            return  # Database already has data - DO NOT OVERWRITE
        
        print("⚠️  WARNING: Database appears to be completely empty!")
        print("   This should only happen on FIRST deployment.")
        print("   If you see this on every deployment, your database is being reset.")
        print("   Consider using a persistent database or setting AUTO_INIT_DB=false")
        print("   Initializing database with sample data...")
        print("=" * 60)
        
        # Create about entry
        default_about = About(
            name="Chetan Jadhav",
            title="Senior Data Engineer",
            bio="Results-driven Senior Data Engineer with extensive experience at Turing Inc., specializing in AWS, Snowflake, and Python to design and enhance fintech data architectures. Proven success in developing efficient data models and ETL pipelines that drive business intelligence and informed decision-making.",
            email="chetan.jadhav@example.com",
            github_url="https://github.com/chetan-jadhav",
            linkedin_url="https://linkedin.com/in/jadhav-chetan",
            profile_image_url="https://via.placeholder.com/400x400/667eea/ffffff?text=CJ",
            hero_short_description="Passionate about building scalable data solutions and transforming complex data challenges into actionable insights. I specialize in cloud data engineering, ETL pipelines, and machine learning infrastructure.",
            hero_top_skills="Python,SQL,ETL,DBT,Snowflake"
        )
        db.session.add(default_about)
        
        # Create experience entries
        experiences = [
            Experience(
                company="Turing Inc.",
                position="Senior Data Engineer",
                start_date="08/2023",
                end_date="01/2025",
                location="Remote, United States",
                short_description="Designed and managed scalable cloud data infrastructure using Snowflake, AWS, and Terraform. Built ETL pipelines with DBT for staging, transformation, and mart layers.",
                detailed_description="""Company Overview: Fintech Data Infrastructure and Modeling

Key Responsibilities:
- Designed and managed scalable cloud data infrastructure using Snowflake, AWS, and Terraform
- Built and maintained ETL pipelines leveraging DBT for staging, transformation, and mart layers, enabling advanced business intelligence
- Optimized data models to support analytics and decision-making in the financial sector
- Automated operational workflows with Apache Airflow and ensured high availability using PagerDuty
- Developed dynamic pricing models for major US sports events using machine learning and historical data analysis
- Migrated from Azure PostgreSQL to Snowflake for enhanced performance and scalability
- Collaborated across teams to optimize data pipelines and machine learning workflows

Key Technologies: Python, AWS S3, AWS DynamoDB, Snowflake, Docker, Kubernetes, DBT, Kafka, Airflow, Terraform, Git Actions, Azure DataBricks, PySpark, Azure ML Studio, Flink""",
                technologies="Python,SQL,ETL,Airflow,Terraform,Git Actions,DBT,Azure DataBricks,Azure,Snowflake,PySpark,Azure ML Studio,Docker,Kubernetes,Kafka,Flink",
                order=1
            ),
            Experience(
                company="Deviahc Technologies Pvt Ltd",
                position="Data Engineer",
                start_date="10/2019",
                end_date="08/2023",
                location="Pune, Maharashtra",
                short_description="Automated car damage detection using image processing and deep learning. Built end-to-end machine learning pipelines containerized with Docker and orchestrated using Kubernetes.",
                detailed_description="""Key Responsibilities:
- Automated car damage detection using image processing and deep learning techniques
- Built end-to-end machine learning pipelines, containerized with Docker, and orchestrated using Kubernetes
- Integrated MVS cameras and APIs for seamless data acquisition and defect identification
- Fine-tuned large language models (LLMs) for natural language processing applications
- Developed algorithms for text summarization and retrieval-augmented generation (RAG)
- Built and deployed e-commerce chatbots using GPT-3.5 Turbo
- Created ETL scripts to move and transform data from various sources into a centralized repository
- Collaborated with other teams to understand their requirements and deliver solutions accordingly

Key Technologies: TensorFlow, OpenCV, MLFlow, SQL, AWS SageMaker, Apache Airflow, Python, RAG, Snowflake, Docker, Azure, AWS""",
                technologies="Python,TensorFlow,OpenCV,MLFlow,SQL,AWS SageMaker,Apache Airflow,RAG,Snowflake,Docker,Azure,AWS",
                order=2
            )
        ]
        
        for exp in experiences:
            db.session.add(exp)
        
        # Create sample projects
        sample_projects = [
            Project(
                title="Real-Time Financial Data Pipeline",
                description="High-throughput streaming pipeline processing 1M+ transactions/sec using Kafka, Flink, and Snowflake.",
                detailed_description="""Designed and implemented a robust real-time data pipeline for a fintech application. The system ingests millions of transaction records daily, performs real-time fraud detection, and loads aggregated data into Snowflake for analytics.

Key Features:
- **Ingestion**: Apache Kafka for high-throughput event streaming.
- **Processing**: Apache Flink for stateful stream processing and windowed aggregations.
- **Storage**: Snowflake Data Cloud for scalable data warehousing.
- **Orchestration**: Apache Airflow for managing batch backfills and dependency management.
- **IaC**: Terraform for provisioning AWS infrastructure (MSK, EMR, S3).

The pipeline reduced data latency from hours to seconds, enabling the fraud team to react to suspicious activities in near real-time.""",
                technologies="Apache Kafka,Apache Flink,Snowflake,AWS,Terraform,Python,Java",
                github_url="https://github.com/chetan-jadhav/financial-pipeline",
                live_url="https://demo.example.com/pipeline",
                image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
                screenshots=json.dumps([
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1543286386-713df548e9cc?q=80&w=1000&auto=format&fit=crop"
                ])
            ),
            Project(
                title="Data Lakehouse Architecture Migration",
                description="Migrated legacy data warehouse to a modern Data Lakehouse using Databricks and Delta Lake.",
                detailed_description="""Led the migration of a multi-terabyte legacy data warehouse to a modern Data Lakehouse architecture on AWS using Databricks and Delta Lake. This modernization improved query performance by 40% and reduced storage costs by 30%.

Key Achievements:
- Designed the Bronze-Silver-Gold medallion architecture.
- Implemented CDC (Change Data Capture) pipelines using Debezium and Spark Structured Streaming.
- Enforced data quality checks using Great Expectations.
- Enabled ACID transactions and time travel capabilities with Delta Lake.
- Built a unified catalog for data discovery.

This project democratized data access across the organization, allowing data scientists and analysts to query the same consistent source of truth.""",
                technologies="Databricks,Apache Spark,Delta Lake,AWS S3,Python,SQL,Great Expectations",
                github_url="https://github.com/chetan-jadhav/lakehouse-migration",
                live_url=None,
                image_url="https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000&auto=format&fit=crop",
                screenshots=json.dumps([
                    "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000&auto=format&fit=crop"
                ])
            ),
            Project(
                title="dbt Analytics Engineering Framework",
                description="Implemented a modular dbt project for transforming raw data into business-ready data marts.",
                detailed_description="""Established a scalable Analytics Engineering framework using dbt (data build tool) and BigQuery. This framework replaced ad-hoc SQL scripts with version-controlled, tested, and documented data models.

Key Components:
- **Modeling**: Dimensional modeling (Star Schema) for performance and usability.
- **Testing**: Automated schema and data integrity tests (unique, not null, relationships).
- **Documentation**: Auto-generated documentation hosted on GitHub Pages.
- **CI/CD**: GitHub Actions pipeline to lint SQL and run tests on pull requests.

The framework significantly reduced data incidents and improved trust in business dashboards.""",
                technologies="dbt,BigQuery,SQL,GitHub Actions,Python,Looker",
                github_url="https://github.com/chetan-jadhav/dbt-analytics",
                live_url="https://demo.example.com/dbt-docs",
                image_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
                screenshots=json.dumps([
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                ])
            )
        ]
        
        for project in sample_projects:
            db.session.add(project)
        
        # Create skills with icons
        sample_skills = [
            Skill(name="Python", category="Programming Languages", proficiency=95, icon="FaPython"),
            Skill(name="SQL", category="Programming Languages", proficiency=90, icon="FaDatabase"),
            Skill(name="Scala", category="Programming Languages", proficiency=80, icon="FaCode"),
            Skill(name="Apache Spark", category="Big Data", proficiency=90, icon="SiApachespark"),
            Skill(name="Kafka", category="Big Data", proficiency=85, icon="SiApachekafka"),
            Skill(name="Snowflake", category="Data Warehousing", proficiency=92, icon="SiSnowflake"),
            Skill(name="Databricks", category="Data Warehousing", proficiency=88, icon="SiDatabricks"),
            Skill(name="dbt", category="Data Engineering", proficiency=90, icon="SiDbt"),
            Skill(name="Airflow", category="Data Engineering", proficiency=85, icon="SiApacheairflow"),
            Skill(name="AWS", category="Cloud", proficiency=85, icon="FaAws"),
            Skill(name="Docker", category="DevOps", proficiency=80, icon="FaDocker"),
            Skill(name="Terraform", category="DevOps", proficiency=75, icon="SiTerraform"),
        ]
        
        for skill in sample_skills:
            db.session.add(skill)
        
        # Create sample blogs
        sample_blogs = [
            Blog(
                title="The Evolution of the Modern Data Stack",
                slug="evolution-modern-data-stack",
                excerpt="From Hadoop clusters to the Cloud Data Lakehouse. A deep dive into how data engineering architecture has evolved over the last decade.",
                banner_image_url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
                content="""<h2>Introduction</h2>
<p>The data landscape has shifted dramatically. Gone are the days of managing complex on-premise Hadoop clusters. Today, we live in the era of the Modern Data Stack (MDS).</p>

<h2>What is the Modern Data Stack?</h2>
<p>The MDS is a suite of tools centered around a cloud data warehouse (like Snowflake, BigQuery, or Redshift). It emphasizes modularity, scalability, and ease of use.</p>

<h3>Key Components:</h3>
<ul>
<li><strong>Ingestion:</strong> Fivetran, Airbyte</li>
<li><strong>Warehousing:</strong> Snowflake, Databricks, BigQuery</li>
<li><strong>Transformation:</strong> dbt (data build tool)</li>
<li><strong>Orchestration:</strong> Airflow, Dagster, Prefect</li>
<li><strong>Reverse ETL:</strong> Hightouch, Census</li>
</ul>

<h2>The Shift to ELT</h2>
<p>With cheap cloud storage and powerful compute, we've moved from ETL (Extract, Transform, Load) to ELT (Extract, Load, Transform). This allows us to load raw data first and transform it later using SQL, giving us more flexibility and agility.</p>

<h2>Conclusion</h2>
<p>Embracing the MDS allows data teams to focus on delivering value rather than managing infrastructure. It's an exciting time to be a data engineer!</p>""",
                author="Chetan Jadhav",
                published=True,
                featured=True,
                show_on_homepage=True,
                tags="Data Engineering,Modern Data Stack,Cloud,ETL",
                reading_time=5,
                views=120,
                published_at=datetime.utcnow() - timedelta(days=5)
            ),
            Blog(
                title="Idempotency in Data Pipelines: Why It Matters",
                slug="idempotency-data-pipelines",
                excerpt="Understanding idempotency is crucial for building reliable data pipelines. Learn what it is and how to implement it.",
                banner_image_url="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop",
                content="""<h2>What is Idempotency?</h2>
<p>In data engineering, an idempotent operation is one that can be applied multiple times without changing the result beyond the initial application. In simpler terms: running your pipeline twice shouldn't duplicate your data.</p>

<h2>Why is it Important?</h2>
<p>Pipelines fail. Networks glitch. Servers crash. When you need to backfill data or retry a failed run, you need to be confident that you won't corrupt your dataset.</p>

<h2>Strategies for Idempotency</h2>
<h3>1. DELETE-INSERT Pattern</h3>
<p>Before inserting data for a specific date partition, delete any existing data for that partition.</p>
<pre><code class="language-sql">DELETE FROM target_table WHERE date = '2023-10-27';
INSERT INTO target_table SELECT * FROM source WHERE date = '2023-10-27';</code></pre>

<h3>2. MERGE (Upsert)</h3>
<p>Use the MERGE statement to update existing records and insert new ones based on a unique key.</p>

<h2>Conclusion</h2>
<p>Designing for idempotency from day one will save you countless headaches down the road. It is the bedrock of reliable data engineering.</p>""",
                author="Chetan Jadhav",
                published=True,
                featured=False,
                show_on_homepage=True,
                tags="Data Engineering,Best Practices,SQL,Pipelines",
                reading_time=4,
                views=85,
                published_at=datetime.utcnow() - timedelta(days=2)
            )
        ]
        
        for blog in sample_blogs:
            db.session.add(blog)
        
        # Create sample analytics data (30 days)
        countries = ['United States', 'India', 'United Kingdom', 'Canada', 'Germany', 'Australia', 'France', 'Japan']
        cities = {
            'United States': ['New York', 'San Francisco', 'Seattle', 'Austin'],
            'India': ['Mumbai', 'Bangalore', 'Delhi', 'Pune'],
            'United Kingdom': ['London', 'Manchester', 'Edinburgh'],
            'Canada': ['Toronto', 'Vancouver', 'Montreal'],
            'Germany': ['Berlin', 'Munich', 'Hamburg'],
            'Australia': ['Sydney', 'Melbourne', 'Brisbane'],
            'France': ['Paris', 'Lyon', 'Marseille'],
            'Japan': ['Tokyo', 'Osaka', 'Kyoto']
        }
        sections = ['about', 'projects', 'skills', 'experience', 'contact', 'github']
        project_names = [p.title for p in sample_projects]
        
        base_time = datetime.utcnow()
        session_ids = [str(uuid.uuid4()) for _ in range(50)]
        
        for day in range(30):
            day_time = base_time - timedelta(days=day)
            for hour in range(24):
                hour_time = day_time.replace(hour=hour, minute=0, second=0)
                # Create page views
                for _ in range(3 + (day % 5)):
                    session_id = session_ids[day % len(session_ids)]
                    country = countries[day % len(countries)]
                    city = cities[country][day % len(cities[country])]
                    
                    analytics = Analytics(
                        session_id=session_id,
                        event_type='page_view',
                        section=None,
                        ip_address=f"192.168.1.{day % 255}",
                        country=country,
                        city=city,
                        timestamp=hour_time + timedelta(minutes=(day * 3) % 60)
                    )
                    db.session.add(analytics)
                    
                    # Add section views
                    section = sections[day % len(sections)]
                    analytics_section = Analytics(
                        session_id=session_id,
                        event_type='section_view',
                        section=section,
                        ip_address=f"192.168.1.{day % 255}",
                        country=country,
                        city=city,
                        timestamp=hour_time + timedelta(minutes=(day * 3 + 1) % 60)
                    )
                    db.session.add(analytics_section)
                    
                    # Add project clicks
                    if day % 3 == 0:
                        project_name = project_names[day % len(project_names)]
                        analytics_project = Analytics(
                            session_id=session_id,
                            event_type='project_click',
                            section='projects',
                            item_name=project_name,
                            ip_address=f"192.168.1.{day % 255}",
                            country=country,
                            city=city,
                            timestamp=hour_time + timedelta(minutes=(day * 3 + 2) % 60)
                        )
                        db.session.add(analytics_project)
        
        db.session.commit()
        print("✅ Database initialized successfully with sample data!")
        print("📊 Added: About, Experiences, Projects, Skills, Blogs, Analytics")
        
    except Exception as e:
        import traceback
        print(f"⚠️  Error initializing database: {str(e)}")
        print(f"Full traceback:\n{traceback.format_exc()}")
        db.session.rollback()
        # Don't fail startup if initialization fails

# Initialize database
with app.app_context():
    try:
        # Try to create tables - this will test the connection
        db.create_all()
        print("✅ Database tables created/verified successfully")
        
        # Auto-initialize with sample data if database is empty
        # Set AUTO_INIT_DB=false in environment variables to disable
        initialize_database()
    except Exception as e:
        db_url = app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')
        # Don't print full URL for security
        db_preview = db_url.split('@')[-1] if '@' in db_url else 'Not configured'
        
        print("=" * 60)
        print("⚠️  WARNING: Database connection failed during startup")
        print(f"   Error: {type(e).__name__}")
        print(f"   Database host: {db_preview}")
        print("=" * 60)
        print("This could mean:")
        print("  1. Database is not accessible (check Supabase project status)")
        print("  2. Connection string is incorrect")
        print("  3. Database is paused (Supabase free tier pauses after inactivity)")
        print("  4. Network connectivity issues")
        print("=" * 60)
        print("The app will continue to run, but database operations will fail.")
        print("Please check your DATABASE_URL environment variable and Supabase status.")
        print("=" * 60)
        # Don't crash - let the app start and handle connection errors gracefully

# Helper function to log admin activities
def log_activity(action, entity_type, entity_id=None, entity_name=None, admin_user=None, data_snapshot=None):
    """Log admin activity for tracking and undo functionality"""
    if not admin_user:
        admin_user = get_jwt_identity() or 'unknown'
    
    activity = ActivityLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        entity_name=entity_name,
        admin_user=admin_user,
        data_snapshot=json.dumps(data_snapshot) if data_snapshot else None
    )
    db.session.add(activity)
    db.session.commit()
    return activity

# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username == app.config['ADMIN_USERNAME'] and password == app.config['ADMIN_PASSWORD']:
        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=24))
        return jsonify({'access_token': access_token}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# Projects routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify([project.to_dict() for project in projects]), 200

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify(project.to_dict()), 200

@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    
    screenshots_json = json.dumps(data.get('screenshots', [])) if data.get('screenshots') else None
    
    project = Project(
        title=data.get('title'),
        description=data.get('description'),
        detailed_description=data.get('detailed_description'),
        technologies=','.join(data.get('technologies', [])),
        github_url=data.get('github_url'),
        live_url=data.get('live_url'),
        image_url=data.get('image_url'),
        screenshots=screenshots_json
    )
    
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    admin_user = get_jwt_identity()
    data = request.get_json()
    
    # Store old data for activity log
    old_data = project.to_dict()
    
    project.title = data.get('title', project.title)
    project.description = data.get('description', project.description)
    project.detailed_description = data.get('detailed_description', project.detailed_description)
    project.technologies = ','.join(data.get('technologies', [])) if data.get('technologies') else project.technologies
    project.github_url = data.get('github_url', project.github_url)
    project.live_url = data.get('live_url', project.live_url)
    project.image_url = data.get('image_url', project.image_url)
    if 'screenshots' in data:
        project.screenshots = json.dumps(data.get('screenshots', [])) if data.get('screenshots') else None
    
    db.session.commit()
    
    # Log activity
    log_activity('update', 'project', project.id, project.title, admin_user, {'old': old_data, 'new': project.to_dict()})
    
    return jsonify(project.to_dict()), 200

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    admin_user = get_jwt_identity()
    
    # Store data for undo
    project_data = project.to_dict()
    
    db.session.delete(project)
    db.session.commit()
    
    # Log activity with full data snapshot for undo
    log_activity('delete', 'project', project_id, project_data.get('title'), admin_user, project_data)
    
    return jsonify({'message': 'Project deleted successfully', 'deleted_data': project_data}), 200

# About routes
@app.route('/api/about', methods=['GET'])
def get_about():
    about = About.query.first()
    if about:
        return jsonify(about.to_dict()), 200
    return jsonify({'message': 'About information not found'}), 404

@app.route('/api/about', methods=['PUT'])
@jwt_required()
def update_about():
    about = About.query.first()
    admin_user = get_jwt_identity()
    
    if not about:
        about = About()
        db.session.add(about)
        old_data = {}
    else:
        old_data = about.to_dict()
    
    data = request.get_json()
    about.name = data.get('name', about.name)
    about.title = data.get('title', about.title)
    about.bio = data.get('bio', about.bio)
    about.email = data.get('email', about.email)
    about.github_url = data.get('github_url', about.github_url)
    about.linkedin_url = data.get('linkedin_url', about.linkedin_url)
    about.twitter_url = data.get('twitter_url', about.twitter_url)
    about.profile_image_url = data.get('profile_image_url', about.profile_image_url)
    if 'hero_top_skills' in data:
        # Handle both string (comma-separated) and array formats
        if isinstance(data.get('hero_top_skills'), list):
            about.hero_top_skills = ','.join(data.get('hero_top_skills', [])[:5])
        else:
            about.hero_top_skills = data.get('hero_top_skills', '')
    about.hero_short_description = data.get('hero_short_description', about.hero_short_description)
    
    db.session.commit()
    
    # Log activity
    log_activity('update', 'about', about.id, about.name, admin_user, {'old': old_data, 'new': about.to_dict()})
    
    return jsonify(about.to_dict()), 200

# Skills routes
@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    return jsonify([skill.to_dict() for skill in skills]), 200

@app.route('/api/skills', methods=['POST'])
@jwt_required()
def create_skill():
    data = request.get_json()
    admin_user = get_jwt_identity()
    
    skill = Skill(
        name=data.get('name'),
        category=data.get('category'),
        proficiency=data.get('proficiency', 0),
        icon=data.get('icon')
    )
    
    db.session.add(skill)
    db.session.commit()
    
    # Log activity
    log_activity('create', 'skill', skill.id, skill.name, admin_user)
    
    return jsonify(skill.to_dict()), 201

@app.route('/api/skills/<int:skill_id>', methods=['PUT'])
@jwt_required()
def update_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    admin_user = get_jwt_identity()
    data = request.get_json()
    
    old_data = skill.to_dict()
    
    skill.name = data.get('name', skill.name)
    skill.category = data.get('category', skill.category)
    skill.proficiency = data.get('proficiency', skill.proficiency)
    skill.icon = data.get('icon', skill.icon)
    
    db.session.commit()
    
    # Log activity
    log_activity('update', 'skill', skill.id, skill.name, admin_user, {'old': old_data, 'new': skill.to_dict()})
    
    return jsonify(skill.to_dict()), 200

@app.route('/api/skills/<int:skill_id>', methods=['DELETE'])
@jwt_required()
def delete_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    admin_user = get_jwt_identity()
    
    skill_data = skill.to_dict()
    
    db.session.delete(skill)
    db.session.commit()
    
    # Log activity with data snapshot for undo
    log_activity('delete', 'skill', skill_id, skill_data.get('name'), admin_user, skill_data)
    
    return jsonify({'message': 'Skill deleted successfully', 'deleted_data': skill_data}), 200

# Helper function to get location from IP
def get_location_from_ip(ip_address):
    """Get country and city from IP address using free API"""
    try:
        # Using ipapi.co free service (1000 requests/day free)
        if ip_address and ip_address != '127.0.0.1' and not ip_address.startswith('192.168'):
            response = requests.get(f'https://ipapi.co/{ip_address}/json/', timeout=2)
            if response.status_code == 200:
                data = response.json()
                return {
                    'country': data.get('country_name', 'Unknown'),
                    'city': data.get('city', 'Unknown')
                }
    except:
        pass
    return {'country': 'Unknown', 'city': 'Unknown'}

# Analytics routes
@app.route('/api/analytics/track', methods=['POST'])
def track_event():
    """Track user interaction events"""
    data = request.get_json()
    ip_address = request.remote_addr or request.headers.get('X-Forwarded-For', '').split(',')[0]
    
    # Get location
    location = get_location_from_ip(ip_address)
    
    analytics = Analytics(
        session_id=data.get('session_id', str(uuid.uuid4())),
        event_type=data.get('event_type', 'page_view'),
        section=data.get('section'),
        item_id=data.get('item_id'),
        item_name=data.get('item_name'),
        ip_address=ip_address,
        user_agent=request.headers.get('User-Agent', ''),
        country=location['country'],
        city=location['city'],
        referrer=request.headers.get('Referer', ''),
        duration=data.get('duration')
    )
    
    db.session.add(analytics)
    db.session.commit()
    return jsonify({'message': 'Event tracked', 'session_id': analytics.session_id}), 201

@app.route('/api/analytics/stats', methods=['GET'])
@jwt_required()
def get_analytics_stats():
    """Get analytics statistics for dashboard"""
    # Total visitors
    total_visitors = db.session.query(func.count(func.distinct(Analytics.session_id))).scalar()
    
    # Total page views
    total_views = Analytics.query.filter_by(event_type='page_view').count()
    
    # Section views
    section_views = db.session.query(
        Analytics.section,
        func.count(Analytics.id).label('count')
    ).filter(
        Analytics.section.isnot(None)
    ).group_by(Analytics.section).all()
    
    # Top projects
    top_projects = db.session.query(
        Analytics.item_name,
        func.count(Analytics.id).label('count')
    ).filter(
        Analytics.event_type == 'project_click',
        Analytics.item_name.isnot(None)
    ).group_by(Analytics.item_name).order_by(desc('count')).limit(10).all()
    
    # Visitors by country
    visitors_by_country = db.session.query(
        Analytics.country,
        func.count(func.distinct(Analytics.session_id)).label('count')
    ).filter(
        Analytics.country.isnot(None),
        Analytics.country != 'Unknown'
    ).group_by(Analytics.country).order_by(desc('count')).all()
    
    # Visitors by city
    visitors_by_city = db.session.query(
        Analytics.city,
        Analytics.country,
        func.count(func.distinct(Analytics.session_id)).label('count')
    ).filter(
        Analytics.city.isnot(None),
        Analytics.city != 'Unknown'
    ).group_by(Analytics.city, Analytics.country).order_by(desc('count')).limit(20).all()
    
    # Recent activity (last 24 hours)
    from datetime import timedelta
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_activity = Analytics.query.filter(
        Analytics.timestamp >= yesterday
    ).order_by(desc(Analytics.timestamp)).limit(50).all()
    
    # Hourly traffic (last 24 hours)
    hourly_traffic = db.session.query(
        func.extract('hour', Analytics.timestamp).label('hour'),
        func.count(Analytics.id).label('count')
    ).filter(
        Analytics.timestamp >= yesterday
    ).group_by('hour').order_by('hour').all()
    
    return jsonify({
        'total_visitors': total_visitors or 0,
        'total_views': total_views or 0,
        'section_views': [{'section': s[0], 'count': s[1]} for s in section_views],
        'top_projects': [{'name': p[0], 'count': p[1]} for p in top_projects],
        'visitors_by_country': [{'country': c[0], 'count': c[1]} for c in visitors_by_country],
        'visitors_by_city': [{'city': c[0], 'country': c[1], 'count': c[2]} for c in visitors_by_city],
        'recent_activity': [a.to_dict() for a in recent_activity],
        'hourly_traffic': [{'hour': int(h[0]), 'count': h[1]} for h in hourly_traffic]
    }), 200

@app.route('/api/analytics/realtime', methods=['GET'])
@jwt_required()
def get_realtime_stats():
    """Get real-time analytics (last hour)"""
    from datetime import timedelta
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    
    recent_visitors = db.session.query(
        func.count(func.distinct(Analytics.session_id))
    ).filter(
        Analytics.timestamp >= one_hour_ago
    ).scalar()
    
    recent_views = Analytics.query.filter(
        Analytics.timestamp >= one_hour_ago
    ).count()
    
    recent_locations = db.session.query(
        Analytics.city,
        Analytics.country,
        func.count(func.distinct(Analytics.session_id)).label('count')
    ).filter(
        Analytics.timestamp >= one_hour_ago,
        Analytics.city.isnot(None),
        Analytics.city != 'Unknown'
    ).group_by(Analytics.city, Analytics.country).order_by(desc('count')).limit(10).all()
    
    return jsonify({
        'visitors_last_hour': recent_visitors or 0,
        'views_last_hour': recent_views or 0,
        'recent_locations': [{'city': l[0], 'country': l[1], 'count': l[2]} for l in recent_locations]
    }), 200

# Experience routes
@app.route('/api/experience', methods=['GET'])
def get_experience():
    experiences = Experience.query.order_by(Experience.order.desc(), Experience.start_date.desc()).all()
    return jsonify([exp.to_dict() for exp in experiences]), 200

@app.route('/api/experience/<int:exp_id>', methods=['GET'])
def get_experience_item(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    return jsonify(exp.to_dict()), 200

@app.route('/api/experience', methods=['POST'])
@jwt_required()
def create_experience():
    data = request.get_json()
    admin_user = get_jwt_identity()
    
    exp = Experience(
        company=data.get('company'),
        position=data.get('position'),
        start_date=data.get('start_date'),
        end_date=data.get('end_date', 'Present'),
        location=data.get('location'),
        short_description=data.get('short_description'),
        detailed_description=data.get('detailed_description'),
        technologies=','.join(data.get('technologies', [])) if data.get('technologies') else None,
        company_logo_url=data.get('company_logo_url'),
        order=data.get('order', 0)
    )
    
    db.session.add(exp)
    db.session.commit()
    
    # Log activity
    log_activity('create', 'experience', exp.id, f"{exp.position} at {exp.company}", admin_user)
    
    return jsonify(exp.to_dict()), 201

@app.route('/api/experience/<int:exp_id>', methods=['PUT'])
@jwt_required()
def update_experience(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    admin_user = get_jwt_identity()
    data = request.get_json()
    
    old_data = exp.to_dict()
    
    exp.company = data.get('company', exp.company)
    exp.position = data.get('position', exp.position)
    exp.start_date = data.get('start_date', exp.start_date)
    exp.end_date = data.get('end_date', exp.end_date)
    exp.location = data.get('location', exp.location)
    exp.short_description = data.get('short_description', exp.short_description)
    exp.detailed_description = data.get('detailed_description', exp.detailed_description)
    if 'technologies' in data:
        exp.technologies = ','.join(data.get('technologies', [])) if data.get('technologies') else None
    exp.company_logo_url = data.get('company_logo_url', exp.company_logo_url)
    exp.order = data.get('order', exp.order)
    
    db.session.commit()
    
    # Log activity
    log_activity('update', 'experience', exp.id, f"{exp.position} at {exp.company}", admin_user, {'old': old_data, 'new': exp.to_dict()})
    
    return jsonify(exp.to_dict()), 200

@app.route('/api/experience/<int:exp_id>', methods=['DELETE'])
@jwt_required()
def delete_experience(exp_id):
    exp = Experience.query.get_or_404(exp_id)
    admin_user = get_jwt_identity()
    
    exp_data = exp.to_dict()
    
    db.session.delete(exp)
    db.session.commit()
    
    # Log activity with data snapshot for undo
    log_activity('delete', 'experience', exp_id, f"{exp_data.get('position')} at {exp_data.get('company')}", admin_user, exp_data)
    
    return jsonify({'message': 'Experience deleted successfully', 'deleted_data': exp_data}), 200

# Contact routes
@app.route('/api/contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    
    contact = Contact(
        name=data.get('name'),
        email=data.get('email'),
        subject=data.get('subject', 'Portfolio Contact'),
        message=data.get('message')
    )
    
    db.session.add(contact)
    db.session.commit()
    
    # Send email notification
    try:
        if app.config.get('MAIL_USERNAME') and app.config.get('ADMIN_EMAIL'):
            msg = Message(
                subject=f"Portfolio Contact: {contact.subject}",
                recipients=[app.config['ADMIN_EMAIL']],
                body=f"""
New contact form submission:

Name: {contact.name}
Email: {contact.email}
Subject: {contact.subject}

Message:
{contact.message}
                """,
                sender=app.config.get('MAIL_DEFAULT_SENDER')
            )
            mail.send(msg)
    except Exception as e:
        print(f"Email sending failed: {e}")
        # Don't fail the request if email fails
    
    return jsonify({'message': 'Contact form submitted successfully', 'id': contact.id}), 201

@app.route('/api/contact', methods=['GET'])
@jwt_required()
def get_contacts():
    contacts = Contact.query.order_by(Contact.created_at.desc()).all()
    return jsonify([c.to_dict() for c in contacts]), 200

@app.route('/api/contact/<int:contact_id>', methods=['GET'])
@jwt_required()
def get_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    return jsonify(contact.to_dict()), 200

@app.route('/api/contact/<int:contact_id>/read', methods=['PUT'])
@jwt_required()
def mark_contact_read(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    contact.read = True
    db.session.commit()
    return jsonify(contact.to_dict()), 200

@app.route('/api/contact/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def delete_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    admin_user = get_jwt_identity()
    
    contact_data = contact.to_dict()
    
    db.session.delete(contact)
    db.session.commit()
    
    # Log activity
    log_activity('delete', 'contact', contact_id, f"Contact from {contact_data.get('name')}", admin_user, contact_data)
    
    return jsonify({'message': 'Contact deleted successfully', 'deleted_data': contact_data}), 200

# Activity Log routes
@app.route('/api/activity', methods=['GET'])
@jwt_required()
def get_activity_logs():
    """Get activity logs for admin dashboard"""
    limit = request.args.get('limit', 50, type=int)
    activities = ActivityLog.query.order_by(desc(ActivityLog.timestamp)).limit(limit).all()
    return jsonify([a.to_dict() for a in activities]), 200

@app.route('/api/activity/undo/<int:activity_id>', methods=['POST'])
@jwt_required()
def undo_activity(activity_id):
    """Undo a delete action by restoring the deleted item"""
    activity = ActivityLog.query.get_or_404(activity_id)
    admin_user = get_jwt_identity()
    
    if activity.undone:
        return jsonify({'message': 'This action has already been undone'}), 400
    
    if activity.action != 'delete':
        return jsonify({'message': 'Only delete actions can be undone'}), 400
    
    if not activity.data_snapshot:
        return jsonify({'message': 'No data available to restore'}), 400
    
    try:
        snapshot = json.loads(activity.data_snapshot) if isinstance(activity.data_snapshot, str) else activity.data_snapshot
        
        # Restore based on entity type
        if activity.entity_type == 'project':
            project = Project(
                title=snapshot.get('title'),
                description=snapshot.get('description'),
                detailed_description=snapshot.get('detailed_description'),
                technologies=','.join(snapshot.get('technologies', [])),
                github_url=snapshot.get('github_url'),
                live_url=snapshot.get('live_url'),
                image_url=snapshot.get('image_url'),
                screenshots=json.dumps(snapshot.get('screenshots', [])) if snapshot.get('screenshots') else None
            )
            db.session.add(project)
            db.session.commit()
            restored_id = project.id
            
        elif activity.entity_type == 'skill':
            skill = Skill(
                name=snapshot.get('name'),
                category=snapshot.get('category'),
                proficiency=snapshot.get('proficiency', 0),
                icon=snapshot.get('icon')
            )
            db.session.add(skill)
            db.session.commit()
            restored_id = skill.id
            
        elif activity.entity_type == 'experience':
            exp = Experience(
                company=snapshot.get('company'),
                position=snapshot.get('position'),
                start_date=snapshot.get('start_date'),
                end_date=snapshot.get('end_date', 'Present'),
                location=snapshot.get('location'),
                short_description=snapshot.get('short_description'),
                detailed_description=snapshot.get('detailed_description'),
                technologies=','.join(snapshot.get('technologies', [])) if snapshot.get('technologies') else None,
                company_logo_url=snapshot.get('company_logo_url'),
                order=snapshot.get('order', 0)
            )
            db.session.add(exp)
            db.session.commit()
            restored_id = exp.id
            
        elif activity.entity_type == 'contact':
            contact = Contact(
                name=snapshot.get('name'),
                email=snapshot.get('email'),
                subject=snapshot.get('subject'),
                message=snapshot.get('message'),
                read=snapshot.get('read', False)
            )
            db.session.add(contact)
            db.session.commit()
            restored_id = contact.id
        else:
            return jsonify({'message': 'Entity type not supported for undo'}), 400
        
        # Mark activity as undone
        activity.undone = True
        db.session.commit()
        
        # Log undo action
        log_activity('undo', activity.entity_type, restored_id, activity.entity_name, admin_user)
        
        return jsonify({
            'message': f'{activity.entity_type} restored successfully',
            'restored_id': restored_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error restoring item: {str(e)}'}), 500

# GitHub routes
@app.route('/api/github/settings', methods=['GET'])
@jwt_required()
def get_github_settings():
    """Get GitHub settings"""
    settings = GitHubSettings.query.first()
    if not settings:
        settings = GitHubSettings()
        db.session.add(settings)
        db.session.commit()
    return jsonify(settings.to_dict()), 200

@app.route('/api/github/settings/public', methods=['GET'])
def get_public_github_settings():
    """Get GitHub settings for public frontend (only enabled status)"""
    settings = GitHubSettings.query.first()
    if not settings or not settings.enabled:
        return jsonify({'enabled': False}), 200
    return jsonify({'enabled': settings.enabled}), 200

@app.route('/api/github/settings', methods=['PUT'])
@jwt_required()
def update_github_settings():
    """Update GitHub settings"""
    admin_user = get_jwt_identity()
    data = request.get_json()
    
    settings = GitHubSettings.query.first()
    if not settings:
        settings = GitHubSettings()
        db.session.add(settings)
    
    old_data = settings.to_dict()
    
    if 'github_username' in data:
        settings.github_username = data.get('github_username')
    if 'github_token' in data:
        settings.github_token = data.get('github_token')  # In production, encrypt this
    if 'enabled' in data:
        settings.enabled = data.get('enabled', False)
    if 'selected_repos' in data:
        selected_repos = data.get('selected_repos', [])
        # Handle both string (JSON) and array formats
        if isinstance(selected_repos, str):
            try:
                # If it's already a JSON string, validate it
                json.loads(selected_repos)
                settings.selected_repos = selected_repos
            except:
                # If invalid JSON, treat as empty
                settings.selected_repos = json.dumps([])
        else:
            # If it's an array, convert to JSON string
            settings.selected_repos = json.dumps(selected_repos) if selected_repos else json.dumps([])
    
    settings.updated_at = datetime.utcnow()
    db.session.commit()
    
    # Log activity
    log_activity('update', 'github_settings', settings.id, 'GitHub Settings', admin_user, {'old': old_data, 'new': settings.to_dict()})
    
    return jsonify(settings.to_dict()), 200

@app.route('/api/github/repos', methods=['GET'])
@jwt_required()
def fetch_github_repos():
    """Fetch repositories from GitHub API"""
    settings = GitHubSettings.query.first()
    
    if not settings:
        return jsonify({'message': 'GitHub settings not found. Please configure GitHub settings first.'}), 400
    
    if not settings.github_username:
        return jsonify({'message': 'GitHub username not configured. Please enter your GitHub username in settings.'}), 400
    
    try:
        headers = {}
        if settings.github_token:
            headers['Authorization'] = f'token {settings.github_token}'
        
        url = f'https://api.github.com/users/{settings.github_username}/repos'
        params = {
            'sort': 'updated',
            'direction': 'desc',
            'per_page': 100
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            repos = response.json()
            # Update last sync time
            settings.last_sync = datetime.utcnow()
            db.session.commit()
            
            # Format repos for frontend
            formatted_repos = []
            for repo in repos:
                formatted_repos.append({
                    'id': repo['id'],
                    'name': repo['name'],
                    'full_name': repo['full_name'],
                    'description': repo['description'],
                    'html_url': repo['html_url'],
                    'language': repo['language'],
                    'stars': repo['stargazers_count'],
                    'forks': repo['forks_count'],
                    'updated_at': repo['updated_at'],
                    'created_at': repo['created_at'],
                    'is_private': repo['private'],
                    'default_branch': repo['default_branch']
                })
            
            return jsonify({'repos': formatted_repos}), 200
        else:
            return jsonify({'message': f'GitHub API error: {response.status_code}'}), response.status_code
            
    except requests.exceptions.RequestException as e:
        error_msg = str(e)
        print(f"GitHub API request error: {error_msg}")
        return jsonify({'message': f'Error fetching repos: {error_msg}'}), 500
    except Exception as e:
        error_msg = str(e)
        print(f"Unexpected error fetching GitHub repos: {error_msg}")
        return jsonify({'message': f'Unexpected error: {error_msg}'}), 500

@app.route('/api/github/repos/public', methods=['GET'])
def get_public_github_repos():
    """Get selected GitHub repos for public frontend"""
    settings = GitHubSettings.query.first()
    
    if not settings:
        return jsonify({'repos': [], 'error': 'GitHub settings not configured'}), 200
    
    if not settings.enabled:
        return jsonify({'repos': [], 'error': 'GitHub section is disabled'}), 200
    
    if not settings.github_username:
        return jsonify({'repos': [], 'error': 'GitHub username not configured'}), 200
    
    try:
        # Get selected repos
        selected_repos = []
        if settings.selected_repos:
            try:
                selected_repos = json.loads(settings.selected_repos)
            except:
                selected_repos = []
        
        if not selected_repos:
            return jsonify({'repos': [], 'error': 'No repositories selected. Please select repositories in admin settings.'}), 200
        
        # Fetch fresh data from GitHub
        headers = {}
        if settings.github_token:
            headers['Authorization'] = f'token {settings.github_token}'
        
        url = f'https://api.github.com/users/{settings.github_username}/repos'
        params = {
            'sort': 'updated',
            'direction': 'desc',
            'per_page': 100
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            all_repos = response.json()
            
            # Filter to only selected repos
            formatted_repos = []
            for repo in all_repos:
                # Match by full_name or name
                repo_identifier = repo.get('full_name') or repo.get('name')
                if repo_identifier in selected_repos or repo.get('name') in selected_repos:
                    formatted_repos.append({
                        'id': repo['id'],
                        'name': repo['name'],
                        'full_name': repo['full_name'],
                        'description': repo['description'],
                        'html_url': repo['html_url'],
                        'language': repo['language'],
                        'stars': repo['stargazers_count'],
                        'forks': repo['forks_count'],
                        'updated_at': repo['updated_at'],
                        'created_at': repo['created_at'],
                        'is_private': repo['private']
                    })
            
            return jsonify({'repos': formatted_repos}), 200
        else:
            # Log the error
            error_msg = f'GitHub API returned status {response.status_code}'
            if response.status_code == 401:
                error_msg = 'Invalid GitHub token. Please check your token in admin settings.'
            elif response.status_code == 404:
                error_msg = 'GitHub username not found. Please check your username.'
            elif response.status_code == 403:
                error_msg = 'GitHub API rate limit exceeded or access denied. Please try again later.'
            print(f"GitHub API error: {error_msg}")
            return jsonify({'repos': [], 'error': error_msg}), 200
            
    except requests.exceptions.RequestException as e:
        error_msg = f'Network error: {str(e)}'
        print(f"GitHub API request error: {error_msg}")
        return jsonify({'repos': [], 'error': error_msg}), 200
    except Exception as e:
        # Log error for debugging
        error_msg = str(e)
        print(f"Error fetching GitHub repos: {error_msg}")
        # Return empty on error
        return jsonify({'repos': [], 'error': error_msg}), 200

# Blog routes
@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    """Get all published blogs"""
    published = request.args.get('published', 'true').lower() == 'true'
    homepage = request.args.get('homepage', 'false').lower() == 'true'
    
    query = Blog.query
    if published:
        query = query.filter(Blog.published == True)
    if homepage:
        query = query.filter(Blog.show_on_homepage == True)
    
    blogs = query.order_by(Blog.published_at.desc(), Blog.created_at.desc()).all()
    return jsonify([blog.to_dict() for blog in blogs]), 200

@app.route('/api/blogs/all', methods=['GET'])
@jwt_required()
def get_all_blogs():
    """Get all blogs (including drafts) for admin"""
    try:
        blogs = Blog.query.order_by(Blog.created_at.desc()).all()
        return jsonify([blog.to_dict() for blog in blogs]), 200
    except Exception as e:
        print(f"Error fetching blogs: {e}")
        return jsonify({'message': f'Error fetching blogs: {str(e)}'}), 500

@app.route('/api/blogs/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    """Get a single blog post"""
    blog = Blog.query.get_or_404(blog_id)
    
    # Increment view count
    blog.views = (blog.views or 0) + 1
    db.session.commit()
    
    return jsonify(blog.to_dict()), 200

@app.route('/api/blogs/slug/<slug>', methods=['GET'])
def get_blog_by_slug(slug):
    """Get blog by slug"""
    blog = Blog.query.filter_by(slug=slug).first_or_404()
    
    # Only return if published (unless admin)
    # For now, return all
    
    # Increment view count
    blog.views = (blog.views or 0) + 1
    db.session.commit()
    
    return jsonify(blog.to_dict()), 200

@app.route('/api/blogs', methods=['POST'])
@jwt_required()
def create_blog():
    """Create a new blog post"""
    try:
        admin_user = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Generate slug from title
        import re
        slug = data.get('slug') or re.sub(r'[^\w\s-]', '', data.get('title', '')).strip().lower()
        slug = re.sub(r'[-\s]+', '-', slug)
        
        # Check if slug exists
        existing = Blog.query.filter_by(slug=slug).first()
        if existing:
            slug = f"{slug}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        # Calculate reading time (rough estimate: 200 words per minute)
        content_text = re.sub(r'<[^>]+>', '', data.get('content', ''))
        word_count = len(content_text.split())
        reading_time = max(1, round(word_count / 200))
        
        blog = Blog(
            title=data.get('title'),
            slug=slug,
            excerpt=data.get('excerpt'),
            banner_image_url=data.get('banner_image_url'),
            content=data.get('content'),
            author=data.get('author', admin_user),
            published=data.get('published', False),
            featured=data.get('featured', False),
            show_on_homepage=data.get('show_on_homepage', False),
            tags=','.join(data.get('tags', [])) if isinstance(data.get('tags'), list) else data.get('tags', ''),
            reading_time=reading_time
        )
        
        if blog.published:
            blog.published_at = datetime.utcnow()
        
        db.session.add(blog)
        db.session.commit()
        
        # Log activity
        log_activity('create', 'blog', blog.id, blog.title, admin_user)
        
        return jsonify(blog.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating blog: {e}")
        return jsonify({'message': f'Error creating blog: {str(e)}'}), 500

@app.route('/api/blogs/<int:blog_id>', methods=['PUT'])
@jwt_required()
def update_blog(blog_id):
    """Update a blog post"""
    try:
        admin_user = get_jwt_identity()
        blog = Blog.query.get_or_404(blog_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        old_data = blog.to_dict()
        
        # Update fields
        if 'title' in data:
            blog.title = data.get('title')
        if 'slug' in data:
            blog.slug = data.get('slug')
        if 'excerpt' in data:
            blog.excerpt = data.get('excerpt')
        if 'banner_image_url' in data:
            blog.banner_image_url = data.get('banner_image_url')
        if 'content' in data:
            blog.content = data.get('content')
            # Recalculate reading time
            import re
            content_text = re.sub(r'<[^>]+>', '', data.get('content', ''))
            word_count = len(content_text.split())
            blog.reading_time = max(1, round(word_count / 200))
        if 'author' in data:
            blog.author = data.get('author')
        if 'published' in data:
            was_published = blog.published
            blog.published = data.get('published')
            if blog.published and not was_published:
                blog.published_at = datetime.utcnow()
        if 'featured' in data:
            blog.featured = data.get('featured')
        if 'show_on_homepage' in data:
            blog.show_on_homepage = data.get('show_on_homepage', False)
        if 'tags' in data:
            blog.tags = ','.join(data.get('tags', [])) if isinstance(data.get('tags'), list) else data.get('tags', '')
        
        blog.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log activity
        log_activity('update', 'blog', blog.id, blog.title, admin_user, {'old': old_data, 'new': blog.to_dict()})
        
        return jsonify(blog.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating blog: {e}")
        return jsonify({'message': f'Error updating blog: {str(e)}'}), 500

@app.route('/api/blogs/<int:blog_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(blog_id):
    """Delete a blog post"""
    admin_user = get_jwt_identity()
    blog = Blog.query.get_or_404(blog_id)
    
    blog_data = blog.to_dict()
    
    db.session.delete(blog)
    db.session.commit()
    
    # Log activity
    log_activity('delete', 'blog', blog_id, blog_data.get('title'), admin_user, blog_data)
    
    return jsonify({'message': 'Blog deleted successfully', 'deleted_data': blog_data}), 200

# Blog Like/Comment routes
@app.route('/api/blogs/<int:blog_id>/like', methods=['POST'])
def like_blog(blog_id):
    """Like a blog post"""
    blog = Blog.query.get_or_404(blog_id)
    
    user_ip = request.remote_addr or request.headers.get('X-Forwarded-For', '').split(',')[0]
    user_agent = request.headers.get('User-Agent', '')
    
    # Check if already liked from this IP
    existing_like = BlogLike.query.filter_by(blog_id=blog_id, user_ip=user_ip).first()
    if existing_like:
        return jsonify({'message': 'Already liked', 'liked': True}), 200
    
    like = BlogLike(
        blog_id=blog_id,
        user_ip=user_ip,
        user_agent=user_agent
    )
    db.session.add(like)
    db.session.commit()
    
    # Get updated count
    count = BlogLike.query.filter_by(blog_id=blog_id).count()
    return jsonify({'message': 'Blog liked', 'liked': True, 'count': count}), 201

@app.route('/api/blogs/<int:blog_id>/likes', methods=['GET'])
def get_blog_likes(blog_id):
    """Get like count for a blog and check if current user has liked"""
    user_ip = request.remote_addr or request.headers.get('X-Forwarded-For', '').split(',')[0]
    count = BlogLike.query.filter_by(blog_id=blog_id).count()
    
    # Check if current user has liked
    user_liked = False
    if user_ip:
        existing_like = BlogLike.query.filter_by(blog_id=blog_id, user_ip=user_ip).first()
        user_liked = existing_like is not None
    
    return jsonify({'count': count, 'liked': user_liked}), 200

@app.route('/api/blogs/<int:blog_id>/comments', methods=['GET'])
def get_blog_comments(blog_id):
    """Get comments for a blog"""
    comments = BlogComment.query.filter_by(blog_id=blog_id, approved=True, parent_id=None).order_by(BlogComment.created_at.asc()).all()
    
    # Get replies for each comment
    result = []
    for comment in comments:
        comment_dict = comment.to_dict()
        replies = BlogComment.query.filter_by(parent_id=comment.id, approved=True).order_by(BlogComment.created_at.asc()).all()
        comment_dict['replies'] = [r.to_dict() for r in replies]
        result.append(comment_dict)
    
    return jsonify(result), 200

@app.route('/api/blogs/<int:blog_id>/comments', methods=['POST'])
def create_blog_comment(blog_id):
    """Create a comment on a blog"""
    blog = Blog.query.get_or_404(blog_id)
    data = request.get_json()
    
    user_ip = request.remote_addr or request.headers.get('X-Forwarded-For', '').split(',')[0]
    user_agent = request.headers.get('User-Agent', '')
    
    comment = BlogComment(
        blog_id=blog_id,
        parent_id=data.get('parent_id'),  # For replies
        author_name=data.get('author_name'),
        author_email=data.get('author_email'),
        content=data.get('content'),
        user_ip=user_ip,
        user_agent=user_agent,
        approved=True  # Auto-approve comments for now
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify(comment.to_dict()), 201

@app.route('/api/blogs/comments/<int:comment_id>/reply', methods=['POST'])
@jwt_required()
def reply_to_comment(comment_id):
    """Reply to a comment (admin only)"""
    admin_user = get_jwt_identity()
    parent_comment = BlogComment.query.get_or_404(comment_id)
    data = request.get_json()
    
    user_ip = request.remote_addr or request.headers.get('X-Forwarded-For', '').split(',')[0]
    user_agent = request.headers.get('User-Agent', '')
    
    reply = BlogComment(
        blog_id=parent_comment.blog_id,
        parent_id=comment_id,
        author_name=data.get('author_name', admin_user),
        author_email=data.get('author_email'),
        content=data.get('content'),
        user_ip=user_ip,
        user_agent=user_agent,
        approved=True
    )
    
    db.session.add(reply)
    db.session.commit()
    
    return jsonify(reply.to_dict()), 201

# Comment Like routes
@app.route('/api/comments/<int:comment_id>/like', methods=['POST'])
def like_comment(comment_id):
    """Like a comment"""
    comment = BlogComment.query.get_or_404(comment_id)
    
    user_ip = request.remote_addr or request.headers.get('X-Forwarded-For', '').split(',')[0]
    user_agent = request.headers.get('User-Agent', '')
    
    # Check if already liked from this IP
    existing_like = CommentLike.query.filter_by(comment_id=comment_id, user_ip=user_ip).first()
    if existing_like:
        # Unlike: remove the like
        db.session.delete(existing_like)
        # Update cached count
        comment.like_count = max(0, (comment.like_count or 0) - 1)
        db.session.commit()
        
        count = CommentLike.query.filter_by(comment_id=comment_id).count()
        return jsonify({'message': 'Comment unliked', 'liked': False, 'count': count}), 200
    
    # Add like
    like = CommentLike(
        comment_id=comment_id,
        user_ip=user_ip,
        user_agent=user_agent
    )
    db.session.add(like)
    # Update cached count
    comment.like_count = (comment.like_count or 0) + 1
    db.session.commit()
    
    count = CommentLike.query.filter_by(comment_id=comment_id).count()
    return jsonify({'message': 'Comment liked', 'liked': True, 'count': count}), 201

@app.route('/api/comments/<int:comment_id>/likes', methods=['GET'])
def get_comment_likes(comment_id):
    """Get like count for a comment and check if current user has liked"""
    comment = BlogComment.query.get_or_404(comment_id)
    user_ip = request.remote_addr or request.headers.get('X-Forwarded-For', '').split(',')[0]
    
    # Use cached count from comment table
    count = comment.like_count or 0
    
    # Check if current user has liked
    user_liked = False
    if user_ip:
        existing_like = CommentLike.query.filter_by(comment_id=comment_id, user_ip=user_ip).first()
        user_liked = existing_like is not None
    
    return jsonify({'count': count, 'liked': user_liked}), 200

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get unread notifications (likes and comments)"""
    unread_likes = BlogLike.query.filter_by(read=False).count()
    unread_comments = BlogComment.query.filter_by(read=False, approved=True).count()
    
    recent_likes = BlogLike.query.filter_by(read=False).order_by(BlogLike.created_at.desc()).limit(10).all()
    recent_comments = BlogComment.query.filter_by(read=False, approved=True).order_by(BlogComment.created_at.desc()).limit(10).all()
    
    return jsonify({
        'unread_likes': unread_likes,
        'unread_comments': unread_comments,
        'total_unread': unread_likes + unread_comments,
        'recent_likes': [like.to_dict() for like in recent_likes],
        'recent_comments': [comment.to_dict() for comment in recent_comments]
    }), 200

@app.route('/api/notifications/mark-read', methods=['POST'])
@jwt_required()
def mark_notifications_read():
    """Mark notifications as read"""
    data = request.get_json()
    notification_type = data.get('type')  # 'likes', 'comments', or 'all'
    
    if notification_type == 'likes' or notification_type == 'all':
        BlogLike.query.filter_by(read=False).update({'read': True})
    if notification_type == 'comments' or notification_type == 'all':
        BlogComment.query.filter_by(read=False).update({'read': True})
    
    db.session.commit()
    return jsonify({'message': 'Notifications marked as read'}), 200

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))  # Changed to 5001 to avoid macOS AirPlay conflict
    # Use debug=False in production (Render sets FLASK_ENV=production)
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)

