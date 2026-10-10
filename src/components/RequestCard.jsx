import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Check, X, Calendar, FolderKanban } from 'lucide-react';
import SkillBadge from './SkillBadge';
import StatusBadge from './StatusBadge';

const RequestCard = ({
  request,
  type = 'incoming', // 'incoming' | 'outgoing'
  onAccept,
  onReject,
}) => {
  const [actionLoading, setActionLoading] = useState(false);

  const {
    id,
    projectId,
    projectTitle,
    student,
    studentSkills = [],
    skillMatchPercentage = 0,
    status,
    createdAt,
  } = request;

  const handleAction = async (actionFn) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await actionFn(id);
    } finally {
      setActionLoading(false);
    }
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  if (type === 'incoming') {
    return (
      <div className="request-card incoming-card">
        <div className="request-card-header">
          <div className="student-profile-summary">
            <div className="student-avatar">
              {student?.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h4 className="student-name">{student?.name}</h4>
              <p className="student-sub">
                {student?.department} • {student?.year}
              </p>
            </div>
          </div>
          <div className="request-for-project">
            <span className="for-label">Requested to join:</span>
            <Link to={`/projects/${projectId}`} className="project-link-chip">
              <FolderKanban size={14} />
              <span>{projectTitle}</span>
            </Link>
          </div>
        </div>

        <div className="request-card-body">
          <div className="request-info-row">
            <div className="match-pill-wrap">
              <span className="match-tag-label">Skill Match:</span>
              <span
                className={`match-percentage-badge ${
                  skillMatchPercentage >= 75
                    ? 'match-high'
                    : skillMatchPercentage >= 50
                    ? 'match-medium'
                    : 'match-low'
                }`}
              >
                {skillMatchPercentage}% Match
              </span>
            </div>
            {formattedDate && (
              <span className="request-date">
                <Calendar size={13} /> {formattedDate}
              </span>
            )}
          </div>

          <div className="student-skills-section">
            <span className="section-label">Student Skills:</span>
            <div className="skills-badge-list">
              {studentSkills.length > 0 ? (
                studentSkills.map((skill) => (
                  <SkillBadge key={skill} name={skill} size="sm" />
                ))
              ) : (
                <span className="text-muted text-xs">No skills listed</span>
              )}
            </div>
          </div>
        </div>

        <div className="request-card-footer">
          {status === 'PENDING' ? (
            <div className="request-action-buttons">
              <button
                type="button"
                className="btn-success btn-sm"
                onClick={() => handleAction(onAccept)}
                disabled={actionLoading}
              >
                <Check size={15} />
                <span>{actionLoading ? 'Processing...' : 'Accept'}</span>
              </button>
              <button
                type="button"
                className="btn-danger btn-sm"
                onClick={() => handleAction(onReject)}
                disabled={actionLoading}
              >
                <X size={15} />
                <span>Reject</span>
              </button>
            </div>
          ) : (
            <StatusBadge status={status} />
          )}
        </div>
      </div>
    );
  }

  // Outgoing Request Card
  return (
    <div className="request-card outgoing-card">
      <div className="request-card-header">
        <div>
          <h4 className="project-title">
            <Link to={`/projects/${projectId}`}>{projectTitle}</Link>
          </h4>
          <span className="request-date">
            <Calendar size={13} /> Sent on {formattedDate}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="request-card-body">
        <p className="request-status-hint">
          {status === 'PENDING' &&
            'Your join request is awaiting review by the project owner.'}
          {status === 'ACCEPTED' &&
            'Congratulations! You have been accepted into this project team.'}
          {status === 'REJECTED' &&
            'This join request was declined by the project owner.'}
        </p>
      </div>

      <div className="request-card-footer">
        <Link to={`/projects/${projectId}`} className="btn-secondary btn-sm">
          <span>View Project</span>
        </Link>
      </div>
    </div>
  );
};

export default RequestCard;
