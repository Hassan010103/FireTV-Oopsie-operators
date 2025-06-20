
import React from 'react';
import { PeakWatchDataPoint } from '../types';

interface PeakWatchGraphProps {
  peakData: PeakWatchDataPoint[];
  duration: number;
  currentTime: number;
  graphHeight?: number; // Max height of the graph peaks
  baseGraphColor?: string;
  watchedGraphColor?: string;
}

const PeakWatchGraph: React.FC<PeakWatchGraphProps> = ({
  peakData,
  duration,
  currentTime,
  graphHeight = 16, // Default height of 16px for a subtle graph
  baseGraphColor = "rgba(100, 116, 139, 0.5)", // slate-500 with opacity
  watchedGraphColor = "rgba(168, 85, 247, 0.8)" // purple-500 with opacity
}) => {
  if (!peakData || peakData.length === 0 || duration <= 0) {
    return null;
  }

  // Ensure data is sorted by timestampPercent
  const sortedData = [...peakData].sort((a, b) => a.timestampPercent - b.timestampPercent);

  // Normalize intensity to graphHeight
  // Find max intensity to scale graph properly, if not all intensities are 0-1
  const maxIntensityValue = sortedData.reduce((max, p) => Math.max(max, p.intensity), 0);
  const normalizedIntensity = (intensity: number) => {
    if (maxIntensityValue === 0) return graphHeight; // Flat line at bottom if all intensities are 0
    return graphHeight - (intensity / maxIntensityValue) * graphHeight * 0.8; // Use 80% of height for peaks, leaving some base
  };
  
  // Create path data string for the SVG
  let pathD = `M0,${graphHeight}`; // Start at bottom left

  sortedData.forEach(point => {
    const x = point.timestampPercent * 100; // As percentage for viewBox
    const y = normalizedIntensity(point.intensity);
    pathD += ` L${x},${y}`;
  });

  pathD += ` L100,${graphHeight} Z`; // Line to bottom right, then close path

  const currentProgressPercent = (currentTime / duration) * 100;

  return (
    <div className="w-full h-auto relative -mb-1" style={{ height: `${graphHeight}px` }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 16" // Using 16 as the viewBox height to match default graphHeight
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0" // Position it above the seek bar
        aria-hidden="true" // Decorative element
      >
        {/* Base graph */}
        <path d={pathD} fill={baseGraphColor} />

        {/* Watched portion of the graph */}
        <defs>
          <clipPath id="watchedClipPath">
            <rect x="0" y="0" width={currentProgressPercent} height={graphHeight} />
          </clipPath>
        </defs>
        <path
          d={pathD}
          fill={watchedGraphColor}
          clipPath="url(#watchedClipPath)"
        />
      </svg>
    </div>
  );
};

export default PeakWatchGraph;
