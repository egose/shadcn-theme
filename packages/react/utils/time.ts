export function convertToHours(value: string): string;
export function convertToHours(value: string, asNumber: true): number;
export function convertToHours(value: string, asNumber: false): string;
export function convertToHours(value: string, asNumber: boolean = false): string | number {
  let result: number;

  if (!value) {
    result = 0;
  }
  // Check if the input is a valid number without any suffix (e.g., "1.5")
  else if (!isNaN(Number(value))) {
    result = parseFloat(value);
  } else if (value.toLowerCase().endsWith('h')) {
    // Check if it ends with 'h' or 'H' (hours)
    result = parseFloat(value.slice(0, -1));
  } else if (value.toLowerCase().endsWith('m')) {
    // Check if it ends with 'm' or 'M' (minutes)
    const minutes = parseFloat(value.slice(0, -1));
    result = minutes / 60; // Convert minutes to hours
  } else if (value.toLowerCase().endsWith('s')) {
    // Check if it ends with 's' or 'S' (seconds)
    const seconds = parseFloat(value.slice(0, -1));
    result = seconds / 3600; // Convert seconds to hours
  } else {
    // For any other format, return 0
    result = 0;
  }

  // Return the result either as a number or string based on the 'asNumber' option
  return asNumber ? result : String(Number(result.toFixed(17))); // Convert to number to remove trailing zeros
}

export function convertFromHours(value: string): string {
  const hours = parseFloat(value);

  if (isNaN(hours) || hours === 0) {
    return '0';
  }

  if (hours >= 1) {
    return `${hours}h`;
  }

  const minutes = hours * 60;
  if (minutes >= 1) {
    return `${Math.round(minutes)}m`;
  }

  const seconds = hours * 3600;
  return `${Math.round(seconds)}s`;
}

export function convertToWholeFromHours(value: string): string {
  const hours = parseFloat(value);

  if (isNaN(hours) || hours === 0) {
    return '0';
  }

  // Convert to minutes if the value represents a whole number of minutes
  const minutes = hours * 60;
  if (Math.abs(minutes - Math.round(minutes)) < 1e-10) {
    return `${Math.round(minutes)}m`;
  }

  // Convert to seconds if the value represents a whole number of seconds
  const seconds = hours * 3600;
  if (Math.abs(seconds - Math.round(seconds)) < 1e-10) {
    return `${Math.round(seconds)}s`;
  }

  // Otherwise, return the value with the 'h' suffix for hours
  return `${hours}h`;
}
