import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, RotateCcw, AlertCircle, Sparkles, FolderKanban } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Artificial Intelligence',
  'Full Stack Development',
  'Mobile App Development',
  'Data Science',
  'Productivity & EdTech',
  'IoT & Embedded',
  'Cybersecurity',
];

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Data Science',
  'Artificial Intelligence & ML',
];

const FindProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [sortByMatch, setSortByMatch] = useState(false);

  // Fetch available skills for the filter dropdown
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        if (res.success && res.data) {
          setAvailableSkills(res.data);
        }
      } catch (err) {
        console.error('Failed to load skills list', err);
      }
    };
    fetchSkills();
  }, []);

  // Fetch projects matching filters
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (user?.id) params.userId = user.id;
      if (searchKeyword.trim()) params.keyword = searchKeyword.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDepartment !== 'All') params.department = selectedDepartment;
      if (selectedSkill !== 'All') params.skill = selectedSkill;

      const res = await api.get('/projects/search', { params });
      if (res.success && res.data) {
        let list = res.data;
        if (sortByMatch) {
          list = [...list].sort(
            (a, b) => b.skillMatchPercentage - a.skillMatchPercentage
          );
        }
        setProjects(list);
      }
    } catch (err) {
      setError(err.message || 'Failed to search projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedDepartment, selectedSkill, sortByMatch, user?.id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('All');
    setSelectedDepartment('All');
    setSelectedSkill('All');
    setSortByMatch(false);
  };

  const handleJoinRequest = async (projectId) => {
    try {
      const res = await api.post(`/projects/${projectId}/requests`, {
        studentId: user.id,
      });
      setSuccessMessage('Join request submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchProjects();
    } catch (err) {
      alert(err.message || 'Could not send join request.');
    }
  };

  return (
    <div className="find-projects-page max-w-7xl">
      {/* Header section */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Find Academic Projects</h1>
          <p className="page-subtitle">
            Explore active student projects, evaluate your skill match percentage, and send join requests.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success my-4">
          <Sparkles size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error my-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="search-filters-panel">
        <form onSubmit={handleSearchSubmit} className="search-input-form">
          <div className="search-input-group">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by project name or description keywords..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="btn-primary btn-search-go">
              Search
            </button>
          </div>
        </form>

        <div className="filters-row">
          <div className="filter-select-group">
            <label htmlFor="skillFilter">Filter by Skill</label>
            <select
              id="skillFilter"
              className="form-select filter-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="All">All Skills</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <label htmlFor="catFilter">Category</label>
            <select
              id="catFilter"
              className="form-select filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <label htmlFor="deptFilter">Department</label>
            <select
              id="deptFilter"
              className="form-select filter-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions-group">
            <button
              type="button"
              className={`btn-sort-toggle ${sortByMatch ? 'active-sort' : ''}`}
              onClick={() => setSortByMatch(!sortByMatch)}
              title="Sort by highest Skill Match percentage first"
            >
              <Sparkles size={15} />
              <span>Highest Match First</span>
            </button>

            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Results Count */}
      <div className="results-summary-bar">
        <span>
          Showing <strong>{projects.length}</strong> {projects.length === 1 ? 'project' : 'projects'}
        </span>
        {sortByMatch && (
          <span className="sort-hint-tag">Sorted by highest skill match %</span>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="page-loading-spinner">
          <div className="spinner"></div>
          <p>Searching projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onJoinRequest={handleJoinRequest}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-box">
          <FolderKanban size={48} className="text-muted" />
          <h3>No matching projects found</h3>
          <p>
            Try adjusting your search keywords, clearing filters, or create your own project!
          </p>
          <button type="button" className="btn-secondary mt-3" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FindProjects;
