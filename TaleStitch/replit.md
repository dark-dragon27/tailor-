# Taletique - Premium Online Tailoring Platform

## Overview

Taletique is a simple, elegant website for premium online tailoring services. The platform showcases tailoring services including formal wear, wedding attire, casual wear, and alterations. Built with clean HTML, CSS, and Python for simplicity and ease of maintenance.

## User Preferences

Preferred communication style: Simple, everyday language.
Technology preference: Simple HTML/CSS/Python approach instead of complex frameworks.
Development environment: VS Code compatibility preferred.
Dependencies: Minimal - only standard Python libraries, no external packages.

## System Architecture

### Frontend Architecture
- **Technology**: Pure HTML5 with semantic markup
- **Styling**: Custom CSS with modern flexbox and grid layouts
- **Color Scheme**: Navy, maroon, and beige theme for premium tailoring aesthetic
- **Responsive Design**: Mobile-first approach with CSS media queries
- **JavaScript**: Minimal vanilla JavaScript for enhanced user experience
- **Features**: Smooth scrolling, form validation, animated elements, contact form

### Backend Architecture
- **Language**: Python 3.11 with built-in http.server module
- **Framework**: Custom HTTP handler extending SimpleHTTPRequestHandler
- **Server**: Basic TCP server serving static files and handling form submissions
- **Form Processing**: POST request handling for contact form with validation
- **Data Storage**: Simple JSON file storage for contact information
- **Error Handling**: Custom error pages with user-friendly messages

### File Structure
- **index.html**: Main landing page with all sections
- **style.css**: Complete styling with responsive design
- **script.js**: Interactive features and form handling
- **app.py**: Python web server with contact form processing
- **data/**: Directory for storing contact form submissions

### Key Features
- **Hero Section**: Professional introduction with call-to-action buttons
- **Services**: Four main services (formal, wedding, casual, alterations) with detailed descriptions
- **About Section**: Why choose Taletique with feature highlights
- **Contact Form**: Functional contact form with validation and email/phone/service selection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Navigation**: Smooth scrolling navigation with fixed header
- **Professional Design**: Clean, modern aesthetic suitable for premium tailoring business

### Development and Deployment
- **Development**: Run `npm run dev` which starts the Python server on port 8080
- **Server Setup**: Uses Node.js wrapper to launch Python server for compatibility with Replit workflows
- **No Build Process**: Direct file serving, no compilation required
- **Simple Deployment**: Python-based server with Node.js launcher for workflow compatibility
- **Contact Storage**: Form submissions saved to `data/contacts.json`
- **Static Assets**: All assets served directly from filesystem
- **Port**: Server runs on port 8080 (changed from 5000 to avoid conflicts)