#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';

function startBot() {
  const startScript = path.join(process.cwd(), 'dados', 'src', '.scripts', 'start.js');
  
  if (!fs.existsSync(startScript)) {
    console.error('❌ Script de inicialização não encontrado:', startScript);
    process.exit(1);
  }

  const child = spawn('node', [startScript], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: isWindows
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Bot encerrado com código: ${code}. Reiniciando em 3 segundos...`);
      setTimeout(startBot, 3000);
    } else {
      process.exit(0);
    }
  });

  child.on('error', (err) => {
    console.error('Erro ao iniciar bot:', err);
    setTimeout(startBot, 5000);
  });
}

console.log('🚀 Nazuna Bot - Startup inicializado');
startBot();
