import { StyleSheet } from 'react-native';

export const routeSummaryCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
    letterSpacing: -0.2,
  },
  favoriteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteHeart: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statCol: {
    flex: 1,
  },
  statValue: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSubtext: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulseGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
});
