
import React from 'react';
import { PeakWatchDataPoint } from '../types';

interface PeakMomentsListProps {
  peakData: PeakWatchDataPoint[];
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    let timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (hours > 0) {
        timeString = `${hours.toString().padStart(2, '0')}:${timeString}`;
    }
    return timeString;
};

const PeakMomentsList: React.FC<PeakMomentsListProps> = ({ peakData, duration, onSeek, className = '' }) => {
  const labeledPeaks = peakData.filter(p => p.label && p.label.trim() !== '');

  if (labeledPeaks.length === 0 || duration <= 0) {
    return null;
  }

  return (
    <div className={`mt-4 p-3 bg-slate-800/50 rounded-lg shadow ${className}`}>
      <h3 className="text-md font-semibold text-slate-200 mb-2">Key Moments</h3>
      <ul className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
        {labeledPeaks.map((peak, index) => {
          const peakTimeSeconds = peak.timestampPercent * duration;
          return (
            <li key={index}>
              <button
                onClick={() => onSeek(peakTimeSeconds)}
                className="w-full text-left px-2 py-1.5 text-sm text-sky-300 hover:bg-slate-700 rounded transition-colors"
                title={`Jump to ${peak.label} at ${formatTime(peakTimeSeconds)}`}
              >
                {peak.label} - <span className="text-xs text-slate-400">({formatTime(peakTimeSeconds)})</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PeakMomentsList;
