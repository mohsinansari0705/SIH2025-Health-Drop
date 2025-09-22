// src/screens/ExportScreen.tsx
import React from 'react';
import { View, Button, ScrollView } from 'react-native';
import { exportToCSV, exportToExcel } from '../services/exportService';

export default function ExportScreen() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Button title="Export Water (CSV)" onPress={() => exportToCSV('water')} />
      <Button title="Export Water (Excel)" onPress={() => exportToExcel('water')} />

      <Button title="Export Clinic (CSV)" onPress={() => exportToCSV('clinic')} />
      <Button title="Export Clinic (Excel)" onPress={() => exportToExcel('clinic')} />

      <Button title="Export Rainfall (CSV)" onPress={() => exportToCSV('rainfall')} />
      <Button title="Export Rainfall (Excel)" onPress={() => exportToExcel('rainfall')} />
    </ScrollView>
  );
}
