#!/usr/bin/env python3
"""
Database module for Taletique
Simple PostgreSQL database operations
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime

class TaletiqueDatabase:
    """Simple database class for Taletique"""
    
    def __init__(self):
        # Get database URL from environment
        self.database_url = os.getenv('DATABASE_URL')
        if not self.database_url:
            print("Warning: No DATABASE_URL found. Using JSON file storage instead.")
            self.use_db = False
        else:
            self.use_db = True
            self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        if not self.use_db:
            return None
        
        try:
            conn = psycopg2.connect(self.database_url)
            return conn
        except Exception as e:
            print(f"Database connection error: {e}")
            return None
    
    def init_database(self):
        """Initialize database tables"""
        if not self.use_db:
            return
        
        conn = self.get_connection()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            
            # Create contacts table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS contacts (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(50) NOT NULL,
                    service VARCHAR(100) NOT NULL,
                    message TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create services table for future use
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS services (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10,2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Insert default services if table is empty
            cursor.execute("SELECT COUNT(*) FROM services")
            count = cursor.fetchone()[0]
            
            if count == 0:
                services = [
                    ("Formal Wear", "Custom suits and business attire tailored to perfection", 500.00),
                    ("Wedding Attire", "Bespoke wedding suits and formal wear for your special day", 800.00),
                    ("Casual Wear", "Comfortable and stylish everyday clothing", 300.00),
                    ("Alterations", "Expert alterations to make your existing clothes fit perfectly", 150.00)
                ]
                
                cursor.executemany(
                    "INSERT INTO services (name, description, price) VALUES (%s, %s, %s)",
                    services
                )
            
            conn.commit()
            cursor.close()
            conn.close()
            print("Database initialized successfully!")
            
        except Exception as e:
            print(f"Error initializing database: {e}")
            conn.rollback()
            conn.close()
    
    def save_contact(self, contact_data):
        """Save contact form submission"""
        if self.use_db:
            return self._save_contact_db(contact_data)
        else:
            return self._save_contact_json(contact_data)
    
    def _save_contact_db(self, contact_data):
        """Save contact to PostgreSQL database"""
        conn = self.get_connection()
        if not conn:
            return self._save_contact_json(contact_data)  # Fallback to JSON
        
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO contacts (name, email, phone, service, message)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (
                contact_data['name'],
                contact_data['email'],
                contact_data['phone'],
                contact_data['service'],
                contact_data.get('message', '')
            ))
            
            contact_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            print(f"Contact saved to database with ID: {contact_id}")
            return True
            
        except Exception as e:
            print(f"Error saving contact to database: {e}")
            conn.rollback()
            conn.close()
            return self._save_contact_json(contact_data)  # Fallback to JSON
    
    def _save_contact_json(self, contact_data):
        """Fallback: Save contact to JSON file"""
        try:
            # Create data directory if it doesn't exist
            os.makedirs('data', exist_ok=True)
            
            # Add timestamp
            contact_data['timestamp'] = datetime.now().isoformat()
            
            # Read existing contacts
            contacts_file = 'data/contacts.json'
            if os.path.exists(contacts_file):
                with open(contacts_file, 'r') as f:
                    contacts = json.load(f)
            else:
                contacts = []
            
            # Add new contact
            contacts.append(contact_data)
            
            # Save back to file
            with open(contacts_file, 'w') as f:
                json.dump(contacts, f, indent=2)
            
            print("Contact saved to JSON file")
            return True
            
        except Exception as e:
            print(f"Error saving contact to JSON: {e}")
            return False
    
    def get_contacts(self):
        """Get all contacts (for admin use)"""
        if self.use_db:
            return self._get_contacts_db()
        else:
            return self._get_contacts_json()
    
    def _get_contacts_db(self):
        """Get contacts from database"""
        conn = self.get_connection()
        if not conn:
            return self._get_contacts_json()
        
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM contacts ORDER BY created_at DESC")
            contacts = cursor.fetchall()
            cursor.close()
            conn.close()
            return [dict(contact) for contact in contacts]
            
        except Exception as e:
            print(f"Error getting contacts from database: {e}")
            conn.close()
            return self._get_contacts_json()
    
    def _get_contacts_json(self):
        """Get contacts from JSON file"""
        contacts_file = 'data/contacts.json'
        if os.path.exists(contacts_file):
            with open(contacts_file, 'r') as f:
                return json.load(f)
        return []
    
    def get_services(self):
        """Get all services"""
        if self.use_db:
            return self._get_services_db()
        else:
            return self._get_services_default()
    
    def _get_services_db(self):
        """Get services from database"""
        conn = self.get_connection()
        if not conn:
            return self._get_services_default()
        
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM services ORDER BY id")
            services = cursor.fetchall()
            cursor.close()
            conn.close()
            return [dict(service) for service in services]
            
        except Exception as e:
            print(f"Error getting services from database: {e}")
            conn.close()
            return self._get_services_default()
    
    def _get_services_default(self):
        """Default services if no database"""
        return [
            {
                "id": 1,
                "name": "Formal Wear",
                "description": "Custom suits and business attire tailored to perfection",
                "price": 500.00
            },
            {
                "id": 2,
                "name": "Wedding Attire", 
                "description": "Bespoke wedding suits and formal wear for your special day",
                "price": 800.00
            },
            {
                "id": 3,
                "name": "Casual Wear",
                "description": "Comfortable and stylish everyday clothing",
                "price": 300.00
            },
            {
                "id": 4,
                "name": "Alterations",
                "description": "Expert alterations to make your existing clothes fit perfectly", 
                "price": 150.00
            }
        ]

# Create global database instance
db = TaletiqueDatabase()