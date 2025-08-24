#!/usr/bin/env python3
"""
Taletique - Simple Python Web Server
A basic web server to serve the Taletique tailoring website
"""

import http.server
import socketserver
import urllib.parse
import json
import os
from datetime import datetime

# Configuration
PORT = 8000
HOST = '0.0.0.0'

class TaletiqueHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler for Taletique website"""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/':
            # Serve index.html for root path
            self.path = '/index.html'
        
        # Serve static files
        return super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/contact':
            self.handle_contact_form()
        else:
            self.send_error(404, "Not Found")
    
    def handle_contact_form(self):
        """Handle contact form submission"""
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))
            
            # Read form data
            post_data = self.rfile.read(content_length)
            form_data = urllib.parse.parse_qs(post_data.decode('utf-8'))
            
            # Extract form fields
            contact_info = {
                'name': form_data.get('name', [''])[0],
                'email': form_data.get('email', [''])[0],
                'phone': form_data.get('phone', [''])[0],
                'service': form_data.get('service', [''])[0],
                'message': form_data.get('message', [''])[0],
                'timestamp': datetime.now().isoformat()
            }
            
            # Validate required fields
            required_fields = ['name', 'email', 'phone', 'service']
            missing_fields = [field for field in required_fields if not contact_info[field]]
            
            if missing_fields:
                self.send_error_response(f"Missing required fields: {', '.join(missing_fields)}")
                return
            
            # Basic email validation
            if '@' not in contact_info['email'] or '.' not in contact_info['email']:
                self.send_error_response("Invalid email address")
                return
            
            # Save to file (simple storage)
            self.save_contact_info(contact_info)
            
            # Send success response
            self.send_success_response()
            
        except Exception as e:
            print(f"Error handling contact form: {e}")
            self.send_error_response("Internal server error")
    
    def save_contact_info(self, contact_info):
        """Save contact information to a JSON file"""
        try:
            # Create data directory if it doesn't exist
            os.makedirs('data', exist_ok=True)
            
            # File path for storing contacts
            contacts_file = 'data/contacts.json'
            
            # Load existing contacts or create new list
            contacts = []
            if os.path.exists(contacts_file):
                try:
                    with open(contacts_file, 'r') as f:
                        contacts = json.load(f)
                except (json.JSONDecodeError, FileNotFoundError):
                    contacts = []
            
            # Add new contact
            contacts.append(contact_info)
            
            # Save back to file
            with open(contacts_file, 'w') as f:
                json.dump(contacts, f, indent=2)
            
            print(f"Contact saved: {contact_info['name']} ({contact_info['email']})")
            
        except Exception as e:
            print(f"Error saving contact info: {e}")
    
    def send_success_response(self):
        """Send a success response after form submission"""
        # Create a simple success page
        success_html = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You - Taletique</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="container" style="margin-top: 100px; text-align: center; padding: 3rem;">
                <div style="max-width: 600px; margin: 0 auto; background: var(--light-beige); padding: 3rem; border-radius: 12px;">
                    <h1 style="color: var(--navy); margin-bottom: 1rem;">Thank You!</h1>
                    <p style="color: var(--dark-gray); font-size: 1.2rem; margin-bottom: 2rem;">
                        Your inquiry has been received successfully. Our team will contact you within 24 hours to discuss your tailoring requirements.
                    </p>
                    <a href="/" class="btn btn-primary">Back to Home</a>
                </div>
            </div>
        </body>
        </html>
        """
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(success_html.encode('utf-8'))
    
    def send_error_response(self, message):
        """Send an error response"""
        error_html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error - Taletique</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="container" style="margin-top: 100px; text-align: center; padding: 3rem;">
                <div style="max-width: 600px; margin: 0 auto; background: #fee; padding: 3rem; border-radius: 12px; border: 2px solid #e74c3c;">
                    <h1 style="color: #e74c3c; margin-bottom: 1rem;">Error</h1>
                    <p style="color: var(--dark-gray); font-size: 1.1rem; margin-bottom: 2rem;">
                        {message}
                    </p>
                    <a href="/" class="btn btn-primary">Back to Home</a>
                </div>
            </div>
        </body>
        </html>
        """
        
        self.send_response(400)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(error_html.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Custom log message format"""
        timestamp = datetime.now().strftime('%I:%M:%S %p')
        print(f"{timestamp} [taletique] {format % args}")

def start_server():
    """Start the Taletique web server"""
    try:
        # Create server
        with socketserver.TCPServer((HOST, PORT), TaletiqueHandler) as httpd:
            print(f"Taletique server starting...")
            print(f"Serving at http://{HOST}:{PORT}")
            print(f"Access your website at: http://localhost:{PORT}")
            print("Press Ctrl+C to stop the server")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"Error: Port {PORT} is already in use.")
            print("Please stop any other servers running on this port or change the PORT in app.py")
        else:
            print(f"Error starting server: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    start_server()