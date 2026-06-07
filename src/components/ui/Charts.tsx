"use client";

import React from "react";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  glow?: boolean;
}

export function AreaChart({ data, height = 200, glow = true }: ChartProps) {
  if (data.length === 0) return null;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 100); // Pad height to avoid max clipping
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue;

  const width = 600;
  const paddingX = 50;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate points
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A3FF12" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A3FF12" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingY + chartHeight * ratio;
          const val = maxValue - ratio * valueRange;
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 4}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Filled Area */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Glowing Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#A3FF12"
          strokeWidth="3"
          filter={glow ? "url(#glowFilter)" : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Grid X Axis Labels */}
        {points.map((p, idx) => (
          <g key={idx}>
            <line
              x1={p.x}
              y1={height - paddingY}
              x2={p.x}
              y2={height - paddingY + 5}
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <text
              x={p.x}
              y={height - paddingY + 18}
              fill="#9CA3AF"
              fontSize="10"
              textAnchor="middle"
            >
              {p.label}
            </text>
            {/* Interactive dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#050B07"
              stroke="#A3FF12"
              strokeWidth="2.5"
              className="cursor-pointer hover:r-6 transition-all"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function BarChart({ data, height = 200 }: ChartProps) {
  if (data.length === 0) return null;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 100);
  const width = 600;
  const paddingX = 50;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const barWidth = (chartWidth / data.length) * 0.6;
  const spacing = (chartWidth / data.length) * 0.4;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B7FF4A" />
            <stop offset="100%" stopColor="#7CFF6B" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Y Axis line helpers */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = paddingY + chartHeight * ratio;
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
            />
          );
        })}

        {/* Bars */}
        {data.map((d, idx) => {
          const x = paddingX + idx * (barWidth + spacing) + spacing / 2;
          const barHeight = (d.value / maxValue) * chartHeight;
          const y = paddingY + chartHeight - barHeight;

          return (
            <g key={idx} className="group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill="url(#barGrad)"
                className="transition-all duration-300 hover:fill-accent-neon hover:opacity-100 opacity-90 cursor-pointer"
              />
              <text
                x={x + barWidth / 2}
                y={height - paddingY + 18}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="middle"
              >
                {d.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 8}
                fill="#A3FF12"
                fontSize="9"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity font-mono"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
