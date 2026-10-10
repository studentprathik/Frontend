import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  GraduationCap,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Trash2,
  Inbox,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const params = user?.id ? { userId: user.id } : {};
      const res = await api.get(`/projects/${id}`, { params });
      if (res.success && res.data) {
        setProject(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, user?.id]);

  const handleSendJoinRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRequestSubmitting(true);
    try {
      await api.post(`/projects/${id}/requests`, {
        studentId: user.id,
      });
      setSuccess('Your join request has been sent to the project owner!');
      fetchProjectDetails();
    } catch (err) {
      setError(err.message || 'Could not send join request.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/projects/${id}`, {
        params: { userId: user.id },
      });
      alert('Project deleted successfully.');
      navigate('/my-projects');
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  if (loading) {
    return (
      <div className="page-loading-spinner">
        <div className="spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 text-center">
        <div className="alert alert-error mb-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <Link to="/projects" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) return null;

  const {
    title,
    description,
    category,
    teamSize,
    currentMemberCount,
    owner,
    status,
    createdAt,
    requiredSkills = [],
    skillMatchPercentage = 0,
    matchedSkills = [],
    missingSkills = [],
    isOwner,
    isMember,
    hasPendingRequest,
    members = [],
  } = project;

  const isFull = status === 'FULL' || currentMemberCount >= teamSize;

  return (
    <div className="project-details-page max-w-5xl">
      {/* Top navigation back link */}
      <div className="details-top-bar">
        <Link to="/projects" className="link-back">
          <ArrowLeft size={16} />
          <span>Back to All Projects</span>
        </Link>
        {isOwner && (
          <div className="owner-top-actions">
            <Link to="/requests" className="btn-secondary btn-sm">
              <Inbox size={15} />
              <span>Review Requests</span>
            </Link>
            <button
              type="button"
              className="btn-danger btn-sm"
              onClick={handleDeleteProject}
            >
              <Trash2 size={15} />
              <span>Delete Project</span>
            </button>
          </div>
        )}
      </div>

      {success && (
        <div className="alert alert-success my-4">
          <Sparkles size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error my-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="project-hero-card">
        <div className="hero-top-row">
          <span className="category-tag">{category}</span>
          <StatusBadge status={status} />
        </div>

        <h1 className="details-title">{title}</h1>

        <div className="hero-meta-row">
          <div className="meta-pill">
            <Calendar size={15} />
            <span>
              Created on{' '}
              {new Date(createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="meta-pill">
            <Users size={15} />
            <span>
              Team Capacity: <strong>{currentMemberCount}</strong> / {teamSize}
            </span>
          </div>
        </div>

        <div className="details-description-block">
          <h3>Project Overview</h3>
          <p>{description}</p>
        </div>

        {/* Join action banner */}
        <div className="details-cta-banner">
          {isOwner ? (
            <div className="owner-notice">
              <ShieldCheck size={20} className="text-primary" />
              <div>
                <strong>You are the Project Owner</strong>
                <p>You can manage incoming join requests in the Requests tab.</p>
              </div>
            </div>
          ) : isMember ? (
            <div className="member-notice">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <div>
                <strong>You are a confirmed team member!</strong>
                <p>Collaborate with your teammates listed below.</p>
              </div>
            </div>
          ) : hasPendingRequest ? (
            <div className="pending-notice">
              <Clock size={20} className="text-amber-600" />
              <div>
                <strong>Join Request Pending</strong>
                <p>Your request has been submitted and is awaiting owner review.</p>
              </div>
            </div>
          ) : isFull ? (
            <div className="full-notice">
              <AlertCircle size={20} className="text-gray-500" />
              <div>
                <strong>Project Team is Full</strong>
                <p>This project has reached its maximum team size ({teamSize} members).</p>
              </div>
            </div>
          ) : (
            <div className="join-cta-row">
              <div className="join-cta-text">
                <strong>Interested in collaborating?</strong>
                <p>Send a request to the project owner to join this team.</p>
              </div>
              <button
                type="button"
                className="btn-primary btn-lg"
                onClick={handleSendJoinRequest}
                disabled={requestSubmitting}
              >
                <Send size={16} />
                <span>{requestSubmitting ? 'Submitting...' : 'Request to Join Project'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Skill Match Breakdown and Project Owner */}
      <div className="details-two-col-grid mt-6">
        {/* Skill Match Breakdown Card (Section 9 Requirement) */}
        <div className="details-panel skill-match-panel">
          <div className="panel-header">
            <div className="flex-row items-center gap-2">
              <Sparkles size={20} className="text-indigo-600" />
              <h2 className="panel-title">Skill Match Analysis</h2>
            </div>
            <div className="match-gauge-badge">
              <span className="match-num">{skillMatchPercentage}%</span>
              <span className="match-text">Match</span>
            </div>
          </div>

          <p className="panel-desc">
            Calculated by comparing required project technologies with your registered skills:
          </p>

          <div className="match-progress-full">
            <div
              className={`match-progress-bar-fill ${
                skillMatchPercentage >= 75
                  ? 'bg-emerald'
                  : skillMatchPercentage >= 50
                  ? 'bg-amber'
                  : 'bg-rose'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, skillMatchPercentage))}%` }}
            />
          </div>

          {/* Visual Checklist: Matched (Checkmark) & Missing (Cross) */}
          <div className="skills-checklist mt-4">
            <h4 className="checklist-heading">Skill Breakdown:</h4>
            <div className="checklist-items-grid">
              {requiredSkills.map((skill) => {
                const isMatched = matchedSkills.some(
                  (m) => m.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <div
                    key={skill}
                    className={`checklist-item ${
                      isMatched ? 'checklist-matched' : 'checklist-missing'
                    }`}
                  >
                    <div className="checklist-indicator">
                      {isMatched ? (
                        <Check size={16} className="text-emerald-600" />
                      ) : (
                        <X size={16} className="text-rose-500" />
                      )}
                    </div>
                    <span className="checklist-skill-name">{skill}</span>
                    <span className="checklist-status-label">
                      {isMatched ? 'You have this' : 'Skill needed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {!user && (
            <div className="auth-hint-box mt-4">
              <span>Sign in to calculate your personal skill match percentage!</span>
            </div>
          )}
        </div>

        {/* Project Owner Information Card */}
        <div className="details-panel owner-info-panel">
          <h2 className="panel-title">Project Owner</h2>
          <div className="owner-card-profile mt-4">
            <div className="owner-avatar-lg">
              {owner?.name ? owner.name.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="owner-info-text">
              <h3 className="owner-name">{owner?.name}</h3>
              <p className="owner-dept">
                <GraduationCap size={15} /> {owner?.department}
              </p>
              <p className="owner-year">
                <Calendar size={15} /> {owner?.year}
              </p>
              <p className="owner-email">
                <Mail size={15} /> {owner?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Team Members Section */}
      <div className="details-panel team-members-panel mt-6">
        <div className="panel-header">
          <div className="flex-row items-center gap-2">
            <Users size={20} className="text-primary" />
            <h2 className="panel-title">Current Team Members ({members.length} / {teamSize})</h2>
          </div>
        </div>

        <div className="members-cards-grid mt-4">
          {members.map((member) => (
            <div key={member.id} className="team-member-card">
              <div className="member-avatar">
                {member.studentName ? member.studentName.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="member-info">
                <div className="member-name-row">
                  <h4 className="member-name">{member.studentName}</h4>
                  <span
                    className={`member-role-badge ${
                      member.role === 'OWNER' ? 'role-owner' : 'role-member'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
                <p className="member-dept">
                  {member.department} • {member.year}
                </p>

                <div className="member-skills-row mt-2">
                  {member.skills && member.skills.length > 0 ? (
                    member.skills.slice(0, 4).map((s) => (
                      <span key={s} className="skill-mini-pill">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted text-xs">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Empty seats visual representation */}
          {Array.from({ length: Math.max(0, teamSize - members.length) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="empty-seat-card">
              <div className="empty-seat-icon">
                <Users size={20} className="text-muted" />
              </div>
              <div className="empty-seat-text">
                <span className="empty-title">Open Position</span>
                <span className="empty-sub">Awaiting suitable teammate</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
