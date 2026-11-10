import { Palette } from '../../../constants/palette';
import { StyleSheet } from 'react-native';

export const makeRouteSummaryCardStyles = (P: Palette) => StyleSheet.create({
  card: {
    backgroundColor: P.surface,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: P.line,
    shadowColor: P.shadow,
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
    color: P.text,
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
    backgroundColor: P.raised,
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
    color: P.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSubtext: {
    color: P.muted,
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
    backgroundColor: P.brand,
    shadowColor: P.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveText: {
    color: P.brand,
    fontSize: 12,
    fontWeight: '700',
  },
});
