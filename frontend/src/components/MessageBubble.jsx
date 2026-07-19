import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}>
      <div
        className="text-[14px] leading-[1.6]"
        style={{
          backgroundColor: isUser ? 'var(--color-accent)' : '#f0f0f0',
          color: isUser ? '#ffffff' : 'var(--color-primary)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '70%',
        }}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
