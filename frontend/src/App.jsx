import { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import LeadPanel from './components/LeadPanel';


const App = () => {
  const [isTyping, setIsTyping] = useState(false);
  // Static snapshot of mock data as requested
  const [conversationState, setConversationState] = useState({
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

  const handleSendMessage = (text) => {
    setConversationState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: 'user', text }],
    }));
    
    setIsTyping(true);
    // Optional: simulate a fake assistant reply after 1 second
    setTimeout(() => {
      setIsTyping(false);
      setConversationState((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', text: 'Thanks for sharing! I have updated your travel profile.' }],
      }));
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen w-full font-sans bg-gray-50">
      <header className="flex items-center justify-between h-16 bg-white border border-gray-200 rounded-2xl px-5 shrink-0 z-10 relative overflow-hidden">
        <div className="leading-4 flex flex-col items-start">
          <h1 className="text-[17px] font-semibold text-gray-900 tracking-tight">Travel Assistant</h1>
          <p className="text-[12px] text-gray-400 font-regular tracking-tightest mt-0.5">Tell me about your dream destination</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[12px] text-gray-500">Active</span>
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1 min-h-0">
        <ChatPanel messages={conversationState.messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
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