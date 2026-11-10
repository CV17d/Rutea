import { Palette } from '../../../constants/palette';
import { StyleSheet } from 'react-native';

export const makeUserProfileCardStyles = (P: Palette) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: P.scrim,
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
    color: P.text,
    fontSize: 18,
    fontWeight: '800',
  },
  rankText: {
    color: P.brand,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: P.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: P.text2,
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
    color: P.brand,
    fontSize: 28,
    fontWeight: '900',
  },
  pointsLabel: {
    color: P.muted,
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
    color: P.text2,
    fontSize: 11,
    fontWeight: '700',
  },
  progressPctText: {
    color: P.brand,
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: P.raised,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: P.brand,
    borderRadius: 4,
  },
  leaderboardSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.10)',
    paddingTop: 14,
    marginBottom: 14,
  },
  leaderboardTitle: {
    color: P.muted,
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
    color: P.text,
    fontSize: 12,
    fontWeight: '700',
  },
  leaderPoints: {
    color: P.live,
    fontSize: 12,
    fontWeight: '800',
  },
});
