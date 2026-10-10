import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  let badgeClass = 'status-badge';
  let label = normalized;

  switch (normalized) {
    case 'OPEN':
      badgeClass += ' status-open';
      label = 'Open for Members';
      break;
    case 'FULL':
      badgeClass += ' status-full';
      label = 'Team Full';
      break;
    case 'PENDING':
      badgeClass += ' status-pending';
      label = 'Pending Review';
      break;
    case 'ACCEPTED':
      badgeClass += ' status-accepted';
      label = 'Accepted';
      break;
    case 'REJECTED':
      badgeClass += ' status-rejected';
      label = 'Rejected';
      break;
    default:
      badgeClass += ' status-default';
  }

  return <span className={badgeClass}>{label}</span>;
};

export default StatusBadge;
