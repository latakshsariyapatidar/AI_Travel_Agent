import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const ChatPanel = ({ messages, onSendMessage, isTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
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
    <div className="flex-1 flex flex-col p-8 md:border-r border-b md:border-b-0 border-(--color-neutral) min-h-0 bg-[#ffffff]">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-5 pr-2">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isTyping && (
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
          placeholder="Type your message..."
          className="flex-1 text-[14px] bg-[#ffffff] transition-all duration-200 outline-none placeholder-gray-400"
          style={{
            padding: '12px 16px',
            border: '1px solid var(--color-neutral)',
            borderRadius: 'var(--radius-md)',
            minHeight: '44px',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-accent)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-neutral)';
          }}
        />
        <button
          onClick={handleSend}
          className="text-[14px] font-medium text-white transition-colors duration-200 cursor-pointer min-h-11"
          style={{
            padding: '0 16px',
            backgroundColor: 'var(--color-accent)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
