'use client';

import React from 'react';

export interface RadarDataPoint {
  area: string;
  affinity: number; // 0 to 100
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  selectedArea?: string;
  onAreaClick?: (area: string) => void;
  accentColor?: string;
  fillColor?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 280,
  accentColor = '#A35139', // Truffle Trouble / terracotta default
  fillColor = 'rgba(163, 81, 57, 0.25)',
}) => {
  const center = size / 2;
  const radius = (size - 90) / 2;
  const totalAxes = 6;

  // Grid level ratios (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate angle for axis i (top is -90 degrees)
  const getAngle = (index: number) => {
    return (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
  };

  // Get Cartesian coordinates (x, y)
  const getCoordinates = (index: number, ratio: number) => {
    const angle = getAngle(index);
    const r = radius * Math.min(1.0, Math.max(0.0, ratio));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build SVG polygon points
  const getPolygonPoints = (ratios: number[]) => {
    return ratios
      .map((ratio, i) => {
        const { x, y } = getCoordinates(i, ratio);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const dataRatios = data.map((d) => (d.affinity || 0) / 100);
  const dataPointsString = getPolygonPoints(dataRatios);

  return (
    <div className="flex flex-col items-center justify-center p-1 select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9C1B1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EEE9DF" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Outer Background Hexagon Fill */}
        <polygon
          points={getPolygonPoints(Array(totalAxes).fill(1.0))}
          fill="url(#hexGlow)"
        />

        {/* Concentric Grid Lines */}
        {gridLevels.map((level, idx) => (
          <polygon
            key={idx}
            points={getPolygonPoints(Array(totalAxes).fill(level))}
            fill="none"
            stroke="#C9C1B1"
            strokeWidth={level === 1.0 ? '1.5' : '1.0'}
            strokeDasharray={level < 1.0 ? '2,2' : undefined}
          />
        ))}

        {/* Radial Spokes */}
        {Array.from({ length: totalAxes }).map((_, i) => {
          const outer = getCoordinates(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="#C9C1B1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon Fill */}
        <polygon
          points={dataPointsString}
          fill={fillColor}
          stroke={accentColor}
          strokeWidth="2"
          className="transition-all duration-500 ease-out"
        />

        {/* Data Vertices Dots */}
        {data.map((item, i) => {
          const ratio = (item.affinity || 0) / 100;
          const { x, y } = getCoordinates(i, ratio);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#FFFFFF"
              stroke={accentColor}
              strokeWidth="2"
              className="transition-all duration-500"
            />
          );
        })}

        {/* Area Axis Labels Around Hexagon */}
        {data.map((item, i) => {
          const labelCoords = getCoordinates(i, 1.28);
          const cleanScore = Math.min(100, Math.max(0, Math.round(item.affinity || 0)));

          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (labelCoords.x > center + 12) textAnchor = 'start';
          if (labelCoords.x < center - 12) textAnchor = 'end';

          // Abbreviate long names for compact card display
          let shortName = item.area;
          if (shortName.toLowerCase().includes('desarrollo')) shortName = 'Desarrollo';
          else if (shortName.toLowerCase().includes('cloud')) shortName = 'Cloud/DevOps';
          else if (shortName.toLowerCase().includes('ciencia')) shortName = 'Datos & IA';
          else if (shortName.toLowerCase().includes('calidad')) shortName = 'QA & Testing';
          else if (shortName.toLowerCase().includes('ciberseguridad')) shortName = 'Ciberseguridad';
          else if (shortName.toLowerCase().includes('gestion')) shortName = 'Gestión TI';

          return (
            <g key={i}>
              <text
                x={labelCoords.x}
                y={labelCoords.y - 3}
                textAnchor={textAnchor}
                className="text-[10px] font-semibold fill-slate-700 font-sans tracking-tight"
              >
                {shortName}
              </text>
              <text
                x={labelCoords.x}
                y={labelCoords.y + 9}
                textAnchor={textAnchor}
                className="text-[10px] font-bold fill-abyssal-blue font-mono"
              >
                {cleanScore}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
