 # 🔧 Backend - Smart Task Manager API

This is the Node.js backend API for the Smart Task Manager, built with Express.js and MongoDB following the MVC (Model-View-Controller) architecture pattern.

## 📁 Folder Structure

```
backend/
├── config/                   # Configuration files
│   └── db.js               # MongoDB connection setup
│
├── controllers/             # Business logic layer (MVC - Controllers)
│   ├── authController.js   # Authentication logic (login, register)
│   ├── categoryController.js # Category CRUD operations
│   └── taskController.js   # Task CRUD operations
│
├── middlewares/            # Custom middleware functions
│   └── authMiddleware.js   # JWT authentication middleware
│
├── models/                 # Data models layer (MVC - Models)
│   ├── User.js           # User schema and model
│   ├── Category.js       # Category schema and model
│   └── Task.js           # Task schema and model
│
├── routes/                # API routes layer (MVC - Views)
│   ├── authRoutes.js     # Authentication endpoints
│   ├── categoryRoutes.js # Category endpoints
│   └── taskRoutes.js     # Task endpoints
│
├── node_modules/          # Dependencies
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Dependency lock file
├── server.js              # Application entry point
└── README.md              # This file
```

## MVC Architecture

Our backend follows the **Model-View-Controller (MVC)** architecture pattern for clean separation of concerns and maintainable code:

### **Models Layer**
The models handle data structure and database operations using Mongoose schemas:
- **User Model**: Manages user authentication data and password hashing
- **Task Model**: Handles task data with relationships to users and categories
- **Category Model**: Manages category data with user ownership

### **Controllers Layer**
Controllers contain the business logic and handle HTTP requests:
- **Auth Controller**: Manages user registration, login, and authentication
- **Task Controller**: Handles task CRUD operations with validation
- **Category Controller**: Manages category operations and user isolation

### **Views Layer (Routes)**
Routes define the API endpoints and connect them to controllers:
- **Auth Routes**: `/api/auth/*` endpoints for authentication
- **Task Routes**: `/api/tasks/*` endpoints for task management
- **Category Routes**: `/api/categories/*` endpoints for category management

## Authentication & Security

Our API uses **JWT (JSON Web Tokens)** for stateless authentication, providing secure user sessions without server-side storage. The authentication middleware validates tokens on protected routes, ensuring only authenticated users can access their data.

## Database Design

The application uses **MongoDB** with **Mongoose ODM** for flexible document storage. Our database design supports:
- **User isolation**: Each user only sees their own data
- **Relational data**: Tasks belong to users and categories
- **Scalable queries**: Indexed fields for optimal performance
- **Data validation**: Mongoose schemas ensure data integrity
