import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import SkillBadge from '../components/SkillBadge';
import { 
  FolderPlus, 
  Search, 
  FolderKanban, 
  UserCircle, 
  Inbox, 
  Award, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Layers,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/users/${user.id}/dashboard`);
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const handleJoinRequest = async (projectId) => {
    try {
      const res = await api.post(`/projects/${projectId}/requests`, {
        studentId: user.id,
      });
      setActionSuccess('Join request submitted successfully!');
      setTimeout(() => setActionSuccess(''), 4000);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to send join request.');
    }
  };

  if (loading) {
    return (
      <div className="page-loading-spinner">
        <div className="spinner"></div>
        <p>Loading your student dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page max-w-7xl">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-text-side">
          <h1 className="welcome-heading">
            Welcome, {user?.name || 'Student'} 👋
          </h1>
          <p className="welcome-subtext">
            {user?.department} • {user?.year} — Find project teammates who complement your skills or lead your own college capstone!
          </p>
        </div>
        <div className="welcome-cta-group">
          <Link to="/create-project" className="btn-primary">
            <FolderPlus size={18} />
            <span>Create Project</span>
          </Link>
          <Link to="/projects" className="btn-secondary">
            <Search size={18} />
            <span>Find Projects</span>
          </Link>
        </div>
      </section>

      {error && (
        <div className="alert alert-error my-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="alert alert-success my-4">
          <Sparkles size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <section className="metrics-grid">
        <div className="metric-card metric-card-primary">
          <div className="metric-icon-wrap bg-blue-100 text-blue-600">
            <Layers size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Projects Created</span>
            <span className="metric-value">{stats?.projectsCreated ?? 0}</span>
          </div>
        </div>

        <div className="metric-card metric-card-success">
          <div className="metric-icon-wrap bg-emerald-100 text-emerald-600">
            <FolderKanban size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Projects Joined</span>
            <span className="metric-value">{stats?.projectsJoined ?? 0}</span>
          </div>
        </div>

        <div className="metric-card metric-card-warning">
          <div className="metric-icon-wrap bg-amber-100 text-amber-600">
            <Inbox size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Pending Requests</span>
            <span className="metric-value">{stats?.pendingRequests ?? 0}</span>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Bar */}
      <section className="quick-actions-bar">
        <span className="quick-actions-title">Quick Actions:</span>
        <div className="quick-btns-row">
          <Link to="/create-project" className="quick-btn">
            <FolderPlus size={16} />
            <span>Create Project</span>
          </Link>
          <Link to="/projects" className="quick-btn">
            <Search size={16} />
            <span>Find Projects</span>
          </Link>
          <Link to="/my-projects" className="quick-btn">
            <FolderKanban size={16} />
            <span>My Projects</span>
          </Link>
          <Link to="/requests" className="quick-btn">
            <Inbox size={16} />
            <span>Requests</span>
            {stats?.pendingRequests > 0 && (
              <span className="pill-count">{stats.pendingRequests}</span>
            )}
          </Link>
          <Link to="/profile" className="quick-btn">
            <UserCircle size={16} />
            <span>My Profile</span>
          </Link>
        </div>
      </section>

      {/* Skills Showcase Section */}
      <section className="dashboard-skills-card">
        <div className="skills-card-header">
          <div className="flex-row items-center gap-2">
            <Award size={20} className="text-primary" />
            <h2 className="section-title">My Technical Skills</h2>
          </div>
          <Link to="/profile" className="link-action">
            Edit Skills & Profile →
          </Link>
        </div>
        <p className="skills-card-desc">
          These skills are used to match you with available project teams. Keep them updated to see accurate match percentages!
        </p>
        <div className="skills-badge-list mt-3">
          {stats?.skills && stats.skills.length > 0 ? (
            stats.skills.map((skill) => (
              <SkillBadge key={skill} name={skill} size="md" />
            ))
          ) : (
            <div className="empty-skills-hint">
              <span>No skills added yet. </span>
              <Link to="/profile" className="text-primary font-semibold underline">
                Add your skills now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Projects with Match % */}
      <section className="dashboard-section mt-8">
        <div className="section-header-flex">
          <div>
            <div className="badge-flair">
              <Sparkles size={14} /> Recommended For You
            </div>
            <h2 className="section-title text-xl">Top Skill-Matched Projects</h2>
          </div>
          <Link to="/projects" className="link-see-all">
            Browse All Projects <ArrowRight size={16} />
          </Link>
        </div>

        {stats?.recommendedProjects && stats.recommendedProjects.length > 0 ? (
          <div className="projects-grid mt-4">
            {stats.recommendedProjects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onJoinRequest={handleJoinRequest}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <Search size={36} className="text-muted" />
            <h3>No projects available right now</h3>
            <p>Be the first to start a project and invite classmates!</p>
            <Link to="/create-project" className="btn-primary mt-3">
              <FolderPlus size={16} /> Create Project
            </Link>
          </div>
        )}
      </section>

      {/* My Created Projects Preview */}
      <section className="dashboard-section mt-10">
        <div className="section-header-flex">
          <h2 className="section-title text-xl">Projects Created By Me</h2>
          <Link to="/my-projects" className="link-see-all">
            Manage All <ArrowRight size={16} />
          </Link>
        </div>

        {stats?.myProjects && stats.myProjects.length > 0 ? (
          <div className="projects-grid mt-4">
            {stats.myProjects.slice(0, 2).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onJoinRequest={handleJoinRequest}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <FolderKanban size={36} className="text-muted" />
            <h3>You haven't created any projects yet</h3>
            <p>Have an idea for a final year or semester mini-project? Start one now!</p>
            <Link to="/create-project" className="btn-primary mt-3">
              <FolderPlus size={16} /> Create New Project
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
