import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Mail, Lock, User, GraduationCap, Calendar, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Data Science',
  'Artificial Intelligence & ML',
  'Mechanical Engineering',
  'Civil Engineering',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science',
    year: '3rd Year',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Users size={32} className="auth-logo-icon" />
          </div>
          <h2 className="auth-title">Create Student Profile</h2>
          <p className="auth-subtitle">
            Join your college project network and find ideal teammates
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">College Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="e.g. rahul@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password * (min. 6 characters)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="department">Department *</label>
              <div className="input-with-icon">
                <GraduationCap size={18} className="input-icon" />
                <select
                  id="department"
                  name="department"
                  className="form-input form-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group form-col">
              <label htmlFor="year">Academic Year *</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <select
                  id="year"
                  name="year"
                  className="form-input form-select"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary btn-block btn-lg"
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
