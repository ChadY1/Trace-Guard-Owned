// IntelService : fournit des vues synthétiques pour l'IMINT, l'OSINT et la surveillance géopolitique.
// Les données sont simulées pour faciliter le prototypage légal et auditable.

export type IntelSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ImintSource {
  id: string;
  platform: 'SATELLITE' | 'UAV' | 'FIXED';
  description: string;
  lastCaptureIso: string;
  status: 'ACTIVE' | 'PAUSED';
  spectrum: 'EO' | 'IR' | 'MULTISPECTRAL' | 'SAR';
}

export interface OsintStream {
  id: string;
  keyword: string;
  language: string;
  volumeLastHour: number;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sources: string[];
}

export interface GeopoliticalSignal {
  region: string;
  indicator: string;
  severity: IntelSeverity;
  updatedAt: string;
  summary: string;
}

export interface IntelOverview {
  imint: {
    activeSources: number;
    pausedSources: number;
    pendingAnalyses: number;
    lastCaptureIso: string;
    sampleSources: ImintSource[];
  };
  osint: {
    activeStreams: number;
    avgVolumeLastHour: number;
    sampleStreams: OsintStream[];
  };
  geopolitics: {
    trackedRegions: number;
    highRiskSignals: number;
    sampleSignals: GeopoliticalSignal[];
  };
}

export class IntelService {
  private readonly imintSources: ImintSource[] = [
    {
      id: 'imint-geo-1',
      platform: 'SATELLITE',
      description: 'Observation optique haute résolution sur zone prioritaire',
      lastCaptureIso: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      spectrum: 'EO',
    },
    {
      id: 'imint-uav-1',
      platform: 'UAV',
      description: 'Drone tactique autorisé pour couverture de site critique',
      lastCaptureIso: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      spectrum: 'IR',
    },
    {
      id: 'imint-fixed-1',
      platform: 'FIXED',
      description: 'Caméra fixe périmètre avec capteur multispectral',
      lastCaptureIso: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'PAUSED',
      spectrum: 'MULTISPECTRAL',
    },
  ];

  private readonly osintStreams: OsintStream[] = [
    {
      id: 'osint-keyword-geo',
      keyword: 'infrastructure critique',
      language: 'fr',
      volumeLastHour: 240,
      sentiment: 'NEUTRAL',
      sources: ['flux RSS officiels', 'fils d’actualité régionaux'],
    },
    {
      id: 'osint-keyword-supply',
      keyword: 'rupture logistique',
      language: 'en',
      volumeLastHour: 180,
      sentiment: 'NEGATIVE',
      sources: ['sites gouvernementaux', 'presse spécialisée'],
    },
  ];

  private readonly geopoliticalSignals: GeopoliticalSignal[] = [
    {
      region: 'Europe centrale',
      indicator: 'Tension énergétique',
      severity: 'MEDIUM',
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      summary: 'Hausse de prix et tensions d’approvisionnement rapportées par plusieurs sources officielles.',
    },
    {
      region: 'Afrique du Nord',
      indicator: 'Manifestations locales',
      severity: 'LOW',
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      summary: 'Signal faible de manifestations, aucune infrastructure critique affectée à ce stade.',
    },
    {
      region: 'Asie-Pacifique',
      indicator: 'Sanctions commerciales',
      severity: 'HIGH',
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      summary: 'Annonces de sanctions ciblées nécessitant revue des dépendances fournisseurs.',
    },
  ];

  getOverview(): IntelOverview {
    const activeSources = this.imintSources.filter((s) => s.status === 'ACTIVE').length;
    const pausedSources = this.imintSources.length - activeSources;
    const lastCaptureIso = this.imintSources.reduce(
      (latest, current) => (current.lastCaptureIso > latest ? current.lastCaptureIso : latest),
      this.imintSources[0]?.lastCaptureIso ?? new Date().toISOString(),
    );
    const avgVolume = this.osintStreams.reduce((acc, stream) => acc + stream.volumeLastHour, 0) / this.osintStreams.length;
    const highRiskSignals = this.geopoliticalSignals.filter((signal) => signal.severity === 'HIGH').length;

    return {
      imint: {
        activeSources,
        pausedSources,
        pendingAnalyses: 3,
        lastCaptureIso,
        sampleSources: this.imintSources,
      },
      osint: {
        activeStreams: this.osintStreams.length,
        avgVolumeLastHour: Math.round(avgVolume),
        sampleStreams: this.osintStreams,
      },
      geopolitics: {
        trackedRegions: this.geopoliticalSignals.length,
        highRiskSignals,
        sampleSignals: this.geopoliticalSignals,
      },
    };
  }

  listImintSources(): ImintSource[] {
    return this.imintSources;
  }

  listOsintStreams(): OsintStream[] {
    return this.osintStreams;
  }

  listGeopoliticalSignals(): GeopoliticalSignal[] {
    return this.geopoliticalSignals;
  }
}
