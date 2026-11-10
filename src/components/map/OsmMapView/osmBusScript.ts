/**
 * Animacion de buses dentro del WebView/iframe de Leaflet (se inserta en el ambito de osmMapScript).
 * Cada bus es un marcador persistente: se interpola posicion y rumbo entre actualizaciones
 * para que avance suave y siempre mire hacia su direccion de marcha.
 */
export const OSM_BUS_SCRIPT = `
  // ---------- Buses animados ----------
  function shortestAngle(from, to) { return ((((to - from) % 360) + 540) % 360) - 180; }

  function createBus(b) {
    var html = '<div class="rutea-bus-rot"><div class="rutea-bus"><div class="rutea-lights"><i></i><i></i></div><div class="rutea-windshield"></div><div class="rutea-code"></div><div class="rutea-rear"></div></div></div>';
    var icon = L.divIcon({ className: 'rutea-bus-icon', html: html, iconSize: [22, 44], iconAnchor: [11, 22] });
    var m = L.marker([b.lat, b.lng], { icon: icon, zIndexOffset: 1000 }).on('click', function() { post({ type: 'busPress', busId: b.id }); }).addTo(map);
    var st = { marker: m, fromLat: b.lat, fromLng: b.lng, toLat: b.lat, toLng: b.lng, lat: b.lat, lng: b.lng,
               heading: b.heading || 0, fromHeading: b.heading || 0, toHeading: b.heading || 0, start: 0, el: null };
    busMarkers[b.id] = st;
    return st;
  }
  function styleBus(st, b) {
    var root = st.marker.getElement();
    if (!root) return;
    st.el = root.querySelector('.rutea-bus-rot');
    var body = root.querySelector('.rutea-bus');
    var code = root.querySelector('.rutea-code');
    if (body) { body.style.background = b.color || '#10b981'; body.style.opacity = b.status === 'GHOST' ? '0.6' : '1'; }
    if (code) code.textContent = b.code || '';
  }
  function updateBuses(list) {
    var now = performance.now();
    var seen = {};
    (list || []).forEach(function(b) {
      seen[b.id] = true;
      var st = busMarkers[b.id] || createBus(b);
      styleBus(st, b);
      st.fromLat = st.lat; st.fromLng = st.lng;
      st.toLat = b.lat; st.toLng = b.lng;
      st.fromHeading = st.heading;
      st.toHeading = st.heading + shortestAngle(st.heading, Number(b.heading) || 0);
      // Si el salto es enorme (cambio de ruta), ubicar directo sin animar.
      var far = Math.abs(st.toLat - st.fromLat) + Math.abs(st.toLng - st.fromLng) > 0.01;
      st.start = far ? now - BUS_ANIM_MS : now;
    });
    Object.keys(busMarkers).forEach(function(id) {
      if (!seen[id]) { map.removeLayer(busMarkers[id].marker); delete busMarkers[id]; }
    });
  }
  function animateBuses() {
    var now = performance.now();
    Object.keys(busMarkers).forEach(function(id) {
      var st = busMarkers[id];
      var t = Math.min(1, (now - st.start) / BUS_ANIM_MS);
      st.lat = st.fromLat + (st.toLat - st.fromLat) * t;
      st.lng = st.fromLng + (st.toLng - st.fromLng) * t;
      var th = Math.min(1, t * 2.5);
      st.heading = st.fromHeading + (st.toHeading - st.fromHeading) * th;
      st.marker.setLatLng([st.lat, st.lng]);
      if (!st.el) { var r = st.marker.getElement(); st.el = r && r.querySelector('.rutea-bus-rot'); }
      if (st.el) st.el.style.transform = 'rotate(' + st.heading.toFixed(1) + 'deg)';
    });
    requestAnimationFrame(animateBuses);
  }

`;
