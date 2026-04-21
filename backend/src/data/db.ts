export interface Machine {
  id: string;
  name: string;
  status: 'RUNNING' | 'WARNING' | 'OFFLINE';
  temp: number;
  rpm: number;
  output: number;
  health: number;
}

export interface Shipment {
  id: string;
  route: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELAYED' | 'DELIVERED';
  eta: string;
  lat: number;
  lng: number;
}

export interface QualityLog {
  id: string;
  status: 'PASS' | 'FAIL';
  confidence: string;
}

export interface Analytics {
  productionTotal: number;
  defectRate: number;
  monthlySavings: number;
}

export interface ComponentMetric {
  label: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface TrackedComponent {
  id: string;
  name: string;
  category: string;
  metrics: ComponentMetric[];
  telemetryLog: any[]; // Used for charts
}

export interface DatabaseState {
  machines: Machine[];
  shipments: Shipment[];
  qualityLogs: QualityLog[];
  actions: string[];
  analytics: Analytics;
  components: TrackedComponent[];
}

const seedData: DatabaseState = {
  machines: [
    { id: 'SAT-01', name: 'Comms Payload Integrator', status: 'RUNNING', temp: 65, rpm: 1200, output: 45, health: 98 },
    { id: 'SAT-02', name: 'Thermal Shield Lathe', status: 'RUNNING', temp: 70, rpm: 3000, output: 120, health: 90 },
    { id: 'SAT-03', name: 'Gyroscope Calibrator X', status: 'RUNNING', temp: 55, rpm: 800, output: 300, health: 99 },
    { id: 'SAT-04', name: 'Solar Array Packager', status: 'RUNNING', temp: 60, rpm: 1500, output: 400, health: 95 }
  ],
  shipments: [
    { id: 'TRK-101', route: 'Clean Room 4 -> Launch Pad A', status: 'IN_TRANSIT', eta: '3h 15m', lat: 23.2599, lng: 77.4126 },
    { id: 'TRK-205', route: 'Testing Lab -> Assembly Deck', status: 'IN_TRANSIT', eta: '2h 45m', lat: 18.95, lng: 72.82 },
    { id: 'TRK-308', route: 'Propulsion Mfg -> Export Vault', status: 'IN_TRANSIT', eta: '5h 10m', lat: 28.6139, lng: 77.2090 }
  ],
  qualityLogs: [] as any[],
  actions: [] as string[],
  analytics: {
    productionTotal: 4200,
    defectRate: 1.2,
    monthlySavings: 15400
  },
  components: [
    {
      id: 'gyroscope',
      name: 'Gyroscope',
      category: 'Satellite',
      metrics: [
        { label: 'Calibration Accuracy', value: 99.99, unit: '%', trend: 'stable' },
        { label: 'Stability Variance', value: 0.002, unit: 'deg/h', trend: 'up' },
        { label: 'Failure Risk', value: 1.2, unit: '%', trend: 'down' },
        { label: 'Production Count', value: 34, unit: 'units', trend: 'stable' }
      ],
      telemetryLog: []
    },
    {
      id: 'solar_panel',
      name: 'Solar Panel Array',
      category: 'Satellite',
      metrics: [
        { label: 'Power Efficiency', value: 42.5, unit: '%', trend: 'up' },
        { label: 'Surface Defects', value: 0.3, unit: '%', trend: 'stable' },
        { label: 'Material Quality', value: 98.6, unit: '%', trend: 'up' },
        { label: 'Ready to Ship', value: 14, unit: 'units', trend: 'stable' }
      ],
      telemetryLog: []
    },
    {
      id: 'propulsion_unit',
      name: 'Propulsion Unit',
      category: 'Satellite',
      metrics: [
        { label: 'Pressure Tolerance', value: 15000, unit: 'psi', trend: 'stable' },
        { label: 'Seal Quality', value: 99.8, unit: '%', trend: 'stable' },
        { label: 'Safety Risk', value: 0.4, unit: '%', trend: 'down' },
        { label: 'Assembly Status', value: 85, unit: '%', trend: 'up' }
      ],
      telemetryLog: []
    },
    {
      id: 'camera_payload',
      name: 'Camera Payload',
      category: 'Satellite',
      metrics: [
        { label: 'Lens Alignment Score', value: 99.9, unit: '%', trend: 'stable' },
        { label: 'Sensor Quality', value: 98.5, unit: '%', trend: 'up' },
        { label: 'Packaging Readiness', value: 40, unit: '%', trend: 'up' },
        { label: 'Production Count', value: 5, unit: 'units', trend: 'stable' }
      ],
      telemetryLog: []
    },
    {
      id: 'generic_electronics',
      name: 'Microcontroller Core',
      category: 'Electronics',
      metrics: [
        { label: 'Yield Rate', value: 95.5, unit: '%', trend: 'stable' },
        { label: 'Processing Stability', value: 100, unit: '%', trend: 'stable' }
      ],
      telemetryLog: []
    }
  ]
};

// Global singleton DB
export let db: DatabaseState = JSON.parse(JSON.stringify(seedData));

export const resetDb = () => {
  db = JSON.parse(JSON.stringify(seedData));
};
