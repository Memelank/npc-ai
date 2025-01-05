import React from 'react';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#E5DDD5',
      }}
    >
      <ChatWindow />
    </div>
  );
};

export default App;
