
const FieldRow = ({ label, value }) => {
  const isFilled = value !== null && value !== undefined && value !== '';

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <span className="text-xs font-semibold text-gray-500">
        {label}
      </span>
      <div
        className="flex items-center text-xs font-medium transition-colors duration-200 rounded-sm"
        style={{
          padding: '3px 12px',
          minHeight: '30px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isFilled ? '#86efac' : 'var(--color-neutral)',
          backgroundColor: isFilled ? '#f9fafb' : '#ffffff',
          color: isFilled ? '#166534' : '#cccccc',
        }}
      >
        {isFilled ? value : 'Not yet shared'}
      </div>
    </div>
  );
};

export default FieldRow;
