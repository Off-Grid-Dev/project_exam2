import React from 'react';

const LoadingPlaceholder: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={`flex items-start justify-center py-8 ${className ?? ''}`}>
      <div
        role='status'
        aria-live='polite'
        style={{ height: 600, maxWidth: 768, width: '100%' }}
        className='rounded bg-gray-200'
      />
    </div>
  );
};

export default LoadingPlaceholder;
