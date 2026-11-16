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
  const [apiKey, setKey] = useState(localStorage.getItem('api-key') ?? '');
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

  const handleKeySubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const key = apiKey.trim();
    localStorage.setItem('api-key', key);
    setKey(key);
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

  async function requestAnswer(text: string, apiKey: string): Promise<string> {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const body = {
      model: 'openrouter/free',
      messages: [
        {role: 'user', content: text},
      ],
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ошибка ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const answer = data.choices[0].message.content;

    return answer;
  }
  

  return (
    <div className='app'>
      <aside className='sidebar'>
        <form onSubmit={handleKeySubmit}>
          <input type='password' value={apiKey} onChange={(e) => setKey(e.target.value)}></input>
          <button type='submit'>Save</button>
        </form>
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