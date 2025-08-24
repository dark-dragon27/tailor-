#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

// Start the Python server
const pythonPath = 'python';
const appPath = path.join(process.cwd(), 'app.py');

console.log('Starting Taletique Python server...');

const pythonProcess = spawn(pythonPath, [appPath], {
  stdio: 'inherit',
  cwd: process.cwd()
});

pythonProcess.on('error', (err) => {
  console.error('Failed to start Python server:', err);
  process.exit(1);
});

pythonProcess.on('close', (code) => {
  console.log(`Python server exited with code ${code}`);
  process.exit(code || 0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  pythonProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  pythonProcess.kill('SIGTERM');
});