import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  leftCol: {
    width: 36,
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  walkCircle: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  busCircle: {
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  destCircle: {
    backgroundColor: '#fee2e2',
    borderWidth: 1.5,
    borderColor: '#f87171',
  },
  iconEmoji: {
    fontSize: 14,
  },
  trackLine: {
    width: 2,
    backgroundColor: '#cbd5e1',
    position: 'absolute',
    top: 32,
    bottom: -8,
    left: 17,
    zIndex: 1,
  },
  contentCol: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 20,
  },
  stepHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
  },
  stepSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  badgeWrap: {
    marginTop: 8,
    marginBottom: 6,
  },
  intermediateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  intermediateToggleText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  intermediateList: {
    marginTop: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  intermediateItem: {
    fontSize: 11,
    color: '#64748b',
    paddingVertical: 2,
  },
});
