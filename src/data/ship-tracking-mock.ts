// Mock data for ship tracking dashboard

export interface Vessel {
  id: string
  name: string
  imo: string
  type: 'Container' | 'Bulk Carrier' | 'Tanker' | 'RoRo'
  flag: string
  status: 'In Transit' | 'At Port' | 'Anchored' | 'Delayed'
  position: {
    lat: number
    lng: number
  }
  destination: string
  eta: string
  speed: number // knots
  heading: number // degrees
  cargo: string
}

export interface Shipment {
  id: string
  bookingRef: string
  vesselId: string
  vesselName: string
  origin: string
  destination: string
  departureDate: string
  arrivalDate: string
  eta: string
  status: 'Pending' | 'In Transit' | 'Customs' | 'Delivered' | 'Delayed'
  containers: number
  weight: number // tons
  value: number // USD
  customer: string
  documents: Document[]
}

export interface Document {
  id: string
  shipmentId: string
  type: 'Bill of Lading' | 'Commercial Invoice' | 'Packing List' | 'Certificate of Origin' | 'Customs Declaration' | 'Insurance Certificate'
  name: string
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected'
  uploadedAt: string
  uploadedBy: string
  fileSize: string
}

export interface Port {
  id: string
  name: string
  code: string
  country: string
  position: {
    lat: number
    lng: number
  }
  type: 'Origin' | 'Destination' | 'Transit'
}

// Mock Vessels
export const vessels: Vessel[] = [
  {
    id: 'v1',
    name: 'MSC AURORA',
    imo: 'IMO9839430',
    type: 'Container',
    flag: 'Panama',
    status: 'In Transit',
    position: { lat: 25.7617, lng: -80.1918 },
    destination: 'Rotterdam, Netherlands',
    eta: '2024-02-25',
    speed: 18.5,
    heading: 45,
    cargo: 'Mixed Goods',
  },
  {
    id: 'v2',
    name: 'EVER GIVEN',
    imo: 'IMO9811000',
    type: 'Container',
    flag: 'Panama',
    status: 'At Port',
    position: { lat: 51.9054, lng: 4.4661 },
    destination: 'Rotterdam, Netherlands',
    eta: '2024-02-20',
    speed: 0,
    heading: 180,
    cargo: 'Electronics',
  },
  {
    id: 'v3',
    name: 'MAERSK EMERALD',
    imo: 'IMO9778791',
    type: 'Container',
    flag: 'Denmark',
    status: 'In Transit',
    position: { lat: 35.6762, lng: 139.6503 },
    destination: 'Los Angeles, USA',
    eta: '2024-03-01',
    speed: 21.2,
    heading: 90,
    cargo: 'Automotive Parts',
  },
  {
    id: 'v4',
    name: 'CMA CGM LIBERTY',
    imo: 'IMO9882530',
    type: 'Container',
    flag: 'France',
    status: 'Delayed',
    position: { lat: 1.3521, lng: 103.8198 },
    destination: 'Hamburg, Germany',
    eta: '2024-02-28',
    speed: 12.8,
    heading: 270,
    cargo: 'Textiles',
  },
  {
    id: 'v5',
    name: 'OCEAN PIONEER',
    imo: 'IMO9765432',
    type: 'Bulk Carrier',
    flag: 'Liberia',
    status: 'Anchored',
    position: { lat: 22.3193, lng: 114.1694 },
    destination: 'Shanghai, China',
    eta: '2024-02-22',
    speed: 0,
    heading: 0,
    cargo: 'Iron Ore',
  },
  {
    id: 'v6',
    name: 'NORDIC SPIRIT',
    imo: 'IMO9801234',
    type: 'Tanker',
    flag: 'Norway',
    status: 'In Transit',
    position: { lat: 29.7604, lng: -95.3698 },
    destination: 'Houston, USA',
    eta: '2024-02-24',
    speed: 14.5,
    heading: 315,
    cargo: 'Crude Oil',
  },
]

