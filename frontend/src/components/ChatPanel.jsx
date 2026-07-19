import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const ChatPanel = ({ messages, onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 min-h-0 bg-white w-full">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-5 pr-2">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <MessageBubble
            message={{
              role: 'assistant',
              text: (
                <div className="flex items-center gap-1 h-5">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              ),
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2 w-full mt-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Type your message..."
          className="flex-1 text-sm bg-white px-4 py-3 border border-neutral-200 rounded-lg min-h-[44px] transition-all duration-200 outline-none placeholder-gray-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 disabled:opacity-50 disabled:bg-gray-50"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`text-sm font-medium text-white transition-colors duration-200 min-h-[44px] px-4 rounded-lg border-none ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
