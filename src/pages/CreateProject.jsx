import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';
import { 
  FolderPlus, 
  Layers, 
  Users, 
  FileText, 
  Tag, 
  Plus, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft 
} from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Artificial Intelligence',
  'Full Stack Development',
  'Mobile App Development',
  'Data Science',
  'Productivity & EdTech',
  'IoT & Embedded Systems',
  'Cybersecurity & Network',
  'Cloud Computing & DevOps',
];

const SUGGESTED_SKILLS = [
  'Java', 'React', 'Spring Boot', 'MySQL', 'Python', 
  'Machine Learning', 'HTML', 'CSS', 'JavaScript', 
  'Node.js', 'Docker', 'Git', 'MongoDB', 'Flutter'
];

const CreateProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    teamSize: 4,
  });

  const [selectedSkills, setSelectedSkills] = useState(['React', 'Java']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (skill) => {
    const clean = skill.trim();
    if (!clean) return;
    if (!selectedSkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setSelectedSkills([...selectedSkills, clean]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleCustomSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(customSkillInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a project title.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a project description.');
      return;
    }
    if (selectedSkills.length === 0) {
      setError('Please add at least one required skill for the project.');
      return;
    }
    if (formData.teamSize < 2) {
      setError('Maximum team size must be at least 2 members.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        teamSize: parseInt(formData.teamSize, 10),
        ownerId: user.id,
        requiredSkills: selectedSkills,
      };

      const res = await api.post('/projects', payload);
      if (res.success && res.data) {
        navigate(`/projects/${res.data.id}`);
      } else {
        navigate('/my-projects');
      }
    } catch (err) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page max-w-4xl">
      <div className="details-top-bar mb-4">
        <Link to="/my-projects" className="link-back">
          <ArrowLeft size={16} />
          <span>Back to My Projects</span>
        </Link>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <div className="form-icon-wrap">
            <FolderPlus size={26} className="text-primary" />
          </div>
          <div>
            <h1 className="form-title">Create Academic Project</h1>
            <p className="form-subtitle">
              Publish your project idea, set required skills, and assemble the ideal student team.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error my-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="project-form mt-6">
          <div className="form-group">
            <label htmlFor="title">Project Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Smart Campus Assistant"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-input form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-col">
              <label htmlFor="teamSize">Maximum Team Size * (including you)</label>
              <input
                id="teamSize"
                name="teamSize"
                type="number"
                min="2"
                max="10"
                className="form-input"
                value={formData.teamSize}
                onChange={handleChange}
                required
              />
              <span className="field-hint">e.g. 4 students total</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="form-input form-textarea"
              placeholder="Describe the project goal, problem statement, key deliverables, and technologies to be used..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Required Skills Selector */}
          <div className="form-group skills-picker-section">
            <label>Required Skills & Technologies *</label>
            <p className="field-hint mb-2">
              Select or type skills that students need to contribute to this project:
            </p>

            {/* Currently Selected Skills */}
            <div className="selected-skills-box">
              {selectedSkills.length > 0 ? (
                selectedSkills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    name={skill}
                    variant="removable"
                    onRemove={handleRemoveSkill}
                  />
                ))
              ) : (
                <span className="text-muted text-sm">No skills added yet</span>
              )}
            </div>

            {/* Custom Skill Input */}
            <div className="custom-skill-input-row mt-3">
              <input
                type="text"
                className="form-input custom-input"
                placeholder="Type a skill and press Enter (e.g. Docker, OpenCV)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={handleCustomSkillKeyDown}
              />
              <button
                type="button"
                className="btn-secondary btn-add-custom"
                onClick={() => handleAddSkill(customSkillInput)}
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Quick Pick Chips */}
            <div className="suggested-chips-wrap mt-3">
              <span className="suggested-label">Quick Add:</span>
              <div className="suggested-chips">
                {SUGGESTED_SKILLS.filter(
                  (s) => !selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
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

          <div className="form-actions-bar mt-8">
            <button
              type="submit"
              className="btn-primary btn-lg"
              disabled={loading}
            >
              <FolderPlus size={18} />
              <span>{loading ? 'Creating Project...' : 'Publish Project'}</span>
            </button>
            <Link to="/my-projects" className="btn-secondary btn-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
