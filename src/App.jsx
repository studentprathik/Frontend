import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindProjects from './pages/FindProjects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import MyProjects from './pages/MyProjects';
import Requests from './pages/Requests';
import Profile from './pages/Profile';

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="app-wrapper">
      {user && <Navbar />}
      <main className="main-content-container">
        {children}
      </main>
      <footer className="app-footer">
        <div className="footer-inner max-w-7xl">
          <p>© {new Date().getFullYear()} Project Team Finder — Skill-Based Student Project Collaboration Platform</p>
          <p className="footer-sub">Designed for College Mini & Major Projects</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Student Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <FindProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-project"
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-projects"
              element={
                <ProtectedRoute>
                  <MyProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
