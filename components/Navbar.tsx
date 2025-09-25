import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useTheme, Theme } from '../lib/ThemeContext';

interface NavbarProps {
  onMenuPress: () => void;
  userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuPress, userName }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌙';
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton} activeOpacity={0.7}>
          <View style={styles.menuIconContainer}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/app_logo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.brandText}>
            <Text style={styles.appName}>HealthDrop Surveillance</Text>
            <Text style={styles.tagline}>Disease Early Warning System</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingIcon}>{getGreeting()}</Text>
        </View>
        
        <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
          <View style={styles.statusDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  navbar: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 35,
    paddingTop: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
  },
  menuIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 22,
    color: 'white',
  },
  logo: {
    width: 28,
    height: 28,
    tintColor: 'white',
  },
  brandText: {
    marginLeft: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingContainer: {
    marginRight: 12,
  },
  greetingIcon: {
    fontSize: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});

export default Navbar;