// Mock Shipments
export const shipments: Shipment[] = [
  {
    id: 's1',
    bookingRef: 'BK-2024-001245',
    vesselId: 'v1',
    vesselName: 'MSC AURORA',
    origin: 'Miami, USA',
    destination: 'Rotterdam, Netherlands',
    departureDate: '2024-02-15',
    arrivalDate: '2024-02-25',
    eta: '2024-02-25 14:00',
    status: 'In Transit',
    containers: 12,
    weight: 245.5,
    value: 1250000,
    customer: 'Global Trade Corp',
    documents: [],
  },
  {
    id: 's2',
    bookingRef: 'BK-2024-001246',
    vesselId: 'v2',
    vesselName: 'EVER GIVEN',
    origin: 'Shanghai, China',
    destination: 'Rotterdam, Netherlands',
    departureDate: '2024-02-01',
    arrivalDate: '2024-02-20',
    eta: '2024-02-20 08:30',
    status: 'Customs',
    containers: 8,
    weight: 186.2,
    value: 890000,
    customer: 'TechParts Inc',
    documents: [],
  },
  {
    id: 's3',
    bookingRef: 'BK-2024-001247',
    vesselId: 'v3',
    vesselName: 'MAERSK EMERALD',
    origin: 'Tokyo, Japan',
    destination: 'Los Angeles, USA',
    departureDate: '2024-02-18',
    arrivalDate: '2024-03-01',
    eta: '2024-03-01 16:00',
    status: 'In Transit',
    containers: 24,
    weight: 520.8,
    value: 3450000,
    customer: 'AutoMax Industries',
    documents: [],
  },
  {
    id: 's4',
    bookingRef: 'BK-2024-001248',
    vesselId: 'v4',
    vesselName: 'CMA CGM LIBERTY',
    origin: 'Singapore',
    destination: 'Hamburg, Germany',
    departureDate: '2024-02-10',
    arrivalDate: '2024-02-28',
    eta: '2024-03-02 10:00',
    status: 'Delayed',
    containers: 16,
    weight: 312.4,
    value: 1780000,
    customer: 'Fashion Forward Ltd',
    documents: [],
  },
  {
    id: 's5',
    bookingRef: 'BK-2024-001249',
    vesselId: 'v5',
    vesselName: 'OCEAN PIONEER',
    origin: 'Brisbane, Australia',
    destination: 'Shanghai, China',
    departureDate: '2024-02-12',
    arrivalDate: '2024-02-22',
    eta: '2024-02-22 06:00',
    status: 'Pending',
    containers: 0,
    weight: 45000,
    value: 2100000,
    customer: 'SteelWorks Asia',
    documents: [],
  },
  {
    id: 's6',
    bookingRef: 'BK-2024-001250',
    vesselId: 'v1',
    vesselName: 'MSC AURORA',
    origin: 'Miami, USA',
    destination: 'Rotterdam, Netherlands',
    departureDate: '2024-02-15',
    arrivalDate: '2024-02-25',
    eta: '2024-02-25 14:00',
    status: 'In Transit',
    containers: 6,
    weight: 128.3,
    value: 675000,
    customer: 'MedSupply Co',
    documents: [],
  },
  {
    id: 's7',
    bookingRef: 'BK-2024-001251',
    vesselId: 'v6',
    vesselName: 'NORDIC SPIRIT',
    origin: 'Galveston, USA',
    destination: 'Houston, USA',
    departureDate: '2024-02-20',
    arrivalDate: '2024-02-24',
    eta: '2024-02-24 12:00',
    status: 'In Transit',
    containers: 0,
    weight: 85000,
    value: 4200000,
    customer: 'PetroGlobal',
    documents: [],
  },
  {
    id: 's8',
    bookingRef: 'BK-2024-001252',
    vesselId: 'v2',
    vesselName: 'EVER GIVEN',
    origin: 'Shenzhen, China',
    destination: 'Rotterdam, Netherlands',
    departureDate: '2024-02-01',
    arrivalDate: '2024-02-20',
    eta: '2024-02-20 08:30',
    status: 'Delivered',
    containers: 4,
    weight: 92.1,
    value: 520000,
    customer: 'HomeGoods Direct',
    documents: [],
  },
]

