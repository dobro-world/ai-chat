import { useEffect, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import type { KeyboardEvent } from 'react';
import './App.css'

type Message = {
  id: string; 
  role: 'user' | 'assistant'; 
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const [textArea, setTextArea] = useState('');

  const sendMessage = () => {
    const text = textArea.trim();
    if (!text) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: text,
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: 'я пока не умею',
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setTextArea('');
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='app'>
      <aside className='sidebar'>
        sidebar
      </aside>
      <main className='chat'>
        <section className='messages' ref={messagesRef}>
          <ul>
            {messages.map((mess) => (
              <li key={mess.id}>{mess.text}</li>
            ))}
          </ul>
        </section>
        <form className='composer' onSubmit={handleSubmit}>
          <textarea placeholder='type message here' value={textArea} onChange={(e) => setTextArea(e.target.value)} onKeyDown={handleKeyDown}></textarea>
          <button type='submit'>Send</button>
        </form>
      </main>
    </div>
  );
}