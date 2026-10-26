import React, { useState, useEffect, useRef } from 'react';
import { getChatMessages, sendChatMessage, getCurrentUser } from '../lib/storage';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatroom() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const currentUser = getCurrentUser();
  const chatEndRef = useRef(null);

  const loadMessages = () => {
    setMessages(getChatMessages());
  };

  useEffect(() => {
    loadMessages();
    const handleUpdate = () => loadMessages();
    window.addEventListener('chat_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('chat_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const updated = sendChatMessage(input.trim());
    setMessages(updated);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center justify-center relative"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all">
          <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <MessageSquare className="w-5 h-5" />
              <span>在線刷題交流區</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-900/50">
            {messages.map((msg) => {
              const isMe = msg.userId === currentUser.id;
              return (
                <div key={msg.id} className={`flex gap-2.5 items-start ${isMe ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={msg.avatar || currentUser.avatarGif}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-blue-400 shrink-0"
                  />
                  <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                    <span className="text-[10px] text-gray-400 block mb-0.5">{msg.sender} • {msg.time}</span>
                    <div
                      className={`inline-block p-3 rounded-2xl text-xs sm:text-sm ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入訊息交流..."
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}