// src/screens/WaterForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import { saveWaterData } from '../services/waterService';
import { sendSMS, sendEmail, sendWhatsApp } from '../utils/notification';
import { exportToCSV, exportToExcel } from '../services/exportService';

<><Button title="Export Water Data (CSV)" onPress={() => exportToCSV('water')} /><Button title="Export Water Data (Excel)" onPress={() => exportToExcel('water')} /></>



export default function WaterForm() {
  const [form, setForm] = useState({
    location: '',
    sensor_id: '',
    turbidity: '',
    pH: '',
    bacterial_count: '',
    dissolved_oxygen: '',
    conductivity: '',
    temperature: '',
    contamination_level: '',
    data_source: ''
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await saveWaterData({
        ...form,
        turbidity: parseFloat(form.turbidity),
        pH: parseFloat(form.pH),
        bacterial_count: parseInt(form.bacterial_count),
        dissolved_oxygen: parseFloat(form.dissolved_oxygen),
        conductivity: parseFloat(form.conductivity),
        temperature: parseFloat(form.temperature),
      });

      // 🚨 Alert trigger
      if (parseInt(form.bacterial_count) > 1000) {
        const msg = `⚠️ ALERT: High bacterial count detected at ${form.location}. Value: ${form.bacterial_count}`;
        sendSMS("+911234567890", msg);
        sendEmail("health@authority.org", "Water Quality Alert", msg);
        sendWhatsApp("+911234567890", msg);
      }

      Alert.alert('Success', 'Water data saved locally! Will sync when online.');
      setForm({
        location: '',
        sensor_id: '',
        turbidity: '',
        pH: '',
        bacterial_count: '',
        dissolved_oxygen: '',
        conductivity: '',
        temperature: '',
        contamination_level: '',
        data_source: ''
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not save water data.');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {Object.keys(form).map(key => (
        <View key={key} style={{ marginBottom: 10 }}>
          <Text>{key}</Text>
          <TextInput
            value={form[key as keyof typeof form]}
            onChangeText={val => handleChange(key, val)}
            style={{ borderWidth: 1, padding: 5 }}
          />
        </View>
      ))}
      <Button title="Save Water Data" onPress={handleSubmit} />
    </ScrollView>
  );
}
