#!/usr/bin/env python3
"""
Simple script to run the Taletique website
"""
import os
import subprocess
import sys
import time

def main():
    print("🌐 Starting Taletique Website...")
    print("📁 Files ready: index.html, style.css, script.js, app.py")
    print("🎨 Design: Navy, maroon, beige theme")
    print("⚡ Technology: Simple HTML + CSS + Python")
    print()
    
    # Change to the correct directory
    os.chdir('/home/runner/workspace')
    
    # Start the server
    print("🚀 Starting Python server on port 5000...")
    try:
        # Run the app
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Thank you for using Taletique!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()