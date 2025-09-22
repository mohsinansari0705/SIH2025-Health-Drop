// src/screens/ClinicForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import { saveClinicData } from '../services/clinicService';
import { sendSMS, sendEmail, sendWhatsApp } from '../utils/notification';
import { exportToCSV, exportToExcel } from '../services/exportService';
<><Button title="Export Clinic Data (CSV)" onPress={() => exportToCSV('clinic')} /><Button title="Export Clinic Data (Excel)" onPress={() => exportToExcel('clinic')} /></>


export default function ClinicForm() {
  const [form, setForm] = useState({
    clinic_id: '',
    patient_name: '',
    age: '',
    gender: '',
    symptoms: '',
    diagnosis: '',
    date_of_visit: '',
    treatment_given: '',
    outcome: '',
    data_source: ''
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await saveClinicData({
        ...form,
        age: parseInt(form.age),
      });

      // 🚨 Alert trigger
      if (form.diagnosis.toLowerCase().includes("cholera") || form.diagnosis.toLowerCase().includes("typhoid")) {
        const msg = `🚨 ALERT: ${form.diagnosis} case reported at clinic ${form.clinic_id}. Patient: ${form.patient_name}, Age: ${form.age}`;
        sendSMS("+911234567890", msg);
        sendEmail("health@authority.org", "Clinic Disease Alert", msg);
        sendWhatsApp("+911234567890", msg);
      }

      Alert.alert('Success', 'Clinic report saved locally! Will sync when online.');
      setForm({
        clinic_id: '',
        patient_name: '',
        age: '',
        gender: '',
        symptoms: '',
        diagnosis: '',
        date_of_visit: '',
        treatment_given: '',
        outcome: '',
        data_source: ''
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not save clinic data.');
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
      <Button title="Save Clinic Report" onPress={handleSubmit} />
    </ScrollView>
  );
}
