import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useTheme, Theme } from '../lib/ThemeContext';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  isGuest?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onNavigate, isGuest = false }) => {
  const translateX = React.useRef(new Animated.Value(-300)).current;
  const { theme, toggleTheme, colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const menuItems = [
    { icon: '📊', label: 'Dashboard', screen: 'Dashboard' },
    { icon: '🦠', label: 'Outbreaks', screen: 'Outbreaks' },
    { icon: '💧', label: 'Water Quality', screen: 'WaterQuality' },
    { icon: '🚨', label: 'Warnings', screen: 'Warnings' },
    { icon: '🗺️', label: 'Maps', screen: 'Maps' },
    ...(!isGuest ? [{ icon: '👤', label: 'Profile', screen: 'Profile' }] : []),
    { icon: '⚙️', label: 'Settings', screen: 'Settings' },
    { icon: theme === 'dark' ? '☀️' : '🌙', label: `${theme === 'dark' ? 'Light' : 'Dark'} Mode`, action: toggleTheme },
    ...(isGuest ? [{ icon: '🔑', label: 'Sign In', screen: 'Auth' }] : []),
  ];

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/app_logo.png')}
                style={styles.logoImage}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerText}>HealthDrop</Text>
              <Text style={styles.headerSubtext}>Surveillance System</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {!isGuest && (
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Health Worker</Text>
              <Text style={styles.userStatus}>Active Mode</Text>
            </View>
          </View>
        )}

        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.screen) {
                  onNavigate(item.screen);
                  onClose();
                }
              }}
            >
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 35,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: colors.background,
    zIndex: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    paddingTop: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.primary,
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#fff',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  menuItems: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  menuItemIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  menuItemArrow: {
    fontSize: 16,
    color: colors.textSecondary,
    opacity: 0.6,
  },
});

export default Sidebar;