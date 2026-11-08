import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTrackingStore } from '../../store/useTrackingStore';
import { useRoutesStore } from '../../store/useRoutesStore';
import { useUiStore } from '../../store/useUiStore';
import { findBestRoutes, resolvePastoLocation } from '../../services/tripRecommendation.service';
import { RouteRecommendation } from '../../types/trip.types';
import { RouteRecommendationCard } from './RouteRecommendationCard';
import { styles } from './TripPlanner.styles';

interface Props {
  onClose?: () => void;
}

export const TripPlanner: React.FC<Props> = ({ onClose }) => {
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const selectRoute = useRoutesStore((s) => s.selectRoute);
  const setScreenMode = useUiStore((s) => s.setScreenMode);

  const [originText, setOriginText] = useState('Mi Ubicación');
  const [destText, setDestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RouteRecommendation[] | null>(null);

  const handleUseGps = () => {
    if (currentLocation) {
      setOriginText('Mi Ubicación GPS');
    } else {
      setOriginText('Plaza de Nariño');
    }
  };

  const handleSearch = async () => {
    if (!destText.trim()) return;

    setIsLoading(true);
    setRecommendations(null);

    const origCoord =
      originText === 'Mi Ubicación GPS' && currentLocation
        ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
        : resolvePastoLocation(originText) || { latitude: 1.2145, longitude: -77.2783 }; // Default Plaza Nariño

    const destCoord = resolvePastoLocation(destText) || { latitude: 1.2312, longitude: -77.2918 }; // Default Torobajo

    const results = await findBestRoutes({
      origin: origCoord,
      destination: destCoord,
      radiusMeters: 1200,
    });

    setRecommendations(results);
    setIsLoading(false);
  };

  const handleSelectRoute = (rec: RouteRecommendation) => {
    selectRoute(rec.routeId);
    if (onClose) onClose();
    setScreenMode('ROUTE_DETAILS');
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.dragHandle} />

        <View style={styles.headerRow}>
          <Text style={styles.titleText}>Planificador de Viaje</Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputWrap}>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🟢</Text>
            <TextInput
              style={styles.textInput}
              value={originText}
              onChangeText={setOriginText}
              placeholder="Punto de partida"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity onPress={handleUseGps} style={styles.gpsBtn}>
              <Text style={styles.gpsBtnText}>📍 GPS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🔴</Text>
            <TextInput
              style={styles.textInput}
              value={destText}
              onChangeText={setDestText}
              placeholder="¿A dónde vas?"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.chipsRow}>
          {['Torobajo', 'Hospital Departamental', 'Catambuco', 'Terminal'].map((chip) => (
            <TouchableOpacity key={chip} style={styles.chip} onPress={() => setDestText(chip)}>
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.searchBtn, (!destText.trim() || isLoading) && styles.searchBtnDisabled]}
          onPress={handleSearch}
          disabled={!destText.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.searchBtnText}>Buscar Rutas Directas</Text>
          )}
        </TouchableOpacity>

        {recommendations !== null && (
          <ScrollView style={{ maxHeight: 260 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            <Text style={styles.resultsHeader}>
              {recommendations.length > 0 ? `Rutas sugeridas (${recommendations.length})` : 'Sin rutas directas'}
            </Text>
            {recommendations.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No encontramos una ruta directa entre estos dos puntos dentro de 1.2 km.</Text>
              </View>
            ) : (
              recommendations.map((rec, index) => (
                <RouteRecommendationCard key={`${rec.routeId}-${index}`} recommendation={rec} onSelect={handleSelectRoute} />
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};
