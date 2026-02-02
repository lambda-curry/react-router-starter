import { closeSync, openSync, writeSync } from 'node:fs';
import { getLogFilePath, touchLogFile } from './logs.server';

/**
 * Writer interface for Ralph task log files
 */
export interface RalphTaskLogWriter {
  logPath: string;
  write: (chunk: string | Uint8Array) => void;
  close: () => void;
}

/**
 * Open a log writer for a task
 * @param taskId - Task ID
 * @returns Log writer instance
 */
export const openRalphTaskLogWriter = (taskId: string): RalphTaskLogWriter => {
  // Ensure directory exists + file name mapping is identical to the viewer.
  const logPath = touchLogFile(taskId);
  const fd = openSync(logPath, 'a');

  return {
    logPath,
    write: chunk => {
      // Keep bytes intact for log streaming.
      if (typeof chunk === 'string') {
        writeSync(fd, chunk);
        return;
      }

      writeSync(fd, chunk);
    },
    close: () => closeSync(fd)
  };
};

/**
 * Resolve the log file path for a task
 * @param taskId - Task ID
 * @returns Absolute path to the log file
 */
export const resolveRalphTaskLogPath = (taskId: string): string => getLogFilePath(taskId);
