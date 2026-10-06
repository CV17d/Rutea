import { Injectable } from '@nestjs/common';

export interface TelemetryValidationResult {
  isValid: boolean;
  awardedPoints: number;
  reason?: string;
}

@Injectable()
export class GamificationService {
  private readonly MAX_URBAN_SPEED = 80.0; // km/h
  private readonly MIN_ACCURACY_METERS = 30.0; // metros

  validateAndCalculatePoints(
    speedKmh: number,
    accuracy: number,
    isSnappedToRoute: boolean,
    distanceMeters: number,
  ): TelemetryValidationResult {
    // 1. Anti-Spoofing: Precisión GPS insuficiente
    if (accuracy > this.MIN_ACCURACY_METERS) {
      return { isValid: false, awardedPoints: 0, reason: 'PRECISION_INSUFICIENTE' };
    }

    // 2. Anti-Spoofing: Velocidad sobrehumana urbana
    if (speedKmh > this.MAX_URBAN_SPEED) {
      return { isValid: false, awardedPoints: 0, reason: 'EXCESO_VELOCIDAD_ANOMALO' };
    }

    // 3. Validación de Ruta Oficial
    if (!isSnappedToRoute) {
      return { isValid: false, awardedPoints: 0, reason: 'FUERA_DE_TRAZADO_OFICIAL' };
    }

    // 4. Emisor estático que olvidó apagar
    if (speedKmh < 1.0 && distanceMeters < 5.0) {
      return { isValid: false, awardedPoints: 0, reason: 'EMISOR_ESTATICO' };
    }

    // Puntos otorgados: 2 puntos por paquete verificado en movimiento
    return {
      isValid: true,
      awardedPoints: 2,
    };
  }

  calculateLevel(points: number): string {
    if (points >= 300) return 'Embajador Supremo de Pasto';
    if (points >= 150) return 'Guía Mayor de Ruta';
    if (points >= 75) return 'Vigía del Galeras';
    if (points >= 30) return 'Pasajero Frecuente';
    return 'Caminante de Pasto';
  }
}
