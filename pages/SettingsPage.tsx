import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useTheme, Theme } from '../lib/ThemeContext';
import { supabase } from '../lib/supabase';

interface SettingsPageProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

interface UserData {
  email?: string;
  full_name?: string;
  organization?: string;
  role?: string;
}

interface SettingItem {
  icon: string;
  label: string;
  value?: string | boolean;
  onPress?: () => void;
  disabled?: boolean;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, onBack }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  const [userData, setUserData] = useState<UserData>({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch additional user profile data if available
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserData({
          email: user.email,
          full_name: profile?.full_name || user.user_metadata?.full_name,
          organization: profile?.organization || 'Health Department',
          role: profile?.role || 'Health Worker',
        });
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error', 'Failed to logout. Please try again.');
      } else {
        setShowLogoutModal(false);
        onNavigate('Auth');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => setShowLogoutModal(true) },
      ]
    );
  };

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          icon: '👤',
          label: 'Profile Information',
          value: userData.full_name || 'Update Profile',
          onPress: () => onNavigate('Profile'),
        },
        {
          icon: '📧',
          label: 'Email',
          value: userData.email || 'No email',
          disabled: true,
        },
        {
          icon: '🏢',
          label: 'Organization',
          value: userData.organization || 'Not specified',
          disabled: true,
        },
        {
          icon: '👔',
          label: 'Role',
          value: userData.role || 'Health Worker',
          disabled: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: theme === 'dark' ? '🌙' : '☀️',
          label: 'Theme',
          value: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
          onPress: toggleTheme,
        },
        {
          icon: '🔔',
          label: 'Push Notifications',
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: '📍',
          label: 'Location Services',
          toggle: true,
          value: locationEnabled,
          onToggle: setLocationEnabled,
        },
        {
          icon: '🔄',
          label: 'Auto Sync Data',
          toggle: true,
          value: autoSync,
          onToggle: setAutoSync,
        },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          icon: '💾',
          label: 'Clear Cache',
          value: 'Clear app cache',
          onPress: () => Alert.alert('Info', 'Cache cleared successfully!'),
        },
        {
          icon: '📊',
          label: 'Data Usage',
          value: 'View data usage',
          onPress: () => Alert.alert('Info', 'Feature coming soon!'),
        },
        {
          icon: '☁️',
          label: 'Sync Settings',
          value: 'Manage sync preferences',
          onPress: () => Alert.alert('Info', 'Feature coming soon!'),
        },
      ],
    },
    {
      title: 'Support & About',
      items: [
        {
          icon: '❓',
          label: 'Help & FAQ',
          value: 'Get help',
          onPress: () => Alert.alert('Info', 'Feature coming soon!'),
        },
        {
          icon: '📝',
          label: 'Privacy Policy',
          value: 'View policy',
          onPress: () => Alert.alert('Info', 'Feature coming soon!'),
        },
        {
          icon: '📋',
          label: 'Terms of Service',
          value: 'View terms',
          onPress: () => Alert.alert('Info', 'Feature coming soon!'),
        },
        {
          icon: 'ℹ️',
          label: 'App Version',
          value: 'v1.0.0',
          disabled: true,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    item.disabled && styles.settingItemDisabled,
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  onPress={item.onPress}
                  disabled={item.disabled}
                  activeOpacity={item.disabled ? 1 : 0.7}
                >
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, item.disabled && styles.disabledText]}>
                        {item.label}
                      </Text>
                      {!item.toggle && (
                        <Text style={[styles.settingValue, item.disabled && styles.disabledText]}>
                          {item.value}
                        </Text>
                      )}
                    </View>
                  </View>
                  {item.toggle ? (
                    <Switch
                      value={item.value as boolean}
                      onValueChange={item.onToggle}
                      thumbColor={item.value ? colors.primary : colors.textSecondary}
                      trackColor={{ false: colors.border, true: colors.primary + '40' }}
                    />
                  ) : !item.disabled ? (
                    <Text style={styles.settingArrow}>›</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout from HealthDrop? You'll need to sign in again to access your account.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Logging out...' : 'Logout'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
  },
  backIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerRight: {
    width: 36,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemDisabled: {
    opacity: 0.6,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingArrow: {
    fontSize: 18,
    color: colors.textSecondary,
    opacity: 0.6,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  logoutSection: {
    marginVertical: 20,
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.error + '15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.error,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SettingsPage;