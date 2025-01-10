// src/components/ChatWindow.tsx

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types';
import MessageComponent from './Message';
import InputBox from './InputBox';
import { fetch } from '@tauri-apps/plugin-http';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const addMessage = (sender: 'user' | 'bot', content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id; // 返回新消息的 ID
  };

  const updateMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, content: msg.content + newContent }
          : msg
      )
    );
  };

  const handleSend = async (content: string) => {
    // 添加用户消息
    addMessage('user', content);

    // 添加一个空的机器人消息，并获取其 ID
    const botMessageId = addMessage('bot', '');

    try {
      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'post',
        mode: "cors",
        body: JSON.stringify({
          model: 'qwen2.5:0.5b',
          messages: [
            {
              role: 'user',
              content: content,
            },
          ],
          stream: false,
        }),
      });

      if (!response.body) {
        throw new Error('响应没有可读的主体');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 假设每个 JSON 对象以换行符分隔
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          const chunk = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1);

          if (chunk) {
            try {
              const parsed = JSON.parse(chunk);
              const botContent = parsed.message.content;

              if (botContent) {
                updateMessage(botMessageId, botContent);
              }

              if (parsed.done) {
                // 如果需要在完成时做些什么，可以在这里处理
              }
            } catch (err) {
              console.error('解析 JSON 出错:', err);
            }
          }

          boundary = buffer.indexOf('\n');
        }
      }

      // 处理剩余的缓冲区
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer.trim());
          const botContent = parsed.message.content;

          if (botContent) {
            updateMessage(botMessageId, botContent);
          }
        } catch (err) {
          console.error('解析 JSON 出错:', err);
        }
      }
    } catch (error) {
      console.error('请求 Ollama 服务出错:', error);
      updateMessage(botMessageId, '抱歉，无法获取回复。');
    }
  };

  useEffect(() => {
    // 滚动到最底部
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        width: '400px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          background: '#F5F5F5',
        }}
      >
        {messages.map((msg) => (
          <MessageComponent key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <InputBox onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
