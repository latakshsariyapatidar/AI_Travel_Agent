import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import LeadPanel from './components/LeadPanel';

const App = () => {
  // Static snapshot of mock data as requested
  const [conversationState] = useState({
    messages: [
      { role: 'assistant', text: 'Hi! I can help you plan your next trip. Where would you like to go?' },
      { role: 'user', text: 'I want to go to Bali in December.' },
      { role: 'assistant', text: 'Bali in December is beautiful! How many people are traveling and what is your budget?' },
      { role: 'user', text: 'Just me and my partner. We want a luxury experience, budget is around $5000.' },
    ],
    capturedFields: {
      destination: 'Bali',
      departureCity: null,
      travelMonth: 'December',
      travellers: '2',
      budget: '$5000',
      tripType: 'Luxury',
      name: null,
      email: null,
      phone: null,
    },
    leadScore: 65,
    confidence: 'Medium',
  });

  return (
    <div className="flex flex-col h-screen w-full font-sans bg-gray-50">
      {/* Top Navigation Bar - SaaS Style */}
      <header className="flex items-center justify-between h-[60px] bg-white border-b border-[var(--color-neutral)] px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white text-[18px]">
            ✈️
          </div>
          <span className="font-semibold text-[16px] tracking-tight text-[var(--color-primary)]">
            TravelAI <span className="text-gray-400 font-normal ml-1">Agent Console</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500 font-medium">Status: Active</span>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-sm ml-2 font-medium">
            JD
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex flex-col md:flex-row flex-1 min-h-0">
        <ChatPanel messages={conversationState.messages} />
        <LeadPanel 
          capturedFields={conversationState.capturedFields} 
          leadScore={conversationState.leadScore}
          confidence={conversationState.confidence}
        />
      </main>
    </div>
  );
};

export default App;