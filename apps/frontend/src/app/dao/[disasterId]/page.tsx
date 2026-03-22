'use client'

import { useParams, useRouter } from 'next/navigation'
import { Typography } from 'antd'
import {
  ArrowLeftOutlined,
  HomeOutlined,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { createStyles } from 'antd-style'
import { useState } from 'react'

const { Title, Text } = Typography

// ─── Disaster name map ───────────────────────────────────────────────────────
const DISASTER_NAMES: Record<number, string> = {
  1: 'Valparaíso Earthquake',
  2: 'Piura Floods',
  3: 'Gran Chaco Drought',
  4: 'Caribbean Coast Flooding',
  5: 'Amazon Wildfire Emergency',
  6: 'Hurricane Marta',
  7: 'Tungurahua Volcanic Activity',
}

// ─── Pool data ───────────────────────────────────────────────────────────────
const POOL_DATA: Record<number, { raised: number; goal: number }> = {
  1: { raised: 78000, goal: 100000 },
  2: { raised: 27000, goal: 50000 },
  3: { raised: 9300, goal: 30000 },
  4: { raised: 15000, goal: 75000 },
  5: { raised: 42000, goal: 80000 },
  6: { raised: 61000, goal: 120000 },
  7: { raised: 8500, goal: 40000 },
}

// ─── Types ───────────────────────────────────────────────────────────────────
type StepStatus = 'completed' | 'in_progress' | 'pending'

interface DaoStep {
  id: number
  title: string
  titleEs: string
  description: string
  status: StepStatus
  timestamp?: string
  details?: Record<string, string>
}

// ─── Mock DAO steps ──────────────────────────────────────────────────────────
const DAO_STEPS: DaoStep[] = [
  {
    id: 1,
    title: 'Cause Registered',
    titleEs: 'Causa Registrada',
    description:
      'Disaster event registered in the HandLend smart contract. Campaign escrow account initialized on Avalanche C-Chain.',
    status: 'completed',
    timestamp: '2026-03-15T08:30:00Z',
    details: {
      'Genesis TX': '0xabc4f2...8e1d',
      Block: '#8,234,501',
      Contract: '0xEsc...0w42',
      Network: 'Avalanche C-Chain',
    },
  },
  {
    id: 2,
    title: 'GenLayer Validation',
    titleEs: 'Validación GenLayer',
    description:
      'GenLayer AI verified the disaster event against real-world sources (USGS, GDACS, ReliefWeb). Semantic confirmation issued.',
    status: 'completed',
    timestamp: '2026-03-15T09:15:00Z',
    details: {
      'Verdict ID': 'GL-2026-0315-001',
      Confidence: '98.4%',
      'Sources checked': 'USGS, GDACS, ReliefWeb, local gov',
      Decision: 'CONFIRMED',
    },
  },
  {
    id: 3,
    title: 'Pool Credited',
    titleEs: 'Pool Acreditado',
    description:
      'Campaign pool received initial funding. Donor contributions credited to the disaster escrow account.',
    status: 'completed',
    timestamp: '2026-03-16T10:00:00Z',
    details: {
      Contributors: '142 donors',
      'Total locked': 'from POOL_DATA raised',
      Currency: 'USDC',
      'TX Hash': '0xdef9a1...2b3c',
    },
  },
  {
    id: 4,
    title: 'Escrow Active',
    titleEs: 'Escrow Activo',
    description:
      'Funds are locked in escrow on Avalanche. Transaction confirmed. Funds are NOT yet released — release requires validated delivery evidence.',
    status: 'completed',
    timestamp: '2026-03-16T10:05:00Z',
    details: {
      'Escrow Contract': '0xEsc...0w42',
      'Locked amount': 'from POOL_DATA raised',
      Status: 'LOCKED — pending evidence',
      'Release condition': 'GenLayer evidence approval',
    },
  },
  {
    id: 5,
    title: 'Coordinator Action Plan',
    titleEs: 'Plan del Coordinador',
    description:
      'The assigned coordinator (LogiHumanitas) is submitting their detailed action plan, including budget breakdown and operational timeline.',
    status: 'in_progress',
    details: {
      Coordinator: 'LogiHumanitas SpA',
      'Plan status': 'UNDER REVIEW',
      Submitted: '2026-03-20T11:00:00Z',
    },
  },
  {
    id: 6,
    title: 'Evidence Submission',
    titleEs: 'Subida de Evidencia',
    description:
      'Coordinator uploads delivery evidence: geo-tagged photos, GPS tracks, recipient counts, and signed delivery receipts.',
    status: 'pending',
  },
  {
    id: 7,
    title: 'GenLayer Evidence Review',
    titleEs: 'Análisis GenLayer',
    description:
      'GenLayer AI analyzes submitted evidence for semantic validity, cross-referencing location data, photos, and declared beneficiary counts.',
    status: 'pending',
  },
  {
    id: 8,
    title: 'Fund Release',
    titleEs: 'Liberación de Fondos',
    description:
      'Upon GenLayer approval, the Avalanche escrow contract executes the conditional transfer, crediting the validated amount to the coordinator.',
    status: 'pending',
  },
]

// ─── Styles ──────────────────────────────────────────────────────────────────
const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px',
    maxWidth: 1100,
    margin: '0 auto',
    '@media (min-width: 768px)': { padding: '32px 40px' },
  }),
  fadeIn: css({
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  }),
  breadcrumb: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: 600,
    flexWrap: 'wrap' as const,
    '& a': { color: 'rgba(255,255,255,0.55)', textDecoration: 'none' },
    '& a:hover': { color: '#2dd4bf' },
  }),
  backBtn: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    marginBottom: 20,
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  }),
  headerSection: css({
    marginBottom: 24,
  }),
  contractBar: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap' as const,
    marginBottom: 32,
  }),
  contractBarItem: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 500,
    '& strong': { color: 'rgba(255,255,255,0.9)', fontWeight: 700 },
  }),
  contractBarDivider: css({
    width: 1,
    height: 20,
    background: 'rgba(255,255,255,0.1)',
    '@media (max-width: 640px)': { display: 'none' },
  }),
  activeBadge: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    background: 'rgba(45,212,191,0.12)',
    border: '1px solid rgba(45,212,191,0.3)',
    borderRadius: 24,
    color: '#2dd4bf',
    fontSize: 12,
    fontWeight: 700,
  }),
  copyBtn: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  }),
  twoCol: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 24,
    '@media (min-width: 900px)': { gridTemplateColumns: '2fr 1fr' },
  }),
  // ─── Stepper ───────────────────────────────────────────────────────────────
  stepperWrap: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '28px 28px 12px',
  }),
  step: css({
    display: 'flex',
    gap: 16,
    position: 'relative',
  }),
  stepLeft: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 36,
  }),
  stepCircle: css({
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
    zIndex: 1,
  }),
  stepCircleCompleted: css({
    background: 'rgba(74,222,128,0.2)',
    border: '2px solid #4ade80',
    color: '#4ade80',
  }),
  stepCircleInProgress: css({
    background: 'rgba(45,212,191,0.15)',
    border: '2px solid #2dd4bf',
    color: '#2dd4bf',
    animation: 'pulseStep 1.8s ease-in-out infinite',
    '@keyframes pulseStep': {
      '0%, 100%': { boxShadow: '0 0 0 0 rgba(45,212,191,0.4)' },
      '50%': { boxShadow: '0 0 0 8px rgba(45,212,191,0)' },
    },
  }),
  stepCirclePending: css({
    background: 'rgba(255,255,255,0.04)',
    border: '2px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.25)',
  }),
  stepConnector: css({
    flex: 1,
    width: 2,
    minHeight: 24,
    marginTop: 4,
  }),
  stepConnectorCompleted: css({
    background: '#4ade80',
    opacity: 0.5,
  }),
  stepConnectorPending: css({
    background: 'transparent',
    borderLeft: '2px dashed rgba(255,255,255,0.12)',
  }),
  stepRight: css({
    flex: 1,
    paddingBottom: 28,
  }),
  stepTitle: css({
    fontWeight: 700,
    fontSize: 15,
    color: '#fff',
    marginBottom: 2,
  }),
  stepTitleEs: css({
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 6,
    fontStyle: 'italic',
  }),
  stepDesc: css({
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.5,
    marginBottom: 8,
  }),
  stepTimestamp: css({
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'monospace',
    marginBottom: 10,
  }),
  stepDetails: css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    '@media (max-width: 480px)': { gridTemplateColumns: '1fr' },
  }),
  stepDetailItem: css({
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: '8px 12px',
  }),
  stepDetailKey: css({
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: 2,
  }),
  stepDetailVal: css({
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 600,
    fontFamily: 'monospace',
  }),
  processingBadge: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    background: 'rgba(45,212,191,0.1)',
    border: '1px solid rgba(45,212,191,0.25)',
    borderRadius: 8,
    color: '#2dd4bf',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
    animation: 'processingPulse 1.5s ease-in-out infinite',
    '@keyframes processingPulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.6 },
    },
  }),
  stepPending: css({
    opacity: 0.4,
  }),
  // ─── Right panel ───────────────────────────────────────────────────────────
  rightPanel: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px',
    height: 'fit-content',
    position: 'sticky' as const,
    top: 24,
  }),
  liveIndicator: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  }),
  liveDot: css({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    animation: 'livePulse 1.4s ease-in-out infinite',
    '@keyframes livePulse': {
      '0%, 100%': { boxShadow: '0 0 0 0 rgba(74,222,128,0.4)' },
      '50%': { boxShadow: '0 0 0 6px rgba(74,222,128,0)' },
    },
  }),
  auditList: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  }),
  auditItem: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingBottom: 14,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    '&:last-child': { borderBottom: 'none', paddingBottom: 0 },
  }),
  auditLabel: css({
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  }),
  auditValue: css({
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'monospace',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap' as const,
  }),
  disclaimer: css({
    marginTop: 32,
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    textAlign: 'center' as const,
  }),
}))