// Mock Documents
export const documents: Document[] = [
  {
    id: 'd1',
    shipmentId: 's1',
    type: 'Bill of Lading',
    name: 'BOL-2024-001245.pdf',
    status: 'Approved',
    uploadedAt: '2024-02-14',
    uploadedBy: 'John Smith',
    fileSize: '245 KB',
  },
  {
    id: 'd2',
    shipmentId: 's1',
    type: 'Commercial Invoice',
    name: 'INV-2024-001245.pdf',
    status: 'Approved',
    uploadedAt: '2024-02-14',
    uploadedBy: 'John Smith',
    fileSize: '128 KB',
  },
  {
    id: 'd3',
    shipmentId: 's1',
    type: 'Packing List',
    name: 'PL-2024-001245.pdf',
    status: 'Pending',
    uploadedAt: '2024-02-15',
    uploadedBy: 'Sarah Johnson',
    fileSize: '89 KB',
  },
  {
    id: 'd4',
    shipmentId: 's2',
    type: 'Bill of Lading',
    name: 'BOL-2024-001246.pdf',
    status: 'Approved',
    uploadedAt: '2024-01-30',
    uploadedBy: 'Mike Chen',
    fileSize: '256 KB',
  },
  {
    id: 'd5',
    shipmentId: 's2',
    type: 'Customs Declaration',
    name: 'CD-2024-001246.pdf',
    status: 'Pending',
    uploadedAt: '2024-02-19',
    uploadedBy: 'Lisa Wang',
    fileSize: '342 KB',
  },
  {
    id: 'd6',
    shipmentId: 's3',
    type: 'Bill of Lading',
    name: 'BOL-2024-001247.pdf',
    status: 'Approved',
    uploadedAt: '2024-02-17',
    uploadedBy: 'Takeshi Yamamoto',
    fileSize: '198 KB',
  },
  {
    id: 'd7',
    shipmentId: 's3',
    type: 'Certificate of Origin',
    name: 'COO-2024-001247.pdf',
    status: 'Approved',
    uploadedAt: '2024-02-17',
    uploadedBy: 'Takeshi Yamamoto',
    fileSize: '156 KB',
  },
  {
    id: 'd8',
    shipmentId: 's4',
    type: 'Bill of Lading',
    name: 'BOL-2024-001248.pdf',
    status: 'Draft',
    uploadedAt: '2024-02-09',
    uploadedBy: 'Emma Fischer',
    fileSize: '212 KB',
  },
  {
    id: 'd9',
    shipmentId: 's4',
    type: 'Insurance Certificate',
    name: 'IC-2024-001248.pdf',
    status: 'Rejected',
    uploadedAt: '2024-02-10',
    uploadedBy: 'Emma Fischer',
    fileSize: '178 KB',
  },
  {
    id: 'd10',
    shipmentId: 's5',
    type: 'Commercial Invoice',
    name: 'INV-2024-001249.pdf',
    status: 'Draft',
    uploadedAt: '2024-02-11',
    uploadedBy: 'David Brown',
    fileSize: '134 KB',
  },
]

// Link documents to shipments
shipments.forEach(shipment => {
  shipment.documents = documents.filter(doc => doc.shipmentId === shipment.id)
})

// Mock Ports
export const ports: Port[] = [
  { id: 'p1', name: 'Port of Rotterdam', code: 'NLRTM', country: 'Netherlands', position: { lat: 51.9054, lng: 4.4661 }, type: 'Destination' },
  { id: 'p2', name: 'Port of Miami', code: 'USMIA', country: 'USA', position: { lat: 25.7617, lng: -80.1918 }, type: 'Origin' },
  { id: 'p3', name: 'Port of Shanghai', code: 'CNSHA', country: 'China', position: { lat: 31.2304, lng: 121.4737 }, type: 'Transit' },
  { id: 'p4', name: 'Port of Singapore', code: 'SGSIN', country: 'Singapore', position: { lat: 1.3521, lng: 103.8198 }, type: 'Transit' },
  { id: 'p5', name: 'Port of Los Angeles', code: 'USLAX', country: 'USA', position: { lat: 33.7405, lng: -118.2608 }, type: 'Destination' },
  { id: 'p6', name: 'Port of Hamburg', code: 'DEHAM', country: 'Germany', position: { lat: 53.5511, lng: 9.9937 }, type: 'Destination' },
  { id: 'p7', name: 'Port of Hong Kong', code: 'HKHKG', country: 'Hong Kong', position: { lat: 22.3193, lng: 114.1694 }, type: 'Transit' },
  { id: 'p8', name: 'Port of Tokyo', code: 'JPTYO', country: 'Japan', position: { lat: 35.6762, lng: 139.6503 }, type: 'Origin' },
]

// Dashboard Metrics
export const dashboardMetrics = {
  totalShipments: shipments.length,
  inTransit: shipments.filter(s => s.status === 'In Transit').length,
  atCustoms: shipments.filter(s => s.status === 'Customs').length,
  delivered: shipments.filter(s => s.status === 'Delivered').length,
  delayed: shipments.filter(s => s.status === 'Delayed').length,
  pending: shipments.filter(s => s.status === 'Pending').length,
  totalContainers: shipments.reduce((acc, s) => acc + s.containers, 0),
  totalWeight: shipments.reduce((acc, s) => acc + s.weight, 0),
  totalValue: shipments.reduce((acc, s) => acc + s.value, 0),
  documentsTotal: documents.length,
  documentsPending: documents.filter(d => d.status === 'Pending' || d.status === 'Draft').length,
  documentsApproved: documents.filter(d => d.status === 'Approved').length,
  activeVessels: vessels.filter(v => v.status === 'In Transit').length,
}

// Monthly trend data for charts
export const monthlyTrends = [
  { month: 'Sep', shipments: 42, value: 8.2 },
  { month: 'Oct', shipments: 56, value: 12.4 },
  { month: 'Nov', shipments: 48, value: 9.8 },
  { month: 'Dec', shipments: 61, value: 14.2 },
  { month: 'Jan', shipments: 52, value: 11.6 },
  { month: 'Feb', shipments: 38, value: 8.9 },
]
