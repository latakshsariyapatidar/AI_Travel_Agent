import { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import LeadPanel from './components/LeadPanel';
import { useChat } from './hooks/useChat';

const App = () => {
  const { messages, extractedFields, qualification, isLoading, sendMessage } = useChat();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full font-sans bg-gray-50 overflow-hidden">
      <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-5 shrink-0 z-20">
        <div className="leading-4 flex flex-col items-start">
          <h1 className="text-[17px] font-semibold text-gray-900 tracking-tight">Travel Assistant</h1>
          <p className="text-[12px] text-gray-400 font-regular tracking-tightest mt-0.5">Tell me about your dream destination</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[12px] text-gray-500">Active</span>
          </div>
          <button 
            className="md:hidden text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md font-medium"
            onClick={() => setShowSidebar(true)}
          >
            View Details
          </button>
        </div>
      </header>

      <main className="flex flex-1 min-h-0 relative">
        {/* Chat Area */}
        <div className="flex-1 flex min-w-0">
          <ChatPanel messages={messages} onSendMessage={sendMessage} isLoading={isLoading} />
        </div>

        {/* Mobile Backdrop */}
        {showSidebar && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar / Lead Panel */}
        <div className={`
          absolute right-0 top-0 bottom-0 z-50 w-[85vw] max-w-[340px] bg-neutral-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
          md:static md:w-[380px] md:max-w-none md:shadow-none md:translate-x-0 md:border-l md:border-neutral-200
          ${showSidebar ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
            <span className="font-semibold text-gray-800">Lead Details</span>
            <button onClick={() => setShowSidebar(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-md">✕</button>
          </div>
          <div className="flex-1 overflow-hidden">
            <LeadPanel
              capturedFields={extractedFields}
              leadScore={qualification.leadScore}
              confidence={qualification.confidence}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;