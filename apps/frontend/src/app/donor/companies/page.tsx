'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Tag, Spin, Typography, Progress, Space,
} from 'antd'
import {
  CheckCircleOutlined, ArrowRightOutlined,
  ClockCircleOutlined, ArrowLeftOutlined, HomeOutlined,
  DollarOutlined, TeamOutlined, FireOutlined, AuditOutlined,
} from '@ant-design/icons'
import { createStyles } from 'antd-style'
import { getCompaniesByDisaster } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Company = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Disaster = any

const POOL_DATA: Record<number, { raised: number; goal: number; urgency: string }> = {
  1: { raised: 78000, goal: 100000, urgency: 'critical' },
  2: { raised: 27000, goal: 50000, urgency: 'high' },
  3: { raised: 9300, goal: 30000, urgency: 'medium' },
  4: { raised: 15000, goal: 75000, urgency: 'critical' },
  5: { raised: 42000, goal: 80000, urgency: 'high' },
  6: { raised: 61000, goal: 120000, urgency: 'critical' },
  7: { raised: 8500, goal: 40000, urgency: 'medium' },
}

function getUrgencyColor(urgency: string) {
  if (urgency === 'critical') return '#ef4444'
  if (urgency === 'high') return '#f97316'
  return '#fbbf24'
}

function getTrustColor(score: number) {
  if (score >= 85) return '#4ade80'
  if (score >= 70) return '#38bdf8'
  return '#fbbf24'
}

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px',
    maxWidth: 1000,
    margin: '0 auto',
    '@media (min-width: 768px)': { padding: '32px 40px' },
  }),
  breadcrumb: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: 600,
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
  contextTags: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  }),
  /* ─── Pool Card ─── */
  poolCard: css({
    background: 'rgba(45,212,191,0.06)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(45,212,191,0.2)',
    borderRadius: 24,
    padding: '28px 32px',
    marginBottom: 32,
  }),
  poolHeader: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  }),
  poolStats: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 20,
    '@media (max-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
  }),
  poolStat: css({
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: '14px 16px',
  }),
  contributeBtn: css({
    width: '100%',
    height: 52,
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 16,
    background: '#2dd4bf',
    border: 'none',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    '&:hover': {
      filter: 'brightness(1.1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 24px rgba(45,212,191,0.35)',
    },
  }),
  daoBtn: css({
    width: '100%',
    height: 44,
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 15,
    background: 'rgba(45,212,191,0.08)',
    border: '1px solid rgba(45,212,191,0.3)',
    color: '#2dd4bf',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    '&:hover': {
      background: 'rgba(45,212,191,0.14)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px rgba(45,212,191,0.2)',
    },
  }),
  /* ─── Section divider ─── */
  sectionDivider: css({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '8px 0 24px',
  }),
  dividerLine: css({
    flex: 1,
    height: 1,
    background: 'rgba(255,255,255,0.08)',
  }),
  /* ─── Coordinator card ─── */
  coordinatorCard: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px',
    marginBottom: 16,
    transition: 'all 0.25s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.12)',
    },
  }),
  cardContent: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 20,
  }),
  cardLeft: css({
    flex: 1,
    minWidth: 260,
  }),
  cardRight: css({
    textAlign: 'center',
    minWidth: 160,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  }),
  viewBtn: css({
    width: '100%',
    height: 40,
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    '&:hover': {
      background: 'rgba(255,255,255,0.14)',
      color: '#fff',
    },
  }),
  summary: css({
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),
  metaRow: css({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
    flexWrap: 'wrap',
  }),
  metaItem: css({
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    '& strong': { color: 'rgba(255,255,255,0.8)', fontWeight: 700 },
  }),
  fadeIn: css({
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  }),
  emptyState: css({
    textAlign: 'center',
    padding: '40px 24px',
    background: 'rgba(15,23,42,0.35)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
  }),
}))

