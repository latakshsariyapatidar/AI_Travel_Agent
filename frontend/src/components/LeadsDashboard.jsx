import { useState, useEffect } from 'react';

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        setLeads(data.leads || []);
      } catch (err) {
        console.error('Failed to fetch leads', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
        <div className="text-gray-500 font-medium animate-pulse">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Qualified Leads</h2>
          <p className="text-gray-500 mt-1">Review captured leads that have reached the qualification threshold.</p>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-500">When the AI qualifies a user and captures their contact info, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {leads.map((lead) => (
              <div key={lead.conversationId} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                
                {/* Header: Name and Score */}
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{lead.customer.name}</h3>
                    <p className="text-sm text-gray-500">{lead.customer.phone} {lead.customer.email && `• ${lead.customer.email}`}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-blue-600 leading-none">{lead.qualification.leadScore}</span>
                    <span className="text-xs uppercase font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                      {lead.qualification.confidence}
                    </span>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Destination</span>
                    <span className="text-sm font-medium text-gray-800">{lead.travel.destination || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Date</span>
                    <span className="text-sm font-medium text-gray-800">{lead.travel.travelDate || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Budget</span>
                    <span className="text-sm font-medium text-gray-800">{lead.travel.budget || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Travellers</span>
                    <span className="text-sm font-medium text-gray-800">{lead.travel.travellers || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Type</span>
                    <span className="text-sm font-medium text-gray-800">{lead.travel.tripType || '—'}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-auto bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1">Summary</span>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {lead.qualification.summary}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsDashboard;
