import React from 'react';
import MessageBubble from './MessageBubble';

const ChatPanel = ({ messages }) => {
  return (
    <div className="flex-1 flex flex-col p-[32px] md:border-r border-b md:border-b-0 border-[var(--color-neutral)] min-h-0 bg-[#ffffff]">
      {/* Header */}
      <div className="mb-[32px]">
        <h1 className="text-[20px] font-semibold text-[var(--color-primary)]">Travel Assistant</h1>
        <p className="text-[13px] text-[#888888]">Tell me about your dream destination...</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-[16px] mb-[20px] pr-2">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 w-full mt-auto">
        <input
          type="text"
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
            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-neutral)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          className="text-[14px] font-medium text-white transition-colors duration-200 cursor-pointer min-h-[44px]"
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
