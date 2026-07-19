
const FieldRow = ({ label, value }) => {
  const isFilled = value !== null && value !== undefined && value !== '';

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <span className="text-xs font-semibold text-gray-500">
        {label}
      </span>
      <div
        className={`flex items-center text-xs font-medium transition-colors duration-200 rounded-sm px-3 py-[3px] min-h-[30px] border ${
          isFilled 
            ? 'border-green-300 bg-gray-50 text-green-800' 
            : 'border-neutral-200 bg-white text-gray-300'
        }`}
      >
        {isFilled ? value : 'Not yet shared'}
      </div>
    </div>
  );
};

export default FieldRow;
