import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  stopsContainer: {
    marginBottom: 16,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    position: 'relative',
  },
  indicatorCol: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconPink: {
    backgroundColor: '#ffe4e6',
  },
  iconGreen: {
    backgroundColor: '#dcfce7',
  },
  iconGray: {
    backgroundColor: '#f1f5f9',
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  iconEmoji: {
    fontSize: 14,
  },
  trackLine: {
    position: 'absolute',
    top: 32,
    bottom: -20,
    width: 2,
    backgroundColor: '#e2e8f0',
    zIndex: 1,
  },
  stopInfoCol: {
    flex: 1,
  },
  stopName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  stopSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stopSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  etaCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  clockIcon: {
    fontSize: 12,
    marginBottom: 1,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  detailsButton: {
    backgroundColor: 'rgba(238, 242, 246, 0.95)',
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
});
