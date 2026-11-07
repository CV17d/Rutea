import { StyleSheet } from 'react-native';

export const userProfileCardStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 40,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    justifyContent: 'center',
  },
  alias: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  rankText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: 'bold',
  },
  pointsBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 12,
  },
  pointsNumber: {
    color: '#10b981',
    fontSize: 28,
    fontWeight: '900',
  },
  pointsLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 18,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressNextRank: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  progressPctText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  leaderboardSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.10)',
    paddingTop: 14,
    marginBottom: 14,
  },
  leaderboardTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  leaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderMedal: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  leaderName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  leaderPoints: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '800',
  },
});
