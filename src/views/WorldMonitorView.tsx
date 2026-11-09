import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Globe,
  Radio,
  Clock,
  Compass,
  Layers,
  MapPin,
  RefreshCw,
  ExternalLink,
  Satellite,
  Activity,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { HotspotLocation, NewsItem } from '../types';
import { worldMonitorService } from '../services/worldMonitorService';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const WorldMonitorView: React.FC = () => {
  const [hotspots, setHotspots] = useState<HotspotLocation[]>(worldMonitorService.getHotspots());
  const [news, setNews] = useState<NewsItem[]>(worldMonitorService.getNews());
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotLocation | null>(hotspots[0]);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [utcTime, setUtcTime] = useState('');
  const [selectedNewsCat, setSelectedNewsCat] = useState<string>('all');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const { showToast } = useToast();

  useEffect(() => {
    return worldMonitorService.subscribe(() => {
      setHotspots(worldMonitorService.getHotspots());
      setNews(worldMonitorService.getNews());
    });
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(`${now.toUTCString().slice(17, 25)} UTC · MJD ${(now.getTime() / 86400000 + 40587).toFixed(1)}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Three.js 3D Globe Initialization
  useEffect(() => {
    if (viewMode !== '3d' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Detect software GL
    const gl = document.createElement('canvas').getContext('webgl2');
    const isSoftwareGl = (() => {
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 1. Procedural Wireframe Sphere
    const sphereRadius = 75;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x071522,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 2. Inner glow shell
    const innerGeo = new THREE.SphereGeometry(sphereRadius - 1.5, 32, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.04
    });
    globeGroup.add(new THREE.Mesh(innerGeo, innerMat));

    // 3. Atmosphere glow ring
    const ringGeo = new THREE.RingGeometry(sphereRadius + 1, sphereRadius + 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    globeGroup.add(ringMesh);

    // 4. Procedural latitude/longitude grids
    const latLinesGroup = new THREE.Group();
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = Math.sin(phi) * sphereRadius;
      const y = Math.cos(phi) * sphereRadius;
      const circleGeo = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
      }
      circleGeo.setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.12
      });
      latLinesGroup.add(new THREE.Line(circleGeo, lineMat));
    }
    globeGroup.add(latLinesGroup);

    // 5. Geographic Hotspot Markers
    hotspots.forEach(hot => {
      const phi = (90 - hot.lat) * (Math.PI / 180);
      const theta = (hot.lng + 180) * (Math.PI / 180);
      const x = -(sphereRadius * Math.sin(phi) * Math.cos(theta));
      const z = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const y = sphereRadius * Math.cos(phi);

      // Marker point
      const pinGeo = new THREE.SphereGeometry(1.8, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({
        color: hot.status === 'online' ? 0x00d9ff : 0xf59e0b
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(x, y, z);
      globeGroup.add(pin);

      // Marker stem
      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(x * 1.1, y * 1.1, z * 1.1)
      ]);
      const stemMat = new THREE.LineBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.6
      });
      globeGroup.add(new THREE.Line(stemGeo, stemMat));
    });

    // 6. Orbital Satellite Trajectory
    const satOrbitCurve = new THREE.EllipseCurve(0, 0, 105, 95, 0, 2 * Math.PI, false, 0);
    const orbitPoints = satOrbitCurve.getPoints(64).map(p => new THREE.Vector3(p.x, p.y * 0.4, p.y * 0.9));
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 3,
      gapSize: 2,
      transparent: true,
      opacity: 0.4
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    globeGroup.add(orbitLine);

    // Mouse drag rotation controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      globeGroupRef.current.rotation.y += deltaX * 0.006;
      globeGroupRef.current.rotation.x += deltaY * 0.006;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      if (globeGroupRef.current && !isDraggingRef.current) {
        globeGroupRef.current.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
    };
  }, [viewMode, hotspots]);

  const handlePingNode = (node: HotspotLocation) => {
    voiceService.playSfx('pulse');
    const newLat = worldMonitorService.pingNode(node.id);
    setSelectedHotspot(node);
    showToast('Node Pinged', `${node.name}: ${newLat}ms response time`, 'info');
  };

  const handleZoom = (inOut: 'in' | 'out') => {
    if (!cameraRef.current) return;
    voiceService.playSfx('click');
    const targetZ = inOut === 'in' ? 180 : 300;
    cameraRef.current.position.z = Math.max(160, Math.min(320, cameraRef.current.position.z + (inOut === 'in' ? -25 : 25)));
  };

  const filteredNews = news.filter(
    n => selectedNewsCat === 'all' || n.category === selectedNewsCat
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              World Monitor &amp; Planetary Sensor Array
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              8 NODES TRACKED
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            {utcTime} · Autonomous geographic relay telemetry and global cybersecurity feed.
          </p>
        </div>

        {/* View Toggle (3D Globe vs 2D Map) */}
        <div className="flex items-center gap-2 bg-[#05090D] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => {
              setViewMode('3d');
              voiceService.playSfx('click');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              viewMode === '3d'
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                : 'text-[#8295A7] hover:text-[#F2F7FA]'
            }`}
          >
            3D Globe View
          </button>
          <button
            onClick={() => {
              setViewMode('2d');
              voiceService.playSfx('click');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              viewMode === '2d'
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                : 'text-[#8295A7] hover:text-[#F2F7FA]'
            }`}
          >
            2D Command Grid
          </button>
        </div>
      </div>

      {/* Main Globe & Location Intelligence Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3D Globe / 2D Map Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-xl bg-[#071522] border border-[#00D9FF]/25 shadow-[0_0_35px_rgba(0,217,255,0.06)] relative overflow-hidden min-h-[480px]">
          {/* Top Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#05090D]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-[#8295A7]">
            <Satellite className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span className="text-[#F2F7FA]">ORBIT: LEO CONST-8</span>
            <span>·</span>
            <span>ALT: 550 KM</span>
          </div>

          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded-lg bg-[#05090D]/80 border border-white/10 hover:border-[#00D9FF]/40 text-[#8295A7] hover:text-[#00D9FF] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded-lg bg-[#05090D]/80 border border-white/10 hover:border-[#00D9FF]/40 text-[#8295A7] hover:text-[#00D9FF] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* 3D WebGL Canvas or 2D Map Container */}
          {viewMode === '3d' ? (
            <div
              ref={containerRef}
              className="w-full flex-1 min-h-[460px] cursor-grab active:cursor-grabbing"
            />
          ) : (
            <div className="w-full flex-1 min-h-[460px] p-6 flex flex-col justify-center items-center stonic-grid-bg">
              {/* 2D Cyber Map Visualization */}
              <div className="w-full max-w-2xl aspect-[2/1] rounded-lg bg-[#05090D] border border-[#00D9FF]/30 p-6 relative flex flex-col justify-between">
                <div className="flex justify-between text-[11px] font-mono text-[#8295A7]">
                  <span>MERCATOR CYBERNETIC PROJECTION</span>
                  <span className="text-[#00D9FF]">GLOBAL RELAY ACTIVE</span>
                </div>

                {/* 2D Node Plotting */}
                <div className="relative w-full h-48 border border-white/5 rounded bg-black/40">
                  {hotspots.map(h => {
                    const left = `${((h.lng + 180) / 360) * 100}%`;
                    const top = `${((90 - h.lat) / 180) * 100}%`;
                    return (
                      <div
                        key={h.id}
                        onClick={() => handlePingNode(h)}
                        style={{ left, top }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        title={`${h.name} (${h.country}) - ${h.latencyMs}ms`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${
                            h.status === 'online'
                              ? 'bg-[#00D9FF] border-[#071522] shadow-[0_0_8px_#00D9FF]'
                              : 'bg-amber-400 border-[#071522] shadow-[0_0_8px_#F59E0B]'
                          } group-hover:scale-125 transition-transform`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="text-center text-xs font-mono text-[#8295A7]">
                  Click any hotspot point to inspect telemetry packet response
                </div>
              </div>
            </div>
          )}

          {/* Bottom Hotspots Mini Strip */}
          <div className="p-3 bg-[#05090D]/90 border-t border-[#00D9FF]/15 flex items-center gap-3 overflow-x-auto z-10">
            <span className="text-[11px] font-mono text-[#8295A7] shrink-0">Nodes:</span>
            {hotspots.map(h => (
              <button
                key={h.id}
                onClick={() => handlePingNode(h)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedHotspot?.id === h.id
                    ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                    : 'text-[#8295A7] hover:text-[#F2F7FA] hover:bg-white/5'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    h.status === 'online' ? 'bg-[#00D9FF]' : 'bg-amber-400'
                  }`}
                />
                <span>{h.name}</span>
                <span className="text-[10px] opacity-75">{h.latencyMs}ms</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Node Details & Global News (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Node Inspector */}
          {selectedHotspot && (
            <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D9FF]">
                  NODE TELEMETRY
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    selectedHotspot.status === 'online'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  {selectedHotspot.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-semibold text-[#F2F7FA] font-display">
                {selectedHotspot.name}
              </h3>
              <p className="text-xs text-[#8295A7] font-mono mb-3">
                {selectedHotspot.country} · {selectedHotspot.lat.toFixed(2)}° N,{' '}
                {selectedHotspot.lng.toFixed(2)}° E
              </p>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-4">
                {selectedHotspot.details}
              </p>

              <div className="p-3 rounded-lg bg-[#05090D] border border-white/5 flex items-center justify-between text-xs font-mono mb-4">
                <span className="text-[#8295A7]">Roundtrip Ping:</span>
                <span className="text-[#00D9FF] font-semibold text-sm">
                  {selectedHotspot.latencyMs} ms
                </span>
              </div>

              <button
                onClick={() => handlePingNode(selectedHotspot)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-xs font-mono transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Probe Node Latency</span>
              </button>
            </div>
          )}

          {/* Global Cyber & AI News Stream */}
          <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#F2F7FA] font-display">
                Global Telemetry News
              </h3>
              <span className="text-[10px] font-mono text-[#8295A7]">SYNCHRONIZED</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {filteredNews.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#071522] border border-white/5 hover:border-[#00D9FF]/30 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-[#00D9FF] uppercase">{item.source}</span>
                    <span className="text-[#8295A7]">{item.timeAgo}</span>
                  </div>
                  <h4 className="text-xs font-medium text-[#F2F7FA] font-display mb-1 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#8295A7] font-sans line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
