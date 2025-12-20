type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const levelColors: Record<LogLevel, string> = {
  info: '\x1b[36m',   // cyan
  warn: '\x1b[33m',   // yellow
  error: '\x1b[31m',  // red
  debug: '\x1b[35m',  // magenta
};

function formatMessage(level: LogLevel, message: string) {
  const timestamp = new Date().toISOString();
  const color = levelColors[level] || '';
  const reset = '\x1b[0m';
  return `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`;
}

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.info(formatMessage('info', message), ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(formatMessage('warn', message), ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(formatMessage('error', message), ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.DEBUG) {
      console.debug(formatMessage('debug', message), ...args);
    }
  },
}; 