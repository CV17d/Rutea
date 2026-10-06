# 🚍 Rutea Pasto - Telemetría Colaborativa de Transporte Público

> **Repositorio Oficial:** [CV17d/Rutea](https://github.com/CV17d/Rutea.git)  
> **Ciudad:** San Juan de Pasto, Nariño, Colombia  
> **Versión:** MVP 1.0.0

---

## 🌟 Visión del Proyecto
Rutea transforma los smartphones de los pasajeros a bordo en balizas GPS en segundo plano (*crowdsourced telemetry*). Los pasajeros en espera visualizan la posición exacta proyectada ortogonalmente (*snap-to-route* con Turf.js) sobre las rutas de Pasto (C1, C16, E1, E4), calculando tiempos estimados de llegada (ETA) y visualizando reportes viales comunitarios con interfaces glassmórficas al 100% del viewport.

---

## 🏗️ Arquitectura del Sistema
- **Frontend:** React Native + Expo, NativeWind (Tailwind), react-native-maps, Zustand.
- **Backend:** NestJS, WebSockets con Socket.io, Turf.js para proyección espacial y buses fantasma.
- **Base de Datos:** PostgreSQL con extensión PostGIS para Supabase (`database/schema.sql`).
- **Gamificación:** Sistema de puntos comunitarios ("85 PTS") con algoritmos anti-spoofing y avatares procedurales pseudo-anónimos.

---

## 📱 Pantallas Principales
1. **Inicio (100% Viewport):** Mapa continuo de San Juan de Pasto con barra de búsqueda flotante glassmórfica y selector rápido de rutas.
2. **Ruta y Paraderos:** Tarjetas superpuestas translúcidas con tiempos de espera por paradero y bloque de alto contraste de tiempo estimado (ETA).
3. **A Bordo (Modo Emisor):** Rastreo Activo en Modo Bolsillo, contador de 85 PTS, botón de reporte de incidentes y feed de novedades viales.
4. **Avatares Procedurales:** Tarjeta emergente con alias nariñense (`CuyVeloz42`), puntos y reputación comunitaria al tocar cualquier bus en el mapa.

---

## 🚀 Guía de Inicio Rápido

### 1. Frontend Mobile (Expo)
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo de Expo
npm start
```

### 2. Backend NestJS
```bash
cd backend
npm install
npm run start:dev
```

### 3. Base de Datos (Supabase / PostGIS)
Ejecutar en el SQL Editor de Supabase:
1. `database/schema.sql` (Habilita PostGIS, tablas, índices GiST y funciones espaciales).
2. `database/seed_routes.sql` (Carga rutas C1, C16, E1, E4 y paraderos de Pasto).

---

## 🧪 Pruebas Unitarias
```bash
npm test
```
Ejecuta la suite de pruebas nativa para proyecciones Haversine, cálculo de tiempos ETA y reglas de anti-spoofing.

---

## 📄 Licencia
Proyecto desarrollado bajo licencia MIT para la comunidad de San Juan de Pasto.
