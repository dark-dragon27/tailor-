# Taletique - Premium Online Tailoring Platform

A simple, elegant website for premium online tailoring services built with HTML, CSS, and Python.

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python 3.11+ (built-in http.server module)
- **No frameworks required** - just standard Python libraries

## 📋 Prerequisites

### Required Software
1. **Python 3.11 or higher**
   - Download from: https://www.python.org/downloads/
   - Check if installed: `python --version` or `python3 --version`

2. **VS Code** (recommended)
   - Download from: https://code.visualstudio.com/

### Optional VS Code Extensions
- Python (by Microsoft) - for Python syntax highlighting
- Live Server - for additional development features (optional)

## 🚀 Detailed Setup Instructions

### Step 1: Install Python
**Windows:**
1. Go to https://www.python.org/downloads/
2. Download Python 3.11 or newer
3. Run the installer
4. ✅ **IMPORTANT**: Check "Add Python to PATH" during installation
5. Verify installation: Open Command Prompt and type `python --version`

**Mac:**
1. Go to https://www.python.org/downloads/
2. Download Python 3.11 or newer
3. Run the installer
4. Verify installation: Open Terminal and type `python3 --version`

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

### Step 2: Install VS Code
1. Download from https://code.visualstudio.com/
2. Install VS Code
3. Open VS Code

### Step 3: Download Project Files
1. Download all project files to a folder (e.g., `taletique`)
2. Make sure you have these files:
   - `app.py`
   - `index.html`
   - `style.css`
   - `script.js`

### Step 4: Open Project in VS Code
1. Open VS Code
2. Click "File" → "Open Folder"
3. Select your project folder
4. You should see all files in the left sidebar

### Step 5: Run the Server

**Method 1: Using Terminal (Recommended)**
1. In VS Code, click "Terminal" → "New Terminal"
2. You should see a terminal at the bottom
3. Type one of these commands:
   ```bash
   # Try this first
   python app.py
   
   # If above doesn't work, try:
   python3 app.py
   
   # On Windows, sometimes:
   py app.py
   ```
4. You should see:
   ```
   Taletique server starting...
   Serving at http://0.0.0.0:8000
   Access your website at: http://localhost:8000
   ```
5. Open your browser and go to: http://localhost:8000

**Method 2: Using VS Code Run Button**
1. Install Python extension in VS Code (Extensions → Search "Python" → Install)
2. Open `app.py` file
3. Click the ▶️ "Run Python File" button in top-right corner
4. Server starts in the terminal below

### Step 6: View Your Website
1. Open any web browser (Chrome, Firefox, Safari, Edge)
2. Type in address bar: `http://localhost:8000`
3. Press Enter
4. Your Taletique website should appear!

### Step 7: Test the Contact Form
1. Scroll down to the contact section
2. Fill out the form with test information
3. Click "Send Message"
4. Check that a `data` folder is created with `contacts.json` file

## 🔧 Alternative Running Methods

### Command Line (No VS Code)
1. Open Terminal/Command Prompt
2. Navigate to project folder:
   ```bash
   cd path/to/your/taletique/folder
   ```
3. Run: `python app.py`
4. Visit: http://localhost:8000

### Double-Click Method (Windows)
1. Right-click `app.py`
2. Choose "Open with" → "Python"
3. A command window opens showing the server
4. Visit: http://localhost:8000

## 📁 Project Structure

```
taletique/
├── app.py              # Python web server
├── index.html          # Main website page
├── style.css           # All styling
├── script.js           # Interactive features
├── data/               # Contact form submissions (auto-created)
├── uploads/            # File uploads directory
└── README.md           # This file
```

## 🔧 No Dependencies Required!

This project uses **only Python standard library**:
- `http.server` - Web server
- `urllib.parse` - Form data parsing
- `json` - Data storage
- `os` - File operations
- `datetime` - Timestamps

**No pip install needed!** Everything works with a standard Python installation.

## 🌐 Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Contact Form** - Functional form with validation
- **Services Showcase** - Formal wear, wedding attire, casual wear, alterations
- **Clean Code** - Easy to understand and modify
- **No Build Process** - Direct file serving

## 🎯 Development

1. Make changes to HTML, CSS, or JavaScript files
2. Refresh your browser to see changes
3. Python server automatically serves updated files
4. Contact form submissions are saved to `data/contacts.json`

## 📝 Customization

- **Colors**: Edit CSS variables in `style.css`
- **Content**: Modify `index.html`
- **Server Port**: Change `PORT` in `app.py` (currently 8000)
- **Server Host**: Change `HOST` in `app.py` (currently 0.0.0.0)

## 🔍 Troubleshooting

### "Python is not recognized" (Windows)
**Problem**: Command Prompt says "python is not recognized"
**Solution**:
1. Reinstall Python from python.org
2. ✅ Check "Add Python to PATH" during installation
3. Restart Command Prompt/VS Code
4. Try `py app.py` instead

### "Permission denied" (Mac/Linux)
**Problem**: Permission error when running
**Solution**:
```bash
chmod +x app.py
python3 app.py
```

### "Port 8000 is already in use"
**Problem**: Another program is using port 8000
**Solutions**:
1. **Option A**: Stop other servers:
   - Close other terminals/programs
   - Restart your computer
   
2. **Option B**: Change port in `app.py`:
   - Open `app.py`
   - Find line: `PORT = 8000`
   - Change to: `PORT = 8080` (or any number 8000-9999)
   - Save file and run again

### "Module not found" Error
**Problem**: Python can't find modules
**Solution**: This project uses only built-in Python modules, so this shouldn't happen. If it does:
1. Make sure you're using Python 3.11+
2. Try reinstalling Python

### Website Not Loading
**Problem**: Browser shows "This site can't be reached"
**Solutions**:
1. Make sure server is running (check terminal for "Serving at..." message)
2. Try these URLs:
   - http://localhost:8000
   - http://127.0.0.1:8000
   - http://0.0.0.0:8000
3. Check if antivirus/firewall is blocking

### Contact Form Not Working
**Problem**: Form doesn't submit or save
**Solutions**:
1. Check terminal for error messages
2. Make sure `data` folder gets created automatically
3. Check file permissions in project folder

## 📧 Getting Help

If you're still having trouble:
1. Check the terminal/console for error messages
2. Make sure all files are in the same folder
3. Verify Python version: `python --version` (should be 3.11+)
4. Try running from a different folder location

## 💡 Quick Start Checklist

Before you start, make sure you have:
- [ ] Python 3.11+ installed
- [ ] VS Code installed (optional but recommended)
- [ ] All project files downloaded
- [ ] Files are in the same folder

**Quick test**:
1. Open terminal/command prompt
2. Type: `python --version` (should show 3.11 or higher)
3. Navigate to project folder
4. Type: `python app.py`
5. Open browser: http://localhost:8000

## 🎯 What You Should See

When everything works correctly:

**In Terminal:**
```
Taletique server starting...
Serving at http://0.0.0.0:8000
Access your website at: http://localhost:8000
Press Ctrl+C to stop the server
```

**In Browser:**
- Professional tailoring website
- Navigation menu (Home, Services, About, Contact)
- Hero section with call-to-action buttons
- Services grid showing 4 tailoring services
- Working contact form at the bottom

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛑 Stopping the Server

To stop the server:
- Press `Ctrl+C` in the terminal
- Or close the terminal window
- Or close VS Code