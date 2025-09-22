// src/services/clinicService.ts
import { getDBConnection } from './db';
import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api/clinics'; // replace with teammate's API

export const saveClinicData = async (data: any) => {
  const db = await getDBConnection();
  await db.executeSql(
    `INSERT INTO clinics_reports 
      (clinic_id, patient_name, age, gender, symptoms, diagnosis, date_of_visit, treatment_given, outcome, data_source) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.clinic_id,
      data.patient_name,
      parseInt(data.age),
      data.gender,
      data.symptoms,
      data.diagnosis,
      data.date_of_visit,
      data.treatment_given,
      data.outcome,
      data.data_source
    ]
  );
};

export const getUnsyncedClinicData = async () => {
  const db = await getDBConnection();
  const results = await db.executeSql(`SELECT * FROM clinics_reports WHERE synced = 0`);
  const rows = results[0].rows;
  const data = [];
  for (let i = 0; i < rows.length; i++) {
    data.push(rows.item(i));
  }
  return data;
};

export const syncClinicData = async () => {
  const unsynced = await getUnsyncedClinicData();
  for (const record of unsynced) {
    try {
      await axios.post(API_URL, record);
      const db = await getDBConnection();
      await db.executeSql(`UPDATE clinics_reports SET synced = 1 WHERE id = ?`, [record.id]);
    } catch (error) {
      console.log('Clinic sync failed', error);
    }
  }
};
