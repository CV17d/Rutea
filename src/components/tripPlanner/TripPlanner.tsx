import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, ActivityIndicator, Animated, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTrackingStore } from '../../store/useTrackingStore';
import { useRoutesStore } from '../../store/useRoutesStore';
import { useUiStore } from '../../store/useUiStore';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useKeyboardOffset } from '../../hooks/useKeyboardOffset';
import { useGpsOrigin } from '../../hooks/useGpsOrigin';
import { findBestRoutes, resolvePastoLocation, checkCoverageArea } from '../../services/tripRecommendation.service';
import { RouteRecommendation } from '../../types/trip.types';
import { RouteRecommendationCard } from './RouteRecommendationCard';
import { TripDetailsModal } from './TripDetailsModal';
import { DestinationChips } from './DestinationChips';
import { PlaceSuggestions } from './PlaceSuggestions';
import { styles } from './TripPlanner.styles';

interface Props { onClose?: () => void; }
const CHIPS = ['Torobajo', 'Hospital Departamental', 'Catambuco', 'Terminal']; const OUT_OF_AREA_MSG = 'Parece que estás fuera de San Juan de Pasto. Por favor, ingresa un punto de origen manualmente';

export const TripPlanner: React.FC<Props> = ({ onClose }) => {
  const { currentLocation, setTripPhase, setOriginStopLocation, setWalkingPolyline } = useTrackingStore();
  const selectRoute = useRoutesStore((s) => s.selectRoute);
  const setScreenMode = useUiStore((s) => s.setScreenMode);
  const { t } = useTranslation();
  const { palette } = useAppTheme();
  const { offsetAnim, isKeyboardVisible, maxContentHeight, onContainerLayout } = useKeyboardOffset();
  const destInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const [originText, setOriginText] = useState('Mi Ubicación');
  const [destText, setDestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coverageWarning, setCoverageWarning] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RouteRecommendation[] | null>(null);
  const [selectedRec, setSelectedRec] = useState<RouteRecommendation | null>(null);
  const [focused, setFocused] = useState<'origin' | 'dest' | null>(null); // campo con sugerencias abiertas

  const handleClose = () => { Keyboard.dismiss(); onClose?.(); };
  const isGpsOrigin = (txt: string) => txt.trim().toLowerCase().startsWith('mi ubicación');
  const getGpsLocation = useGpsOrigin();
  const GPS_FAIL_MSG = 'No pudimos obtener tu ubicación GPS. Activa la ubicación o escribe tu punto de partida.';

  const handleUseGps = async () => {
    const gps = await getGpsLocation();
    if (!gps) { setCoverageWarning(GPS_FAIL_MSG); return; }
    if (checkCoverageArea(gps).isOutOfArea) {
      setCoverageWarning(OUT_OF_AREA_MSG); setOriginText(''); setRecommendations(null); return;
    }
    setCoverageWarning(null); setOriginText('Mi Ubicación GPS');
  };

  const handleSearch = async () => {
    if (!destText.trim()) return;
    Keyboard.dismiss(); setFocused(null); setIsLoading(true); setRecommendations(null);

    const origCoord = isGpsOrigin(originText) ? await getGpsLocation() : resolvePastoLocation(originText);
    const destCoord = resolvePastoLocation(destText);
    if (!origCoord || !destCoord) {
      const missing = !origCoord ? originText : destText;
      setCoverageWarning(!origCoord && isGpsOrigin(originText) ? GPS_FAIL_MSG : `No encontramos “${missing.trim()}” en Pasto. Elige una de las sugerencias al escribir.`); setIsLoading(false); return;
    }
    if (checkCoverageArea(origCoord).isOutOfArea || checkCoverageArea(destCoord).isOutOfArea) {
      setCoverageWarning(OUT_OF_AREA_MSG); setIsLoading(false); return;
    }
    setCoverageWarning(null);
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
      if (currentLocation) setWalkingPolyline([{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }, rec.originStop.location]);
    }
    setSelectedRec(null);
    onClose?.();
    setScreenMode('ROUTE_DETAILS');
  };

  const P = palette;
  const canSearch = !!destText.trim() && !isLoading;

  return (
    <Animated.View onLayout={onContainerLayout} style={[styles.modalOverlay, { paddingBottom: offsetAnim, backgroundColor: P.scrim }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}><View style={{ flex: 1, width: '100%' }} /></TouchableWithoutFeedback>
      <View style={[styles.modalContent, { backgroundColor: P.bg, shadowColor: P.shadow }, maxContentHeight ? { maxHeight: maxContentHeight } : null, isKeyboardVisible && { paddingBottom: 14 }]}>
        <View style={[styles.dragHandle, { backgroundColor: P.line }]} />
        <View style={styles.headerRow}>
          <Text style={[styles.titleText, { color: P.text }]}>{t('search.planTrip', 'Planea tu viaje')}</Text>
          {onClose && (
            <TouchableOpacity onPress={handleClose} style={[styles.closeBtn, { backgroundColor: P.raised }]} accessibilityLabel="Cerrar">
              <MaterialCommunityIcons name="close" size={18} color={P.text2} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={{ flexGrow: 0 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
          <View style={[styles.inputWrap, { backgroundColor: P.surface, borderColor: P.line }]}>
            <View style={styles.inputRow}>
              <View style={[styles.originDot, { borderColor: P.brand }]} />
              <TextInput style={[styles.textInput, { color: P.text }]} value={originText} onChangeText={(txt) => { setOriginText(txt); setCoverageWarning(null); }} onFocus={() => setFocused('origin')} placeholder={t('search.startPoint', 'Punto de partida')} placeholderTextColor={P.muted} returnKeyType="next" onSubmitEditing={() => destInputRef.current?.focus()} />
              <TouchableOpacity onPress={handleUseGps} style={[styles.gpsBtn, { backgroundColor: P.brandSoft }]} accessibilityLabel="Usar mi ubicación GPS">
                <MaterialCommunityIcons name="crosshairs-gps" size={14} color={P.brand} />
                <Text style={[styles.gpsBtnText, { color: P.brand }]}>GPS</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.connectorRow}>
              <View style={[styles.connector, { borderColor: P.muted }]} />
              <View style={[styles.divider, { backgroundColor: P.line }]} />
            </View>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="map-marker" size={18} color={P.danger} />
              <TextInput ref={destInputRef} style={[styles.textInput, styles.destInput, { color: P.text }]} value={destText} onChangeText={setDestText} onFocus={() => setFocused('dest')} placeholder={t('search.whereTo', '¿A dónde vas?')} placeholderTextColor={P.muted} returnKeyType="search" onSubmitEditing={handleSearch} />
            </View>
          </View>

          {focused && <PlaceSuggestions query={focused === 'origin' ? (isGpsOrigin(originText) ? '' : originText) : destText} palette={P} onPick={(pl) => {
            if (focused === 'origin') { setOriginText(pl.name); destInputRef.current?.focus(); } else { setDestText(pl.name); setFocused(null); Keyboard.dismiss(); }
          }} />}

          {coverageWarning && (
            <View style={[styles.warningBox, { backgroundColor: P.liveSoft, borderColor: 'transparent' }]}><MaterialCommunityIcons name="alert-circle-outline" size={16} color={P.live} /><Text style={[styles.warningText, { color: P.text }]}>{coverageWarning}</Text></View>
          )}

          <DestinationChips chips={CHIPS} value={destText} palette={P} onPick={(chip) => { setDestText(chip); setFocused(null); Keyboard.dismiss(); }} />

          <TouchableOpacity style={[styles.searchBtn, { backgroundColor: canSearch ? P.brand : P.raised }]} onPress={handleSearch} disabled={!canSearch}>
            {isLoading ? <ActivityIndicator color={P.onBrand} size="small" /> : <Text style={[styles.searchBtnText, { color: canSearch ? P.onBrand : P.muted }]}>{t('search.findDirectRoutes', 'Buscar rutas')}</Text>}
          </TouchableOpacity>

          {recommendations !== null && (
            <>
              <Text style={[styles.resultsHeader, { color: P.text }]}>{recommendations.length > 0 ? `${recommendations.length} ${recommendations.length === 1 ? 'ruta' : 'rutas'} para tu viaje` : t('search.noDirectRoutes', 'Sin rutas directas')}</Text>
              {recommendations.length === 0 ? (
                <View style={[styles.emptyBox, { backgroundColor: P.surface }]}><Text style={[styles.emptyText, { color: P.text2 }]}>{t('search.noDirectRoutesDesc', 'Ninguna ruta pasa cerca de tu origen y tu destino. Prueba con otro punto de partida.')}</Text></View>
              ) : recommendations.map((rec, i) => <RouteRecommendationCard key={`${rec.routeId}-${i}`} recommendation={rec} onSelect={setSelectedRec} isBest={i === 0} />)}
            </>
          )}
        </ScrollView>
      </View>
      <TripDetailsModal visible={selectedRec !== null} recommendation={selectedRec} onClose={() => setSelectedRec(null)} onSelectRoute={handleConfirmRoute} />
    </Animated.View>
  );
};
