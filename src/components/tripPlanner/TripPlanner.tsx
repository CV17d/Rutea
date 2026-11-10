import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, ActivityIndicator, Animated, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTrackingStore } from '../../store/useTrackingStore';
import { useRoutesStore } from '../../store/useRoutesStore';
import { useUiStore } from '../../store/useUiStore';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useKeyboardOffset } from '../../hooks/useKeyboardOffset';
import { findBestRoutes, resolvePastoLocation, checkCoverageArea } from '../../services/tripRecommendation.service';
import { RouteRecommendation } from '../../types/trip.types';
import { RouteRecommendationCard } from './RouteRecommendationCard';
import { TripDetailsModal } from './TripDetailsModal';
import { styles } from './TripPlanner.styles';

interface Props { onClose?: () => void; }
const CHIPS = ['Torobajo', 'Hospital Departamental', 'Catambuco', 'Terminal'];
const OUT_OF_AREA_MSG = 'Parece que estás fuera de San Juan de Pasto. Por favor, ingresa un punto de origen manualmente';

export const TripPlanner: React.FC<Props> = ({ onClose }) => {
  const { currentLocation, setTripPhase, setOriginStopLocation, setWalkingPolyline } = useTrackingStore();
  const selectRoute = useRoutesStore((s) => s.selectRoute);
  const setScreenMode = useUiStore((s) => s.setScreenMode);
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { offsetAnim, isKeyboardVisible, maxContentHeight, onContainerLayout } = useKeyboardOffset();
  const destInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const [originText, setOriginText] = useState('Mi Ubicación');
  const [destText, setDestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coverageWarning, setCoverageWarning] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RouteRecommendation[] | null>(null);
  const [selectedRec, setSelectedRec] = useState<RouteRecommendation | null>(null);

  const handleClose = () => { Keyboard.dismiss(); onClose?.(); };

  const handleUseGps = () => {
    if (!currentLocation) { setOriginText('Plaza de Nariño'); setCoverageWarning(null); return; }
    if (checkCoverageArea(currentLocation).isOutOfArea) {
      setCoverageWarning(OUT_OF_AREA_MSG); setOriginText(''); setRecommendations(null); return;
    }
    setCoverageWarning(null); setOriginText('Mi Ubicación GPS');
  };

  const handleSearch = async () => {
    if (!destText.trim()) return;
    Keyboard.dismiss();
    setIsLoading(true); setRecommendations(null);

    const origCoord = originText === 'Mi Ubicación GPS' && currentLocation
      ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
      : resolvePastoLocation(originText);

    if (!origCoord || checkCoverageArea(origCoord).isOutOfArea) {
      setCoverageWarning(OUT_OF_AREA_MSG); setIsLoading(false); return;
    }
    setCoverageWarning(null);
    const destCoord = resolvePastoLocation(destText);
    if (!destCoord || checkCoverageArea(destCoord).isOutOfArea) {
      setCoverageWarning(OUT_OF_AREA_MSG); setIsLoading(false); return;
    }
    const results = await findBestRoutes({ origin: origCoord, destination: destCoord, radiusMeters: 1200 });
    setRecommendations(results);
    setIsLoading(false);
  };

  const handleConfirmRoute = (rec: RouteRecommendation) => {
    Keyboard.dismiss();
    selectRoute(rec.routeId);
    setTripPhase('WALKING_TO_STOP');
    if (rec.originStop) {
      setOriginStopLocation({ ...rec.originStop.location, name: rec.originStop.name, id: rec.originStop.id });
      const userPos = currentLocation ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude } : { latitude: 1.2136, longitude: -77.2811 };
      setWalkingPolyline([userPos, rec.originStop.location]);
    }
    setSelectedRec(null);
    onClose?.();
    setScreenMode('ROUTE_DETAILS');
  };

  return (
    <Animated.View onLayout={onContainerLayout} style={[styles.modalOverlay, { paddingBottom: offsetAnim }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}><View style={{ flex: 1, width: '100%' }} /></TouchableWithoutFeedback>
      <View style={[styles.modalContent, isDark && { backgroundColor: '#0f172a', borderColor: '#334155' }, maxContentHeight ? { maxHeight: maxContentHeight } : null, isKeyboardVisible && { paddingBottom: 14 }]}>
        <View style={styles.dragHandle} />
        <View style={styles.headerRow}>
          <Text style={[styles.titleText, isDark && { color: '#ffffff' }]}>{t('search.planTrip', 'Planificador de Viaje')}</Text>
          {onClose && (
            <TouchableOpacity onPress={handleClose} style={[styles.closeBtn, isDark && { backgroundColor: '#1e293b' }]}>
              <MaterialCommunityIcons name="close" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={{ flexGrow: 0 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
          <View style={[styles.inputWrap, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="circle-slice-8" size={16} color="#10b981" />
              <TextInput style={[styles.textInput, isDark && { color: '#ffffff' }]} value={originText} onChangeText={(txt) => { setOriginText(txt); setCoverageWarning(null); }} placeholder={t('search.startPoint', 'Punto de partida')} placeholderTextColor="#94a3b8" returnKeyType="next" onSubmitEditing={() => destInputRef.current?.focus()} />
              <TouchableOpacity onPress={handleUseGps} style={styles.gpsBtn}>
                <MaterialCommunityIcons name="crosshairs-gps" size={13} color="#0284c7" />
                <Text style={styles.gpsBtnText}>GPS</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, isDark && { backgroundColor: '#334155' }]} />
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="map-marker" size={18} color="#ef4444" />
              <TextInput ref={destInputRef} style={[styles.textInput, isDark && { color: '#ffffff' }]} value={destText} onChangeText={setDestText} placeholder={t('search.whereTo', '¿A dónde vas?')} placeholderTextColor="#94a3b8" returnKeyType="search" onSubmitEditing={handleSearch} />
            </View>
          </View>

          {coverageWarning && (
            <View style={styles.warningBox}><MaterialCommunityIcons name="alert-circle-outline" size={16} color="#b45309" /><Text style={styles.warningText}>{coverageWarning}</Text></View>
          )}

          <View style={styles.chipsRow}>
            {CHIPS.map((chip) => (
              <TouchableOpacity key={chip} style={[styles.chip, isDark && { backgroundColor: '#1e293b' }]} onPress={() => { setDestText(chip); Keyboard.dismiss(); }}>
                <Text style={[styles.chipText, isDark && { color: '#cbd5e1' }]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.searchBtn, (!destText.trim() || isLoading) && styles.searchBtnDisabled]} onPress={handleSearch} disabled={!destText.trim() || isLoading}>
            {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.searchBtnText}>{t('search.findDirectRoutes', 'Buscar Rutas Directas')}</Text>}
          </TouchableOpacity>

          {recommendations !== null && (
            <>
              <Text style={styles.resultsHeader}>{recommendations.length > 0 ? `${t('search.suggestedRoutes', 'Rutas sugeridas')} (${recommendations.length})` : t('search.noDirectRoutes', 'Sin rutas directas')}</Text>
              {recommendations.length === 0 ? (
                <View style={styles.emptyBox}><Text style={styles.emptyText}>{t('search.noDirectRoutesDesc', 'No encontramos rutas directas para este trayecto.')}</Text></View>
              ) : recommendations.map((rec, i) => <RouteRecommendationCard key={`${rec.routeId}-${i}`} recommendation={rec} onSelect={setSelectedRec} />)}
            </>
          )}
        </ScrollView>
      </View>
      <TripDetailsModal visible={selectedRec !== null} recommendation={selectedRec} onClose={() => setSelectedRec(null)} onSelectRoute={handleConfirmRoute} />
    </Animated.View>
  );
};
