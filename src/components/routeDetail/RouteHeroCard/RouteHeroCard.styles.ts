import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  leftCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  etaNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1,
  },
  etaUnit: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 3,
  },
  etaLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginHorizontal: 16,
  },
  rightCol: {
    flex: 1.4,
    justifyContent: 'center',
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  pointsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  pointsBadge: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10b981',
  },
  collabSubtext: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
});
