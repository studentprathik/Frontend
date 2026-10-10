import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';
import {
  UserCircle,
  Mail,
  GraduationCap,
  Calendar,
  Award,
  Sparkles,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase,
  Heart
} from 'lucide-react';

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

const COMMON_SKILLS = [
  'Java', 'React', 'Spring Boot', 'MySQL', 'Python', 
  'Machine Learning', 'HTML', 'CSS', 'JavaScript', 
  'Node.js', 'Docker', 'Git', 'MongoDB', 'Flutter', 
  'C++', 'TypeScript', 'AWS', 'TensorFlow'
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [previousProjects, setPreviousProjects] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/users/${user.id}`);
      if (res.success && res.data) {
        const p = res.data;
        setProfile(p);
        setName(p.name || '');
        setDepartment(p.department || 'Computer Science');
        setYear(p.year || '3rd Year');
        setBio(p.bio || '');
        setInterests(p.interests || '');
        setPreviousProjects(p.previousProjects || '');
        setSkills(p.skills || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const handleAddSkill = (skillToAdd) => {
    const clean = skillToAdd.trim();
    if (!clean) return;
    if (!skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setSkills([...skills, clean]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(newSkillInput);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // 1. Update text profile fields
      const updateData = {
        name: name.trim(),
        department,
        year,
        bio: bio.trim(),
        interests: interests.trim(),
        previousProjects: previousProjects.trim(),
      };
      const resProfile = await api.put(`/users/${user.id}`, updateData);

      // 2. Update skills list
      const resSkills = await api.put(`/users/${user.id}/skills`, {
        skills,
      });

      // Update auth context user
      updateUser({
        name: updateData.name,
        department: updateData.department,
        year: updateData.year,
      });

      setSuccess('Profile and skills updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading-spinner">
        <div className="spinner"></div>
        <p>Loading your student profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Profile</h1>
          <p className="page-subtitle">
            Keep your skills, interests, and past projects updated so teammates can find you.
          </p>
        </div>
      </div>

      {success && (
        <div className="alert alert-success my-4">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error my-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="profile-form mt-4">
        {/* Profile Card Header */}
        <div className="profile-hero-card">
          <div className="profile-avatar-large">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-hero-info">
            <h2 className="profile-name-display">{name}</h2>
            <p className="profile-meta-display">
              <GraduationCap size={15} /> {department} • {year}
            </p>
            <p className="profile-email-display">
              <Mail size={15} /> {profile?.email}
            </p>
          </div>
        </div>

        {/* Basic Information Panel */}
        <div className="form-card mt-6">
          <h3 className="form-card-title">Academic Details</h3>

          <div className="form-row mt-4">
            <div className="form-group form-col">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group form-col">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input bg-gray-50 text-gray-500 cursor-not-allowed"
                value={profile?.email || ''}
                disabled
                title="Email cannot be changed"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="dept">Department *</label>
              <select
                id="dept"
                className="form-input form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-col">
              <label htmlFor="year">Academic Year *</label>
              <select
                id="year"
                className="form-input form-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
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

          <div className="form-group">
            <label htmlFor="bio">Short Bio</label>
            <textarea
              id="bio"
              rows="3"
              className="form-input form-textarea"
              placeholder="Tell teammates about your academic interests and career goals..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Technical Skills Manager Panel */}
        <div className="form-card mt-6">
          <div className="flex-row items-center gap-2">
            <Award size={20} className="text-primary" />
            <h3 className="form-card-title m-0">Technical Skills</h3>
          </div>
          <p className="field-hint mt-1">
            Add all languages, frameworks, databases, and tools you know. These determine your Skill Match % on projects!
          </p>

          {/* Current Skills Badges */}
          <div className="selected-skills-box mt-4">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <SkillBadge
                  key={skill}
                  name={skill}
                  variant="removable"
                  onRemove={handleRemoveSkill}
                  size="md"
                />
              ))
            ) : (
              <span className="text-muted text-sm">
                No skills listed yet. Add skills below!
              </span>
            )}
          </div>

          {/* Add custom skill input */}
          <div className="custom-skill-input-row mt-4">
            <input
              type="text"
              className="form-input custom-input"
              placeholder="Type a skill and press Enter (e.g. Spring Boot, Docker)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={handleSkillInputKeyDown}
            />
            <button
              type="button"
              className="btn-secondary btn-add-custom"
              onClick={() => handleAddSkill(newSkillInput)}
            >
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Popular skill quick suggestions */}
          <div className="suggested-chips-wrap mt-4">
            <span className="suggested-label">Popular Suggestions:</span>
            <div className="suggested-chips">
              {COMMON_SKILLS.filter(
                (s) => !skills.some((userSkill) => userSkill.toLowerCase() === s.toLowerCase())
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip-suggestion"
                  onClick={() => handleAddSkill(s)}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests & Previous Projects */}
        <div className="form-card mt-6">
          <h3 className="form-card-title">Interests & Previous Work</h3>

          <div className="form-group mt-4">
            <label htmlFor="interests">Interests & Specializations</label>
            <textarea
              id="interests"
              rows="2"
              className="form-input form-textarea"
              placeholder="e.g. Cloud Architecture, Natural Language Processing, UI/UX Design..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="previousProjects">Previous Projects Completed</label>
            <textarea
              id="previousProjects"
              rows="3"
              className="form-input form-textarea"
              placeholder="e.g. College Fest Website, E-commerce Mobile App, Machine Learning Sentiment Classifier..."
              value={previousProjects}
              onChange={(e) => setPreviousProjects(e.target.value)}
            />
          </div>
        </div>

        {/* Save button bar */}
        <div className="form-actions-bar mt-6">
          <button
            type="submit"
            className="btn-primary btn-lg"
            disabled={saving}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
