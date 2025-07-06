# 📋 Smart Task Manager

A modern task management application built with React and Node.js that helps users organize their tasks, categories, and track their productivity.

## Tech Stack

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

## Why This Stack?

• **Same language everywhere** - JavaScript is used for both frontend and backend, so developers don't need to switch between different languages and can work on any part of the app easily.

• **React and Redux work great together** - React handles the user interface while Redux manages all the data, making it perfect for showing tasks, categories, and user info in a smooth way.

• **Fast and easy to build** - The tools like Vite make development quick, JWT keeps users secure, and there are lots of ready-made packages to use, so we can build features fast and the app runs well.

## High-Level Architecture
![SmartTask – Architecture Overview](https://github.com/user-attachments/assets/efba439b-087c-424d-9e9c-a838a58c481d)


## Database Schema
![SmartTask-ER diagram](https://github.com/user-attachments/assets/ca816d42-b3d3-4d73-bae8-ab1389af5417)


## How to Run the Project

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

## Architecture & Scalability

Our application uses the **Model-View-Controller (MVC)** architecture for better structure and scalability. **Models** define data using **Mongoose schemas** (**User**, **Task**, **Category**), **Views** are built with **React components** and **API responses**, and **Controllers** handle business logic via **Express.js** (**auth**, **task**, **category** controllers). This separation improves **maintainability** and **testability**.

We use **Redux Toolkit** for **centralized** and **predictable state management**. It supports powerful **developer tools**, **middleware**, and makes it easy to add new features like **real-time updates** or **analytics** without disrupting existing functionality.

## Improvements for Future

We plan to integrate a **calendar system** for better task scheduling, along with **real-time date synchronization** to enhance user experience and productivity.

### Project Structure
```
taskdone/
├── backend/          # Node.js + Express API
├── frontend/         # React + Redux application
└── README.md         # This file
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
