import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar comportamiento predeterminado en primer y segundo plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

export const PROXIMITY_CHANNEL_ID = 'proximity-alerts';

export interface ProximityNotificationPayload {
  routeCode: string;
  busId?: string;
  distanceMeters?: number;
}

export const notificationService = {
  /**
   * Configura canal de notificación con máxima prioridad, sonido y vibración en Android
   */
  async configureNotificationChannels(): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(PROXIMITY_CHANNEL_ID, {
        name: 'Alertas de Proximidad',
        description: 'Avisos cuando el bus está próximo a tu paradero',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
        sound: 'default',
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });
    }
  },

  /**
   * Solicita permisos de notificación y obtiene el token del dispositivo
   */
  async registerForPushNotificationsAsync(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      await this.configureNotificationChannels();

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[NotificationService] Permiso push no concedido');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      return tokenData.data;
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[NotificationService] Error push token:', error);
      return null;
    }
  },

  /**
   * Dispara una notificación push local de proximidad para despertar la pantalla
   */
  async scheduleProximityNotification(payload: ProximityNotificationPayload): Promise<string> {
    const routeCode = payload.routeCode || 'SETPasto';
    const message = `¡Prepárate! La ruta ${routeCode} está llegando a tu parada`;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '¡Prepárate!',
        body: message,
        sound: true,
        vibrate: [0, 250, 250, 250],
        priority: Notifications.AndroidNotificationPriority.MAX,
        color: '#10b981',
        data: {
          routeCode,
          busId: payload.busId,
          distanceMeters: payload.distanceMeters,
        },
      },
      trigger: null, // Disparo local inmediato
    });
  },
};
