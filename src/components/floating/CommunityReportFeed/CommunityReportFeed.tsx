import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { ProceduralAvatar } from '../../avatar/ProceduralAvatar';
import { CommunityReport } from '../../../types/user.types';
import { formatRelativeTime } from '../../../utils/time.utils';

export interface CommunityReportFeedProps {
  reports?: CommunityReport[];
  onUpvote?: (reportId: string) => void;
}

const DEFAULT_REPORTS: CommunityReport[] = [
  {
    id: 'rep-1',
    category: 'TRAFFIC_JAM',
    title: 'Tráfico lento en Calle 18',
    description: 'Congestión vehicular por obras cerca a la Plaza del Carnaval.',
    reporterAlias: 'GalerasRunner19',
    reporterAvatarSeed: 'galeras19',
    timestamp: Date.now() - 240000,
    upvotes: 7,
    routeCode: 'C1',
  },
  {
    id: 'rep-2',
    category: 'DETOUR',
    title: 'Desvío temporal en Torobajo',
    description: 'Buses tomando carrera 30 por mantenimiento de vía.',
    reporterAlias: 'CuyVeloz42',
    reporterAvatarSeed: 'cuy42',
    timestamp: Date.now() - 600000,
    upvotes: 12,
    routeCode: 'C16',
  },
];

export const CommunityReportFeed: React.FC<CommunityReportFeedProps> = ({
  reports = DEFAULT_REPORTS,
  onUpvote,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>REPORTES EN VIVO DE LA COMUNIDAD</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {reports.map((report) => (
          <GlassCard key={report.id} style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <View style={styles.reporterInfo}>
                <ProceduralAvatar seed={report.reporterAvatarSeed} size={28} />
                <Text style={styles.alias}>{report.reporterAlias}</Text>
              </View>
              <Text style={styles.time}>{formatRelativeTime(report.timestamp)}</Text>
            </View>

            <Text style={styles.title}>{report.title}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {report.description}
            </Text>

            <View style={styles.footer}>
              {report.routeCode && (
                <View style={styles.routeTag}>
                  <Text style={styles.routeTagText}>Ruta {report.routeCode}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => onUpvote && onUpvote(report.id)}
                style={styles.upvoteBtn}
              >
                <Text style={styles.upvoteText}>👍 {report.upvotes}</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scroll: {
    paddingLeft: 16,
  },
  reportCard: {
    width: 250,
    marginRight: 12,
    borderRadius: 20,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alias: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  time: {
    color: '#94a3b8',
    fontSize: 10,
  },
  title: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  desc: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  routeTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  routeTagText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  upvoteBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  upvoteText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
