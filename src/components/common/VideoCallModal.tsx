import React, { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, ShieldCheck, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoCallModal: React.FC = () => {
  const { isVideoCallOpen, setIsVideoCallOpen, videoCallDog } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'Dr. Vance', text: 'Hello! I have Aurelius here playing right now. Can you see him clearly?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isVideoCallOpen || !videoCallDog) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'You', text: inputMsg }]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: videoCallDog.seller.name, text: 'He is so energetic! Would you like me to show his paws and teeth up close?' }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#242424]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#242424] border border-[#5B3A29] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#1a1a1a] border-b border-[#333333] flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D64545] animate-pulse"></div>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Live HD Breeder Session • 1080p 60fps
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#2F7D68] font-bold bg-[#2F7D68]/20 px-3 py-1 rounded-full border border-[#2F7D68]/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D68]" /> Verified Breeder: {videoCallDog.seller.name}
            </span>
            <button onClick={() => setIsVideoCallOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Video Stream simulation */}
          {!isVideoOff ? (
            <video
              autoPlay
              loop
              muted
              src={videoCallDog.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-happy-golden-retriever-dog-running-41584-large.mp4"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-zinc-400 text-xs font-mono flex flex-col items-center space-y-2">
              <VideoOff className="w-12 h-12 text-zinc-600" />
              <span>Breeder Video Feed Paused</span>
            </div>
          )}

          {/* Self Camera PIP */}
          <div className="absolute top-4 right-4 w-36 h-24 rounded-2xl bg-[#1a1a1a] border-2 border-[#D89B5B] shadow-2xl overflow-hidden hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Buyer Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-2 text-[9px] font-bold text-[#5B3A29] bg-[#D89B5B] px-1.5 py-0.5 rounded">You</div>
          </div>

          {/* Dog Details overlay tag */}
          <div className="absolute top-4 left-4 bg-[#242424]/90 backdrop-blur-md p-3 rounded-2xl border border-[#482E20] flex items-center space-x-3">
            <img src={videoCallDog.images[0]} alt={videoCallDog.name} className="w-10 h-10 rounded-xl object-cover border border-[#482E20]" />
            <div>
              <h5 className="font-bold text-white text-xs">{videoCallDog.name}</h5>
              <p className="text-[10px] text-[#D89B5B] font-bold">{videoCallDog.breed} • Health: {videoCallDog.health.healthScore}/100</p>
            </div>
          </div>

          {/* Live Chat Overlay Drawer */}
          {showChat && (
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#1f1f1f]/95 border-l border-[#333333] p-4 flex flex-col justify-between z-20">
              <div className="space-y-3 overflow-y-auto max-h-[80%] pr-1">
                <h5 className="text-xs font-bold text-white border-b border-[#333333] pb-2">Session Chat</h5>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-[#D89B5B]">{msg.sender}: </span>
                    <span className="text-zinc-200">{msg.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex gap-1 pt-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3d3d3d] rounded-xl py-1.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#2F7D68]"
                />
                <button type="submit" className="p-2 bg-[#2F7D68] hover:bg-[#246252] rounded-xl text-white font-bold cursor-pointer transition-colors">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Video Call Controls Bar */}
        <div className="p-4 bg-[#1a1a1a] border-t border-[#333333] flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full border transition-colors cursor-pointer ${
              isMuted ? 'bg-[#D64545] text-white border-[#D64545]' : 'bg-[#333333] text-zinc-300 border-[#444444] hover:bg-[#444444]'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-full border transition-colors cursor-pointer ${
              isVideoOff ? 'bg-[#D64545] text-white border-[#D64545]' : 'bg-[#333333] text-zinc-300 border-[#444444] hover:bg-[#444444]'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 rounded-full bg-[#333333] border border-[#444444] text-zinc-300 hover:bg-[#444444] transition-colors relative cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsVideoCallOpen(false)}
            className="px-6 py-3 rounded-xl bg-[#D64545] hover:bg-[#b53232] text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-xs transition-transform hover:scale-105 cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Stream</span>
          </button>
        </div>
      </div>
    </div>
  );
};
