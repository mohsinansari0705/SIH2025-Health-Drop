// src/screens/RainfallForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import { saveRainfallData } from '../services/rainfallService';
import { sendSMS, sendEmail, sendWhatsApp } from '../utils/notification';

export default function RainfallForm() {
  const [form, setForm] = useState({
    location: '',
    station_id: '',
    date_recorded: '',
    rainfall_amount: '',
    rainfall_intensity: '',
    data_source: ''
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await saveRainfallData({
        ...form,
        rainfall_amount: parseFloat(form.rainfall_amount),
        rainfall_intensity: parseFloat(form.rainfall_intensity),
      });

      // 🚨 Alert trigger
      if (parseFloat(form.rainfall_intensity) > 50) {
        const msg = `🌧️ ALERT: Heavy rainfall detected at ${form.location}. Intensity: ${form.rainfall_intensity} mm/hr`;
        sendSMS("+911234567890", msg);
        sendEmail("disaster@authority.org", "Heavy Rainfall Alert", msg);
        sendWhatsApp("+911234567890", msg);
      }

      Alert.alert('Success', 'Rainfall data saved locally! Will sync when online.');
      setForm({
        location: '',
        station_id: '',
        date_recorded: '',
        rainfall_amount: '',
        rainfall_intensity: '',
        data_source: ''
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not save rainfall data.');
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
      <Button title="Save Rainfall Data" onPress={handleSubmit} />
    </ScrollView>
  );
}