function CampaignPoolContent() {
  const { styles } = useStyles()
  const router = useRouter()
  const searchParams = useSearchParams()
  const disasterId = Number(searchParams.get('disaster_id'))

  const [companies, setCompanies] = useState<Company[]>([])
  const [disaster, setDisaster] = useState<Disaster | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('selectedDisaster')
    if (stored) {
      try { setDisaster(JSON.parse(stored)) } catch {}
    }
  }, [])

  useEffect(() => {
    if (!disasterId) {
      router.replace('/donor/disasters')
      return
    }
    async function load() {
      setLoading(true)
      const data = await getCompaniesByDisaster(disasterId)
      setCompanies(data)
      setLoading(false)
    }
    load()
  }, [disasterId, router])

  const pool = POOL_DATA[disasterId] ?? { raised: 0, goal: 100000, urgency: 'medium' }
  const pct = Math.round((pool.raised / pool.goal) * 100)
  const urgencyColor = getUrgencyColor(pool.urgency)

  function handleContribute() {
    router.push('/donor/fund')
  }

  function handleViewCompany(company: Company) {
    router.push(`/donor/company/${company.id}?disaster_id=${disasterId}`)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading campaign..." />
      </div>
    )
  }

  return (
    <div className={`${styles.page} ${styles.fadeIn}`}>
      <div className={styles.breadcrumb}>
        <HomeOutlined />
        <span>/</span>
        <a href="/donor/disasters">Disasters</a>
        <span>/</span>
        <span>{disaster?.name || `Disaster #${disasterId}`}</span>
        <span>/</span>
        <span>Campaign Pool</span>
      </div>

      <button className={styles.backBtn} onClick={() => router.push('/donor/disasters')}>
        <ArrowLeftOutlined />
        Back to disasters
      </button>

      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: 0 }}>Campaign Pool</Title>
        {disaster && (
          <div className={styles.contextTags}>
            <Tag style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              borderRadius: 24,
              fontWeight: 700,
              fontSize: 12,
            }}>
              {disaster.name}
            </Tag>
            <Tag style={{
              background: 'rgba(45,212,191,0.12)',
              border: '1px solid rgba(45,212,191,0.3)',
              color: '#2dd4bf',
              borderRadius: 24,
              fontWeight: 700,
              fontSize: 12,
            }}>
              {disaster.country}
            </Tag>
          </div>
        )}
      </div>

      {/* ─── Pool Status Card (PRIMARY) ─── */}
      <div className={styles.poolCard}>
        <div className={styles.poolHeader}>
          <div>
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
              Public Campaign Pool
            </Text>
            <Title level={3} style={{ margin: 0, color: '#fff' }}>
              {disaster?.name || `Disaster #${disasterId}`} — Relief Fund
            </Title>
          </div>
          <Tag style={{
            background: `${urgencyColor}1a`,
            border: `1px solid ${urgencyColor}4d`,
            color: urgencyColor,
            borderRadius: 24,
            fontWeight: 700,
            fontSize: 13,
            padding: '4px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <FireOutlined />
            {pool.urgency.charAt(0).toUpperCase() + pool.urgency.slice(1)} urgency
          </Tag>
        </div>

        <Progress
          percent={pct}
          strokeColor={{ '0%': '#2dd4bf', '100%': '#38bdf8' }}
          trailColor="rgba(255,255,255,0.08)"
          strokeWidth={10}
          style={{ marginBottom: 8 }}
        />

        <div className={styles.poolStats}>
          <div className={styles.poolStat}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
              Raised
            </Text>
            <Text strong style={{ color: '#2dd4bf', fontSize: 22 }}>
              ${pool.raised.toLocaleString('en-US')}
            </Text>
          </div>
          <div className={styles.poolStat}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
              Goal
            </Text>
            <Text strong style={{ color: '#fff', fontSize: 22 }}>
              ${pool.goal.toLocaleString('en-US')}
            </Text>
          </div>
          <div className={styles.poolStat}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
              Funded
            </Text>
            <Text strong style={{ color: pct >= 75 ? '#4ade80' : '#fbbf24', fontSize: 22 }}>
              {pct}%
            </Text>
          </div>
        </div>

        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'block', marginBottom: 20 }}>
          Funds are locked in escrow on Avalanche and released to coordinators only after validated last-mile delivery evidence is submitted.
        </Text>

        <button className={styles.contributeBtn} onClick={handleContribute} data-testid="contribute-pool-btn">
          <DollarOutlined />
          Contribute to Campaign Pool
        </button>
        <button
          className={styles.daoBtn}
          onClick={() => router.push(`/dao/${disasterId}`)}
          data-testid="view-dao-btn"
        >
          <AuditOutlined />
          View DAO Status
        </button>
      </div>

      {/* ─── Coordinators Section (SECONDARY) ─── */}
      <div className={styles.sectionDivider}>
        <div className={styles.dividerLine} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' as const }}>
          <TeamOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
            Entities with response capacity
          </Text>
        </div>
        <div className={styles.dividerLine} />
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: 20, fontSize: 13 }}>
        The following coordinators are registered as capacity providers for this disaster. They will receive pool allocations upon submitting validated delivery evidence — they are not individual funding destinations.
      </Text>

      {companies.length === 0 ? (
        <div className={styles.emptyState}>
          <Text type="secondary">No coordinators registered for this disaster yet.</Text>
        </div>
      ) : (
        companies.map((company: Company) => (
          <div
            key={company.id}
            className={styles.coordinatorCard}
            data-testid={`coordinator-card-${company.id}`}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <Space align="center" style={{ marginBottom: 8 }}>
                  <Title level={4} style={{ margin: 0, color: '#fff' }}>{company.name}</Title>
                  {company.verification_status === 'active' && (
                    <Tag
                      icon={<CheckCircleOutlined />}
                      style={{
                        background: 'rgba(74,222,128,0.12)',
                        border: '1px solid rgba(74,222,128,0.3)',
                        color: '#4ade80',
                        borderRadius: 24,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      Verified
                    </Tag>
                  )}
                </Space>

                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <strong>Capacity:</strong> {company.capacity}
                  </span>
                  <span className={styles.metaItem}>
                    <strong>Coverage:</strong> {company.coverage}
                  </span>
                  <span className={styles.metaItem}>
                    <ClockCircleOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />
                    {company.response_time}
                  </span>
                </div>

                <p className={styles.summary}>
                  {company.genlayer_summary}
                </p>
              </div>

              <div className={styles.cardRight}>
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  Trust Score
                </Text>
                <Text strong style={{ fontSize: 32, color: getTrustColor(company.trust_score), lineHeight: 1 }}>
                  {company.trust_score}
                </Text>
                <Progress
                  percent={company.trust_score}
                  showInfo={false}
                  strokeColor={getTrustColor(company.trust_score)}
                  trailColor="rgba(255,255,255,0.08)"
                  style={{ width: 160 }}
                />
                <button
                  className={styles.viewBtn}
                  onClick={() => handleViewCompany(company)}
                  data-testid={`view-coordinator-${company.id}`}
                >
                  View capacity details
                  <ArrowRightOutlined />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default function CampaignPoolPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spin size="large" /></div>}>
      <CampaignPoolContent />
    </Suspense>
  )
}
