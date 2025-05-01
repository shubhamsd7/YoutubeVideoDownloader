import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// For ES modules, we need to use import.meta.url instead of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stats storage
interface SiteStats {
  totalVisits: number;
  apiCalls: number;
  videosFetched: number;
  downloadsStarted: number;
  downloadsCompleted: number;
  lastUpdated: string;
}

// Initial stats
const initialStats: SiteStats = {
  totalVisits: 0,
  apiCalls: 0,
  videosFetched: 0,
  downloadsStarted: 0,
  downloadsCompleted: 0,
  lastUpdated: new Date().toISOString()
};

// File path for storing stats
const statsFilePath = path.join(process.cwd(), 'stats.json');

// Load or initialize stats
let stats: SiteStats;
try {
  if (fs.existsSync(statsFilePath)) {
    const fileData = fs.readFileSync(statsFilePath, 'utf-8');
    stats = JSON.parse(fileData);
  } else {
    stats = { ...initialStats };
    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
  }
} catch (error) {
  console.error('Error initializing stats:', error);
  stats = { ...initialStats };
}

// Save stats to disk
function saveStats() {
  stats.lastUpdated = new Date().toISOString();
  try {
    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

// Analytics functions
export function incrementVisits() {
  stats.totalVisits++;
  saveStats();
}

export function incrementApiCalls() {
  stats.apiCalls++;
  if (stats.apiCalls % 10 === 0) {
    saveStats(); // Save every 10 API calls to reduce disk writes
  }
}

export function incrementVideosFetched() {
  stats.videosFetched++;
  saveStats();
}

export function incrementDownloadsStarted() {
  stats.downloadsStarted++;
  saveStats();
}

export function incrementDownloadsCompleted() {
  stats.downloadsCompleted++;
  saveStats();
}

export function getStats(): SiteStats {
  return { ...stats };
}