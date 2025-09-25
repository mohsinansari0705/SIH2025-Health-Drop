import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useTheme, themes, Theme } from '../lib/ThemeContext';

interface HeroSectionProps {
  userName: string;
}

const { width } = Dimensions.get('window');

const HeroSection: React.FC<HeroSectionProps> = ({ userName }) => {
  const { theme } = useTheme();
  const themeColors = themes[theme];
  const styles = React.useMemo(() => createStyles(themeColors), [themeColors]);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Disease Surveillance</Text>
          <Text style={styles.userName}>Early Warning System �</Text>
          <Text style={styles.date}>Monitoring water-borne diseases • {getCurrentDate()}</Text>
        </View>
        
        <View style={styles.healthIcon}>
          <Image 
            source={require('../assets/app_logo.png')}
            style={styles.logoImage}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🦠</Text>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Active Cases</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>�</Text>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Water Sources</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🚨</Text>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Outbreak Alerts</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Disease Trends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>�</Text>
          <Text style={styles.actionText}>Water Quality</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (themeColors: Theme) => StyleSheet.create({
  container: {
    backgroundColor: themeColors.surface,
    borderRadius: 20,
    margin: 16,
    padding: 20,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: themeColors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: themeColors.textSecondary,
  },
  healthIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: themeColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  logoImage: {
    width: 36,
    height: 36,
    tintColor: themeColors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: themeColors.surfaceVariant,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: themeColors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: themeColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default HeroSection;