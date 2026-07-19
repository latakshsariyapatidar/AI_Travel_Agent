
const FieldRow = ({ label, value }) => {
  const isFilled = value !== null && value !== undefined && value !== '';

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <span className="text-xs font-semibold text-gray-500">
        {label}
      </span>
      <div
        className={`flex items-center text-xs font-medium transition-colors duration-200 rounded-sm px-3 py-0.75 min-h-7.5 border ${
          isFilled 
            ? 'border-gray-200 bg-gray-50 text-gray-900' 
            : 'border-gray-200 bg-white text-gray-400'
        }`}
      >
        {isFilled ? value : 'Not yet shared'}
      </div>
    </div>
  );
};

export default FieldRow;
