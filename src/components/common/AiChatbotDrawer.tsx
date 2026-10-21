import React, { useState } from 'react';
import { Sparkles, Bot, Send, X, User, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';

export const AiChatbotDrawer: React.FC = () => {
  const { isChatbotOpen, setIsChatbotOpen, messages, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isChatbotOpen) {
    return (
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-[#5B3A29] hover:bg-[#482E20] text-white font-bold text-xs shadow-xl shadow-[#5B3A29]/25 hover:scale-105 transition-all duration-300 group border border-[#D89B5B]/30 cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-[#D89B5B] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2F7D68] rounded-full animate-ping"></span>
        </div>
        <span>Ask PawBot India</span>
        <Sparkles className="w-4 h-4 text-[#D89B5B] animate-pulse" />
      </button>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input;
    sendMessage(userText, 'user');
    setInput('');
    setIsSending(true);

    try {
      const res = await api.sendAiChat(userText);
      if (res.success && res.data) {
        sendMessage(res.data.reply, 'ai');
        if (res.data.disclaimer) {
          sendMessage(res.data.disclaimer, 'ai');
        }
      } else {
        sendMessage('I am PawBot India! For health or diet queries, please consult a licensed vet.', 'ai');
      }
    } catch {
      sendMessage('PawBot India Assistant is active! How can I assist you with puppies, KCI pedigree, or delivery today?', 'ai');
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    "Tell me about Rajapalayam & TN native breeds",
    "Best apartment dogs in Tamil Nadu under ₹40,000?",
    "How does UPI payment & KCI registration work?",
    "Show AC transport delivery across TN cities"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white border border-[#E8DED3] rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="bg-[#FFF9F2] p-4 border-b border-[#E8DED3] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-[#D89B5B] p-0.5 shadow-xs flex items-center justify-center font-bold">
            <Bot className="w-5 h-5 text-[#5B3A29]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#5B3A29] flex items-center gap-1.5">
              <span>PawBot India Assistant</span>
              <span className="w-2 h-2 rounded-full bg-[#2F7D68] animate-pulse"></span>
            </h4>
            <p className="text-[10px] text-[#6B7280]">Powered by TN Companion Neural Engine</p>
          </div>
        </div>

        <button
          onClick={() => setIsChatbotOpen(false)}
          className="p-1.5 rounded-full hover:bg-[#FFF9F2] text-[#6B7280] hover:text-[#242424] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs bg-[#FFF9F2]/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                msg.sender === 'user'
                  ? 'bg-[#5B3A29] text-white'
                  : 'bg-[#2F7D68]/15 text-[#2F7D68] border border-[#2F7D68]/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl max-w-[78%] ${
                msg.sender === 'user'
                  ? 'bg-[#5B3A29] text-white font-medium rounded-tr-none shadow-xs'
                  : 'bg-white text-[#242424] border border-[#E8DED3] rounded-tl-none shadow-xs'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
              <span className={`text-[9px] block mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-[#6B7280]'}`}>{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-[#FFF9F2] border-t border-[#E8DED3] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(p);
            }}
            className="shrink-0 text-[10px] bg-white hover:bg-[#FFF9F2] text-[#242424] px-2.5 py-1 rounded-full border border-[#E8DED3] flex items-center gap-1 transition-all cursor-pointer shadow-xs"
          >
            <span>{p}</span>
            <ChevronRight className="w-3 h-3 text-[#D89B5B]" />
          </button>
        ))}
      </div>

      {/* Form Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E8DED3] flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask PawBot about puppies, breeds, or vet care..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white border border-[#E8DED3] focus:border-[#2F7D68] focus:ring-2 focus:ring-[#2F7D68]/20 rounded-xl py-2 px-3 text-xs text-[#242424] placeholder-[#6B7280] focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSending}
          className="p-2.5 rounded-xl bg-[#2F7D68] hover:bg-[#246252] text-white shrink-0 font-bold shadow-md transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
};
