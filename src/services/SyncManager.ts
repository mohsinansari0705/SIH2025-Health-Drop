// src/services/SyncManager.ts
import NetInfo from '@react-native-community/netinfo';
import { syncWaterData } from './waterService';
import { syncClinicData } from './clinicService';
import { syncRainfallData } from './rainfallService';

export const setupAutoSync = () => {
  // Listen to internet connectivity changes
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncAllData();
    }
  });
};

export const syncAllData = async () => {
  try {
    await syncWaterData();
    await syncClinicData();
    await syncRainfallData();
    console.log('All unsynced data synced successfully!');
  } catch (e) {
    console.log('Sync failed', e);
  }
};
