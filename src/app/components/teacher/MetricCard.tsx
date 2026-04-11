import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  trend?: { value: string; isPositive: boolean };
  isPurple?: boolean;
}

export function MetricCard({ title, value, subtext, icon, trend, isPurple = false }: MetricCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
        isPurple ? 'border-[#8b5cf6] shadow-purple-200' : 'border-transparent'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPurple ? 'bg-[#8b5cf6]' : 'bg-[#0ea5e9]'}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend.isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        {title}
      </h3>
      <p className="text-3xl font-bold text-[#1e293b] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {value}
      </p>
      <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
        {subtext}
      </p>
    </div>
  );
}
