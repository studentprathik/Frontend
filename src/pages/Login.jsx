import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Users size={32} className="auth-logo-icon" />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to discover projects and collaborate with teammates
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">College Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="e.g. prathik@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary btn-block btn-lg"
            disabled={loading}
          >
            <LogIn size={18} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Login Shortcut */}
        <div className="demo-login-box">
          <div className="demo-header">
            <Sparkles size={15} />
            <span>Quick Demo Accounts (1-Click Fill)</span>
          </div>
          <div className="demo-btns-grid">
            <button
              type="button"
              className="btn-demo-pill"
              onClick={() => handleQuickLogin('prathik@college.edu')}
            >
              <strong>Prathik</strong> (CSE, 3rd Yr)
            </button>
            <button
              type="button"
              className="btn-demo-pill"
              onClick={() => handleQuickLogin('rahul@college.edu')}
            >
              <strong>Rahul</strong> (IT, 3rd Yr)
            </button>
            <button
              type="button"
              className="btn-demo-pill"
              onClick={() => handleQuickLogin('sai@college.edu')}
            >
              <strong>Sai</strong> (CSE, 4th Yr)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <span>Don't have an account yet?</span>{' '}
          <Link to="/register" className="auth-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
