import { StyleSheet } from 'react-native';

export const quickReportModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  catBtnSelected: {
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    borderColor: '#38bdf8',
  },
  catIcon: {
    fontSize: 14,
  },
  catLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  catLabelSelected: {
    color: '#ffffff',
    fontWeight: '800',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 10,
    color: '#ffffff',
    fontSize: 13,
    minHeight: 60,
    marginBottom: 16,
  },
  submitBtn: {
    paddingVertical: 12,
  },
});
