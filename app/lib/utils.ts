import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};


// List of sensitive keys to mask
const SENSITIVE_KEYS = [
  'password', 'token', 'accessToken', 'refreshToken', 'idToken', 'secret', 'clientSecret', 'authorization', 'auth', 'email', 'code', 'session', 'cookie', 'apiKey', 'key', 'privateKey', 'publicKey', 'credentialID', 'value', 'otp', 'pin'
];

function maskValue(value: any) {
  if (typeof value === 'string' && value.length > 4) {
    return value.slice(0, 2) + '***' + value.slice(-2);
  }
  if (typeof value === 'string') {
    return '***';
  }
  if (typeof value === 'number') {
    return '***';
  }
  if (typeof value === 'object' && value !== null) {
    return '[MASKED]';
  }
  return '***';
}

export function shallowLog(obj: any, maxDepth = 3, currentDepth = 0): any {
  if (obj === null || typeof obj !== "object" || currentDepth >= maxDepth) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => shallowLog(item, maxDepth, currentDepth + 1));
  }
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (SENSITIVE_KEYS.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey.toLowerCase()))) {
        result[key] = maskValue(obj[key]);
      } else {
        result[key] = shallowLog(obj[key], maxDepth, currentDepth + 1);
      }
    }
  }
  return result;
}

export function logWithContext(context: string, ...args: any[]) {
  console.log(`[${context}]`, ...args);
}

export function withContext(context: string, fn: (...args: any[]) => any) {
  return (...args: any[]) => {
    logWithContext(context, ...args);
    return fn(...args);
  };
}
