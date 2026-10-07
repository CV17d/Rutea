import { StyleSheet } from 'react-native';

export const routeDetailCardStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 25,
  },
  card: {
    padding: 16,
  },
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  codeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  routeName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    flexShrink: 1,
  },
  nextStopLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  etaContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  etaNumber: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stopsSection: {
    marginTop: 6,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  stopsHeader: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  stopsScroll: {
    flexDirection: 'row',
  },
  stopChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  stopChipName: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 110,
  },
  stopChipTime: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  expandToggle: {
    paddingVertical: 8,
  },
  expandToggleText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  boardBtn: {
    flex: 1,
    paddingVertical: 12,
  },
});
