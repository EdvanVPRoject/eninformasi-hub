const fs = require('fs');

function extractTocFromContent(content, idFallbackToc = []) {
  if (!content) return idFallbackToc;
  const lines = content.split('\n');
  const toc = [];
  let idx = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      const heading = trimmed.replace('### ', '').trim();
      const numMatch = heading.match(/^(\d+)[\.\)]/);
      let id = '';
      if (numMatch && idFallbackToc) {
        const num = parseInt(numMatch[1], 10);
        if (idFallbackToc[num - 1]) {
          id = idFallbackToc[num - 1].id;
        }
      }
      if (!id && idFallbackToc && idFallbackToc[idx]) {
        id = idFallbackToc[idx].id;
      }
      if (!id) {
        id = heading
          .toLowerCase()
          .replace(/^[0-9]+\.\s*/, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      toc.push({ id, title: heading });
      idx++;
    }
  }
  return toc.length > 0 ? toc : idFallbackToc;
}

// Test with CrewAI English content
const crewaiContent = `
### 1. Why Choose CrewAI for Multi-Agent Workflows?
Building autonomous AI agents requires...

### 2. Environment Setup & Dependency Installation
Create an isolated Python...

### 3. Defining Agents, Personas, and Specific Tasks
Create your orchestration...

### 4. Integrating Custom Tools & Execution
You can extend...

### 5. Production Optimization: Preventing Loops & Token Spikes
Set iteration guardrails...
`;

const idToc = [
  { id: 'kenapa-harus-crewai', title: '1. Kenapa Harus CrewAI?' },
  { id: 'persiapan-lingkungan-python', title: '2. Persiapan Lingkungan & Instalasi Paket' },
  { id: 'arsitektur-agen-dan-task', title: '3. Konfigurasi Agen, Peran, & Tugas Spesifik' },
  { id: 'integrasi-tools-dan-eksekusi', title: '4. Menghubungkan Search Tools & Menjalankan Kickoff' },
  { id: 'tips-menghindari-infinite-loop', title: '5. Trik Optimasi: Mencegah Loop Berulang & Batasan Eksekusi' }
];

console.log('Extracted English TOC:');
console.log(extractTocFromContent(crewaiContent, idToc));
