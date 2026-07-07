import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS class names safely. Combines `clsx` (conditional classes)
 * with `tailwind-merge` (de-duplicates conflicting Tailwind utilities, last
 * one wins). Use this for every component's `className` / `classNames` prop.
 *
 * @example
 * cn('px-2 py-1', isActive && 'bg-primary', condition && 'hidden')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
