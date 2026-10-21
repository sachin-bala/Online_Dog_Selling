import React, { useState, useRef } from 'react';
import { RotateCw, Play, Pause, MoveHorizontal } from 'lucide-react';

interface Viewer360Props {
  frames: string[];
  dogName: string;
}

export const Viewer360: React.FC<Viewer360Props> = ({ frames, dogName }) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const intervalRef = useRef<any>(null);

  const totalFrames = frames.length > 0 ? frames.length : 1;

  const toggleAutoSpin = () => {
    if (isAutoSpinning) {
      clearInterval(intervalRef.current);
      setIsAutoSpinning(false);
    } else {
      setIsAutoSpinning(true);
      intervalRef.current = setInterval(() => {
        setCurrentFrameIndex(prev => (prev + 1) % totalFrames);
      }, 200);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 20) {
      if (deltaX > 0) {
        setCurrentFrameIndex(prev => (prev + 1) % totalFrames);
      } else {
        setCurrentFrameIndex(prev => (prev - 1 + totalFrames) % totalFrames);
      }
      dragStartX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const angleDegree = Math.round((currentFrameIndex / totalFrames) * 360);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-white border border-[#E8DED3] flex flex-col justify-between p-4 group select-none shadow-xs">
      {/* Header Overlay */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E8DED3] shadow-xs">
          <RotateCw className="w-3.5 h-3.5 text-[#2F7D68] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-bold text-[#242424] tracking-wide">360° Interactive Studio</span>
        </div>
        <div className="bg-[#FFF9F2] text-[#5B3A29] px-3 py-1 rounded-full border border-[#E8DED3] text-xs font-mono font-bold shadow-xs">
          Rotation Angle: {angleDegree}°
        </div>
      </div>

      {/* Main Image Display with Rotation Gesture */}
      <div 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing p-8"
      >
        <img
          src={frames[currentFrameIndex] || frames[0]}
          alt={`${dogName} 360 View Frame ${currentFrameIndex}`}
          className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-md transition-all duration-150 transform group-hover:scale-105"
        />

        {/* Drag Guidance Banner */}
        <div className="absolute bottom-16 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E8DED3] text-[#5B3A29] text-xs flex items-center space-x-2 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity shadow-xs">
          <MoveHorizontal className="w-4 h-4 text-[#2F7D68] animate-pulse" />
          <span>Drag left or right to inspect 360° posture</span>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="relative z-10 flex items-center justify-between bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl border border-[#E8DED3] shadow-xs">
        <button
          onClick={toggleAutoSpin}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FFF9F2] hover:bg-white text-[#5B3A29] border border-[#E8DED3] text-xs font-bold transition-all shadow-xs"
        >
          {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isAutoSpinning ? 'Pause Rotation' : 'Auto 360 Spin'}</span>
        </button>

        {/* Frame Dots */}
        <div className="flex items-center space-x-1.5">
          {frames.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFrameIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentFrameIndex === idx ? 'bg-[#2F7D68] w-6' : 'bg-[#E8DED3] hover:bg-[#6B7280]'
              }`}
            />
          ))}
        </div>

        <span className="text-[11px] text-[#6B7280] font-mono">
          Frame {currentFrameIndex + 1}/{totalFrames}
        </span>
      </div>
    </div>
  );
};
