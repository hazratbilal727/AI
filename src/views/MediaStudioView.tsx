import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, Image as ImageIcon, Music, Play, Pause, Volume2, 
  Download, Sliders, Maximize2, Crop, Filter, Sparkles, RefreshCw
} from 'lucide-react';
import { initialMediaAssets } from '../data/mockData';
import { MediaAsset } from '../types';
import { playSound } from '../services/voiceService';

export const MediaStudioView: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>(initialMediaAssets);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0].id);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'audio' | 'video'>('all');
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Visual filter state
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [activeVisualFilter, setActiveVisualFilter] = useState<'normal' | 'cyber' | 'holo' | 'matrix'>('normal');

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const filteredAssets = filterType === 'all' 
    ? assets 
    : assets.filter(a => a.type === filterType);

  const toggleAudio = () => {
    playSound('click');
    if (isPlayingAudio) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        // Harmonic sweep
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 2.4);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setIsPlayingAudio(true);

        osc.onended = () => {
          setIsPlayingAudio(false);
        };
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0B1927]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white">MEDIA & SIGNAL STUDIO</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              Asset Synthesis
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal asset staging, procedural audio generation, frequency waveforms, and holographic frame rendering.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#071522] border border-cyan-500/20 rounded-lg p-1 text-xs font-mono">
          {(['all', 'image', 'audio', 'video'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { playSound('click'); setFilterType(tab); }}
              className={`px-3 py-1 rounded transition-colors uppercase ${
                filterType === tab 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Asset Browser */}
        <div className="lg:col-span-4 bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-3 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 text-xs font-mono text-cyan-400">
            <span>REPOSITORY ASSETS</span>
            <span className="text-slate-500">{filteredAssets.length} items</span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredAssets.map(asset => {
              const isSelected = asset.id === selectedAssetId;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedAssetId(asset.id);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_12px_rgba(0,217,255,0.15)]'
                      : 'bg-[#071522] border-cyan-500/10 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`p-2 rounded bg-black/40 border ${
                      asset.type === 'audio' ? 'text-amber-400 border-amber-500/30' :
                      asset.type === 'video' ? 'text-purple-400 border-purple-500/30' :
                      'text-cyan-400 border-cyan-500/30'
                    }`}>
                      {asset.type === 'audio' ? <Music className="w-4 h-4" /> :
                       asset.type === 'video' ? <Film className="w-4 h-4" /> :
                       <ImageIcon className="w-4 h-4" />}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-white truncate max-w-[140px]">{asset.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">{asset.type} • {asset.size}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-black/30 px-1.5 py-0.5 rounded">
                    {asset.resolution}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-cyan-500/20">
            <button
              onClick={() => {
                playSound('activate');
                const newAsset: MediaAsset = {
                  id: `asset-${Date.now()}`,
                  title: `Render_${Math.floor(Math.random()*9000+1000)}.png`,
                  type: 'image',
                  resolution: '3840x2160',
                  size: '4.8 MB',
                  createdAt: 'Just now',
                  url: ''
                };
                setAssets(prev => [newAsset, ...prev]);
                setSelectedAssetId(newAsset.id);
              }}
              className="w-full py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase hover:bg-cyan-500/25 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Synthesize New Asset
            </button>
          </div>
        </div>

        {/* Right: Studio Canvas & Inspector */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Main Visualizer Stage */}
          <div className="bg-[#071522] border border-cyan-500/30 rounded-xl p-4 shadow-xl flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
            {/* Ambient grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* If audio asset */}
            {selectedAsset.type === 'audio' ? (
              <div className="w-full max-w-md p-6 bg-[#0B1927]/90 border border-amber-500/30 rounded-xl text-center space-y-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                  <Music className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">{selectedAsset.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Procedural Harmonic Frequency: 432 Hz - 864 Hz</p>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center justify-center gap-1 h-16">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlayingAudio 
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' 
                          : 'bg-slate-700'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(12, Math.sin(i * 0.5 + Date.now()) * 48 + 20)}px` : '10px'
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={toggleAudio}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 text-black font-semibold text-xs font-mono uppercase hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                    {isPlayingAudio ? 'Stop Synthesis' : 'Synthesize Audio Wave'}
                  </button>
                </div>
              </div>
            ) : (
              /* Image / Video Canvas */
              <div 
                className={`relative border border-cyan-500/40 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,217,255,0.15)] flex items-center justify-center transition-all ${
                  aspectRatio === '16:9' ? 'w-[480px] h-[270px]' :
                  aspectRatio === '4:3' ? 'w-[400px] h-[300px]' :
                  'w-[300px] h-[300px]'
                } ${
                  activeVisualFilter === 'cyber' ? 'hue-rotate-90 contrast-125' :
                  activeVisualFilter === 'holo' ? 'invert brightness-125' :
                  activeVisualFilter === 'matrix' ? 'hue-rotate-180 saturate-200' : ''
                }`}
                style={{
                  background: 'radial-gradient(circle, rgba(0,217,255,0.2) 0%, rgba(7,21,34,0.95) 100%)'
                }}
              >
                {/* Simulated Wireframe Blueprint / Visual Asset */}
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-xl border border-cyan-400/40 bg-cyan-950/60 mx-auto flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="text-sm font-bold text-white font-mono tracking-wider">{selectedAsset.title}</div>
                  <div className="text-[11px] font-mono text-cyan-400">
                    Canvas Buffer: {selectedAsset.resolution} • RGBA-32bit
                  </div>
                </div>

                {/* HUD Corner Reticles */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400">HUD.REC [00:14:28]</div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-cyan-400">FPS: 60.0</div>
              </div>
            )}
          </div>

          {/* Canvas Controls Bar */}
          <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Aspect ratio */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Crop className="w-3.5 h-3.5 text-cyan-400" />
                Aspect:
              </span>
              {(['16:9', '4:3', '1:1'] as const).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => { playSound('click'); setAspectRatio(ratio); }}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    aspectRatio === ratio ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Filter selection */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Filter:
              </span>
              {(['normal', 'cyber', 'holo', 'matrix'] as const).map(flt => (
                <button
                  key={flt}
                  onClick={() => { playSound('click'); setActiveVisualFilter(flt); }}
                  className={`px-2 py-0.5 rounded text-[11px] uppercase ${
                    activeVisualFilter === flt ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                playSound('complete');
                alert(`Exporting ${selectedAsset.title} at ${selectedAsset.resolution}...`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
