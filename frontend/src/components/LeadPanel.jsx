import React from 'react';
import FieldRow from './FieldRow';
import ScoreBadge from './ScoreBadge';

const LeadPanel = ({ capturedFields, leadScore, confidence }) => {
  return (
    <div className="w-full md:w-[280px] shrink-0 p-[24px] bg-[var(--color-light)] overflow-y-auto border-t md:border-t-0 md:border-l border-[var(--color-neutral)] h-full">
      
      {/* Trip Info Section */}
      <div className="flex flex-col gap-[12px] mb-[24px]">
        <h2 className="text-[12px] uppercase font-bold tracking-[0.5px] text-[#888888]">
          Trip Info
        </h2>
        <FieldRow label="Destination" value={capturedFields.destination} />
        <FieldRow label="Departure City" value={capturedFields.departureCity} />
      </div>

      {/* Travel Details Section */}
      <div className="flex flex-col gap-[12px] mb-[24px]">
        <h2 className="text-[12px] uppercase font-bold tracking-[0.5px] text-[#888888]">
          Travel Details
        </h2>
        <FieldRow label="Travel Month" value={capturedFields.travelMonth} />
        <FieldRow label="Travellers" value={capturedFields.travellers} />
        <FieldRow label="Budget" value={capturedFields.budget} />
        <FieldRow label="Trip Type" value={capturedFields.tripType} />
      </div>

      {/* Contact Info Section */}
      <div className="flex flex-col gap-[12px] mb-[24px]">
        <h2 className="text-[12px] uppercase font-bold tracking-[0.5px] text-[#888888]">
          Contact Info
        </h2>
        <FieldRow label="Name" value={capturedFields.name} />
        <FieldRow label="Email" value={capturedFields.email} />
        <FieldRow label="Phone" value={capturedFields.phone} />
      </div>

      {/* Lead Score Section */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[12px] uppercase font-bold tracking-[0.5px] text-[#888888]">
          Score
        </h2>
        <ScoreBadge score={leadScore} confidence={confidence} />
      </div>

    </div>
  );
};

export default LeadPanel;
