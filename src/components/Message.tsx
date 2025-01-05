import React from 'react';
import { Message } from '../types';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        margin: '10px 0',
      }}
    >
      <div
        style={{
          background: message.sender === 'user' ? '#DCF8C6' : '#FFF',
          padding: '10px',
          borderRadius: '10px',
          maxWidth: '60%',
          boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        }}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageComponent;
