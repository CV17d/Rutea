import { OSM_MAP_SCRIPT } from './osmMapScript';

export function buildOsmMapHtml(isDark: boolean): string {
  const bg = isDark ? '#0D1A20' : '#f8fafc';
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css" />
<style>
  html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: ${bg}; overflow: hidden; }
  .rutea-dark .leaflet-tile-pane { filter: invert(92%) hue-rotate(190deg) brightness(86%) contrast(92%); }
  .rutea-cluster {
    width: 28px; height: 28px; border-radius: 14px; background: #10b981; color: #fff;
    font: 800 12px/28px system-ui, sans-serif; text-align: center; border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  }
  .rutea-stop {
    width: 12px; height: 12px; border-radius: 6px; background: #fff; border: 3px solid #12A077;
    box-shadow: 0 1px 4px rgba(0,0,0,0.35);
  }
  .rutea-bus-icon { background: transparent; border: none; }
  .rutea-bus-rot { width: 22px; height: 44px; transform-origin: 50% 50%; will-change: transform; }
  .rutea-bus {
    position: relative; width: 20px; height: 42px; margin: 1px; border-radius: 7px 7px 5px 5px;
    border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 3px 8px rgba(0,0,0,0.45);
    overflow: hidden; box-sizing: border-box; background: #10b981;
  }
  .rutea-lights { display: flex; justify-content: space-between; padding: 1px 2px 0; height: 3px; }
  .rutea-lights i { display: block; width: 4px; height: 2px; border-radius: 1px; background: #fef08a; }
  .rutea-windshield { margin: 0 2px; height: 8px; background: rgba(15,23,42,0.85); border-radius: 3px 3px 1px 1px; }
  .rutea-code {
    margin-top: 5px; color: #fff; font: 800 7px/9px system-ui, sans-serif; text-align: center;
    transform: rotate(90deg); white-space: nowrap;
  }
  .rutea-rear { position: absolute; left: 3px; right: 3px; bottom: 3px; height: 4px; background: rgba(15,23,42,0.55); border-radius: 1px; }
  .leaflet-control-attribution { font-size: 8px !important; opacity: 0.75; }
  .rutea-report {
    display: flex; align-items: center; gap: 7px; padding: 6px 10px 6px 8px; border-radius: 14px;
    background: rgba(20, 36, 44, 0.96); border: 1px solid rgba(255,255,255,0.08); max-width: 160px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.35); font-family: system-ui, -apple-system, sans-serif;
  }
  .rutea-dot { width: 9px; height: 9px; border-radius: 5px; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(255,255,255,0.08); }
  .rutea-rtitle { color: #ECF2F0; font-size: 11px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; letter-spacing: -0.1px; }
  .rutea-rsub { color: #A6B7B9; font-size: 9px; font-weight: 600; margin-top: 1px; }
  .rutea-cluster { background: #2BC495 !important; color: #062A1F !important; }
  .rutea-user-halo {
    width: 26px; height: 26px; border-radius: 13px; background: rgba(43,196,149,0.22);
    display: flex; align-items: center; justify-content: center;
  }
  .rutea-user {
    width: 12px; height: 12px; border-radius: 6px; background: #2BC495; border: 2px solid #fff;
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.js" onerror="var s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';document.head.appendChild(s);"></script>
<script>${OSM_MAP_SCRIPT}</script>
</body>
</html>`;
}
