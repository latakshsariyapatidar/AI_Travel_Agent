import ChatPanel from './components/ChatPanel';
import LeadPanel from './components/LeadPanel';
import { useChat } from './hooks/useChat';

const App = () => {
  const { messages, extractedFields, qualification, isLoading, sendMessage } = useChat();

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
        <ChatPanel messages={messages} onSendMessage={sendMessage} isLoading={isLoading} />
        <LeadPanel
          capturedFields={extractedFields}
          leadScore={qualification.leadScore}
          confidence={qualification.confidence}
        />
      </main>
    </div>
  );
};

export default App;