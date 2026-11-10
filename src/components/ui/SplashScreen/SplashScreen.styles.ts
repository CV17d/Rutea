import { StyleSheet } from 'react-native';

export const TRACK_WIDTH = 220;
export const DOT_SIZE = 10;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    elevation: 99,
  },
  centerBrand: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  isotipo: {
    width: 154,
    height: 192,
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: -0.8,
    lineHeight: 48,
  },
  brandSlogan: {
    fontSize: 15,
    fontWeight: '500',
    color: '#10b981',
    letterSpacing: 0.2,
    marginTop: 4,
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 68,
    width: TRACK_WIDTH,
    height: 20,
    justifyContent: 'center',
  },
  progressTrack: {
    width: TRACK_WIDTH,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    width: TRACK_WIDTH,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#10b981',
  },
  progressDot: {
    position: 'absolute',
    left: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#10b981',
  },
});
