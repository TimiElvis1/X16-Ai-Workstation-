import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PrivateServer } from '../types';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Terminal, 
  Server, 
  Play, 
  Activity, 
  CheckCircle2, 
  Loader2, 
  Maximize2,
  Minimize2
} from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onServerCreatedByAi?: (newServers: PrivateServer[]) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  onServerCreatedByAi
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      content: "Hello! I am IIN AI, your responsive AI model and network orchestrator. I can generate private servers, run network diagnostic probes, execute code injunctions, or help configure open source automation pipelines. What would you like to build?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ sender: m.sender, content: m.content }))
        })
      });

      const data = await response.json();

      if (data.updatedServers && onServerCreatedByAi) {
        onServerCreatedByAi(data.updatedServers);
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "ai",
        content: data.text || "Action executed cleanly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        functionCalls: data.functionCalls || []
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: "system",
          content: `AI Model Communication Error: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="ai-assistant-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between transition-all duration-300 transform"
    >
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <span className="font-iin-digital text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">IIN</span>
                <span>AI Assistant</span>
              </h3>
              <span className="px-1.5 py-0.2 text-[9px] bg-indigo-950 text-indigo-300 rounded font-mono border border-indigo-800">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Network & Code Injunction Orchestrator</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
        
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 mb-1">
              <span>{msg.sender === 'user' ? 'You' : msg.sender === 'ai' ? 'IIN AI' : 'System'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div 
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : msg.sender === 'system'
                  ? 'bg-red-950/80 border border-red-800 text-red-300'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.content}

              {/* Function Calls Visualization Badges */}
              {msg.functionCalls && msg.functionCalls.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-mono text-cyan-400 font-semibold flex items-center space-x-1">
                    <Terminal className="h-3 w-3" />
                    <span>Executed Model Function Tool:</span>
                  </div>
                  {(msg.functionCalls || []).map((fc) => (
                    <div key={fc.id} className="p-2 bg-slate-900 rounded-lg border border-slate-800/80 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-indigo-300">
                        <span>tool: {fc.name}</span>
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Success</span>
                        </span>
                      </div>
                      <div className="text-slate-400 text-[9px] mt-1 line-clamp-2">
                        args: {JSON.stringify(fc.args)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-indigo-400 text-xs italic p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            <span>SubNet AI model evaluating function tools & parameter script...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Action Prompts */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px]">
        <button
          onClick={() => handleSendMessage("Generate a new private vector DB server named 'Neural-Memory-Node-01'")}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-colors"
        >
          + Gen Vector DB Server
        </button>
        <button
          onClick={() => handleSendMessage("Run a ping network tool diagnostic probe against 10.142.0.12")}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 transition-colors"
        >
          ⚡ Ping 10.142.0.12
        </button>
        <button
          onClick={() => handleSendMessage("Execute HttpPayloadParser code injunction with test JSON payload")}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 transition-colors"
        >
          ▶ Run Http Injunction
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask SubNet AI to generate servers or run tools..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-md shadow-indigo-950"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
