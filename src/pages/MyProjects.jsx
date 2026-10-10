import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SkillBadge from '../components/SkillBadge';
import {
  FolderKanban,
  FolderPlus,
  Users,
  User,
  Inbox,
  ArrowRight,
  Trash2,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

const MyProjects = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'joined'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const [resCreated, resJoined] = await Promise.all([
        api.get(`/projects/my-created/${user.id}`),
        api.get(`/projects/my-joined/${user.id}`),
      ]);

      if (resCreated.success) setCreatedProjects(resCreated.data || []);
      if (resJoined.success) setJoinedProjects(resJoined.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user?.id]);

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${projectId}`, {
        params: { userId: user.id },
      });
      fetchProjects();
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  return (
    <div className="my-projects-page max-w-7xl">
      <div className="page-header-with-actions">
        <div>
          <h1 className="page-title">My Projects Workspace</h1>
          <p className="page-subtitle">
            Manage projects you have created and track the team projects you have joined.
          </p>
        </div>
        <Link to="/create-project" className="btn-primary">
          <FolderPlus size={18} />
          <span>New Project</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-error my-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-header-bar mt-6">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'created' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          <FolderKanban size={18} />
          <span>Projects Created By Me</span>
          <span className="tab-count-badge">{createdProjects.length}</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'joined' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('joined')}
        >
          <CheckCircle2 size={18} />
          <span>Projects I Joined</span>
          <span className="tab-count-badge">{joinedProjects.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="page-loading-spinner">
          <div className="spinner"></div>
          <p>Loading your projects...</p>
        </div>
      ) : activeTab === 'created' ? (
        /* Projects Created By Me Section */
        <div className="tab-content-area mt-6">
          {createdProjects.length > 0 ? (
            <div className="my-projects-list-grid">
              {createdProjects.map((proj) => (
                <div key={proj.id} className="my-project-card">
                  <div className="my-project-header">
                    <div>
                      <span className="category-tag">{proj.category}</span>
                      <h3 className="project-title mt-1">
                        <Link to={`/projects/${proj.id}`}>{proj.title}</Link>
                      </h3>
                    </div>
                    <StatusBadge status={proj.status} />
                  </div>

                  <p className="project-description">{proj.description}</p>

                  <div className="my-project-meta-row">
                    <div className="meta-item">
                      <Users size={16} />
                      <span>
                        Team: <strong>{proj.currentMemberCount}</strong> / {proj.teamSize} members
                      </span>
                    </div>
                  </div>

                  <div className="skills-badge-list mt-3">
                    {proj.requiredSkills?.map((s) => (
                      <SkillBadge key={s} name={s} size="sm" />
                    ))}
                  </div>

                  <div className="my-project-actions-bar mt-5">
                    <Link to={`/projects/${proj.id}`} className="btn-secondary btn-sm">
                      <Eye size={15} />
                      <span>View Details</span>
                    </Link>

                    <Link to="/requests" className="btn-primary btn-sm">
                      <Inbox size={15} />
                      <span>Manage Requests</span>
                    </Link>

                    <button
                      type="button"
                      className="btn-danger-outline btn-sm"
                      onClick={() => handleDelete(proj.id)}
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <FolderKanban size={48} className="text-muted" />
              <h3>No projects created yet</h3>
              <p>You haven't initiated any student projects. Start one today!</p>
              <Link to="/create-project" className="btn-primary mt-4">
                <FolderPlus size={16} /> Create Project
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Projects I Joined Section */
        <div className="tab-content-area mt-6">
          {joinedProjects.length > 0 ? (
            <div className="my-projects-list-grid">
              {joinedProjects.map((proj) => (
                <div key={proj.id} className="my-project-card joined-card-accent">
                  <div className="my-project-header">
                    <div>
                      <span className="category-tag">{proj.category}</span>
                      <h3 className="project-title mt-1">
                        <Link to={`/projects/${proj.id}`}>{proj.title}</Link>
                      </h3>
                    </div>
                    <StatusBadge status={proj.status} />
                  </div>

                  <p className="project-description">{proj.description}</p>

                  <div className="my-project-meta-row">
                    <div className="meta-item">
                      <User size={16} />
                      <span>
                        Project Owner: <strong>{proj.owner?.name}</strong> ({proj.owner?.department})
                      </span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>
                        Team: <strong>{proj.currentMemberCount}</strong> / {proj.teamSize}
                      </span>
                    </div>
                  </div>

                  <div className="skills-badge-list mt-3">
                    {proj.requiredSkills?.map((s) => (
                      <SkillBadge key={s} name={s} size="sm" />
                    ))}
                  </div>

                  <div className="my-project-actions-bar mt-5">
                    <Link to={`/projects/${proj.id}`} className="btn-secondary btn-sm">
                      <Eye size={15} />
                      <span>View Project Workspace</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <Users size={48} className="text-muted" />
              <h3>You haven't joined any team projects yet</h3>
              <p>Explore open projects, find matching tech stacks, and send join requests!</p>
              <Link to="/projects" className="btn-primary mt-4">
                Find Projects
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
