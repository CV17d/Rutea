import { StyleSheet } from 'react-native';

export const communityReportFeedStyles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scroll: {
    paddingLeft: 16,
  },
  reportCard: {
    width: 250,
    marginRight: 12,
    borderRadius: 20,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alias: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  time: {
    color: '#94a3b8',
    fontSize: 10,
  },
  title: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  desc: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  routeTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  routeTagText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  upvoteBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  upvoteText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
