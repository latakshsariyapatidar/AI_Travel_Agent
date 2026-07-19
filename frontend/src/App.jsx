import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatPanel from './components/ChatPanel';
import LeadPanel from './components/LeadPanel';
import LeadsDashboard from './components/LeadsDashboard';
import { useChat } from './hooks/useChat';

const ChatView = ({ showSidebar, setShowSidebar }) => {
  const { messages, extractedFields, qualification, isLoading, sendMessage } = useChat();

  return (
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
  );
};

const App = () => {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isBackendActive, setIsBackendActive] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/health');
        setIsBackendActive(res.ok);
      } catch (err) {
        setIsBackendActive(false);
      }
    };
    checkHealth();
    // Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full font-sans bg-gray-50 overflow-hidden">
      <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-5 shrink-0 z-20 overflow-x-auto">
        <div className="leading-4 flex flex-col items-start shrink-0 mr-4">
          <h1 className="text-[17px] font-semibold text-gray-900 tracking-tight">Travel Assistant</h1>
          <p className="text-[12px] text-gray-400 font-regular tracking-tightest mt-0.5">Tell me about your dream destination</p>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link 
            to="/" 
            className={`text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Chat
          </Link>
          <Link 
            to="/leads" 
            className={`text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/leads' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Leads
          </Link>
          
          {location.pathname === '/' && (
            <div className="flex items-center gap-4 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200">
              <div className="hidden md:flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {isBackendActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isBackendActive ? 'bg-green-500' : 'bg-red-500'}`} />
                </span>
                <span className="text-[12px] text-gray-500">{isBackendActive ? 'Active' : 'Inactive'}</span>
              </div>
              <button 
                className="md:hidden text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md font-medium shrink-0"
                onClick={() => setShowSidebar(true)}
              >
                Details
              </button>
            </div>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ChatView showSidebar={showSidebar} setShowSidebar={setShowSidebar} />} />
        <Route path="/leads" element={<LeadsDashboard />} />
      </Routes>
    </div>
  );
};

export default App;