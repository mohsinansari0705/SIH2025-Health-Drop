import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, themes } from '../lib/ThemeContext';
interface CardProps {
  title: string;
  date: string;
  description: string;
  location: string;
  type: 'outbreak' | 'water_quality' | 'prevention' | 'alert';
  severity: 'high' | 'medium' | 'low';
  caseCount?: number;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ title, date, description, location, type, severity, caseCount, onPress }) => {
  const { theme } = useTheme();
  const themeColors = themes[theme];
  const isOutbreak = type === 'outbreak';
  const isWaterQuality = type === 'water_quality';
  const isPrevention = type === 'prevention';
  const isAlert = type === 'alert';

  const styles = React.useMemo(() => createStyles(themeColors), [themeColors]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = () => {
    if (severity === 'high') return themeColors.error;
    if (severity === 'medium') return themeColors.warning;
    return themeColors.success;
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'outbreak': return '🦠';
      case 'water_quality': return '💧';
      case 'prevention': return '🛡️';
      case 'alert': return '⚠️';
      default: return '📊';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'outbreak': return 'Disease Outbreak';
      case 'water_quality': return 'Water Quality';
      case 'prevention': return 'Prevention';
      case 'alert': return 'Alert';
      default: return 'Report';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.card, isAlert ? styles.alertCard : styles.campaignCard]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.icon}>
              {getTypeIcon()}
            </Text>
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>{title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                <Text style={styles.priorityText}>
                  {severity.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.location}>📍 {location}</Text>
              <Text style={styles.date}>{formatDate(date)}</Text>
            </View>
            <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>{description}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.actionText}>
            {isAlert ? 'Review Alert →' : 'Learn More →'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (themeColors: typeof themes.light) => StyleSheet.create({
  card: {
    backgroundColor: themeColors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  alertCard: {
    borderWidth: 1,
    borderColor: themeColors.error + '30',
  },
  campaignCard: {
    borderWidth: 1,
    borderColor: themeColors.success + '30',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: themeColors.text,
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 13,
    color: themeColors.textSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: themeColors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: themeColors.border,
    paddingTop: 12,
  },
  actionText: {
    fontSize: 14,
    color: themeColors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 12,
    color: themeColors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  typeLabel: {
    fontSize: 11,
    color: themeColors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Card;