import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { IncidentCategory } from '../../../types/user.types';
import { useUiStore } from '../../../store/useUiStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';

const CATEGORIES: { key: IncidentCategory; label: string; icon: string }[] = [
  { key: 'TRAFFIC_JAM', label: 'Congestión', icon: '🚗' },
  { key: 'DETOUR', label: 'Desvío de Ruta', icon: '↪️' },
  { key: 'ROAD_BLOCK', label: 'Vía Cerrada', icon: '🚧' },
  { key: 'ACCIDENT', label: 'Accidente', icon: '💥' },
];

export const QuickReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();
  const addPoints = useUserSessionStore((s) => s.addPoints);
  const [selectedCat, setSelectedCat] = useState<IncidentCategory>('TRAFFIC_JAM');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Award +15 community contribution points
    addPoints(15);
    setDescription('');
    closeReportModal();
  };

  return (
    <Modal
      visible={isReportModalOpen}
      transparent
      animationType="fade"
      onRequestClose={closeReportModal}
    >
      <View style={styles.overlay}>
        <GlassCard isHighlighted style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Reportar Incidente en Pasto</Text>
            <TouchableOpacity onPress={closeReportModal} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Gana +15 PTS por cada reporte verificado</Text>

          {/* Category Chips */}
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCat === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setSelectedCat(cat.key)}
                  style={[styles.catBtn, isSelected && styles.catBtnSelected]}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catLabel, isSelected && styles.catLabelSelected]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Description input */}
          <TextInput
            style={styles.input}
            placeholder="Describe brevemente lo que ocurre en la vía..."
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <GlassButton
            label="Enviar Reporte Comunitario"
            variant="primary"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
