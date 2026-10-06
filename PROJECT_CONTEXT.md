# 📋 PROJECT_CONTEXT.md: Rutas Pasto (Rutea)
> **Fuente Única de la Verdad (Single Source of Truth - SSOT)**  
> **Repositorio Oficial:** [CV17d/Rutea](https://github.com/CV17d/Rutea.git)  
> **Rol:** Senior Software Architect & Lead Developer  
> **Versión del Documento:** 1.0.0  
> **Última Actualización:** Octubre 2026  

---

## 📑 Tabla de Contenidos
1. [Visión y Contexto Global del Sistema](#1-visión-y-contexto-global-del-sistema)
2. [Mecánicas Core del Negocio](#2-mecánicas-core-del-negocio)
   - [2.1 App Unificada: Roles Duales Dinámicos](#21-app-unificada-roles-duales-dinámicos)
   - [2.2 Onboarding Progresivo y Privacidad Radical](#22-onboarding-progresivo-y-privacidad-radical)
   - [2.3 Motor de Gamificación Comunitaria](#23-motor-de-gamificación-comunitaria)
   - [2.4 Map-Matching y Filtro Espacial](#24-map-matching-y-filtro-espacial)
   - [2.5 Estrategia de Arranque en Frío (Cold Start & Buses Fantasma)](#25-estrategia-de-arranque-en-frío-cold-start--buses-fantasma)
3. [Stack Tecnológico Definitivo](#3-stack-tecnológico-definitivo)
4. [Reglas Estrictas de Diseño UI/UX](#4-reglas-estrictas-de-diseño-uiux)
5. [Estándares de Código y Arquitectura del Frontend](#5-estándares-de-código-y-arquitectura-del-frontend)
   - [5.1 Regla Sagrada de Extensión de Archivos](#51-regla-sagrada-de-extensión-de-archivos)
   - [5.2 Estructura Modular de Directorios (Frontend)](#52-estructura-modular-de-directorios-frontend)
   - [5.3 Estructura Modular Sugerida (Backend NestJS)](#53-estructura-modular-sugerida-backend-nestjs)
6. [Protocolo Obligatorio de Git y Commits](#6-protocolo-obligatorio-de-git-y-commits)
7. [Fases y Roadmap de Ejecución](#7-fases-y-roadmap-de-ejecución)
8. [Checklists de Calidad y Gobernanza](#8-checklists-de-calidad-y-gobernanza)

---

## 1. Visión y Contexto Global del Sistema

En la ciudad de **San Juan de Pasto (Nariño, Colombia)**, el transporte público colectivo enfrenta una brecha crítica: la ausencia de telemetría y rastreo satelital oficial accesible al ciudadano en tiempo real. Los usuarios sufren largos tiempos de espera, incertidumbre sobre la frecuencia de las rutas y desinformación respecto a desvíos o congestiones.

**Rutas Pasto (Rutea)** nace como una solución descentralizada, colaborativa (*crowdsourced*) y comunitaria. El sistema convierte los teléfonos inteligentes de los propios pasajeros que van a bordo de los buses en balizas móviles de telemetría GPS. Al procesar estos flujos de datos en tiempo real mediante algoritmos espaciales y WebSockets, la plataforma predice con precisión los tiempos estimados de llegada (ETA) y visualiza en vivo la posición de los vehículos para todos los ciudadanos en las paradas o en sus hogares.

---

## 2. Mecánicas Core del Negocio

```
                     ┌─────────────────────────────────────────────────────┐
                     │           PASAJERO A BORDO (EMISOR GPS)             │
                     │  - Sesión Pseudo-anónima (Avatar + Alias)           │
                     │  - Emite GPS en segundo plano (expo-location)       │
                     └──────────────────────────┬──────────────────────────┘
                                                │ (Telemetría cruda)
                                                ▼
                     ┌─────────────────────────────────────────────────────┐
                     │               BACKEND (NestJS + PostGIS)            │
                     │  1. Filtro de Ruido & Outliers                      │
                     │  2. Map-Matching ortogonal (Turf.js sobre trazado)  │
                     │  3. Motor de Inferencia (Cold Start / Buses Fan.)   │
                     │  4. Distribución en Rooms vía Socket.io             │
                     └──────────────────────────┬──────────────────────────┘
                                                │ (Broadcast proyectado)
                                                ▼
                     ┌─────────────────────────────────────────────────────┐
                     │           PASAJERO EN ESPERA (RECEPTOR)             │
                     │  - Mapa a pantalla completa (100% viewport)         │
                     │  - Tarjetas flotantes glassmórficas                 │
                     │  - Tiempos de llegada (ETA) en vivo                 │
                     └─────────────────────────────────────────────────────┘
```

### 2.1 App Unificada: Roles Duales Dinámicos
No existen dos aplicaciones separadas (conductor/pasajero). Una sola aplicación React Native gestiona dos comportamientos intercambiables de forma fluida:
* **Modo Receptor (Por Defecto):**
  - Pasajero que planea su viaje o espera en la parada.
  - Consume eventos WebSocket suscritos a las rutas de su interés.
  - Visualiza buses en movimiento fluido, calcula distancias y tiempos de arribo.
* **Modo Emisor (A Bordo):**
  - El usuario confirma que subió a una ruta específica (ej: "Ruta C1 - Catambuco").
  - La aplicación solicita permisos y activa el servicio de fondo (`expo-location` en background task).
  - Emite paquetes de telemetría periódicos (latitud, longitud, rumbo, velocidad, timestamp).
  - Puede cancelar la emisión en cualquier momento o el sistema la suspende automáticamente al detectar parada prolongada fuera de ruta o exceso de velocidad (ej. vehículo particular).

### 2.2 Onboarding Progresivo y Privacidad Radical
* **Cero Fricción:** El usuario abre la app y tiene acceso inmediato al mapa en vivo sin pantallas de registro forzado ni captchas.
* **Sesiones Pseudo-Anónimas:**
  - Integración nativa con Supabase Anonymous Authentication o generación de ID de dispositivo UUID seguro.
  - **Identidad Gráfica:** Ningún usuario utiliza foto real. Cada emisor cuenta con:
    1. Un **avatar procedural** generado algorítmicamente a partir de un seed único (DiceBear o SVG nativo).
    2. Un **alias pseudo-anónimo** generado con identidad local (ej: `CuyVeloz42`, `GalerasRunner`, `NariñoTransit7`).
  - Cumplimiento de privacidad: la posición no se asocia a nombres, teléfonos ni cédulas.

### 2.3 Motor de Gamificación Comunitaria
* **Puntos por Emisión Verificada:**
  - Los usuarios que emiten datos válidos acumulan "Puntos de Ruta" basados en tiempo y metros recorridos sobre el trazado oficial.
* **Interacción Social en el Mapa:**
  - Al presionar sobre el avatar de un emisor activo en el mapa, se despliega una tarjeta glassmórfica flotante con:
    * Alias del emisor y avatar procedural.
    * Nivel de reputación / Puntos comunitarios.
    * Estado de la transmisión (ej: "A bordo hace 8 min").
* **Sistemas Anti-Trampa (Anti-Spoofing):**
  - Descarte automático de telemetría con saltos espaciales no físicos (> 80 km/h en trama urbana).
  - Detección de emisores estáticos que olvidaron desactivar el modo a bordo.

### 2.4 Map-Matching y Filtro Espacial
El GPS de los dispositivos móviles presenta dispersión por cañones urbanos, nubosidad o reflejos de señal.
* **Filtro de Entrada:** Validación de precisión horizontal (Accuracy < 25m) y velocidad mínima/máxima.
* **Proyección Matemática (Snap-to-Route):**
  - Uso de **Turf.js** (`pointToLineDistance`, `nearestPointOnLine`) en el procesamiento del backend o en borde.
  - La posición GPS cruda se proyecta ortogonalmente sobre el segmento de línea más cercano del GeoJSON de la ruta oficial de Pasto.
  - Si la distancia euclidiana entre la posición y el trazado excede un umbral de tolerancia (ej: 40 metros), el paquete se clasifica como desvío o anomalía y no se propaga a la ruta pública.
* **Interpolación Suave:** La posición emitida se envía al cliente receptor con velocidad y rumbo (*bearing*), permitiendo interpolación (*dead reckoning*) para movimientos fluidos a 60 FPS sin saltos toscos.

### 2.5 Estrategia de Arranque en Frío (Cold Start & Buses Fantasma)
Durante horarios valle o rutas con baja penetración de usuarios, el sistema no muestra un mapa desierto:
* **Algoritmo de Buses Fantasma:**
  - Cuando una ruta activa no tiene emisores reales reportando en un lapso determinado, el backend calcula posiciones estimadas basadas en la frecuencia programada y la velocidad media histórica del corredor vial.
* **Transparencia Visual:**
  - El bus fantasma se representa con estilo visual diferenciado: opacidad reducida (60%), contorno punteado o badge flotante con la etiqueta *"Estimado"*.
  - En cuanto un emisor real se conecta a esa ruta, el bus fantasma se desvanece de inmediato o converge hacia la posición real verificada (*Badge "En Vivo"* con indicador pulsante verde).

---

## 3. Stack Tecnológico Definitivo

| Capa / Dominio | Tecnología | Justificación y Responsabilidad |
| :--- | :--- | :--- |
| **Frontend Mobile** | **React Native + Expo** | Desarrollo multiplataforma nativo de alto rendimiento. Acceso robusto a APIs nativas de geolocalización. |
| **GPS en Background** | **`expo-location` + TaskManager** | Ejecución en segundo plano persistente para usuarios emisores a bordo del transporte público. |
| **Mapas & Render** | **`react-native-maps`** | Renderizado nativo y acelerado por hardware del mapa completo de Pasto con marcadores dinámicos. |
| **Estilos & UI** | **NativeWind (Tailwind CSS)** | Sistema de diseño atómico y utilitario, altamente consistente y adaptable a pantallas móviles. |
| **Efectos Glassmorphism**| **`expo-blur` / LinearGradient** | Desenfoque de fondo (*frosted glass*), transparencias y bordes luminosos flotantes. |
| **Estado Global** | **Zustand** | Gestión de estado atómica, sin *boilerplate*, ultra ligera y de alto rendimiento para flujos en tiempo real. |
| **Backend Framework** | **NestJS (TypeScript)** | Arquitectura modular empresarial basada en controladores, servicios, inyección de dependencias y *gateways*. |
| **Tiempo Real** | **Socket.io** | Protocolo bidireccional de baja latencia con soporte para *rooms* divididas por rutas activas de Pasto. |
| **Cálculo Geoespacial** | **Turf.js** | Algoritmos geoespaciales en memoria: cálculo de distancias, rumbos, proyecciones ortogonales (*snap-to-route*). |
| **Base de Datos** | **Supabase (PostgreSQL + PostGIS)** | Almacenamiento relacional con extensiones espaciales indispensables para indexación GiST, `ST_DWithin` y trazados de rutas. |
| **Autenticación** | **Supabase Auth** | Autenticación anónima inmediata y migración opcional a cuentas persistentes sin fricción. |
| **Control de Versiones**| **Git + GitHub** | Registro atómico del historial del proyecto bajo lineamientos de *Conventional Commits*. |

---

## 4. Reglas Estrictas de Diseño UI/UX

```
┌────────────────────────────────────────────────────────────────────────┐
│ [ MAPA COMPLETO DE PASTO - 100% VIEWPORT EN FONDO CONTINUO ]           │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 [Barra Flotante Glassmorfismo: "Buscar Ruta (C1, E1, C16)..."]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│                🚍 [Marcador Real: Pulso Verde]                         │
│                    │                                                   │
│                    ▼ (Al presionar)                                    │
│             ┌──────────────────────────────────────────────┐           │
│             │ 🪟 [TARJETA FLOTANTE GLASSMORFISMO]          │           │
│             │  👤 CuyVeloz42 • ⭐ 340 pts                  │           │
│             │  ⏱️ PRÓXIMA PARADA: 4 MIN (Neobrutalismo)    │           │
│             │  📍 Calle 18 con Cra 27 - Centro             │           │
│             └──────────────────────────────────────────────┘           │
│                                                                        │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ⚡ [Botón Flotante Acción: "Estoy a bordo de esta ruta"]          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Pantalla Completa Permanente (100% Viewport):**
   - El mapa de Pasto es la base y el lienzo permanente de la aplicación.
   - Prohibido navegar a pantallas blancas o pantallas completas tradicionales que oculten el mapa. Cualquier detalle o menú se presenta como *Bottom Sheets*, tarjetas flotantes o modales translúcidos.
2. **Glassmorfismo Puro:**
   - Todo panel, tarjeta de ruta, botón de acción y tooltip flota sobre el mapa.
   - Fondos con desenfoque de cristal (`backdrop-blur-md` o `BlurView` con intensidad calibrada), fondos translúcidos (`bg-white/10` en Dark Mode o `bg-slate-900/60`), bordes sutiles de alta luminosidad (`border border-white/20`) y esquinas redondeadas generosas (`rounded-2xl`, `rounded-3xl`).
3. **Neobrutalismo Suave y Tipografía Contundente:**
   - Tipografía pesada (*ExtraBold / Black*) y números grandes para los datos críticos: tiempos de llegada (**"5 MIN"**), números de ruta (**"C1"**, **"E4"**) y puntajes.
   - Elevado contraste legible bajo la luz solar directa en la calle.
4. **Micro-interacciones y Feedback Háptico:**
   - Pulsos dinámicos en los marcadores de buses con transmisión activa en vivo.
   - Respuesta háptica suave (`expo-haptics`) al alternar entre modo receptor y emisor.

---

## 5. Estándares de Código y Arquitectura del Frontend

### 5.1 Regla Sagrada de Extensión de Archivos
> ⚠️ **LÍMITE ESTRICTO:** Ningún archivo de código fuente debe superar las **150 - 200 líneas**.  
> Si un archivo alcanza las 150 líneas, es obligatorio refactorizar separando subcomponentes, abstrayendo lógica en *custom hooks* o moviendo constantes a archivos auxiliares.

### 5.2 Estructura Modular de Directorios (Frontend)
El código debe organizarse rigurosamente por responsabilidad atómica:

```
app_mobile/
├── assets/                       # Íconos, fuentes, GeoJSON base de rutas de Pasto
├── src/
│   ├── components/               # Componentes visuales atómicos e independientes
│   │   ├── ui/                   # Componentes base (GlassCard, GlassButton, Typography)
│   │   │   ├── GlassCard/
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── GlassCard.styles.ts
│   │   │   │   └── index.ts
│   │   │   └── GlassButton/
│   │   │       ├── GlassButton.tsx
│   │   │       └── index.ts
│   │   ├── map/                  # Elementos específicos del mapa
│   │   │   ├── MapContainer/
│   │   │   ├── BusMarker/
│   │   │   ├── RoutePolyline/
│   │   │   └── UserAvatarMarker/
│   │   └── floating/             # Paneles flotantes sobre el mapa
│   │       ├── RouteSelector/
│   │       ├── UserProfileCard/
│   │       └── EmissionControlBar/
│   ├── hooks/                    # Lógica y efectos reutilizables
│   │   ├── useLocationTracker.ts # Hook para activar expo-location en background
│   │   ├── useSocketRoutes.ts    # Suscripción a eventos Socket.io por ruta
│   │   ├── useMapCamera.ts       # Control de zoom y centrado en la ciudad
│   │   └── useRouteMatching.ts   # Snap-to-route local si aplica
│   ├── store/                    # Estado global con Zustand
│   │   ├── useRoutesStore.ts     # Catálogo de rutas, ruta seleccionada, polilíneas
│   │   ├── useTrackingStore.ts   # Buses activos, telemetría recibida
│   │   ├── useUserSessionStore.ts# Rol (Emisor/Receptor), alias, puntos
│   │   └── useUiStore.ts         # Estados de paneles flotantes y modales
│   ├── services/                 # Clientes externos
│   │   ├── api.client.ts         # Peticiones HTTP a NestJS
│   │   ├── socket.client.ts      # Conexión persistente Socket.io
│   │   └── supabase.client.ts    # Cliente oficial Supabase
│   ├── utils/                    # Funciones puras y cálculos matemáticos
│   │   ├── geo.utils.ts          # Wrappers de Turf.js (distancias, snap, bearing)
│   │   ├── time.utils.ts         # Formateo de tiempos y cálculo de ETA
│   │   └── avatar.utils.ts       # Generación de avatares procedurales
│   ├── constants/                # Constantes del sistema
│   │   ├── pastoCoordinates.ts   # Límites geográficos y centro de San Juan de Pasto
│   │   └── theme.constants.ts    # Colores, tokens de glassmorfismo y fuentes
│   └── types/                    # Interfaces y contratos TypeScript
│       ├── route.types.ts
│       ├── telemetry.types.ts
│       └── user.types.ts
├── App.tsx                       # Punto de entrada de la aplicación
├── app.json                      # Configuración de Expo y permisos nativos
├── tailwind.config.js            # Configuración de NativeWind
├── tsconfig.json                 # Configuración de TypeScript
└── PROJECT_CONTEXT.md            # Fuente de la verdad (este archivo)
```

### 5.3 Estructura Modular Sugerida (Backend NestJS)
Para mantener coherencia cuando se construya el servicio de backend:
```
backend/
├── src/
│   ├── modules/
│   │   ├── routes/               # Rutas de buses de Pasto (CRUD + GeoJSON)
│   │   ├── telemetry/            # Ingesta de coordenadas crudas de emisores
│   │   ├── tracking/             # Socket.io Gateway y gestión de rooms
│   │   ├── matching/             # Lógica de Map-matching (Turf.js) y Ghost Buses
│   │   ├── gamification/         # Cálculo y asignación de puntos comunitarios
│   │   └── users/                # Gestión de sesiones pseudo-anónimas
│   ├── common/                   # Filtros, interceptores, guards y decoradores
│   └── main.ts                   # Bootstrap de la aplicación NestJS
```

---

## 6. Protocolo Obligatorio de Git y Commits

El desarrollo exige trazabilidad granular y commits atómicos. Ningún desarrollo debe acumular cambios dispersos o desordenados.

### 6.1 Reglas Fundamentales
1. **Commits Atómicos:** Un commit por cada unidad funcional, componente o refactorización específica. Nunca agrupar múltiples componentes no relacionados en un solo commit.
2. **Conventional Commits:** Uso estricto de la especificación estándar con tipo y ámbito (*scope*):
   - `feat(<ámbito>): <descripción>` para nuevas funcionalidades.
   - `fix(<ámbito>): <descripción>` para corrección de errores.
   - `refactor(<ámbito>): <descripción>` para reestructuración de código sin alterar comportamiento.
   - `style(<ámbito>): <descripción>` para ajustes de UI, estilos visuales o formato.
   - `chore(<ámbito>): <descripción>` para configuración de herramientas, dependencias o estructura.
   - `docs(<ámbito>): <descripción>` para documentación técnica.

### 6.2 Ejemplos Obligatorios
* `docs: crear PROJECT_CONTEXT.md con especificación arquitectónica completa`
* `chore: inicializar proyecto Expo con soporte NativeWind y TypeScript`
* `feat(ui): crear componente GlassCard con soporte de desenfoque nativo`
* `feat(map): implementar MapContainer centrado en coordenadas de Pasto`
* `feat(gps): configurar background task con expo-location para modo emisor`
* `fix(matching): corregir umbral de tolerancia en proyección de línea de Turf.js`
* `refactor(store): modularizar estado de seguimiento en useTrackingStore`

---

## 7. Fases y Roadmap de Ejecución

```
  [ FASE 0 ] Arquitectura, Repositorio y Entorno Base
       │
  [ FASE 1 ] Frontend Base: Mapa de Pasto (100% Viewport) y Componentes Glassmorfismo
       │
  [ FASE 2 ] Backend Core: NestJS + Supabase (PostGIS) + Trazado GeoJSON de Rutas
       │
  [ FASE 3 ] Telemetría y Tiempo Real: Background GPS + Socket.io + Map-Matching
       │
  [ FASE 4 ] Gamificación, Cold Start (Buses Fantasma) y Pulido de Producción
```

### Detalle de Fases:
* **Fase 0: Configuración y Gobernanza**
  - Creación del archivo `PROJECT_CONTEXT.md`.
  - Inicialización del repositorio base con tooling de linting, tipado y dependencias esenciales.
* **Fase 1: Capa Visual y Mapa Interactivo**
  - Configuración del mapa base centrado en San Juan de Pasto (`react-native-maps`).
  - Creación del sistema de diseño Glassmorphic (tarjetas, botones, avatares flotantes).
  - Selector de rutas flotante y visualización de polilíneas.
* **Fase 2: Persistencia Geoespacial y Servicios**
  - Configuración de Supabase con extensión PostGIS habilitada.
  - Carga de GeoJSON representativo de rutas emblemáticas de Pasto (ej: C1, C16, E1).
  - Creación de APIs y contratos de datos para rutas y paraderos.
* **Fase 3: Transmisión y Map-Matching**
  - Implementación del modo Emisor con `expo-location` en segundo plano.
  - Gateway de Socket.io en NestJS para rooms por ruta.
  - Algoritmo de filtrado de ruido y proyección sobre polilínea con Turf.js.
* **Fase 4: Gamificación y Madurez Operativa**
  - Asignación de puntos a emisores activos.
  - Algoritmo de simulación de "Buses Fantasma" para arranque en frío.
  - Pruebas de campo simuladas y optimización de consumo de batería en el dispositivo móvil.

---

## 8. Checklists de Calidad y Gobernanza

### ✅ Checklist Arquitectónico
- [x] Especificación de roles duales (Receptor / Emisor) definida.
- [x] Privacidad por diseño (pseudo-anonimato, avatares procedurales) garantizada.
- [x] Motor geoespacial definido (PostGIS en persistencia, Turf.js en procesamiento dinámico).
- [x] Estrategia de arranque en frío (*Cold Start*) documentada.

### ✅ Checklist UI/UX
- [ ] El mapa cubre el 100% de la pantalla sin pantallas secundarias que lo reemplacen.
- [ ] Todos los contenedores de control utilizan efectos de vidrio esmerilado (*glassmorphism*).
- [ ] La tipografía clave sigue lineamientos legibles y neobrutalistas suaves.
- [ ] Los marcadores diferencian visualmente buses en vivo de estimaciones fantasma.

### ✅ Checklist de Calidad de Código
- [ ] Todos los archivos tienen menos de 150 - 200 líneas de código.
- [ ] Cada componente visual cuenta con su propio directorio modular en `/src/components`.
- [ ] La lógica asíncrona y de sensores vive exclusivamente en `/src/hooks`.
- [ ] El estado global está desacoplado en tiendas atómicas de Zustand en `/src/store`.

### ✅ Checklist de Flujo Git
- [ ] Cada cambio funcional se guarda en un commit individual y atómico.
- [ ] Los mensajes de commit cumplen la convención `tipo(ámbito): descripción`.
- [ ] El repositorio remoto `https://github.com/CV17d/Rutea.git` permanece sincronizado.

---
*Este documento es de estricto cumplimiento para todos los agentes, desarrolladores y colaboradores del proyecto Rutas Pasto (Rutea).*
