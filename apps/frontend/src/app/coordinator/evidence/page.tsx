'use client'

import { useState } from 'react'
import { Typography, Breadcrumb, Tabs, Tag } from 'antd'
import {
  FileImageOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { createStyles } from 'antd-style'

const { Title, Text } = Typography

/* ── Types ── */
interface EvidenceFile {
  name: string
  type: 'image' | 'pdf'
  size: string
}

interface EvidencePackage {
  id: string
  operator: string
  disaster: string
  disasterId: number
  lot: string
  files: EvidenceFile[]
  submittedAt: string
  status: 'pending_review' | 'approved' | 'rejected'
  notes?: string
}

const INITIAL_EVIDENCE: EvidencePackage[] = [
  {
    id: 'EV-001',
    operator: 'Carlos Mendez',
    disaster: 'Valparaíso Earthquake',
    disasterId: 1,
    lot: 'LOT-001',
    files: [
      { name: 'delivery_photo_1.jpg', type: 'image', size: '2.1 MB' },
      { name: 'delivery_photo_2.jpg', type: 'image', size: '1.8 MB' },
      { name: 'gps_report.pdf', type: 'pdf', size: '345 KB' },
    ],
    submittedAt: '2026-03-20T09:20:00Z',
    status: 'pending_review',
    notes: '200 kits distributed in northern sector. GPS confirms delivery zone.',
  },
  {
    id: 'EV-002',
    operator: 'Ana Torres',
    disaster: 'Valparaíso Earthquake',
    disasterId: 1,
    lot: 'LOT-002',
    files: [
      { name: 'kit_distribution.jpg', type: 'image', size: '3.2 MB' },
      { name: 'recipients_list.pdf', type: 'pdf', size: '180 KB' },
    ],
    submittedAt: '2026-03-20T14:30:00Z',
    status: 'approved',
    notes: '150 families received emergency food packages.',
  },
  {
    id: 'EV-003',
    operator: 'Carlos Mendez',
    disaster: 'Piura Floods',
    disasterId: 2,
    lot: 'LOT-003',
    files: [
      { name: 'flood_zone_arrival.jpg', type: 'image', size: '4.5 MB' },
      { name: 'water_distribution.jpg', type: 'image', size: '2.9 MB' },
    ],
    submittedAt: '2026-03-20T16:00:00Z',
    status: 'pending_review',
    notes: 'Water tankers reached 3 isolated communities.',
  },
  {
    id: 'EV-004',
    operator: 'Pedro Soto',
    disaster: 'Caribbean Coast Flooding',
    disasterId: 4,
    lot: 'LOT-004',
    files: [
      { name: 'aerial_view.jpg', type: 'image', size: '5.1 MB' },
      { name: 'field_report.pdf', type: 'pdf', size: '520 KB' },
      { name: 'signatures.pdf', type: 'pdf', size: '210 KB' },
    ],
    submittedAt: '2026-03-21T08:15:00Z',
    status: 'pending_review',
    notes: 'Requires manual review — Lot LOT-004 flagged by system.',
  },
]

/* ── Styles ── */
const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    '@media (min-width: 768px)': {
      padding: '32px 40px',
    },
  }),
  infoNotice: css({
    background: 'rgba(56,189,248,0.08)',
    border: '1px solid rgba(56,189,248,0.2)',
    borderRadius: 14,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 28,
  }),
  evidenceCard: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '22px 24px',
    marginBottom: 16,
    transition: 'all 0.2s ease',
    '&:hover': {
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    },
  }),
  cardHeader: css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  }),
  idBadge: css({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    background: 'rgba(167,139,250,0.12)',
    color: '#a78bfa',
    border: '1px solid rgba(167,139,250,0.2)',
    letterSpacing: '0.03em',
  }),
  filesRow: css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  }),
  fileChip: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    fontSize: 12,
    whiteSpace: 'nowrap',
  }),
  actionRow: css({
    display: 'flex',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  }),
  approveBtn: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 20px',
    background: 'rgba(74,222,128,0.12)',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.3)',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      background: 'rgba(74,222,128,0.2)',
      transform: 'translateY(-1px)',
    },
  }),
  rejectBtn: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 20px',
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      background: 'rgba(239,68,68,0.08)',
      transform: 'translateY(-1px)',
    },
  }),
  statusChip: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  }),
}))

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function EvidenceReviewPage() {
  const { styles } = useStyles()
  const [evidence, setEvidence] = useState<EvidencePackage[]>(INITIAL_EVIDENCE)
  const [activeTab, setActiveTab] = useState('all')

  const approve = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' as const } : e))
  }

  const reject = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' as const } : e))
  }

  const counts = {
    all: evidence.length,
    pending_review: evidence.filter(e => e.status === 'pending_review').length,
    approved: evidence.filter(e => e.status === 'approved').length,
    rejected: evidence.filter(e => e.status === 'rejected').length,
  }

  const filtered = evidence
    .filter(e => activeTab === 'all' || e.status === activeTab)
    .sort((a, b) => {
      // pending first
      if (a.status === 'pending_review' && b.status !== 'pending_review') return -1
      if (a.status !== 'pending_review' && b.status === 'pending_review') return 1
      return 0
    })

  const tabItems = [
    { key: 'all', label: <span>All <Tag style={{ marginLeft: 4 }}>{counts.all}</Tag></span> },
    { key: 'pending_review', label: <span>Pending Review <Tag color="warning" style={{ marginLeft: 4 }}>{counts.pending_review}</Tag></span> },
    { key: 'approved', label: <span>Approved <Tag color="success" style={{ marginLeft: 4 }}>{counts.approved}</Tag></span> },
    { key: 'rejected', label: <span>Rejected <Tag color="error" style={{ marginLeft: 4 }}>{counts.rejected}</Tag></span> },
  ]

  return (
    <div className={styles.page}>
      <Breadcrumb
        style={{ marginBottom: 28 }}
        items={[
          { title: <Link href="/"><HomeOutlined /> Home</Link> },
          { title: <Link href="/coordinator/dashboard">Coordinator</Link> },
          { title: 'Evidence Review' },
        ]}
      />

      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 6 }}>Evidence Review</Title>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
          Review and approve evidence submitted by field operators
        </Text>
      </div>

      {/* Info notice */}
      <div className={styles.infoNotice}>
        <InfoCircleOutlined style={{ fontSize: 18, color: '#38bdf8', marginTop: 2, flexShrink: 0 }} />
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
          Approved evidence is forwarded to <strong style={{ color: '#38bdf8' }}>GenLayer AI</strong> for semantic validation.
          Upon GenLayer approval, the <strong style={{ color: '#38bdf8' }}>Avalanche escrow</strong> executes the conditional release to the coordinator.
        </Text>
      </div>

      {/* Filter tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 24 }}
      />

      {/* Evidence cards */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'rgba(15,23,42,0.45)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)' }}>No evidence packages in this category.</Text>
        </div>
      )}

      {filtered.map(pkg => (
        <div key={pkg.id} className={styles.evidenceCard}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              <span className={styles.idBadge}>{pkg.id}</span>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{pkg.lot}</Text>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <Text strong style={{ fontSize: 14 }}>{pkg.operator}</Text>
              <Tag style={{ background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.2)', borderRadius: 20 }}>
                {pkg.disaster}
              </Tag>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{formatDate(pkg.submittedAt)}</Text>
            </div>
            {/* Status badge */}
            {pkg.status === 'pending_review' && (
              <span className={styles.statusChip} style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                Pending Review
              </span>
            )}
            {pkg.status === 'approved' && (
              <span className={styles.statusChip} style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                <CheckCircleOutlined /> Approved
              </span>
            )}
            {pkg.status === 'rejected' && (
              <span className={styles.statusChip} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                <CloseCircleOutlined /> Rejected
              </span>
            )}
          </div>

          {/* Files */}
          <div className={styles.filesRow}>
            {pkg.files.map((file, idx) => (
              <span key={idx} className={styles.fileChip}>
                {file.type === 'pdf'
                  ? <FilePdfOutlined style={{ color: '#ef4444' }} />
                  : <FileImageOutlined style={{ color: '#2dd4bf' }} />
                }
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{file.name}</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{file.size}</Text>
              </span>
            ))}
          </div>

          {/* Notes */}
          {pkg.notes && (
            <Text style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 13, fontStyle: 'italic', marginBottom: 4 }}>
              &quot;{pkg.notes}&quot;
            </Text>
          )}

          {/* Actions */}
          {pkg.status === 'pending_review' && (
            <div className={styles.actionRow}>
              <button className={styles.approveBtn} onClick={() => approve(pkg.id)}>
                <CheckCircleOutlined /> Approve
              </button>
              <button className={styles.rejectBtn} onClick={() => reject(pkg.id)}>
                <CloseCircleOutlined /> Reject
              </button>
            </div>
          )}

          {pkg.status === 'approved' && (
            <div style={{ marginTop: 14 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                background: 'rgba(56,189,248,0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}>
                <InfoCircleOutlined /> Forwarded to GenLayer
              </span>
            </div>
          )}

          {pkg.status === 'rejected' && (
            <div style={{ marginTop: 14 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                background: 'rgba(239,68,68,0.08)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.18)',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}>
                <CloseCircleOutlined /> Rejected
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
