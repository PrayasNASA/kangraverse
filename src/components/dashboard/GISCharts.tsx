'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useState, useEffect } from 'react';

// --- MOCK DATA ---
const categoryData = [
  { value: 142, name: 'Temples', itemStyle: { color: '#8B5CF6' } },
  { value: 38, name: 'Monasteries', itemStyle: { color: '#F59E0B' } },
  { value: 89, name: 'Sacred Groves', itemStyle: { color: '#10B981' } },
  { value: 64, name: 'Water Sources', itemStyle: { color: '#0EA5E9' } },
  { value: 12, name: 'Pilgrimage Routes', itemStyle: { color: '#F97316' } }
];

const growthData = {
  years: ['2020', '2021', '2022', '2023', '2024', '2025'],
  values: [45, 92, 156, 210, 285, 345]
};

const elevationData = {
  ranges: ['<500m', '500-1000m', '1000-2000m', '2000m+', '3000m+'],
  values: [45, 120, 156, 82, 24]
};

const commonOptions = (isDark: boolean) => ({
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'var(--font-geist-sans)' },
  tooltip: {
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textStyle: { color: isDark ? '#fff' : '#000' },
    borderRadius: 12,
    padding: [8, 12]
  }
});

export function CategoryDonutChart() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const option = {
    ...commonOptions(isDark),
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Category',
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: isDark ? '#111' : '#fff',
          borderWidth: 2
        },
        label: { show: false },
        data: categoryData
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}

export function DocumentationGrowthChart() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const option = {
    ...commonOptions(isDark),
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: growthData.years,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: isDark ? '#94A3B8' : '#64748B' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      axisLabel: { color: isDark ? '#94A3B8' : '#64748B' }
    },
    series: [
      {
        name: 'Documented Sites',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3, color: '#8B5CF6' },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.4)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0)' }
            ]
          }
        },
        data: growthData.values
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}

export function ElevationDistributionChart() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const option = {
    ...commonOptions(isDark),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: false },
    xAxis: {
      type: 'category',
      data: elevationData.ranges,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: isDark ? '#94A3B8' : '#64748B', interval: 0, fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      axisLabel: { color: isDark ? '#94A3B8' : '#64748B' }
    },
    series: [
      {
        name: 'Sites',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: '#0EA5E9',
          borderRadius: [6, 6, 0, 0]
        },
        data: elevationData.values
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
