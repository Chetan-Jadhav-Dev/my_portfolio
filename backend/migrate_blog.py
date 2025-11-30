import sqlite3
import os

# Get database path
db_path = 'instance/portfolio.db'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(blog)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'show_on_homepage' not in columns:
            # Add the column
            cursor.execute('ALTER TABLE blog ADD COLUMN show_on_homepage BOOLEAN DEFAULT 0')
            conn.commit()
            print("✓ Added 'show_on_homepage' column to blog table")
        else:
            print("✓ Column 'show_on_homepage' already exists")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print(f"Database not found at {db_path}. It will be created when you run the app.")

