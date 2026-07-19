
const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-pop`}>
      <div
        className={`text-sm leading-relaxed px-4 py-3 rounded-xl max-w-[70%] ${
          isUser ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-950'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
