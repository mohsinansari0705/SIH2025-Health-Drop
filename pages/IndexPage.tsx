import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { useTheme, Theme } from '../lib/ThemeContext';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import Card from '../components/Card';
import SettingsPage from './SettingsPage';

interface IndexPageProps {
  isGuest?: boolean;
  userName?: string;
}

type Screen = 'Dashboard' | 'Settings' | 'Profile' | 'Auth';

const IndexPage: React.FC<IndexPageProps> = ({ isGuest = false, userName = 'Guest' }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('Dashboard');
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Sample surveillance data - replace with actual data from your backend
  const outbreaks = [
    {
      id: 1,
      title: 'Cholera Outbreak Alert',
      description: 'Suspected cholera cases reported in riverside communities',
      location: 'Mawsynram Village',
      date: '2025-09-24',
      type: 'outbreak' as const,
      severity: 'high' as const,
      caseCount: 12,
    },
    {
      id: 2,
      title: 'Diarrhea Cluster Detected',
      description: 'AI model detected unusual pattern of diarrhea cases',
      location: 'Sohra Township',
      date: '2025-09-23',
      type: 'outbreak' as const,
      severity: 'medium' as const,
      caseCount: 7,
    },
  ];

  const waterQualityAlerts = [
    {
      id: 3,
      title: 'Water Contamination Warning',
      description: 'High bacterial count detected in community well water',
      location: 'Nongpoh Market Area',
      date: '2025-09-22',
      type: 'water_quality' as const,
      severity: 'high' as const,
    },
    {
      id: 4,
      title: 'Turbidity Levels Rising',
      description: 'Monsoon affecting water clarity in mountain streams',
      location: 'East Khasi Hills',
      date: '2025-09-21',
      type: 'water_quality' as const,
      severity: 'medium' as const,
    },
  ];

  const preventionCampaigns = [
    {
      id: 5,
      title: 'Hygiene Education Campaign',
      description: 'Community awareness program on water-borne disease prevention',
      location: 'Multiple Villages',
      date: '2025-09-20',
      type: 'prevention' as const,
      severity: 'low' as const,
    },
  ];

  const handleNavigation = (screen: string) => {
    if (isGuest && screen === 'Profile') {
      Alert.alert('Sign In Required', 'Please sign in to access your profile.');
      return;
    }
    
    // Handle specific navigation cases
    switch (screen) {
      case 'Settings':
        setCurrentScreen('Settings');
        break;
      case 'Auth':
        setCurrentScreen('Auth');
        break;
      case 'Profile':
        setCurrentScreen('Profile');
        break;
      case 'Dashboard':
        setCurrentScreen('Dashboard');
        break;
      default:
        console.log(`Navigating to ${screen} - Feature coming soon!`);
        Alert.alert('Coming Soon', `${screen} feature will be available soon!`);
        break;
    }
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('Dashboard');
  };

  // Render Settings page if selected
  if (currentScreen === 'Settings') {
    return (
      <SettingsPage 
        onNavigate={handleNavigation}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Show auth message for auth screen navigation
  if (currentScreen === 'Auth') {
    Alert.alert('Logout', 'You have been logged out successfully.');
    setCurrentScreen('Dashboard');
  }

  // Render main dashboard
  return (
    <View style={styles.container}>
      <Navbar 
        onMenuPress={() => setSidebarVisible(true)}
        userName={userName}
      />
      
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleNavigation}
        isGuest={isGuest}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <HeroSection userName={userName} />

        {/* Disease Outbreaks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🦠 Active Disease Outbreaks</Text>
            <Text style={styles.sectionSubtitle}>Real-time outbreak monitoring</Text>
          </View>
          {outbreaks.map(outbreak => (
            <Card
              key={outbreak.id}
              type={outbreak.type}
              severity={outbreak.severity}
              title={outbreak.title}
              description={outbreak.description}
              location={outbreak.location}
              date={outbreak.date}
              caseCount={outbreak.caseCount}
              onPress={() => console.log(`Outbreak ${outbreak.id} pressed`)}
            />
          ))}
        </View>

        {/* Water Quality Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💧 Water Quality Alerts</Text>
            <Text style={styles.sectionSubtitle}>Contamination monitoring</Text>
          </View>
          {waterQualityAlerts.map(alert => (
            <Card
              key={alert.id}
              type={alert.type}
              severity={alert.severity}
              title={alert.title}
              description={alert.description}
              location={alert.location}
              date={alert.date}
              onPress={() => console.log(`Water alert ${alert.id} pressed`)}
            />
          ))}
        </View>

        {/* Prevention Campaigns Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🛡️ Prevention Campaigns</Text>
            <Text style={styles.sectionSubtitle}>Community health education</Text>
          </View>
          {preventionCampaigns.map(campaign => (
            <Card
              key={campaign.id}
              type={campaign.type}
              severity={campaign.severity}
              title={campaign.title}
              description={campaign.description}
              location={campaign.location}
              date={campaign.date}
              onPress={() => console.log(`Campaign ${campaign.id} pressed`)}
            />
          ))}
        </View>

        {/* AI Insights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤖 AI Early Warning Insights</Text>
            <Text style={styles.sectionSubtitle}>Machine learning predictions</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Outbreak Risk Assessment</Text>
            <Text style={styles.insightText}>
              AI model predicts 75% chance of cholera outbreak in Shillong area within next 7 days based on recent rainfall patterns and reported symptoms.
            </Text>
            <View style={styles.riskIndicator}>
              <Text style={styles.riskLabel}>Risk Level: </Text>
              <Text style={styles.riskHigh}>HIGH</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Regional Health Statistics</Text>
            <Text style={styles.sectionSubtitle}>Last 30 days overview</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>Total Cases</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Water Sources Tested</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Villages Affected</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>People Educated</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  insightCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  riskHigh: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.error,
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default IndexPage;