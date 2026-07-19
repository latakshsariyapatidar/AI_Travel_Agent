
const ScoreBadge = ({ score, confidence }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-(--color-neutral) rounded-lg bg-[#ffffff]">
      <span className="text-[12px] uppercase font-semibold tracking-[0.5px] text-[#888888]">
        Lead Score
      </span>
      <div className='flex justify-around'>
        <div className="text-[32px] font-bold text-(--color-accent) leading-none">
          {score}
        </div>
        <div className="self-start mt-1">
          <span
            className="inline-block text-[11px] font-semibold text-(--color-accent)"
            style={{
              padding: '4px 10px',
              backgroundColor: '#e0e7ff',
              borderRadius: '4px',
            }}
          >
            {confidence} Confidence
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBadge;
