import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.wrap}>
        <MaterialCommunityIcons name="alert-circle-outline" size={44} color="#10b981" />
        <Text style={styles.title}>Algo salió mal en la vista</Text>
        <Text style={styles.sub}>Toca reintentar para recargar el mapa de Pasto.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => this.setState({ hasError: false })}>
          <Text style={styles.btnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginTop: 12 },
  sub: { color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 18 },
  btn: { backgroundColor: '#10b981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});
