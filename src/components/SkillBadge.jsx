import React from 'react';
import { Check, X } from 'lucide-react';

const SkillBadge = ({
  name,
  variant = 'default', // 'default' | 'matched' | 'missing' | 'removable' | 'selectable'
  selected = false,
  onRemove,
  onClick,
  size = 'md', // 'sm' | 'md'
}) => {
  let styleClasses = 'skill-badge';

  if (variant === 'matched') {
    styleClasses += ' skill-badge-matched';
  } else if (variant === 'missing') {
    styleClasses += ' skill-badge-missing';
  } else if (variant === 'removable') {
    styleClasses += ' skill-badge-removable';
  } else if (variant === 'selectable') {
    styleClasses += selected ? ' skill-badge-selected' : ' skill-badge-unselected';
  } else {
    styleClasses += ' skill-badge-default';
  }

  if (size === 'sm') {
    styleClasses += ' text-xs py-0.5 px-2';
  }

  return (
    <span
      className={styleClasses}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {variant === 'matched' && <Check size={13} className="badge-icon icon-matched" />}
      {variant === 'missing' && <X size={13} className="badge-icon icon-missing" />}
      <span className="skill-name">{name}</span>
      {variant === 'removable' && onRemove && (
        <button
          type="button"
          className="badge-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(name);
          }}
          aria-label={`Remove ${name}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
