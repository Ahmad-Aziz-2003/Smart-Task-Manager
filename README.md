# 📋 Smart Task Manager

A modern task management application built with React and Node.js that helps users organize their tasks, categories, and track their productivity.

## 🛠️ Tech Stack

### Frontend
- **React.js**: Component-based UI for task management
- **Redux Toolkit**: State management for user data, tasks, categories
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling for responsive design

### Backend
- **Node.js + Express.js**: JavaScript runtime and web framework
- **MongoDB + Mongoose**: NoSQL database with ODM
- **JWT**: Stateless authentication tokens

### Development Tools
- **ESLint + Prettier**: Code quality and formatting
- **Git**: Version control

## 🤔 Why This Stack?

• **Same language everywhere** - JavaScript is used for both frontend and backend, so developers don't need to switch between different languages and can work on any part of the app easily.

• **React and Redux work great together** - React handles the user interface while Redux manages all the data, making it perfect for showing tasks, categories, and user info in a smooth way.

• **Fast and easy to build** - The tools like Vite make development quick, JWT keeps users secure, and there are lots of ready-made packages to use, so we can build features fast and the app runs well.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React Application                               │   │
│  │                                                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Auth      │  │   Tasks     │  │ Categories  │              │   │
│  │  │ (Login/Reg) │  │ Management  │  │ Management  │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                Redux State Management                      │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Express.js Server                               │   │
│  │                                                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Auth      │  │   Tasks     │  │ Categories  │              │   │
│  │  │ Controller  │  │ Controller  │  │ Controller  │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                JWT Authentication                          │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Database Operations
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MongoDB Database                                │   │
│  │                                                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Users     │  │   Tasks     │  │ Categories  │              │   │
│  │  │ Collection  │  │ Collection  │  │ Collection  │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENTITY RELATIONSHIP DIAGRAM                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐                                                     │
│  │     USERS       │                                                     │
│  │                 │                                                     │
│  │ • _id (PK)      │                                                     │
│  │ • name          │                                                     │
│  │ • email         │                                                     │
│  │ • password      │                                                     │
│  │ • createdAt     │                                                     │
│  │ • updatedAt     │                                                     │
│  └─────────────────┘                                                     │
│           │                                                               │
│           │ 1:N                                                           │
│           ▼                                                               │
│  ┌─────────────────┐                                                     │
│  │   CATEGORIES    │                                                     │
│  │                 │                                                     │
│  │ • _id (PK)      │                                                     │
│  │ • name          │                                                     │
│  │ • color         │                                                     │
│  │ • userId (FK)   │◄─────────────────┐                                 │
│  │ • createdAt     │                   │                                 │
│  │ • updatedAt     │                   │                                 │
│  └─────────────────┘                   │                                 │
│           │                             │                                 │
│           │ 1:N                         │                                 │
│           ▼                             │                                 │
│  ┌─────────────────┐                     │                                 │
│  │     TASKS       │                     │                                 │
│  │                 │                     │                                 │
│  │ • _id (PK)      │                     │                                 │
│  │ • title         │                     │                                 │
│  │ • description   │                     │                                 │
│  │ • priority      │                     │                                 │
│  │ • status        │                     │                                 │
│  │ • dueDate       │                     │                                 │
│  │ • userId (FK)   │◄────────────────────┘                                 │
│  │ • categoryId(FK)│◄────────────────────┐                                 │
│  │ • createdAt     │                     │                                 │
│  │ • updatedAt     │                     │                                 │
│  └─────────────────┘                     │                                 │
│                                          │                                 │
│  ┌───────────────────────────────────────┴─────────────────────────────────┐ │
│  │                           RELATIONSHIPS                               │ │
│  │                                                                       │ │
│  │  • User 1:N Categories  (One user can have many categories)          │ │
│  │  • User 1:N Tasks      (One user can have many tasks)                │ │
│  │  • Category 1:N Tasks  (One category can have many tasks)            │ │
│  │                                                                       │ │
│  │  Note: Tasks belong to both User and Category                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB connection string to .env
MONGO_URI=mongodb://localhost:27017/taskdone
JWT_SECRET=your-secret-key
PORT=5000

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your backend URL to .env
VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 Features

### ✅ Completed Features
- **User Authentication**: Register, login, and logout
- **Task Management**: Create, read, update, delete tasks
- **Category Management**: Organize tasks with custom categories
- **Task Filtering**: Filter by status, priority, category
- **Responsive Design**: Works on desktop and mobile
- **Statistics Page**: View task completion stats and recent work
- **Confirmation Modals**: Safe delete and complete actions

### 🎯 Bonus Features Implemented
- **User Authentication**: JWT-based login/logout system
- **Mobile Responsive**: Tailwind CSS responsive design
- **Git Version Control**: Proper commit history and branching
- **Statistics Dashboard**: Task completion analytics and recent activity

## 📝 Assumptions Made

- **User Category Management**: Users can create and manage their own categories
- **Data Isolation**: Each user only sees their own tasks and categories
- **Task Ownership**: Tasks belong to the user who created them
- **Optional Categories**: Tasks can exist without being assigned to a category

## 🏗️ Architecture & Scalability

### MVC Architecture
We use the **Model-View-Controller (MVC)** pattern for modularization and scalability. This architecture separates concerns and makes the codebase maintainable:

- **Models**: Handle data structure and database operations (User, Task, Category schemas)
- **Views**: Present data to users (React components and API responses)
- **Controllers**: Manage business logic and handle user requests (authController, taskController, categoryController)

### State Management with Redux
We use **Redux Toolkit** for centralized state management, which provides:

- **Predictable State Updates**: All state changes go through reducers
- **Developer Tools**: Excellent debugging and time-travel debugging
- **Middleware Support**: Easy to add features like logging, async actions
- **Scalability**: Easy to add new features without breaking existing functionality

This architecture ensures our application can easily scale as we add new features like real-time updates, team collaboration, or advanced analytics in the future.

## 🛠️ Development

### Project Structure
```
taskdone/
├── backend/          # Node.js + Express API
├── frontend/         # React + Redux application
└── README.md         # This file
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).