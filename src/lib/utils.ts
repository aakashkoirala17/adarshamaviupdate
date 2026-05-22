import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import NepaliDate from "nepali-date-converter"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNepaliDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new NepaliDate(d).format("DD MMMM YYYY", "np");
  } catch (e) {
    return dateStr;
  }
}