// ─── CopyButton ──────────────────────────────────────────────────────────────
function CopyButton({ value, styles }: { value: string; styles: ReturnType<typeof useStyles>['styles'] }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button className={styles.copyBtn} onClick={handleCopy} title="Copy">
      {copied ? <CheckOutlined style={{ color: '#4ade80' }} /> : <CopyOutlined />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

// ─── Format timestamp ────────────────────────────────────────────────────────
function fmtTs(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return iso
  }
}

// ─── Step circle class helper ─────────────────────────────────────────────────
function circleClass(status: StepStatus, styles: ReturnType<typeof useStyles>['styles']) {
  if (status === 'completed') return `${styles.stepCircle} ${styles.stepCircleCompleted}`
  if (status === 'in_progress') return `${styles.stepCircle} ${styles.stepCircleInProgress}`
  return `${styles.stepCircle} ${styles.stepCirclePending}`
}

function connectorClass(status: StepStatus, styles: ReturnType<typeof useStyles>['styles']) {
  if (status === 'completed') return `${styles.stepConnector} ${styles.stepConnectorCompleted}`
  return `${styles.stepConnector} ${styles.stepConnectorPending}`
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function DaoStatusPage() {
  const { styles } = useStyles()
  const router = useRouter()
  const params = useParams()

  const disasterId = Number(params.disasterId)
  const disasterName = DISASTER_NAMES[disasterId] ?? `Disaster #${disasterId}`
  const pool = POOL_DATA[disasterId] ?? { raised: 0, goal: 100000 }

  const lastCompletedStep = [...DAO_STEPS].reverse().find((s) => s.status === 'completed')
  const lastEventTs = lastCompletedStep?.timestamp ? fmtTs(lastCompletedStep.timestamp) : '—'

  // Resolve "from POOL_DATA raised" placeholders
  function resolveDetail(val: string) {
    if (val === 'from POOL_DATA raised') return `$${pool.raised.toLocaleString('en-US')} USDC`
    return val
  }

  return (
    <div className={`${styles.page} ${styles.fadeIn}`}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <HomeOutlined />
        <span>/</span>
        <a href="/donor/disasters">Disasters</a>
        <span>/</span>
        <a href={`/donor/companies?disaster_id=${disasterId}`}>{disasterName}</a>
        <span>/</span>
        <span>DAO Status</span>
      </div>

      {/* Back button */}
      <button
        className={styles.backBtn}
        onClick={() => router.push(`/donor/companies?disaster_id=${disasterId}`)}
      >
        <ArrowLeftOutlined />
        Back to Campaign Pool
      </button>

      {/* Header */}
      <div className={styles.headerSection}>
        <Title level={2} style={{ margin: '0 0 4px', color: '#fff' }}>
          DAO Status — {disasterName}
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Auditable smart contract flow on Avalanche C-Chain
        </Text>
      </div>

      {/* Contract info bar */}
      <div className={styles.contractBar}>
        <div className={styles.contractBarItem}>
          <span>Contract:</span>
          <strong>0xEsc...0w42</strong>
          <CopyButton value="0xEsc...0w42" styles={styles} />
        </div>
        <div className={styles.contractBarDivider} />
        <div className={styles.contractBarItem}>
          <span>Network:</span>
          <strong>Avalanche C-Chain</strong>
        </div>
        <div className={styles.contractBarDivider} />
        <div className={styles.contractBarItem}>
          <span>Total Locked:</span>
          <strong>${pool.raised.toLocaleString('en-US')} USDC</strong>
        </div>
        <div className={styles.contractBarDivider} />
        <div className={styles.activeBadge}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2dd4bf', display: 'inline-block' }} />
          Active Escrow
        </div>
      </div>

      {/* Two-column layout */}
      <div className={styles.twoCol}>
        {/* Left: Stepper */}
        <div className={styles.stepperWrap}>
          <Text
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 24,
            }}
          >
            Smart Contract Flow — {DAO_STEPS.filter((s) => s.status === 'completed').length} of {DAO_STEPS.length} steps completed
          </Text>

          {DAO_STEPS.map((step, idx) => {
            const isLast = idx === DAO_STEPS.length - 1
            const isPending = step.status === 'pending'

            return (
              <div key={step.id} className={`${styles.step} ${isPending ? styles.stepPending : ''}`}>
                {/* Left: number + connector */}
                <div className={styles.stepLeft}>
                  <div className={circleClass(step.status, styles)}>{step.id}</div>
                  {!isLast && (
                    <div className={connectorClass(step.status, styles)} />
                  )}
                </div>

                {/* Right: content */}
                <div className={styles.stepRight}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepTitleEs}>{step.titleEs}</div>

                  {step.status === 'in_progress' && (
                    <div className={styles.processingBadge}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#2dd4bf',
                          display: 'inline-block',
                        }}
                      />
                      Processing...
                    </div>
                  )}

                  <div className={styles.stepDesc}>{step.description}</div>

                  {step.timestamp && (
                    <div className={styles.stepTimestamp}>{fmtTs(step.timestamp)}</div>
                  )}

                  {step.details && (
                    <div className={styles.stepDetails}>
                      {Object.entries(step.details).map(([k, v]) => (
                        <div key={k} className={styles.stepDetailItem}>
                          <span className={styles.stepDetailKey}>{k}</span>
                          <span className={styles.stepDetailVal}>{resolveDetail(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Audit panel */}
        <div className={styles.rightPanel}>
          {/* Live indicator */}
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            <Text style={{ color: '#4ade80', fontSize: 12, fontWeight: 700 }}>
              Live on Avalanche
            </Text>
          </div>

          <Text
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 16,
            }}
          >
            Contract Audit Trail
          </Text>

          <div className={styles.auditList}>
            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Genesis TX</span>
              <span className={styles.auditValue}>
                0xabc4f2...8e1d
                <CopyButton value="0xabc4f2...8e1d" styles={styles} />
              </span>
            </div>

            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>GenLayer Verdict</span>
              <span className={styles.auditValue}>GL-2026-0315-001</span>
            </div>

            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Escrow</span>
              <span className={styles.auditValue}>
                0xEsc...0w42
                <CopyButton value="0xEsc...0w42" styles={styles} />
              </span>
            </div>

            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Block</span>
              <span className={styles.auditValue}>#8,234,501</span>
            </div>

            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Donors</span>
              <span className={styles.auditValue}>142</span>
            </div>

            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Locked</span>
              <span className={styles.auditValue} style={{ color: '#2dd4bf' }}>
                ${pool.raised.toLocaleString('en-US')} USDC
              </span>
            </div>

            <div className={styles.auditItem}>
              <span className={styles.auditLabel}>Last Event</span>
              <span className={styles.auditValue} style={{ fontSize: 11 }}>
                {lastEventTs}
              </span>
            </div>
          </div>

          {/* Progress summary */}
          <div
            style={{
              marginTop: 24,
              padding: '14px 16px',
              background: 'rgba(45,212,191,0.06)',
              border: '1px solid rgba(45,212,191,0.15)',
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Flow Progress
            </Text>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                {DAO_STEPS.filter((s) => s.status === 'completed').length} completed
              </Text>
              <Text style={{ color: '#2dd4bf', fontSize: 12, fontWeight: 700 }}>
                {Math.round((DAO_STEPS.filter((s) => s.status === 'completed').length / DAO_STEPS.length) * 100)}%
              </Text>
            </div>
            <div
              style={{
                height: 6,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.round((DAO_STEPS.filter((s) => s.status === 'completed').length / DAO_STEPS.length) * 100)}%`,
                  background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)',
                  borderRadius: 3,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, lineHeight: 1.6 }}>
          All events are recorded on Avalanche C-Chain and validated by GenLayer AI. This interface is for
          transparency — the protocol executes automatically.
        </Text>
      </div>
    </div>
  )
}
