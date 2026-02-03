#!/usr/bin/env bun
/**
 * Check Task Status
 *
 * Checks if a specific Beads task has a certain status or label.
 * Returns exit code 0 if found, 1 if missing.
 *
 * Usage:
 *   bun check-task-status.ts <task-id> <status|label>
 */

import { spawnSync } from 'node:child_process';

const [id, signal] = process.argv.slice(2);

if (!id || !signal) {
  console.error('Usage: bun check-task-status.ts <id> <signal>');
  process.exit(2);
}

try {
  const result = spawnSync('bd', ['show', id, '--json'], { encoding: 'utf-8' });
  if (result.status !== 0) {
    console.error(`Error: Task ${id} not found.`);
    process.exit(1);
  }

  if (!result.stdout) {
    process.exit(1);
  }

  const task = JSON.parse(result.stdout) as { status?: string; labels?: string[] } | null;
  const found = !!task && (task.status === signal || !!(task.labels && task.labels.includes(signal)));

  process.exit(found ? 0 : 1);
} catch (e) {
  console.error(`Error: ${e}`);
  process.exit(2);
}
