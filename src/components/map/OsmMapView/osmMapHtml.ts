import { OSM_MAP_SCRIPT } from './osmMapScript';

export function buildOsmMapHtml(isDark: boolean): string {
  const bg = isDark ? '#070b13' : '#f8fafc';
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
    width: 12px; height: 12px; border-radius: 6px; background: #fff; border: 3px solid #0284c7;
    box-shadow: 0 1px 4px rgba(0,0,0,0.35);
  }
  .rutea-bus {
    width: 20px; height: 42px; border-radius: 6px; border: 1.5px solid rgba(255,255,255,0.85);
    box-shadow: 0 3px 8px rgba(0,0,0,0.45); overflow: hidden; box-sizing: border-box;
  }
  .rutea-windshield {
    width: 100%; height: 9px; background: rgba(0,0,0,0.72); border-radius: 4px 4px 0 0;
  }
  .rutea-report {
    display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 12px;
    background: rgba(15, 23, 42, 0.94); border: 1.5px solid #f59e0b; max-width: 148px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.45); font-family: system-ui, sans-serif;
  }
  .rutea-dot { width: 8px; height: 8px; border-radius: 4px; flex-shrink: 0; }
  .rutea-rtitle { color: #fff; font-size: 10px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 112px; }
  .rutea-rsub { color: #fbbf24; font-size: 8px; font-weight: 600; }
  .rutea-user-halo {
    width: 26px; height: 26px; border-radius: 13px; background: rgba(2,132,199,0.22);
    display: flex; align-items: center; justify-content: center;
  }
  .rutea-user {
    width: 12px; height: 12px; border-radius: 6px; background: #0284c7; border: 2px solid #fff;
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
