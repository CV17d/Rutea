import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { IncidentCategory } from '../../../types/user.types';
import { useUiStore } from '../../../store/useUiStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { quickReportModalStyles as styles } from './QuickReportModal.styles';

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
