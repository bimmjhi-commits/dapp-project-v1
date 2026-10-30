import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Globe,
  MapPin,
  Server,
  Clock,
  Shield,
  Copy,
  Check,
  RefreshCw,
  Compass,
} from 'lucide-react';

interface IpData {
  ip?: string;
  country?: string;
  country_code?: string;
  region?: string;
  region_name?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
}

interface IpLookupPageProps {
  onBack: () => void;
}

export const IpLookupPage: React.FC<IpLookupPageProps> = ({ onBack }) => {
  const [ipInput, setIpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IpData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getClientPublicIp = async (): Promise<string> => {
    // Strategy 1: ipwho.is auto
    try {
      const res = await fetch('https://ipwho.is/');
      const json = await res.json();
      if (json?.success !== false && json?.ip) return json.ip.trim();
    } catch {}

    // Strategy 2: ipify
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const json = await res.json();
      if (json?.ip) return json.ip.trim();
    } catch {}

    // Strategy 3: ipapi.co
    try {
      const res = await fetch('https://ipapi.co/json/');
      const json = await res.json();
      if (json?.ip) return json.ip.trim();
    } catch {}

    // Strategy 4: api64 ipify
    try {
      const res = await fetch('https://api64.ipify.org?format=json');
      const json = await res.json();
      if (json?.ip) return json.ip.trim();
    } catch {}

    return '';
  };

  const fetchIpInfo = async (targetIp: string) => {
    setLoading(true);
    setError(null);

    let cleanIp = targetIp.trim().replace(/^https?:\/\//i, '').split('/')[0];

    if (!cleanIp) {
      const detected = await getClientPublicIp();
      if (detected) {
        cleanIp = detected;
      }
    }

    // 1. Try ipwho.is (Supports both IPv4, IPv6, and domain names like google.com)
    try {
      const url = cleanIp ? `https://ipwho.is/${encodeURIComponent(cleanIp)}` : 'https://ipwho.is/';
      const res = await fetch(url);
      const json = await res.json();

      if (json && json.success !== false && json.ip) {
        setData({
          ip: json.ip,
          country: json.country,
          country_code: json.country_code,
          region: json.region_code || json.region,
          region_name: json.region,
          city: json.city,
          zip: json.postal,
          lat: json.latitude,
          lon: json.longitude,
          timezone: json.timezone?.id || json.timezone?.utc,
          isp: json.connection?.isp || json.connection?.org,
          org: json.connection?.org || json.connection?.isp,
          as: json.connection?.asn ? `AS${json.connection.asn} ${json.connection.org || json.connection.isp || ''}` : undefined,
        });
        setLoading(false);
        return;
      }
    } catch {}

    // 2. Fallback to ipapi.co
    try {
      const url = cleanIp ? `https://ipapi.co/${encodeURIComponent(cleanIp)}/json/` : 'https://ipapi.co/json/';
      const res = await fetch(url);
      const json = await res.json();

      if (json && !json.error && json.ip) {
        setData({
          ip: json.ip,
          country: json.country_name,
          country_code: json.country_code,
          region: json.region_code,
          region_name: json.region,
          city: json.city,
          zip: json.postal,
          lat: json.latitude,
          lon: json.longitude,
          timezone: json.timezone,
          isp: json.org || json.asn,
          org: json.org,
          as: json.asn ? `${json.asn} ${json.org || ''}` : undefined,
        });
        setLoading(false);
        return;
      }
    } catch {}

    // 3. Fallback to Sylvatica Proxy API
    try {
      const proxyUrl = `/api/info/iplookup?ip=${encodeURIComponent(cleanIp)}`;
      const res = await fetch(proxyUrl);
      const json = await res.json();
      const result = json?.result || json?.data;

      if (json && json.status === true && result && result.ip) {
        setData(result);
        setLoading(false);
        return;
      }
    } catch {}

    setError('Gagal memuat data IP real-time. Pastikan IP / domain valid.');
    setLoading(false);
  };

  useEffect(() => {
    fetchIpInfo('');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIpInfo(ipInput);
  };

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] !bg-none selection:bg-indigo-500 selection:text-white pb-32 relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 relative z-10 space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[18px] bg-white/5 backdrop-blur-lg border border-white/10 text-xs font-bold text-white transition-all hover:bg-white/10 active:scale-95 cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI</span>
          </button>

          <span className="text-[10px] sm:text-xs font-bold px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 backdrop-blur-md uppercase tracking-widest">
            Network Intelligence // v2.0
          </span>
        </div>

        {/* Main Title Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-inner shrink-0">
              <Globe className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl tracking-tight text-white uppercase">
                IP LOOKUP
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Lacak Geografi & Network Provider secara Real-Time
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <label htmlFor="ip-input" className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
              INPUT ALAMAT IP
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <input
                  id="ip-input"
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="180.252.12.34 (Kosongkan untuk IP Saya)"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer grow sm:grow-0"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>SEARCH</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setIpInput('');
                    fetchIpInfo('');
                  }}
                  className="px-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center cursor-pointer"
                  title="Deteksi IP Saya"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Shield className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase">{error}</span>
          </div>
        )}

        {/* Result Cards */}
        {data && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Main IP Badge */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] block mb-1">
                  DETEKSI IP PUBLIK
                </span>
                <span className="font-bold text-3xl sm:text-4xl text-white tracking-tight break-all">
                  {data.ip || '---.---.---.---'}
                </span>
              </div>

              {data.ip && (
                <button
                  type="button"
                  onClick={() => handleCopy(data.ip || '', 'ip')}
                  className="relative flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
                >
                  {copiedKey === 'ip' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>TERSALIN</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>SALIN IP</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lokasi Card */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-sm text-white uppercase tracking-wider">
                    LOKASI GEOGRAFIS
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Negara', value: `${data.country || '-'} ${data.country_code ? `(${data.country_code})` : ''}` },
                    { label: 'Wilayah', value: data.region_name || data.region || '-' },
                    { label: 'Kota', value: data.city || '-' },
                    { label: 'Kode Pos', value: data.zip || '-' },
                    { label: 'Koordinat', value: data.lat !== undefined && data.lon !== undefined ? `${data.lat}, ${data.lon}` : '-' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="text-sm font-bold text-white text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jaringan Card */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-sm text-white uppercase tracking-wider">
                    PROVIDER & NETWORK
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'ISP', value: data.isp || '-' },
                    { label: 'Organisasi', value: data.org || '-' },
                    { label: 'AS Number', value: data.as || '-' },
                    { label: 'Zona Waktu', value: data.timezone || '-' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="text-sm font-bold text-white truncate" title={String(item.value)}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">TERVERIFIKASI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
