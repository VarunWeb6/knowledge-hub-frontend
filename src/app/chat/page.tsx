'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SendHorizonal } from 'lucide-react';

// Message interface to store chat history
interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: ChatMessage = { id: messages.length + 1, role: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/chat/ask', { queryText: newUserMessage.content });
      const { answer, sources } = response.data;
      
      const newAssistantMessage: ChatMessage = { 
        id: messages.length + 2, 
        role: 'assistant', 
        content: answer, 
        sources: sources || [] 
      };
      setMessages(prev => [...prev, newAssistantMessage]);
      
    } catch (err) {
      setError("Failed to get a response from the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex-grow p-6 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Ask a question about your documents...</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <CardContent className="p-4">
                <p className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}:</p>
                <p className="mt-1">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs">
                    <p className="font-semibold">Sources:</p>
                    <ul className="list-disc list-inside">
                      {msg.sources.map((source, index) => (
                        <li key={index}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <p className="text-gray-500 italic">AI is thinking...</p>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-white border-t border-gray-200">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            className="flex-grow"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}