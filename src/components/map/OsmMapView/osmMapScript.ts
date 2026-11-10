export const OSM_MAP_SCRIPT = `
(function() {
  var map = null, tileLayer = null, overlayGroup = null, currentDark = null, lastState = null;
  var esc = function(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  };
  var post = function(obj) {
    try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(obj)); } catch (e) {}
  };
  function applyTheme(isDark) {
    if (!map || currentDark === isDark) return;
    currentDark = isDark;
    document.body.style.background = isDark ? '#070b13' : '#f8fafc';
    var el = document.getElementById('map');
    if (el) el.classList.toggle('rutea-dark', isDark);
  }
  function mountTiles() {
    var url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    var fbUsed = false;
    tileLayer = L.tileLayer(url, { maxZoom: 19, maxNativeZoom: 18 });
    tileLayer.on('tileerror', function() {
      if (fbUsed || !map) return;
      fbUsed = true;
      map.removeLayer(tileLayer);
      tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, maxNativeZoom: 18 }).addTo(map);
    });
    tileLayer.addTo(map);
  }
  function initMap() {
    if (typeof L === 'undefined') { setTimeout(initMap, 250); return; }
    map = L.map('map', { zoomControl: false, attributionControl: false }).setView([1.2136, -77.2811], 14);
    overlayGroup = L.layerGroup().addTo(map);
    mountTiles();
    applyTheme(false);
    map.on('dragstart', function() { post({ type: 'panDrag' }); });
    map.on('click', function() { post({ type: 'mapPress' }); });
    map.on('moveend', function() {
      var b = map.getBounds();
      post({ type: 'regionChange', latitudeDelta: Math.abs(b.getNorth() - b.getSouth()) });
    });
    if (lastState) window.__ruteaUpdate(lastState);
  }
  window.__ruteaCamera = function(lat, lng, zoom) {
    if (!map) return;
    map.flyTo([lat, lng], zoom || map.getZoom(), { duration: 0.55 });
  };
  window.__ruteaUpdate = function(s) {
    lastState = s;
    if (!map || !overlayGroup) return;
    applyTheme(!!s.isDark);
    overlayGroup.clearLayers();
    if (s.routeCoords && s.routeCoords.length > 1) {
      L.polyline(s.routeCoords, { color: s.routeColor || '#3b82f6', weight: 5, opacity: 0.92, lineCap: 'round', lineJoin: 'round' }).addTo(overlayGroup);
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
    (s.buses || []).forEach(function(b) {
      var op = b.status === 'GHOST' ? 0.65 : 1;
      var html = '<div class="rutea-bus" style="background:' + esc(b.color) + ';opacity:' + op + ';transform:rotate(' + Number(b.heading || 0) + 'deg)"><div class="rutea-windshield"></div></div>';
      var bIcon = L.divIcon({ className: '', html: html, iconSize: [20, 42], iconAnchor: [10, 21] });
      L.marker([b.lat, b.lng], { icon: bIcon }).on('click', function() { post({ type: 'busPress', busId: b.id }); }).addTo(overlayGroup);
    });
    (s.reports || []).forEach(function(r) {
      var rHtml = '<div class="rutea-report" style="border-color:' + esc(r.color) + '"><span class="rutea-dot" style="background:' + esc(r.color) + '"></span><div><div class="rutea-rtitle">' + esc(r.title) + '</div><div class="rutea-rsub">&#9650; ' + esc(r.upvotes) + ' &bull; ' + esc(r.alias) + '</div></div></div>';
      var rIcon = L.divIcon({ className: '', html: rHtml, iconSize: [148, 34], iconAnchor: [74, 34] });
      L.marker([r.lat, r.lng], { icon: rIcon }).addTo(overlayGroup);
    });
    if (s.userLoc) {
      var uIcon = L.divIcon({ className: '', html: '<div class="rutea-user-halo"><div class="rutea-user"></div></div>', iconSize: [26, 26], iconAnchor: [13, 13] });
      L.marker([s.userLoc.lat, s.userLoc.lng], { icon: uIcon, interactive: false }).addTo(overlayGroup);
    }
  };
  initMap();
})();
`;
