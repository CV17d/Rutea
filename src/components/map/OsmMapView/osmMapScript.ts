import { OSM_BUS_SCRIPT } from './osmBusScript';

/**
 * Script Leaflet embebido. Usa teselas abiertas sin API key:
 *  - OpenStreetMap estándar (tile.openstreetmap.org); modo oscuro vía filtro CSS
 *  - Respaldo automático: Esri World Street Map (también sin API key)
 * Los buses son marcadores persistentes animados con requestAnimationFrame,
 * así se desplazan suavemente y siempre miran en la dirección de avance.
 */
export const OSM_MAP_SCRIPT = `
(function() {
  var map = null, tileLayer = null, overlayGroup = null, currentDark = null, lastState = null, lastStaticKey = '';
  var useFallback = false, tileErrors = 0;
  var busMarkers = {};
  var BUS_ANIM_MS = 1050;
  var ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  var esc = function(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  };
  var post = function(obj) {
    var data = JSON.stringify(obj);
    try {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(data);
      else if (window.parent && window.parent !== window) window.parent.postMessage({ __rutea: true, data: data }, '*');
    } catch (e) {}
  };

  function mountTiles() {
    if (tileLayer) map.removeLayer(tileLayer);
    var url = useFallback
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileLayer = L.tileLayer(url, { maxZoom: 19, attribution: useFallback ? ATTR + ', Esri' : ATTR });
    tileLayer.on('tileerror', function() {
      tileErrors++;
      if (!useFallback && tileErrors > 4) { useFallback = true; mountTiles(); }
    });
    tileLayer.addTo(map);
  }
  function applyTheme(isDark) {
    if (!map || currentDark === isDark) return;
    currentDark = isDark;
    document.body.style.background = isDark ? '#0D1A20' : '#f8fafc';
    var el = document.getElementById('map');
    if (el) el.classList.toggle('rutea-dark', isDark);
  }

  function initMap() {
    if (typeof L === 'undefined') { setTimeout(initMap, 250); return; }
    map = L.map('map', { zoomControl: false, attributionControl: true }).setView([1.2136, -77.2811], 14);
    map.attributionControl.setPrefix(false);
    overlayGroup = L.layerGroup().addTo(map);
    mountTiles();
    applyTheme(!!(lastState && lastState.isDark));
    map.on('dragstart', function() { post({ type: 'panDrag' }); });
    map.on('click', function() { post({ type: 'mapPress' }); });
    map.on('moveend', function() {
      var b = map.getBounds();
      post({ type: 'regionChange', latitudeDelta: Math.abs(b.getNorth() - b.getSouth()) });
    });
    requestAnimationFrame(animateBuses);
    if (lastState) window.__ruteaUpdate(lastState);
  }

  window.__ruteaCamera = function(lat, lng, zoom) {
    if (!map) return;
    map.flyTo([lat, lng], zoom || map.getZoom(), { duration: 0.55 });
  };

  function drawStatic(s) {
    overlayGroup.clearLayers();
    if (s.routeCoords && s.routeCoords.length > 1) {
      L.polyline(s.routeCoords, { color: '#000', weight: 9, opacity: 0.18, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(overlayGroup);
      L.polyline(s.routeCoords, { color: s.routeColor || '#3b82f6', weight: 5, opacity: 0.95, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(overlayGroup);
    }
    if (s.walkingCoords && s.walkingCoords.length > 1) {
      L.polyline(s.walkingCoords, { color: '#10b981', weight: 4, dashArray: '8, 7', opacity: 0.95 }).addTo(overlayGroup);
    }
    (s.stopItems || []).forEach(function(it) {
      if (it.isCluster) {
        var icon = L.divIcon({ className: '', html: '<div class="rutea-cluster">' + esc(it.count) + '</div>', iconSize: [30, 30], iconAnchor: [15, 15] });
        L.marker([it.lat, it.lng], { icon: icon }).on('click', function() { post({ type: 'clusterPress', lat: it.lat, lng: it.lng }); }).addTo(overlayGroup);
      } else {
        var sIcon = L.divIcon({ className: '', html: '<div class="rutea-stop"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
        L.marker([it.lat, it.lng], { icon: sIcon }).on('click', function() { post({ type: 'stopPress', stopId: it.id }); }).addTo(overlayGroup);
      }
    });
    (s.reports || []).forEach(function(r) {
      var rHtml = '<div class="rutea-report"><span class="rutea-dot" style="background:' + esc(r.color) + '"></span><div><div class="rutea-rtitle">' + esc(r.title) + '</div><div class="rutea-rsub">&#9650; ' + esc(r.upvotes) + ' &bull; ' + esc(r.alias) + '</div></div></div>';
      var rIcon = L.divIcon({ className: '', html: rHtml, iconSize: [148, 34], iconAnchor: [74, 34] });
      L.marker([r.lat, r.lng], { icon: rIcon }).addTo(overlayGroup);
    });
    if (s.userLoc) {
      var uIcon = L.divIcon({ className: '', html: '<div class="rutea-user-halo"><div class="rutea-user"></div></div>', iconSize: [26, 26], iconAnchor: [13, 13] });
      L.marker([s.userLoc.lat, s.userLoc.lng], { icon: uIcon, interactive: false }).addTo(overlayGroup);
    }
  }

${OSM_BUS_SCRIPT}
  window.__ruteaUpdate = function(s) {
    lastState = s;
    if (!map || !overlayGroup) return;
    applyTheme(!!s.isDark);
    var staticKey = JSON.stringify([s.routeCoords && s.routeCoords.length, s.routeCoords && s.routeCoords[0], s.routeColor, s.walkingCoords, s.stopItems, s.reports, s.userLoc]);
    if (staticKey !== lastStaticKey) { lastStaticKey = staticKey; drawStatic(s); }
    updateBuses(s.buses);
  };

  window.addEventListener('message', function(e) {
    try {
      var d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (d && d.__ruteaUpdate) window.__ruteaUpdate(d.__ruteaUpdate);
      if (d && d.__ruteaCamera) window.__ruteaCamera(d.__ruteaCamera[0], d.__ruteaCamera[1], d.__ruteaCamera[2]);
    } catch (err) {}
  });

  initMap();
})();
`;
