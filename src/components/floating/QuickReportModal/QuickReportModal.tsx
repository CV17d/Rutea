import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { IncidentCategory } from '../../../types/user.types';
import { useUiStore } from '../../../store/useUiStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { socketClient } from '../../../services/socket.client';
import { quickReportModalStyles as styles } from './QuickReportModal.styles';

const CATEGORIES: { key: IncidentCategory; label: string; icon: string }[] = [
  { key: 'TRAFFIC_JAM', label: 'Tráfico', icon: '🚗' },
  { key: 'ROAD_BLOCK', label: 'Vía Cerrada', icon: '🚧' },
  { key: 'BUS_FULL', label: 'Bus Lleno', icon: '🚌' },
  { key: 'DETOUR', label: 'Desvío', icon: '↪️' },
];

export const QuickReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();
  const { profile, addPoints } = useUserSessionStore();
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const addReport = useTrackingStore((s) => s.addReport);
  const [selectedCat, setSelectedCat] = useState<IncidentCategory>('TRAFFIC_JAM');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    addPoints(15);
    const catLabel = CATEGORIES.find((c) => c.key === selectedCat)?.label || 'Incidente';
    const reportData = {
      id: `rep-${Date.now()}`,
      category: selectedCat,
      title: `${catLabel} en vía`,
      description: description || 'Reportado por usuario a bordo',
      reporterAlias: profile.alias,
      reporterAvatarSeed: profile.avatarSeed,
      timestamp: Date.now(),
      upvotes: 1,
      routeCode: profile.activeRouteId || 'C1',
      latitude: currentLocation?.latitude || 1.2145,
      longitude: currentLocation?.longitude || -77.2783,
    };
    addReport(reportData);
    socketClient.emit('report:create', {
      userId: profile.id,
      routeId: profile.activeRouteId || 'route-c1',
      reportType: selectedCat,
      title: reportData.title,
      description: reportData.description,
      reporterAlias: profile.alias,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
    });
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
