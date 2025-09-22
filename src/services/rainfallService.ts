// src/services/rainfallService.ts
import { getDBConnection } from './db';
import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api/rainfall'; // replace with teammate's API

export const saveRainfallData = async (data: any) => {
  const db = await getDBConnection();
  await db.executeSql(
    `INSERT INTO rainfall_data 
      (location, station_id, date_recorded, rainfall_amount, rainfall_intensity, data_source) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.location,
      data.station_id,
      data.date_recorded,
      parseFloat(data.rainfall_amount),
      data.rainfall_intensity,
      data.data_source
    ]
  );
};

export const getUnsyncedRainfallData = async () => {
  const db = await getDBConnection();
  const results = await db.executeSql(`SELECT * FROM rainfall_data WHERE synced = 0`);
  const rows = results[0].rows;
  const data = [];
  for (let i = 0; i < rows.length; i++) {
    data.push(rows.item(i));
  }
  return data;
};

export const syncRainfallData = async () => {
  const unsynced = await getUnsyncedRainfallData();
  for (const record of unsynced) {
    try {
      await axios.post(API_URL, record);
      const db = await getDBConnection();
      await db.executeSql(`UPDATE rainfall_data SET synced = 1 WHERE id = ?`, [record.id]);
    } catch (error) {
      console.log('Rainfall sync failed', error);
    }
  }
};
