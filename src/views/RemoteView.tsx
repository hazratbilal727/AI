import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  QrCode,
  Wifi,
  WifiOff,
  Battery,
  ShieldCheck,
  RefreshCw,
  Plus,
  Send,
  Power
} from 'lucide-react';
import { RemoteDevice } from '../types';
import { initialRemoteDevices } from '../data/mockData';
import { StorageService } from '../services/storage';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const RemoteView: React.FC = () => {
  const [devices, setDevices] = useState<RemoteDevice[]>(() =>
    StorageService.getItem<RemoteDevice[]>('remote_devices', initialRemoteDevices)
  );
  const [isPairingNew, setIsPairingNew] = useState(false);
  const { showToast } = useToast();

  const toggleDevice = (id: string) => {
    voiceService.playSfx('click');
    setDevices(prev => {
      const updated = prev.map(d => {
        if (d.id === id) {
          const nextStatus = d.status === 'connected' ? 'disconnected' : 'connected';
          return {
            ...d,
            status: nextStatus as RemoteDevice['status'],
            lastSeen: nextStatus === 'connected' ? 'Active now' : 'Disconnected'
          };
        }
        return d;
      });
      StorageService.setItem('remote_devices', updated);
      const target = updated.find(d => d.id === id);
      showToast(
        target?.status === 'connected' ? 'Device Connected' : 'Device Disconnected',
        `${target?.name} is now ${target?.status}`,
        target?.status === 'connected' ? 'success' : 'info'
      );
      return updated;
    });
  };

  const handleSimulateCommand = (deviceName: string) => {
    voiceService.playSfx('pulse');
    showToast('Remote Signal Sent', `Dispatched synchronization ping to ${deviceName}`, 'info');
  };

  const getDeviceIcon = (type: RemoteDevice['type']) => {
    switch (type) {
      case 'tablet':
        return <Tablet className="w-5 h-5 text-[#00D9FF]" />;
      case 'desktop':
        return <Laptop className="w-5 h-5 text-indigo-400" />;
      default:
        return <Smartphone className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Stonic Remote Companion Link
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              LOCAL ENCLAVE IPC
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Control your STONIC AI desktop workstation remotely from iOS, Android, or tablet companions.
          </p>
        </div>

        <button
          onClick={() => {
            voiceService.playSfx('activate');
            setIsPairingNew(!isPairingNew);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,217,255,0.25)]"
        >
          <QrCode className="w-4 h-4" />
          <span>{isPairingNew ? 'Hide QR Code' : 'Pair New Companion'}</span>
        </button>
      </div>

      {/* Pairing QR Section if open */}
      {isPairingNew && (
        <div className="p-6 rounded-xl bg-[#0B1927] border border-[#00D9FF]/40 shadow-[0_0_25px_rgba(0,217,255,0.12)] flex flex-col md:flex-row items-center gap-8 animate-fade-in">
          {/* Cyber QR Code */}
          <div className="p-4 rounded-xl bg-[#05090D] border border-[#00D9FF]/50 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Stylized procedural QR geometry */}
              <rect x="0" y="0" width="160" height="160" fill="#05090D" />
              {/* Corner 1 */}
              <rect x="10" y="10" width="40" height="40" fill="none" stroke="#00D9FF" strokeWidth="6" />
              <rect x="22" y="22" width="16" height="16" fill="#00D9FF" />
              {/* Corner 2 */}
              <rect x="110" y="10" width="40" height="40" fill="none" stroke="#00D9FF" strokeWidth="6" />
              <rect x="122" y="22" width="16" height="16" fill="#00D9FF" />
              {/* Corner 3 */}
              <rect x="10" y="110" width="40" height="40" fill="none" stroke="#00D9FF" strokeWidth="6" />
              <rect x="22" y="122" width="16" height="16" fill="#00D9FF" />
              {/* Data matrix dots */}
              <rect x="65" y="15" width="10" height="10" fill="#00D9FF" />
              <rect x="85" y="25" width="10" height="10" fill="#00D9FF" />
              <rect x="65" y="45" width="10" height="10" fill="#168BFF" />
              <rect x="70" y="70" width="20" height="20" fill="#00D9FF" />
              <rect x="100" y="70" width="10" height="10" fill="#168BFF" />
              <rect x="120" y="90" width="10" height="10" fill="#00D9FF" />
              <rect x="65" y="110" width="15" height="15" fill="#00D9FF" />
              <rect x="95" y="120" width="10" height="10" fill="#168BFF" />
              <rect x="115" y="130" width="15" height="15" fill="#00D9FF" />
            </svg>
          </div>

          <div className="space-y-3 max-w-lg">
            <h3 className="text-base font-semibold text-[#F2F7FA] font-display">
              Pairing Stonic Mobile or Tablet App
            </h3>
            <ol className="text-xs font-mono text-[#8295A7] space-y-2 list-decimal list-inside leading-relaxed">
              <li>Launch the STONIC Remote app on your mobile device.</li>
              <li>Ensure your device is connected to the same local Wi-Fi subnet.</li>
              <li>Point camera at the QR code above to exchange cryptographic handshakes.</li>
              <li>Once paired, command inputs are forwarded with AES-GCM-256 integrity.</li>
            </ol>
            <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Trust Local Certificate: SHA-256 Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Connected Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devices.map(dev => (
          <div
            key={dev.id}
            className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              dev.status === 'connected'
                ? 'bg-[#0B1927]/90 border-[#00D9FF]/30 shadow-[0_0_20px_rgba(0,217,255,0.06)]'
                : 'bg-[#071522]/60 border-white/5 opacity-70'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#071522] border border-[#00D9FF]/30 flex items-center justify-center">
                  {getDeviceIcon(dev.type)}
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    dev.status === 'connected'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-neutral-500 bg-white/5 border-white/10'
                  }`}
                >
                  {dev.status}
                </span>
              </div>

              {/* Device Title & IP */}
              <h3 className="text-base font-semibold text-[#F2F7FA] font-display mb-1">
                {dev.name}
              </h3>
              <p className="text-xs text-[#8295A7] font-mono mb-3">
                IP: {dev.ipAddress} · {dev.lastSeen}
              </p>

              {dev.batteryLevel !== undefined && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#8295A7] mb-4">
                  <Battery className="w-4 h-4 text-[#00D9FF]" />
                  <span>Battery: {dev.batteryLevel}%</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSimulateCommand(dev.name)}
                disabled={dev.status !== 'connected'}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#05090D] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#F2F7FA] hover:text-[#00D9FF] transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Ping Link</span>
              </button>

              <button
                onClick={() => toggleDevice(dev.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  dev.status === 'connected'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                    : 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/20'
                }`}
                title={dev.status === 'connected' ? 'Disconnect' : 'Connect'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
