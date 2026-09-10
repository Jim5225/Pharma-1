import { Batch, ExpiryStatus, StockStatus } from '../types';

/**
 * Formats a number to Bangladeshi Taka currency format (৳)
 */
export function formatBDT(amount: number, showDecimals = false): string {
  const rounded = showDecimals ? amount.toFixed(2) : Math.round(amount).toString();
  const parts = rounded.split('.');
  
  // Format with South Asian numbering system (lakh/crore) or standard thousands
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `৳${parts.join('.')}`;
}

/**
 * Returns the number of days remaining until expiry.
 * Negative value indicates expired.
 */
export function getDaysUntilExpiry(expiryDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Categorizes expiry based on PRD:
 * - Expired: <= 0 days
 * - Critical: 1 to 30 days
 * - Warning: 31 to 90 days
 * - Safe: > 90 days
 */
export function getExpiryStatus(expiryDateStr: string): ExpiryStatus {
  const days = getDaysUntilExpiry(expiryDateStr);
  if (days <= 0) return 'expired';
  if (days <= 30) return 'critical';
  if (days <= 90) return 'warning';
  return 'safe';
}

/**
 * Returns Stock Status based on current and min levels
 */
export function getStockStatus(currentStock: number, minStock: number, maxStock = 100): StockStatus {
  if (currentStock <= 0) return 'out_of_stock';
  if (currentStock <= minStock) return 'low_stock';
  if (currentStock > maxStock) return 'overstocked';
  return 'healthy';
}

/**
 * Sorts batches using First Expiry, First Out (FEFO) strategy:
 * 1. Available stock > 0 first
 * 2. Unexpired stock first
 * 3. Earliest expiry date first
 */
export function getFEFOBatches(batches: Batch[]): Batch[] {
  return [...batches].sort((a, b) => {
    const aExpired = getDaysUntilExpiry(a.expiryDate) <= 0;
    const bExpired = getDaysUntilExpiry(b.expiryDate) <= 0;
    
    // Put non-expired batches first
    if (!aExpired && bExpired) return -1;
    if (aExpired && !bExpired) return 1;
    
    // If both non-expired (or both expired), sort by expiry date ascending
    const timeA = new Date(a.expiryDate).getTime();
    const timeB = new Date(b.expiryDate).getTime();
    return timeA - timeB;
  });
}

/**
 * Formats ISO date to readable string (e.g. "12 Oct 2026")
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats ISO date to time string (e.g. "10:30 AM")
 */
export function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats ISO date to Date & Time
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  return `${formatDate(dateStr)}, ${formatTime(dateStr)}`;
}
