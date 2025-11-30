from app import app, db
from models import About, Project, Skill, Experience, Blog, Analytics
from datetime import datetime, timedelta
import json
import uuid

with app.app_context():
    # Drop all tables and recreate
    db.drop_all()
    db.create_all()
    
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
    import json
    sample_projects = [
        Project(
            title="Financial Data Pipeline Optimization",
            description="Designed a robust data pipeline using Snowflake for seamless integration and advanced analytics. Enabled real-time data processing and transformation with Kafka and Flink.",
            detailed_description="""This project involved designing and implementing a comprehensive data pipeline architecture for financial data processing. The solution enabled real-time data processing and transformation using Kafka and Flink for both batch and streaming data.

Key Features:
- Real-time data ingestion using Apache Kafka
- Stream processing with Apache Flink
- Data transformation and staging with DBT
- Advanced analytics with Snowflake
- Automated ETL workflows with Airflow
- Zero-downtime deployment with Kubernetes

The pipeline processes millions of financial transactions daily, ensuring data quality and enabling real-time business intelligence for decision-making.""",
            technologies="Python,SQL,Snowflake,Kafka,Flink,DBT,Airflow,Docker,Kubernetes",
            github_url="https://github.com/chetan-jadhav/financial-pipeline",
            live_url="https://demo.example.com/financial-pipeline",
            image_url="https://via.placeholder.com/600x400/667eea/ffffff?text=Financial+Pipeline",
            screenshots=json.dumps([
                "https://via.placeholder.com/1200x800/667eea/ffffff?text=Screenshot+1",
                "https://via.placeholder.com/1200x800/764ba2/ffffff?text=Screenshot+2",
                "https://via.placeholder.com/1200x800/667eea/ffffff?text=Screenshot+3"
            ])
        ),
        Project(
            title="Zero-Downtime Deployment System",
            description="Implemented CI/CD pipelines using Kubernetes and Docker, ensuring zero downtime during production rollouts. Automated deployment process with comprehensive monitoring.",
            detailed_description="""A comprehensive CI/CD solution that enables zero-downtime deployments for critical production systems. The system uses Kubernetes for orchestration and Docker for containerization.

Key Features:
- Automated CI/CD pipelines with GitHub Actions
- Blue-green deployment strategy
- Health checks and automatic rollback
- Comprehensive monitoring and alerting
- Infrastructure as Code with Terraform
- Multi-environment support (dev, staging, prod)

This system reduced deployment time by 80% and eliminated production downtime during deployments.""",
            technologies="Kubernetes,Docker,Terraform,GitHub Actions,Python,CI/CD",
            github_url="https://github.com/chetan-jadhav/zero-downtime-deployment",
            live_url="https://demo.example.com/deployment",
            image_url="https://via.placeholder.com/600x400/764ba2/ffffff?text=Deployment+System",
            screenshots=json.dumps([
                "https://via.placeholder.com/1200x800/764ba2/ffffff?text=Deployment+Dashboard",
                "https://via.placeholder.com/1200x800/667eea/ffffff?text=CI/CD+Pipeline"
            ])
        ),
        Project(
            title="Advanced Analytics Integration - Loan Eligibility Prediction",
            description="Developed ML models for loan eligibility prediction, improving financial inclusion for underbanked populations. Integrated with real-time data streams.",
            detailed_description="""A machine learning system that predicts loan eligibility for underbanked populations, improving financial inclusion. The system uses advanced ML models and integrates with real-time data streams.

Key Features:
- Machine learning models for loan prediction
- Real-time data integration
- Feature engineering and model training
- Model deployment with MLflow
- API endpoints for predictions
- Comprehensive monitoring and logging

The system improved loan approval accuracy by 35% and reduced processing time by 60%.""",
            technologies="Python,Machine Learning,MLflow,Azure ML Studio,SQL,API Development",
            github_url="https://github.com/chetan-jadhav/loan-prediction",
            live_url="https://demo.example.com/loan-prediction",
            image_url="https://via.placeholder.com/600x400/667eea/ffffff?text=ML+Model",
            screenshots=json.dumps([
                "https://via.placeholder.com/1200x800/667eea/ffffff?text=Model+Dashboard",
                "https://via.placeholder.com/1200x800/764ba2/ffffff?text=Prediction+Results"
            ])
        ),
        Project(
            title="Car Damage Detection System",
            description="Automated car damage detection using image processing and deep learning techniques. Integrated MVS cameras and APIs for seamless data acquisition.",
            detailed_description="""An AI-powered system that automatically detects and classifies car damage using computer vision and deep learning. The system processes images from multiple sources and provides detailed damage reports.

Key Features:
- Deep learning models for damage detection
- Image processing with OpenCV
- Multi-camera integration
- Real-time damage classification
- RESTful API for integration
- Containerized deployment with Docker

The system reduced inspection time by 70% and improved accuracy by 25% compared to manual inspection.""",
            technologies="Python,TensorFlow,OpenCV,Deep Learning,Docker,Kubernetes,API",
            github_url="https://github.com/chetan-jadhav/car-damage-detection",
            live_url="https://demo.example.com/car-damage",
            image_url="https://via.placeholder.com/600x400/764ba2/ffffff?text=Car+Damage+AI",
            screenshots=json.dumps([
                "https://via.placeholder.com/1200x800/667eea/ffffff?text=Damage+Detection",
                "https://via.placeholder.com/1200x800/764ba2/ffffff?text=Analysis+Report"
            ])
        ),
        Project(
            title="E-Commerce Chatbot with GPT-3.5",
            description="Built and deployed e-commerce chatbots using GPT-3.5 Turbo. Implemented RAG for enhanced context understanding and response generation.",
            detailed_description="""An intelligent e-commerce chatbot powered by GPT-3.5 Turbo that provides customer support, product recommendations, and order assistance. The system uses RAG (Retrieval-Augmented Generation) for enhanced context understanding.

Key Features:
- GPT-3.5 Turbo integration
- RAG implementation for context retrieval
- Multi-turn conversation handling
- Product recommendation engine
- Order tracking and support
- Analytics and monitoring dashboard

The chatbot handles 80% of customer inquiries automatically, reducing support costs by 60%.""",
            technologies="Python,GPT-3.5,RAG,OpenAI API,Flask,React,SQL",
            github_url="https://github.com/chetan-jadhav/ecommerce-chatbot",
            live_url="https://demo.example.com/chatbot",
            image_url="https://via.placeholder.com/600x400/667eea/ffffff?text=Chatbot",
            screenshots=json.dumps([
                "https://via.placeholder.com/1200x800/667eea/ffffff?text=Chat+Interface",
                "https://via.placeholder.com/1200x800/764ba2/ffffff?text=Analytics+Dashboard"
            ])
        )
    ]
    
    for project in sample_projects:
        db.session.add(project)
    
    # Create skills with icons
    sample_skills = [
        # Programming Languages
        Skill(name="Python", category="Programming Languages", proficiency=95, icon="FaPython"),
        Skill(name="Java", category="Programming Languages", proficiency=85, icon="FaJava"),
        Skill(name="Scala", category="Programming Languages", proficiency=80, icon="SiScala"),
        Skill(name="JavaScript", category="Programming Languages", proficiency=75, icon="SiJavascript"),
        Skill(name="SQL", category="Programming Languages", proficiency=90, icon="FaCode"),
        
        # Frameworks & Libraries
        Skill(name="React", category="Frontend", proficiency=80, icon="SiReact"),
        Skill(name="Flask", category="Backend", proficiency=85, icon="SiFlask"),
        Skill(name="DBT", category="Data Tools", proficiency=90, icon="FaCode"),
        Skill(name="Apache Airflow", category="Data Tools", proficiency=88, icon="FaCode"),
        
        # Cloud & Infrastructure
        Skill(name="AWS", category="Cloud", proficiency=92, icon="FaAws"),
        Skill(name="Azure", category="Cloud", proficiency=85, icon="SiAzure"),
        Skill(name="Snowflake", category="Database", proficiency=90, icon="SiSnowflake"),
        Skill(name="Docker", category="DevOps", proficiency=88, icon="FaDocker"),
        Skill(name="Kubernetes", category="DevOps", proficiency=85, icon="SiKubernetes"),
        Skill(name="Terraform", category="DevOps", proficiency=82, icon="FaCode"),
        
        # Data & ML
        Skill(name="Apache Kafka", category="Data Tools", proficiency=85, icon="FaCode"),
        Skill(name="Apache Spark", category="Data Tools", proficiency=80, icon="FaCode"),
        Skill(name="PySpark", category="Data Tools", proficiency=85, icon="FaCode"),
        Skill(name="TensorFlow", category="Machine Learning", proficiency=80, icon="FaCode"),
        Skill(name="MLflow", category="Machine Learning", proficiency=75, icon="FaCode"),
        
        # Other Tools
        Skill(name="Git", category="Tools", proficiency=90, icon="FaCode"),
        Skill(name="CI/CD", category="DevOps", proficiency=85, icon="FaCode"),
        Skill(name="Linux", category="Tools", proficiency=88, icon="FaCode"),
    ]
    
    for skill in sample_skills:
        db.session.add(skill)
    
    # Create sample blogs
    sample_blogs = [
        Blog(
            title="Building Scalable Data Pipelines with Snowflake and DBT",
            slug="building-scalable-data-pipelines-snowflake-dbt",
            excerpt="Learn how to design and implement scalable data pipelines using Snowflake and DBT for modern data engineering workflows.",
            banner_image_url="https://via.placeholder.com/1200x600/667eea/ffffff?text=Data+Pipelines",
            content="""<h2>Introduction</h2>
<p>In today's data-driven world, building scalable and maintainable data pipelines is crucial for any organization. This blog post explores how to leverage Snowflake and DBT to create robust data engineering solutions.</p>

<h2>Why Snowflake and DBT?</h2>
<p>Snowflake provides a cloud-native data warehouse that scales automatically, while DBT (Data Build Tool) enables data engineers to transform data using SQL and version control.</p>

<h2>Key Benefits</h2>
<ul>
<li>Scalability: Handle petabytes of data effortlessly</li>
<li>Version Control: Track all transformations in Git</li>
<li>Testing: Built-in data quality testing</li>
<li>Documentation: Auto-generated documentation</li>
</ul>

<h2>Getting Started</h2>
<p>To get started, you'll need:</p>
<pre><code class="language-python"># Install DBT
pip install dbt-snowflake

# Initialize a project
dbt init my_project

# Configure your Snowflake connection
# profiles.yml
my_project:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: your_account
      user: your_user
      password: your_password
      warehouse: compute_wh
      database: analytics
      schema: dbt</code></pre>

<h2>Conclusion</h2>
<p>Combining Snowflake and DBT provides a powerful solution for modern data engineering. Start building your pipelines today!</p>""",
            author="Chetan Jadhav",
            published=True,
            featured=True,
            show_on_homepage=True,
            tags="Data Engineering,Snowflake,DBT,ETL",
            reading_time=8,
            views=150,
            published_at=datetime.utcnow() - timedelta(days=5)
        ),
        Blog(
            title="Zero-Downtime Deployments with Kubernetes",
            slug="zero-downtime-deployments-kubernetes",
            excerpt="Discover strategies for achieving zero-downtime deployments in production environments using Kubernetes orchestration.",
            banner_image_url="https://via.placeholder.com/1200x600/764ba2/ffffff?text=Kubernetes",
            content="""<h2>Introduction</h2>
<p>Zero-downtime deployments are essential for maintaining service availability. Kubernetes provides several strategies to achieve this.</p>

<h2>Deployment Strategies</h2>
<h3>1. Rolling Updates</h3>
<p>Kubernetes' default deployment strategy gradually replaces old pods with new ones.</p>

<h3>2. Blue-Green Deployment</h3>
<p>Run two identical production environments and switch traffic between them.</p>

<h3>3. Canary Deployment</h3>
<p>Gradually roll out changes to a small subset of users before full deployment.</p>

<h2>Implementation Example</h2>
<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: app
        image: my-app:v2
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5</code></pre>

<h2>Best Practices</h2>
<ul>
<li>Use health checks and readiness probes</li>
<li>Implement graceful shutdowns</li>
<li>Monitor deployment metrics</li>
<li>Have rollback procedures ready</li>
</ul>

<h2>Conclusion</h2>
<p>With proper configuration, Kubernetes enables seamless zero-downtime deployments.</p>""",
            author="Chetan Jadhav",
            published=True,
            featured=False,
            show_on_homepage=True,
            tags="Kubernetes,DevOps,Deployment,CI/CD",
            reading_time=6,
            views=98,
            published_at=datetime.utcnow() - timedelta(days=3)
        ),
        Blog(
            title="Machine Learning Model Deployment with MLflow",
            slug="ml-model-deployment-mlflow",
            excerpt="A comprehensive guide to deploying machine learning models in production using MLflow for model tracking and management.",
            banner_image_url="https://via.placeholder.com/1200x600/667eea/ffffff?text=MLflow",
            content="""<h2>Introduction</h2>
<p>MLflow is an open-source platform for managing the machine learning lifecycle, including experimentation, reproducibility, and deployment.</p>

<h2>MLflow Components</h2>
<ul>
<li><strong>Tracking:</strong> Log parameters, metrics, and artifacts</li>
<li><strong>Projects:</strong> Package ML code in a reusable format</li>
<li><strong>Models:</strong> Deploy models from various ML libraries</li>
<li><strong>Model Registry:</strong> Centralized model store</li>
</ul>

<h2>Model Tracking Example</h2>
<pre><code class="language-python">import mlflow
import mlflow.sklearn

# Start MLflow run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("alpha", 0.1)
    mlflow.log_param("l1_ratio", 0.5)
    
    # Train model
    model = train_model(X_train, y_train)
    
    # Log metrics
    mlflow.log_metric("rmse", rmse)
    mlflow.log_metric("r2", r2_score)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")</code></pre>

<h2>Deployment</h2>
<p>Deploy models using MLflow's serving capabilities:</p>
<pre><code class="language-bash"># Serve model locally
mlflow models serve -m runs:/&lt;run_id&gt;/model -p 5000

# Deploy to production
mlflow models deploy -m models:/Production/MyModel -t docker</code></pre>

<h2>Conclusion</h2>
<p>MLflow simplifies ML model lifecycle management and deployment.</p>""",
            author="Chetan Jadhav",
            published=True,
            featured=True,
            show_on_homepage=False,
            tags="Machine Learning,MLflow,Python,Deployment",
            reading_time=10,
            views=125,
            published_at=datetime.utcnow() - timedelta(days=1)
        ),
        Blog(
            title="Building Real-Time Data Streams with Apache Kafka",
            slug="real-time-data-streams-apache-kafka",
            excerpt="Explore how to build real-time data streaming applications using Apache Kafka for event-driven architectures.",
            banner_image_url="https://via.placeholder.com/1200x600/764ba2/ffffff?text=Kafka",
            content="""<h2>Introduction</h2>
<p>Apache Kafka is a distributed streaming platform capable of handling trillions of events per day.</p>

<h2>Core Concepts</h2>
<ul>
<li><strong>Topics:</strong> Categories of messages</li>
<li><strong>Producers:</strong> Applications that publish messages</li>
<li><strong>Consumers:</strong> Applications that read messages</li>
<li><strong>Brokers:</strong> Kafka servers that store messages</li>
</ul>

<h2>Producer Example</h2>
<pre><code class="language-python">from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Send message
producer.send('my-topic', {'key': 'value'})
producer.flush()</code></pre>

<h2>Consumer Example</h2>
<pre><code class="language-python">from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'my-topic',
    bootstrap_servers=['localhost:9092'],
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    print(message.value)</code></pre>

<h2>Use Cases</h2>
<ul>
<li>Real-time analytics</li>
<li>Event sourcing</li>
<li>Log aggregation</li>
<li>Stream processing</li>
</ul>

<h2>Conclusion</h2>
<p>Kafka enables building robust real-time data streaming applications.</p>""",
            author="Chetan Jadhav",
            published=True,
            featured=False,
            show_on_homepage=False,
            tags="Kafka,Streaming,Real-time,Data Engineering",
            reading_time=7,
            views=87,
            published_at=datetime.utcnow() - timedelta(days=2)
        )
    ]
    
    for blog in sample_blogs:
        db.session.add(blog)
    
    # Create sample analytics data
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
    
    # Generate analytics data for the last 30 days
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
    print("=" * 60)
    print("Database initialized successfully with dummy data!")
    print("=" * 60)
    print("\n📊 Added Data:")
    print(f"  ✓ About information for: Chetan Jadhav")
    print(f"  ✓ {len(experiences)} Experience entries")
    print(f"  ✓ {len(sample_projects)} Projects with screenshots")
    print(f"  ✓ {len(sample_skills)} Skills with icons")
    print(f"  ✓ {len(sample_blogs)} Blog posts")
    print(f"  ✓ Sample analytics data (30 days)")
    print("\n🔑 Admin Credentials:")
    print("  Username: admin")
    print("  Password: admin123")
    print("\n🌐 Access your portfolio:")
    print("  Frontend: http://localhost:3000")
    print("  Admin: http://localhost:3000/admin")
    print("=" * 60)
