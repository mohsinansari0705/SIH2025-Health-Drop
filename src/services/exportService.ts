// src/services/exportService.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import XLSX from 'xlsx';

import { saveWaterData } from './waterService';
import { saveClinicData } from './clinicService';
import { saveRainfallData } from './rainfallService';

async function getData(table: 'water' | 'clinic' | 'rainfall') {
  if (table === 'water') return await saveWaterData();
  if (table === 'clinic') return await saveClinicData();
  if (table === 'rainfall') return await saveRainfallData();
  return [];
}

// Export CSV
export async function exportToCSV(table: 'water' | 'clinic' | 'rainfall') {
  const data = await getData(table);
  if (!data.length) return null;

  const csv = Papa.unparse(data);
  const fileUri = `${FileSystem.documentDirectory}${table}_data.csv`;
  await FileSystem.writeAsStringAsync(fileUri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }

  return fileUri;
}

// Export Excel
export async function exportToExcel(table: 'water' | 'clinic' | 'rainfall') {
  const data = await getData(table);
  if (!data.length) return null;

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${table}_data`);

  const wbout = XLSX.write(wb, { type: 'base64', bookType: "xlsx" });
  const fileUri = `${FileSystem.documentDirectory}${table}_data.xlsx`;

  await FileSystem.writeAsStringAsync(fileUri, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }

  return fileUri;
}
