import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTrackingStore } from '../../store/useTrackingStore';
import { useRoutesStore } from '../../store/useRoutesStore';
import { useUiStore } from '../../store/useUiStore';
import { findBestRoutes, resolvePastoLocation, checkCoverageArea } from '../../services/tripRecommendation.service';
import { RouteRecommendation } from '../../types/trip.types';
import { RouteRecommendationCard } from './RouteRecommendationCard';
import { TripDetailsModal } from './TripDetailsModal';
import { styles } from './TripPlanner.styles';

interface Props { onClose?: () => void; }
const CHIPS = ['Torobajo', 'Hospital Departamental', 'Catambuco', 'Terminal'];
const OUT_OF_AREA_MSG = 'Parece que estás fuera de San Juan de Pasto. Por favor, ingresa un punto de origen manualmente';

export const TripPlanner: React.FC<Props> = ({ onClose }) => {
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const selectRoute = useRoutesStore((s) => s.selectRoute);
  const setScreenMode = useUiStore((s) => s.setScreenMode);

  const [originText, setOriginText] = useState('Mi Ubicación');
  const [destText, setDestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coverageWarning, setCoverageWarning] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RouteRecommendation[] | null>(null);
  const [selectedRec, setSelectedRec] = useState<RouteRecommendation | null>(null);

  const handleUseGps = () => {
    if (!currentLocation) {
      setOriginText('Plaza de Nariño');
      setCoverageWarning(null);
      return;
    }
    const coverage = checkCoverageArea(currentLocation);
    if (coverage.isOutOfArea) {
      setCoverageWarning(OUT_OF_AREA_MSG);
      setOriginText('');
      setRecommendations(null);
      return;
    }
    setCoverageWarning(null);
    setOriginText('Mi Ubicación GPS');
  };

  const handleSearch = async () => {
    if (!destText.trim()) return;
    setIsLoading(true);
    setRecommendations(null);

    const origCoord = originText === 'Mi Ubicación GPS' && currentLocation
      ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
      : resolvePastoLocation(originText);

    if (!origCoord || checkCoverageArea(origCoord).isOutOfArea) {
      setCoverageWarning(OUT_OF_AREA_MSG);
      setIsLoading(false);
      return;
    }

    setCoverageWarning(null);
    const destCoord = resolvePastoLocation(destText) || { latitude: 1.2312, longitude: -77.2918 };
    const results = await findBestRoutes({ origin: origCoord, destination: destCoord, radiusMeters: 1200 });
    setRecommendations(results);
    setIsLoading(false);
  };

  const handleConfirmRoute = (rec: RouteRecommendation) => {
    selectRoute(rec.routeId);
    setSelectedRec(null);
    if (onClose) onClose();
    setScreenMode('ROUTE_DETAILS');
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.dragHandle} />
        <View style={styles.headerRow}>
          <Text style={styles.titleText}>Planificador de Viaje</Text>
          {onClose && <TouchableOpacity onPress={onClose} style={styles.closeBtn}><Text style={styles.closeText}>✕</Text></TouchableOpacity>}
        </View>

        <View style={styles.inputWrap}>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🟢</Text>
            <TextInput style={styles.textInput} value={originText} onChangeText={(t) => { setOriginText(t); setCoverageWarning(null); }} placeholder="Punto de partida" placeholderTextColor="#94a3b8" />
            <TouchableOpacity onPress={handleUseGps} style={styles.gpsBtn}><Text style={styles.gpsBtnText}>📍 GPS</Text></TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🔴</Text>
            <TextInput style={styles.textInput} value={destText} onChangeText={setDestText} placeholder="¿A dónde vas?" placeholderTextColor="#94a3b8" />
          </View>
        </View>

        {coverageWarning && <View style={styles.warningBox}><Text style={styles.warningText}>⚠️ {coverageWarning}</Text></View>}

        <View style={styles.chipsRow}>
          {CHIPS.map((chip) => (
            <TouchableOpacity key={chip} style={styles.chip} onPress={() => setDestText(chip)}>
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.searchBtn, (!destText.trim() || isLoading) && styles.searchBtnDisabled]} onPress={handleSearch} disabled={!destText.trim() || isLoading}>
          {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.searchBtnText}>Buscar Rutas Directas</Text>}
        </TouchableOpacity>

        {recommendations !== null && (
          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            <Text style={styles.resultsHeader}>
              {recommendations.length > 0 ? `Rutas sugeridas (${recommendations.length})` : 'Sin rutas directas'}
            </Text>
            {recommendations.length === 0 ? (
              <View style={styles.emptyBox}><Text style={styles.emptyText}>No encontramos rutas directas para este trayecto.</Text></View>
            ) : (
              recommendations.map((rec, i) => (
                <RouteRecommendationCard key={`${rec.routeId}-${i}`} recommendation={rec} onSelect={setSelectedRec} />
              ))
            )}
          </ScrollView>
        )}

        <TripDetailsModal visible={selectedRec !== null} recommendation={selectedRec} onClose={() => setSelectedRec(null)} onSelectRoute={handleConfirmRoute} />
      </View>
    </View>
  );
};
