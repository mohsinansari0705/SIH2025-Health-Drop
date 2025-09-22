// src/services/db.ts
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_filename = "SmartHealth.db";
const database_version = "1.0";
const database_displayname = "Smart Health Monitoring DB";
const database_filesize = 200000;

export const getDBConnection = async () => {
  return SQLite.openDatabase(
    database_filename,
    database_version,
    database_displayname,
    database_filesize
  );
};

export const createTables = async () => {
  const db = await getDBConnection();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS water_quality (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT,
      sensor_id TEXT,
      turbidity REAL,
      pH REAL,
      bacterial_count INTEGER,
      dissolved_oxygen REAL,
      conductivity REAL,
      temperature REAL,
      contamination_level TEXT,
      data_source TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS clinics_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clinic_id TEXT,
      patient_name TEXT,
      age INTEGER,
      gender TEXT,
      symptoms TEXT,
      diagnosis TEXT,
      date_of_visit TEXT,
      treatment_given TEXT,
      outcome TEXT,
      data_source TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS rainfall_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT,
      station_id TEXT,
      date_recorded TEXT,
      rainfall_amount REAL,
      rainfall_intensity TEXT,
      data_source TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  return db;
};
