# 🎨 Frontend - Smart Task Manager

This is the React frontend application for the Smart Task Manager, built with modern React patterns and Redux Toolkit for state management.

## 📁 Folder Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── api/                   # API service layer
│   │   ├── authApi.js        # Authentication API calls
│   │   ├── categoryApi.js    # Category API calls
│   │   └── taskApi.js        # Task API calls
│   │
│   ├── assets/               # Images, icons, static files
│   │
│   ├── components/           # Reusable UI components
│   │   ├── ConfirmationModal.jsx
│   │   ├── DashboardStatsHeader.jsx
│   │   ├── Header.jsx
│   │   ├── RemindersModal.jsx
│   │   ├── Sidebar.jsx
│   │   └── statistics/       # Statistics-specific components
│   │
│   ├── features/             # Feature-based Redux modules
│   │   ├── auth/            # Authentication feature
│   │   │   ├── authSlice.js    # Auth state management
│   │   │   ├── authThunks.js   # Auth async actions
│   │   │   └── components/     # Auth-specific components
│   │   │
│   │   ├── categories/      # Category management feature
│   │   │   ├── categorySlice.js
│   │   │   ├── categoryThunks.js
│   │   │   └── components/
│   │   │
│   │   ├── filters/         # Filter and search feature
│   │   │   └── filterSlice.js
│   │   │
│   │   └── tasks/           # Task management feature
│   │       ├── taskSlice.js
│   │       ├── taskThunks.js
│   │       └── components/
│   │
│   ├── layouts/             # Layout components
│   │   └── MainLayout.jsx   # Main application layout
│   │
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard page
│   │   ├── Login.jsx        # Login page
│   │   ├── NotFound.jsx     # 404 page
│   │   ├── Register.jsx     # Registration page
│   │   └── Statistics.jsx   # Statistics page
│   │
│   ├── routes/              # Routing configuration
│   │   └── AppRouter.jsx    # Main router setup
│   │
│   ├── store/               # Redux store configuration
│   │   └── store.js         # Store setup and configuration
│   │
│   ├── styles/              # Global styles
│   │   └── index.css        # Tailwind CSS imports
│   │
│   ├── App.jsx              # Root application component
│   ├── App.css              # App-specific styles
│   └── main.jsx             # Application entry point
│
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint configuration
└── README.md                # This file
```

## 🔄 Redux State Management

Our application uses **Redux Toolkit** for centralized state management, following the feature-based architecture pattern. This approach provides predictable state updates, excellent developer tools, and easy scalability for future features.

### **Store Structure**
The Redux store is organized into feature-based slices, each handling a specific domain of the application:

- **Auth Slice**: Manages user authentication state (login/logout, user info, tokens)
- **Tasks Slice**: Handles task CRUD operations, filtering, and task state
- **Categories Slice**: Manages category creation, updates, and relationships
- **Filters Slice**: Controls search, filtering, and sorting functionality

### **State Management Benefits**
Redux provides centralized state management that ensures all components have access to the same data. State changes are predictable and traceable through reducers, making debugging easier with Redux DevTools. The middleware support allows us to handle async operations like API calls through thunks, keeping our components focused on presentation while business logic stays in the store.

### **Scalability Features**
The feature-based architecture makes it easy to add new functionality without affecting existing code. Each feature has its own slice, thunks, and components, allowing for independent development and testing. This modular approach ensures our application can grow smoothly as we add features like real-time updates, team collaboration, or advanced analytics.

## 🚀 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add backend URL
VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The application uses **Tailwind CSS** for utility-first styling, providing:
- Responsive design out of the box
- Consistent design system
- Small bundle size
- Easy customization

## 📱 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Real-time Updates**: State updates reflect immediately across components
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Graceful error handling with user-friendly messages

## 🔧 Architecture Patterns

- **Feature-based Organization**: Code organized by feature rather than type
- **Component Composition**: Reusable components with clear interfaces
- **Container/Presentational Pattern**: Separation of logic and presentation
- **Custom Hooks**: Shared logic extracted into reusable hooks
- **Route-based Code Splitting**: Automatic code splitting by routes
