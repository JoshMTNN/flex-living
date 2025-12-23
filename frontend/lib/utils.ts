import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getRatingColor(rating: number | null): string {
  if (rating === null) return 'text-muted-foreground';
  if (rating >= 4.5) return 'text-emerald-500';
  if (rating >= 4) return 'text-emerald-400';
  if (rating >= 3) return 'text-amber-400';
  return 'text-red-400';
}

export function getRatingBgColor(rating: number | null): string {
  if (rating === null) return 'bg-muted';
  if (rating >= 4.5) return 'bg-emerald-500/30';
  if (rating >= 4) return 'bg-emerald-400/20';
  if (rating >= 3) return 'bg-amber-400/20';
  return 'bg-red-400/20';
}
