'use client'

import { useState } from 'react'
import {
  vessels,
  shipments,
  documents,
  ports,
  dashboardMetrics,
  monthlyTrends,
  type Vessel,
  type Shipment,
  type Document,
} from '@/data/ship-tracking-mock'

type Tab = 'overview' | 'shipments' | 'documents' | 'vessels'

export default function ShipTrackingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-800/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Ship Tracking</h1>
            <p className="text-sm text-slate-400 mt-1">Monitor vessels, shipments, and documents in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Shipment
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {(['overview', 'shipments', 'documents', 'vessels'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab
            selectedVessel={selectedVessel}
            setSelectedVessel={setSelectedVessel}
          />
        )}
        {activeTab === 'shipments' && (
          <ShipmentsTab
            selectedShipment={selectedShipment}
            setSelectedShipment={setSelectedShipment}
          />
        )}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'vessels' && <VesselsTab />}
      </div>
    </div>
  )
}

// Overview Tab with metrics, map, and recent activity
function OverviewTab({
  selectedVessel,
  setSelectedVessel,
}: {
  selectedVessel: Vessel | null
  setSelectedVessel: (v: Vessel | null) => void
}) {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Total Shipments"
          value={dashboardMetrics.totalShipments}
          icon={<ShipIcon />}
          color="blue"
        />
        <MetricCard
          label="In Transit"
          value={dashboardMetrics.inTransit}
          icon={<TransitIcon />}
          color="emerald"
        />
        <MetricCard
          label="At Customs"
          value={dashboardMetrics.atCustoms}
          icon={<CustomsIcon />}
          color="amber"
        />
        <MetricCard
          label="Delayed"
          value={dashboardMetrics.delayed}
          icon={<AlertIcon />}
          color="red"
        />
        <MetricCard
          label="Total Value"
          value={`$${(dashboardMetrics.totalValue / 1000000).toFixed(1)}M`}
          icon={<DollarIcon />}
          color="purple"
        />
        <MetricCard
          label="Active Vessels"
          value={dashboardMetrics.activeVessels}
          icon={<VesselIcon />}
          color="cyan"
        />
      </div>

      {/* Map and Chart Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* World Map */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Live Vessel Tracking</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                In Transit
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                At Port
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Anchored
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Delayed
              </span>
            </div>
          </div>
          <WorldMap
            vessels={vessels}
            ports={ports}
            selectedVessel={selectedVessel}
            onSelectVessel={setSelectedVessel}
          />
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Shipments</h3>
          <BarChart data={monthlyTrends} />
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Value (6mo)</span>
              <span className="text-white font-semibold">$65.1M</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-400">Avg. per month</span>
              <span className="text-white font-semibold">49 shipments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments and Documents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Shipments</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition">View all</button>
          </div>
          <div className="space-y-3">
            {shipments.slice(0, 5).map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
                  <ShipIcon className="w-5 h-5 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{shipment.bookingRef}</span>
                    <StatusBadge status={shipment.status} />
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {shipment.origin} → {shipment.destination}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{shipment.containers} TEU</p>
                  <p className="text-xs text-slate-400">ETA: {new Date(shipment.eta).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Documents */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Pending Documents</h3>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
              {dashboardMetrics.documentsPending} pending
            </span>
          </div>
          <div className="space-y-3">
            {documents
              .filter((d) => d.status === 'Pending' || d.status === 'Draft')
              .slice(0, 5)
              .map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
                    <DocumentIcon className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{doc.name}</span>
                      <DocStatusBadge status={doc.status} />
                    </div>
                    <p className="text-xs text-slate-400">{doc.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{doc.uploadedAt}</p>
                    <p className="text-xs text-slate-500">{doc.fileSize}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Shipments Tab
function ShipmentsTab({
  selectedShipment,
  setSelectedShipment,
}: {
  selectedShipment: Shipment | null
  setSelectedShipment: (s: Shipment | null) => void
}) {
  const [filter, setFilter] = useState<string>('all')

  const filteredShipments = filter === 'all'
    ? shipments
    : shipments.filter(s => s.status.toLowerCase() === filter)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
          {['all', 'in transit', 'customs', 'delivered', 'delayed', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <input
            type="text"
            placeholder="Search shipments..."
            className="w-64 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Booking Ref</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Vessel</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Route</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Containers</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ETA</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredShipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="hover:bg-slate-700/30 transition cursor-pointer"
                onClick={() => setSelectedShipment(shipment)}
              >
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-white">{shipment.bookingRef}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-300">{shipment.vesselName}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{shipment.origin}</span>
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-sm text-slate-300">{shipment.destination}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={shipment.status} />
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-300">{shipment.containers > 0 ? `${shipment.containers} TEU` : '-'}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-300">{new Date(shipment.eta).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-300">${(shipment.value / 1000).toFixed(0)}K</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="p-1 hover:bg-slate-600 rounded transition">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Documents Tab
function DocumentsTab() {
  const [filter, setFilter] = useState<string>('all')

  const filteredDocs = filter === 'all'
    ? documents
    : documents.filter(d => d.status.toLowerCase() === filter)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Total Documents</p>
          <p className="text-2xl font-bold text-white mt-1">{documents.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Approved</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{documents.filter(d => d.status === 'Approved').length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{documents.filter(d => d.status === 'Pending').length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Rejected</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{documents.filter(d => d.status === 'Rejected').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
          {['all', 'approved', 'pending', 'draft', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                <DocumentIcon className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white truncate">{doc.name}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">{doc.type}</p>
                <div className="flex items-center gap-2 mt-2">
                  <DocStatusBadge status={doc.status} />
                  <span className="text-xs text-slate-500">{doc.fileSize}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-xs text-slate-400">Uploaded by {doc.uploadedBy}</span>
              <span className="text-xs text-slate-500">{doc.uploadedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Vessels Tab
function VesselsTab() {
  return (
    <div className="space-y-6">
      {/* Vessels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vessels.map((vessel) => (
          <div
            key={vessel.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">{vessel.name}</h4>
                <p className="text-sm text-slate-400">{vessel.imo}</p>
              </div>
              <VesselStatusBadge status={vessel.status} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Type</span>
                <span className="text-white">{vessel.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Flag</span>
                <span className="text-white">{vessel.flag}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Destination</span>
                <span className="text-white truncate max-w-[150px]">{vessel.destination}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Speed</span>
                <span className="text-white">{vessel.speed} knots</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">ETA</span>
                <span className="text-white">{new Date(vessel.eta).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-400">
                Position: {vessel.position.lat.toFixed(4)}, {vessel.position.lng.toFixed(4)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// World Map Component (SVG-based)
function WorldMap({
  vessels,
  ports,
  selectedVessel,
  onSelectVessel,
}: {
  vessels: Vessel[]
  ports: typeof import('@/data/ship-tracking-mock').ports
  selectedVessel: Vessel | null
  onSelectVessel: (v: Vessel | null) => void
}) {
  // Convert lat/lng to SVG coordinates (simple mercator projection)
  const toSvg = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 800,
    y: ((90 - lat) / 180) * 400,
  })

  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden">
      <svg viewBox="0 0 800 400" className="w-full h-[300px]">
        {/* Background */}
        <rect width="800" height="400" fill="#0f172a" />

        {/* Grid lines */}
        {[...Array(9)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 50}
            x2="800"
            y2={i * 50}
            stroke="#1e293b"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(17)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2="400"
            stroke="#1e293b"
            strokeWidth="0.5"
          />
        ))}

        {/* Simplified world continents (just outlines for visual reference) */}
        <path
          d="M120,120 L180,100 L220,110 L250,130 L240,160 L200,180 L160,170 L130,150 Z"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1"
        />
        <path
          d="M280,100 L380,80 L450,90 L480,120 L500,180 L480,240 L420,260 L350,250 L300,200 L280,150 Z"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1"
        />
        <path
          d="M500,100 L620,80 L700,100 L720,140 L700,200 L640,220 L580,200 L520,160 L500,120 Z"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1"
        />
        <path
          d="M550,220 L620,210 L680,230 L700,280 L680,340 L620,360 L560,340 L540,280 Z"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Ports */}
        {ports.map((port) => {
          const pos = toSvg(port.position.lat, port.position.lng)
          return (
            <g key={port.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="4"
                fill="#3b82f6"
                fillOpacity="0.3"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="2"
                fill="#3b82f6"
              />
            </g>
          )
        })}

        {/* Vessels */}
        {vessels.map((vessel) => {
          const pos = toSvg(vessel.position.lat, vessel.position.lng)
          const color = vessel.status === 'In Transit' ? '#10b981'
            : vessel.status === 'At Port' ? '#3b82f6'
            : vessel.status === 'Anchored' ? '#f59e0b'
            : '#ef4444'
          const isSelected = selectedVessel?.id === vessel.id

          return (
            <g
              key={vessel.id}
              className="cursor-pointer"
              onClick={() => onSelectVessel(isSelected ? null : vessel)}
            >
              {/* Pulse animation for selected */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="12"
                  fill={color}
                  fillOpacity="0.3"
                >
                  <animate
                    attributeName="r"
                    values="8;16;8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="fill-opacity"
                    values="0.3;0.1;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              {/* Vessel marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 8 : 6}
                fill={color}
                stroke={isSelected ? '#fff' : 'transparent'}
                strokeWidth="2"
              />
              {/* Direction indicator */}
              <line
                x1={pos.x}
                y1={pos.y}
                x2={pos.x + Math.sin((vessel.heading * Math.PI) / 180) * 12}
                y2={pos.y - Math.cos((vessel.heading * Math.PI) / 180) * 12}
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )
        })}
      </svg>

      {/* Selected vessel info */}
      {selectedVessel && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">{selectedVessel.name}</h4>
              <p className="text-sm text-slate-400">{selectedVessel.imo} · {selectedVessel.type}</p>
            </div>
            <VesselStatusBadge status={selectedVessel.status} />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t border-slate-700/50">
            <div>
              <p className="text-xs text-slate-400">Destination</p>
              <p className="text-sm text-white truncate">{selectedVessel.destination}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Speed</p>
              <p className="text-sm text-white">{selectedVessel.speed} kn</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Heading</p>
              <p className="text-sm text-white">{selectedVessel.heading}°</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">ETA</p>
              <p className="text-sm text-white">{new Date(selectedVessel.eta).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Bar Chart Component
function BarChart({ data }: { data: typeof monthlyTrends }) {
  const maxValue = Math.max(...data.map(d => d.shipments))

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.month} className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-8">{item.month}</span>
          <div className="flex-1 bg-slate-700/50 rounded-full h-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${(item.shipments / maxValue) * 100}%` }}
            >
              <span className="text-xs text-white font-medium">{item.shipments}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Metric Card Component
function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'cyan'
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
    red: 'from-red-500/20 to-red-600/10 text-red-400 border-red-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between">
        <div className={colorClasses[color].split(' ').pop()}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white mt-3">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  )
}

// Status Badge Components
function StatusBadge({ status }: { status: Shipment['status'] }) {
  const styles = {
    'In Transit': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Customs: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Delivered: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Delayed: 'bg-red-500/20 text-red-400 border-red-500/30',
    Pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>
      {status}
    </span>
  )
}

function DocStatusBadge({ status }: { status: Document['status'] }) {
  const styles = {
    Approved: 'bg-emerald-500/20 text-emerald-400',
    Pending: 'bg-amber-500/20 text-amber-400',
    Draft: 'bg-slate-500/20 text-slate-400',
    Rejected: 'bg-red-500/20 text-red-400',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}

function VesselStatusBadge({ status }: { status: Vessel['status'] }) {
  const styles = {
    'In Transit': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'At Port': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Anchored: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Delayed: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>
      {status}
    </span>
  )
}

// Icons
function ShipIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function TransitIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function CustomsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function DollarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function VesselIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function DocumentIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
