'use client';

import './styles.css';
import React, { useState } from 'react';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [matchedImage, setMatchedImage] = useState<string | null>(null);
  const [matchPercent, setMatchPercent] = useState<number | null>(null);
  const [name, setName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImagePath(null);
      setMatchedImage(null);
      setMatchPercent(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setImagePath(null);
    setMatchedImage(null);
    setMatchPercent(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    // Show input image preview immediately
    const localImageUrl = URL.createObjectURL(selectedFile);
    setImagePath(localImageUrl);
    // Call external matching API using axios
    setMatching(true);
    const extFormData = new FormData();
    extFormData.append('file', selectedFile);
    try {
      const matchRes = await axios.post('https://bc06-115-187-43-226.ngrok-free.app/image/recognize', {
        image: extFormData.get('file'),
      }, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const matchData = matchRes.data;
      setMatching(false);
      setMatchedImage(`data:image/png;base64,${matchData.image_base64}`);
      setMatchPercent(Math.round(matchData.confidence * 100));
      setName(matchData.person);
    } catch (e) {
      setMatching(false);
      setMatchedImage(null);
      setMatchPercent(null);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-white p-8 relative overflow-hidden font-sans">
      {/* Aceternity grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="aceternity-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="40" height="40" fill="none" />
              <path d="M0 0H40V40" stroke="#5eead4" strokeWidth="0.5" opacity="0.04" />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="url(#aceternity-grid)" />
        </svg>
      </div>
      {/* Images Row */}
      <div className="flex flex-row items-start w-full max-w-5xl z-10 gap-16">
        {/* Left: Input Preview */}
        <div className="flex flex-col items-center flex-1 min-w-[340px]">
          <div className="w-full aspect-square bg-gradient-to-br from-[#232526] to-[#0f2027] rounded-2xl border border-[#5eead4] flex items-center justify-center relative overflow-hidden min-h-[340px] shadow-xl">
            {imagePath ? (
              <img src={imagePath} alt="Preview" className="object-contain w-full h-full rounded-2xl transition-all duration-500 shadow-[0_0_32px_0_rgba(94,234,212,0.15)]" />
            ) : (
              <span className="text-[#5eead4] text-lg font-semibold tracking-widest opacity-60 animate-pulse select-none font-mono">IMAGE PREVIEW</span>
            )}
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-[#5eead4]/20 animate-futuristic-glow"></div>
          </div>
          {/* Upload controls below left image */}
          <div className="w-full mt-8">
            <label htmlFor="file-upload" className={`w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#5eead4] rounded-xl p-6 hover:border-[#38bdf8] transition-all bg-[#232526]/60 mb-4 ${loading ? 'opacity-40 pointer-events-none' : ''}`}>
              <svg className="w-10 h-10 text-[#5eead4] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
              <span className="text-base font-semibold text-[#5eead4] font-mono">{selectedFile ? selectedFile.name : 'Click to select an image'}</span>
              <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#5eead4] to-[#38bdf8] text-[#232526] font-bold text-lg shadow hover:from-[#38bdf8] hover:to-[#5eead4] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'hidden' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#232526]"></span>
                  <span>Uploading...</span>
                </span>
              ) : (
                'Upload Image'
              )}
            </button>
          </div>
        </div>
        {/* Right: Matched Image */}
        <div className="flex flex-col items-center flex-1 min-w-[340px]">
          <div className="w-full aspect-square bg-gradient-to-br from-[#232526] to-[#0f2027] rounded-2xl border border-[#5eead4] flex items-center justify-center relative overflow-hidden min-h-[340px] shadow-xl">
            {matching ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <svg className="animate-spin w-16 h-16 text-[#5eead4] mb-6 drop-shadow-[0_0_32px_#5eead4aa]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="#5eead4" strokeWidth="4"></circle><path className="opacity-75" fill="#5eead4" d="M4 12a8 8 0 018-8v8z"></path></svg>
                <span className="text-[#5eead4] text-xl font-mono tracking-widest animate-pulse font-semibold">Matching Algorithm...</span>
              </div>
            ) : matchedImage && !matching ? (
              <img src={matchedImage} alt="Matched" className="object-contain w-full h-full rounded-2xl transition-all duration-500 shadow-[0_0_32px_0_rgba(94,234,212,0.25)]" />
            ) : (
              <span className="text-[#5eead4] text-lg font-semibold tracking-widest opacity-60 animate-pulse select-none font-mono">MATCHED IMAGE</span>
            )}
          </div>
          {matchPercent !== null && !matching && (
            <div className='mt-8 flex flex-col items-center'>
              <div className="flex flex-col items-center w-[120px] z-20">
                <GaugeChart
                  id="match-gauge"
                  nrOfLevels={20}
                  colors={["#232526", "#5eead4"]}
                  arcWidth={0.25}
                  percent={matchPercent / 100}
                  textColor="#5eead4"
                  needleColor="#5eead4"
                  needleBaseColor="#232526"
                  animate={true}
                  style={{ width: 120 }}
                  hideText={true}
                />
              </div>
              <div className="flex flex-col gap-2 items-center mt-2">
                <span className="text-[#5eead4] font-mono text-lg tracking-widest font-bold drop-shadow">{name || 'Unknown'}</span>
                <span className="text-[#38bdf8] font-mono text-2xl tracking-widest font-semibold">{matchPercent}%</span>
                <span className="text-[#5eead4] font-mono text-base mt-1 tracking-widest animate-pulse whitespace-nowrap font-semibold">MATCH</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
