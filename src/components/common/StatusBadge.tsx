import React from 'react';
import { ExpiryStatus, StockStatus } from '../../types';

interface StatusBadgeProps {
  type: 'expiry' | 'stock';
  status: ExpiryStatus | StockStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status, label, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  if (type === 'expiry') {
    switch (status) {
      case 'expired':
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-red-100 text-red-800 border border-red-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse" />
            {label || 'Expired'}
          </span>
        );
      case 'critical':
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
            {label || '< 30 Days'}
          </span>
        );
      case 'warning':
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            {label || '30-90 Days'}
          </span>
        );
      case 'safe':
      default:
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            {label || 'Safe'}
          </span>
        );
    }
  }

  // Stock status
  switch (status) {
    case 'out_of_stock':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-red-100 text-red-800 border border-red-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5" />
          {label || 'Out of Stock'}
        </span>
      );
    case 'low_stock':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
          {label || 'Low Stock'}
        </span>
      );
    case 'overstocked':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
          {label || 'Overstocked'}
        </span>
      );
    case 'healthy':
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          {label || 'In Stock'}
        </span>
      );
  }
};
