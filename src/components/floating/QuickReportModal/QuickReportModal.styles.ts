import { StyleSheet } from 'react-native';

export const quickReportModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 19, 0.82)',
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
    fontSize: 17,
    fontWeight: '800',
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
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },
  buttonsList: {
    gap: 12,
    marginBottom: 8,
  },
  bigReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 14,
  },
  bigBtnIcon: {
    fontSize: 28,
  },
  bigBtnTextWrap: {
    flex: 1,
  },
  bigBtnTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  bigBtnSub: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  rewardTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.20)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  rewardTagText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
  toastContainer: {
    marginTop: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    borderWidth: 1.5,
    borderColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
