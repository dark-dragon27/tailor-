# Taletique - Premium Online Tailoring Platform

## Overview

Taletique is a comprehensive full-stack web application for premium tailoring services. It serves as a management platform where customers can place custom orders, track their progress, and manage their measurements, while administrators can oversee orders, customers, and business operations. The application features role-based access control with distinct dashboards for customers and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds
- **UI Component Library**: Shadcn/ui components built on Radix UI primitives, providing accessible and customizable interface elements
- **Styling**: Tailwind CSS with custom CSS variables for brand theming (navy, maroon, beige color scheme)
- **Routing**: Wouter for lightweight client-side routing with role-based route protection
- **State Management**: TanStack React Query for server state management, caching, and synchronization
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Component Structure**: Modular architecture with reusable UI components organized in separate directories

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using TypeScript and TSX for development
- **Authentication**: Replit OAuth integration with session-based authentication using express-session
- **Authorization**: Role-based access control (customer/admin roles) with middleware protection
- **API Design**: RESTful endpoints with consistent error handling and logging middleware
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL as the primary database
- **Database Provider**: Neon serverless PostgreSQL with connection pooling
- **Schema Management**: Type-safe database schema definitions with Drizzle Kit for migrations
- **Data Models**: 
  - Users table with role-based access (customer/admin)
  - Orders with status tracking, priority levels, and customer relationships
  - Measurements for custom tailoring specifications
  - Sessions table for authentication state management

### Data Storage Architecture
- **Interface Abstraction**: IStorage interface provides a clean abstraction layer for data operations
- **Database Implementation**: DatabaseStorage class implements all CRUD operations using Drizzle ORM
- **Query Optimization**: Efficient queries with proper indexing and relationship handling
- **Transaction Support**: Database transactions for data consistency in complex operations

### Authentication & Authorization
- **OAuth Provider**: Replit Auth integration for secure user authentication
- **Session Management**: Secure session handling with HTTP-only cookies and CSRF protection
- **Role-Based Access**: Dynamic route protection based on user roles (customer/admin)
- **Security Features**: Session expiration, secure cookie settings, and unauthorized access handling

### Business Logic Components
- **Order Management**: Complete order lifecycle from creation to completion with status tracking
- **Customer Management**: Customer profiles, measurement storage, and order history
- **Admin Operations**: Administrative dashboard with customer overview and order statistics
- **Measurement System**: Detailed measurement capture and storage for custom tailoring

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack React Query
- **Build Tools**: Vite with TypeScript support, ESBuild for production bundling
- **UI Framework**: Radix UI primitives, Shadcn/ui components, Tailwind CSS

### Database & ORM
- **Database**: Neon serverless PostgreSQL with connection pooling
- **ORM**: Drizzle ORM with Drizzle Kit for migrations and schema management
- **Validation**: Zod for runtime type checking and drizzle-zod for schema validation

### Authentication & Session Management
- **OAuth**: Replit Auth with OpenID Connect client
- **Session Storage**: express-session with connect-pg-simple for PostgreSQL session store
- **Security**: Passport.js for authentication strategy implementation

### Development & Production Tools
- **Development**: TSX for TypeScript execution, Replit-specific development plugins
- **Styling**: PostCSS with Autoprefixer for CSS processing
- **Utilities**: date-fns for date manipulation, clsx and tailwind-merge for conditional styling
- **Type Safety**: Comprehensive TypeScript configuration with strict mode enabled