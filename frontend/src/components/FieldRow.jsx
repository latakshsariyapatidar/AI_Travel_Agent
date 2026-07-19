import React from 'react';

const FieldRow = ({ label, value }) => {
  const isFilled = value !== null && value !== undefined && value !== '';

  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-[12px] font-semibold tracking-[0.5px] text-gray-500 uppercase">
        {label}
      </span>
      <div
        className="flex items-center text-[14px] font-medium transition-colors duration-200"
        style={{
          padding: '8px 12px',
          minHeight: '28px',
          borderRadius: 'var(--radius-sm)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isFilled ? '#86efac' : 'var(--color-neutral)',
          backgroundColor: isFilled ? '#f0fdf4' : '#ffffff',
          color: isFilled ? '#166534' : '#cccccc',
        }}
      >
        {isFilled ? value : 'Not yet shared'}
      </div>
    </div>
  );
};

export default FieldRow;
