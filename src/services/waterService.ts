// src/services/waterService.ts
import { getDBConnection } from './db';
import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api/water'; // replace later

export const saveWaterData = async (data: any) => {
  const db = await getDBConnection();
  await db.executeSql(
    `INSERT INTO water_quality 
      (location, sensor_id, turbidity, pH, bacterial_count, dissolved_oxygen, conductivity, temperature, contamination_level, data_source) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.location,
      data.sensor_id,
      data.turbidity,
      data.pH,
      data.bacterial_count,
      data.dissolved_oxygen,
      data.conductivity,
      data.temperature,
      data.contamination_level,
      data.data_source
    ]
  );
};

export const getUnsyncedWaterData = async () => {
  const db = await getDBConnection();
  const results = await db.executeSql(`SELECT * FROM water_quality WHERE synced = 0`);
  const rows = results[0].rows;
  const data = [];
  for (let i = 0; i < rows.length; i++) {
    data.push(rows.item(i));
  }
  return data;
};

export const syncWaterData = async () => {
  const unsynced = await getUnsyncedWaterData();
  for (const record of unsynced) {
    try {
      await axios.post(API_URL, record);
      const db = await getDBConnection();
      await db.executeSql(`UPDATE water_quality SET synced = 1 WHERE id = ?`, [record.id]);
    } catch (error) {
      console.log('Sync failed', error);
    }
  }
};
