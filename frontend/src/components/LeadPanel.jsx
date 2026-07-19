import FieldRow from './FieldRow';
import ScoreBadge from './ScoreBadge';

const LeadPanel = ({ capturedFields, leadScore, confidence }) => {
  return (
    <div className="w-full md:w-90 shrink-0 p-6 bg-neutral-50 overflow-y-auto border-t md:border-t-0 md:border-l border-neutral-200 h-full">

      {/* Lead Score Section */}
      <div className="flex flex-col gap-3 mb-5">
        <h2 className="text-sm uppercase font-bold tracking-[0.5px] text-zinc-600">
          Score
        </h2>
        <ScoreBadge score={leadScore} confidence={confidence} />
      </div>

      {/* Trip Info Section */}
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-sm uppercase font-bold text-zinc-600">
          Trip Info
        </h2>
        <div className='flex gap-5'>
          <FieldRow label="Destination" value={capturedFields.destination} />
          <FieldRow label="Departure City" value={capturedFields.departureCity} />
        </div>
      </div>

      {/* Travel Details Section */}
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-sm uppercase font-bold tracking-[0.5px] text-zinc-600">
          Travel Details
        </h2>
        <div className='grid grid-cols-2 gap-x-5 gap-y-2'>
          <FieldRow label="Budget" value={capturedFields.budget} />
          <FieldRow label="Travel Month" value={capturedFields.travelDate} />
          <FieldRow label="Trip Type" value={capturedFields.tripType} />
          <FieldRow label="Travellers" value={capturedFields.travellers} />
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-sm uppercase font-bold tracking-[0.5px] text-zinc-600">
          Contact Info
        </h2>
        <div className='grid grid-cols-2 gap-x-5 gap-y-2'>
          <FieldRow label="Name" value={capturedFields.name} />
          <FieldRow label="Email" value={capturedFields.email} />
          <FieldRow label="Phone" value={capturedFields.phone} />
        </div>
      </div>

    </div>
  );
};

export default LeadPanel;
