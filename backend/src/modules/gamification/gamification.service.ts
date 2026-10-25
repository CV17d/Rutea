import { Injectable } from '@nestjs/common';

export interface UserGamificationState {
  userId: string;
  totalPoints: number;
  currentRank: string;
  accumulatedMeters: number;
  lastAwardTime: number;
  lastLat?: number;
  lastLng?: number;
}

export interface GamificationReward {
  userId: string;
  awarded: number;
  totalPoints: number;
  currentRank: string;
  rankUp: boolean;
  reason?: string;
}

@Injectable()
export class GamificationService {
  private readonly sessions = new Map<string, UserGamificationState>();

  getRank(points: number): string {
    if (points >= 300) return 'Embajador Supremo de Pasto';
    if (points >= 150) return 'Chasqui Urbano';
    if (points >= 75) return 'Vigía del Galeras';
    if (points >= 30) return 'Pasajero Frecuente';
    return 'Cuy Novato';
  }

  validateAndCalculatePoints(
    speedKmh: number,
    accuracy: number,
    isSnapped: boolean,
    distance: number,
  ): { isValid: boolean; awardedPoints: number; reason?: string } {
    if (accuracy > 30.0) return { isValid: false, awardedPoints: 0, reason: 'PRECISION_INSUFICIENTE' };
    if (speedKmh > 80.0) return { isValid: false, awardedPoints: 0, reason: 'EXCESO_VELOCIDAD_ANOMALO' };
    if (!isSnapped) return { isValid: false, awardedPoints: 0, reason: 'FUERA_DE_TRAZADO_OFICIAL' };
    if (speedKmh < 1.0 && distance < 5.0) return { isValid: false, awardedPoints: 0, reason: 'EMISOR_ESTATICO' };
    return { isValid: true, awardedPoints: 2 };
  }

  processTelemetryReward(
    userId: string,
    lat: number,
    lng: number,
    now: number = Date.now(),
  ): GamificationReward {
    let state = this.sessions.get(userId);
    if (!state) {
      state = {
        userId,
        totalPoints: 0,
        currentRank: this.getRank(0),
        accumulatedMeters: 0,
        lastAwardTime: now,
        lastLat: lat,
        lastLng: lng,
      };
      this.sessions.set(userId, state);
    }

    let awarded = 0;
    const reasons: string[] = [];
    const prevRank = state.currentRank;

    // 1. Distancia recorrida (acumulación cada 500 metros = +1 punto)
    if (state.lastLat !== undefined && state.lastLng !== undefined) {
      const distance = this.haversine(state.lastLat, state.lastLng, lat, lng);
      // Validar que no sea un salto teleportado (> 2km en un solo intervalo)
      if (distance > 0 && distance < 2000) {
        state.accumulatedMeters += distance;
        if (state.accumulatedMeters >= 500) {
          const distPoints = Math.floor(state.accumulatedMeters / 500);
          awarded += distPoints;
          state.accumulatedMeters %= 500;
          reasons.push(`+${distPoints} pts por 500m recorridos`);
        }
      }
    }
    state.lastLat = lat;
    state.lastLng = lng;

    // 2. Tiempo continuo transmitiendo (cada 1 minuto continuo = +1 punto)
    const elapsedMs = now - state.lastAwardTime;
    if (elapsedMs >= 60000) {
      const timePoints = Math.floor(elapsedMs / 60000);
      awarded += timePoints;
      state.lastAwardTime = now;
      reasons.push(`+${timePoints} pts por transmisión continua`);
    }

    state.totalPoints += awarded;
    const newRank = this.getRank(state.totalPoints);
    const rankUp = newRank !== prevRank;
    state.currentRank = newRank;

    return {
      userId,
      awarded,
      totalPoints: state.totalPoints,
      currentRank: newRank,
      rankUp,
      reason: reasons.join(', ') || undefined,
    };
  }

  awardBonusPoints(userId: string, bonus: number, reason: string): GamificationReward {
    let state = this.sessions.get(userId);
    if (!state) {
      state = {
        userId,
        totalPoints: 0,
        currentRank: this.getRank(0),
        accumulatedMeters: 0,
        lastAwardTime: Date.now(),
      };
      this.sessions.set(userId, state);
    }

    const prevRank = state.currentRank;
    state.totalPoints += bonus;
    const newRank = this.getRank(state.totalPoints);
    state.currentRank = newRank;

    return {
      userId,
      awarded: bonus,
      totalPoints: state.totalPoints,
      currentRank: newRank,
      rankUp: newRank !== prevRank,
      reason,
    };
  }

  getSessionState(userId: string): UserGamificationState | undefined {
    return this.sessions.get(userId);
  }

  resetSession(userId: string): void {
    this.sessions.delete(userId);
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
