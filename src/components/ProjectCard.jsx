import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, ArrowRight, Send, CheckCircle2, Clock } from 'lucide-react';
import SkillBadge from './SkillBadge';
import StatusBadge from './StatusBadge';

const ProjectCard = ({ project, onJoinRequest, onRequestSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    id,
    title,
    description,
    category,
    teamSize,
    currentMemberCount,
    owner,
    status,
    requiredSkills = [],
    skillMatchPercentage = 0,
    matchedSkills = [],
    isOwner,
    isMember,
    hasPendingRequest,
  } = project;

  const isFull = status === 'FULL' || currentMemberCount >= teamSize;

  const handleRequestJoin = async (e) => {
    e.preventDefault();
    if (submitting || isOwner || isMember || hasPendingRequest || isFull) return;

    setSubmitting(true);
    try {
      if (onJoinRequest) {
        await onJoinRequest(id);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Determine skill match color tone
  let matchColorClass = 'match-low';
  if (skillMatchPercentage >= 75) {
    matchColorClass = 'match-high';
  } else if (skillMatchPercentage >= 50) {
    matchColorClass = 'match-medium';
  }

  return (
    <div className="project-card">
      <div className="card-top-row">
        <span className="category-tag">{category}</span>
        <StatusBadge status={status} />
      </div>

      <h3 className="project-title">
        <Link to={`/projects/${id}`}>{title}</Link>
      </h3>

      <p className="project-description">{description}</p>

      <div className="card-section">
        <div className="section-label">Required Skills</div>
        <div className="skills-badge-list">
          {requiredSkills.map((skill) => {
            const isMatched = matchedSkills.some(
              (m) => m.toLowerCase() === skill.toLowerCase()
            );
            return (
              <SkillBadge
                key={skill}
                name={skill}
                variant={isMatched ? 'matched' : 'default'}
                size="sm"
              />
            );
          })}
        </div>
      </div>

      <div className="card-meta-grid">
        <div className="meta-item">
          <Users size={16} className="meta-icon" />
          <span>
            Team: <strong>{currentMemberCount}</strong> / {teamSize}
          </span>
        </div>
        <div className="meta-item">
          <User size={16} className="meta-icon" />
          <span>Owner: <strong>{owner?.name || 'Unknown'}</strong></span>
        </div>
      </div>

      {/* Skill Match Indicator */}
      <div className="match-bar-container">
        <div className="match-bar-header">
          <span className="match-title">Skill Match</span>
          <span className={`match-percentage-badge ${matchColorClass}`}>
            {skillMatchPercentage}% Match
          </span>
        </div>
        <div className="match-track">
          <div
            className={`match-fill ${matchColorClass}`}
            style={{ width: `${Math.min(100, Math.max(0, skillMatchPercentage))}%` }}
          />
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="card-actions">
        <Link to={`/projects/${id}`} className="btn-secondary btn-card-details">
          <span>View Details</span>
          <ArrowRight size={15} />
        </Link>

        {isOwner ? (
          <span className="badge-user-role owner-pill">You are Owner</span>
        ) : isMember ? (
          <span className="badge-user-role member-pill">
            <CheckCircle2 size={14} />
            <span>Joined Team</span>
          </span>
        ) : hasPendingRequest ? (
          <span className="badge-user-role pending-pill">
            <Clock size={14} />
            <span>Request Pending</span>
          </span>
        ) : isFull ? (
          <span className="badge-user-role full-pill">Team Full</span>
        ) : (
          <button
            type="button"
            className="btn-primary btn-card-join"
            onClick={handleRequestJoin}
            disabled={submitting}
          >
            <Send size={14} />
            <span>{submitting ? 'Sending...' : 'Request to Join'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
