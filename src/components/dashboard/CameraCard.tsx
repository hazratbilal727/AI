import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, ShieldCheck } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useToast } from '../common/Toast';

export const CameraCard: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [hasWebcam, setHasWebcam] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { showToast } = useToast();

  const toggleCamera = async () => {
    voiceService.playSfx('click');

    if (isActive) {
      // Turn off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      setIsActive(false);
      setHasWebcam(false);
      showToast('Optical Sensor Suspended', 'Camera feed set to offline', 'info');
    } else {
      // Try real webcam
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 480, height: 360 }
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setHasWebcam(true);
          setIsActive(true);
          voiceService.playSfx('activate');
          showToast('Optical Feed Online', 'Webcam stream linked to neural vision', 'success');
        } else {
          throw new Error('No webcam API');
        }
      } catch {
        // Fallback to simulated cyber vision HUD
        setIsActive(true);
        setHasWebcam(false);
        voiceService.playSfx('activate');
        showToast('Simulated Sensor Engaged', 'Cybernetic visual tracking active', 'info');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0B1E2E]/80 to-[#071522]/90 border border-[#00D9FF]/20 p-5 flex flex-col justify-between overflow-hidden min-h-[200px] shadow-[0_0_25px_rgba(0,217,255,0.05)]">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D9FF]/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D9FF]/40" />

      {/* Main Content Area */}
      {isActive ? (
        <div className="relative flex-1 flex flex-col items-center justify-center rounded-xl overflow-hidden bg-black/60 border border-[#00D9FF]/30 min-h-[140px]">
          {hasWebcam ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 relative stonic-grid-bg">
              {/* Simulated Cyber Scanner Grid */}
              <div className="w-16 h-16 rounded-lg border border-[#00D9FF]/60 flex items-center justify-center relative animate-pulse">
                <div className="absolute inset-0 border border-dashed border-[#00D9FF]/40 rounded-lg animate-spin" style={{ animationDuration: '8s' }} />
                <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
              </div>
              <div className="mt-3 text-center">
                <div className="text-[10px] font-mono text-[#00D9FF] tracking-wider uppercase">
                  BIOMETRIC_TARGET: USMAN
                </div>
                <div className="text-[9px] font-mono text-emerald-400 mt-0.5">
                  CONFIDENCE: 99.8% · 30 FPS
                </div>
              </div>
            </div>
          )}

          {/* Active HUD overlay tag */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 border border-emerald-500/40 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>OPTICAL STREAM ACTIVE</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#071522] border border-[#00D9FF]/15 flex items-center justify-center mb-3 text-[#8295A7]/70 shadow-inner">
            <CameraOff className="w-8 h-8 text-[#8295A7]/60" />
          </div>
          <span className="text-xs font-mono text-[#8295A7] tracking-wider">
            Camera offline
          </span>
        </div>
      )}

      {/* Floating Toggle Button (Bottom-Right as in screenshot) */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
        <span className="text-[10px] font-mono text-[#8295A7]">
          {isActive ? 'STATUS: STREAMING' : 'STANDBY'}
        </span>

        <button
          onClick={toggleCamera}
          className={`p-2 rounded-full border transition-all duration-200 ${
            isActive
              ? 'bg-[#00D9FF] text-black border-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.4)]'
              : 'bg-[#071522] text-[#00D9FF] border-[#00D9FF]/30 hover:border-[#00D9FF] hover:bg-[#00D9FF]/10'
          }`}
          title={isActive ? 'Turn camera off' : 'Turn camera on'}
        >
          {isActive ? <Camera className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
