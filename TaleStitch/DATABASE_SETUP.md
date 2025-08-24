# Database Setup for Taletique

This guide explains how to add database functionality to your Taletique tailoring website in VS Code.

## 🗄️ Database Options

Your project supports **two database options**:

### Option 1: Simple File Storage (Default)
- **No setup required** - works immediately
- Saves contact form data to `data/contacts.json`
- Perfect for development and small projects
- No additional software needed

### Option 2: PostgreSQL Database (Advanced)
- Professional database for production use
- Better performance and data integrity
- Supports multiple users and concurrent access
- Requires database setup

## 🚀 Quick Start (No Database Setup)

Your project works immediately without any database setup:

1. Run `python app.py`
2. Fill out the contact form
3. Data is automatically saved to `data/contacts.json`
4. View saved contacts at: http://localhost:8000/admin

## 📊 Setting Up PostgreSQL Database

### Step 1: Install Database Package

The project automatically installs the required package (`psycopg2-binary`) when you run it in Replit. For local development:

```bash
# In VS Code terminal
pip install psycopg2-binary
```

### Step 2: Database Options

#### Option A: Free Online Database (Recommended)

**Neon (Free PostgreSQL):**
1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy the connection string (starts with `postgresql://`)

**Supabase (Free PostgreSQL):**
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string

#### Option B: Local PostgreSQL

**Windows:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for 'postgres' user
4. Connection string: `postgresql://postgres:yourpassword@localhost:5432/postgres`

**Mac:**
```bash
# Install with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb taletique
```
Connection string: `postgresql://username@localhost:5432/taletique`

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb taletique
```

### Step 3: Configure Database Connection

#### Method 1: Environment Variable (Recommended)

**In VS Code:**
1. Create `.env` file in your project folder:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```
2. Install python-dotenv: `pip install python-dotenv`
3. Update `app.py` to load environment variables:
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

#### Method 2: Direct Configuration

Edit `database.py` and add your connection string:
```python
# Replace this line:
self.database_url = os.getenv('DATABASE_URL')

# With your connection string:
self.database_url = "postgresql://your-connection-string-here"
```

### Step 4: Test Database Connection

1. Run your server: `python app.py`
2. Look for these messages:
   ```
   Database initialized successfully!
   Taletique server starting...
   ```
3. If you see database errors, the app automatically falls back to JSON files

### Step 5: Verify Database Setup

1. Fill out the contact form on your website
2. Check terminal for: `Contact saved to database with ID: 1`
3. Visit admin page: http://localhost:8000/admin
4. You should see your contact data

## 🔧 VS Code Database Extensions (Optional)

For viewing your database directly in VS Code:

1. **PostgreSQL Extension**:
   - Install "PostgreSQL" extension by Chris Kolkman
   - Connect using your database credentials
   - Browse tables and data visually

2. **Database Client JDBC**:
   - Install "Database Client JDBC" extension
   - Add PostgreSQL connection
   - Run SQL queries directly in VS Code

## 📋 Database Tables

Your project creates these tables automatically:

### contacts
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service VARCHAR(100) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### services
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Admin Features

Visit `http://localhost:8000/admin` to:
- View all contact form submissions
- See contact details and timestamps
- Export data if needed

## 🔍 Troubleshooting

### "Database connection error"
**Problem**: Can't connect to PostgreSQL
**Solutions**:
1. Check your connection string is correct
2. Ensure database server is running
3. Check firewall isn't blocking connection
4. App automatically falls back to JSON files

### "Module not found: psycopg2"
**Problem**: Database package not installed
**Solution**:
```bash
pip install psycopg2-binary
```

### "Permission denied" 
**Problem**: Database user doesn't have permissions
**Solution**:
1. Check username/password in connection string
2. Grant permissions to your database user
3. Use admin account for testing

### Database tables not created
**Problem**: Tables don't exist
**Solution**:
1. Check terminal for "Database initialized successfully!"
2. Verify connection string is correct
3. Check database user has CREATE permissions

## 💡 Benefits of Database vs JSON

| Feature | JSON Files | PostgreSQL |
|---------|------------|------------|
| Setup Difficulty | None | Medium |
| Performance | Good | Excellent |
| Concurrent Users | Limited | Unlimited |
| Data Integrity | Basic | Advanced |
| Backup/Recovery | Manual | Automatic |
| Scalability | Limited | High |
| Query Capabilities | Basic | Advanced |

## 🎉 What You Get

With database setup complete:
- ✅ Automatic fallback to JSON if database unavailable
- ✅ Professional data storage
- ✅ Admin interface to view contacts
- ✅ Better performance as you grow
- ✅ Data integrity and validation
- ✅ Easy backup and recovery

Your project works great with or without a database - you can start simple and upgrade when ready!