import React, { useState } from 'react';

interface InputBoxProps {
  onSend: (message: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ddd' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd' }}
        placeholder="输入消息..."
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          borderRadius: '20px',
          border: 'none',
          background: '#007BFF',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        发送
      </button>
    </div>
  );
};

export default InputBox;
