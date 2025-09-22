// src/utils/notifications.ts
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';
import { Linking } from 'react-native';

export const sendSMS = async (phone: string, message: string) => {
  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable) {
    await SMS.sendSMSAsync([phone], message);
  } else {
    console.log("SMS not available on this device");
  }
};

export const sendEmail = async (email: string, subject: string, body: string) => {
  const options = { recipients: [email], subject, body };
  await MailComposer.composeAsync(options);
};

export const sendWhatsApp = async (phone: string, message: string) => {
  const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
  try {
    await Linking.openURL(url);
  } catch (e) {
    console.log("WhatsApp not available", e);
  }
};
