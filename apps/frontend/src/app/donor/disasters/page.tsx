'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spin, Typography, Button } from 'antd'
import { ReloadOutlined, HomeOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { createStyles } from 'antd-style'
import { getDisasters } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Disaster = any

function getSeverityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case 'critical': return '#ef4444'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'low': return '#22c55e'
    default: return '#94a3b8'
  }
}

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px',
    maxWidth: 1280,
    margin: '0 auto',
    '@media (min-width: 768px)': { padding: '32px 40px' },
  }),
  breadcrumb: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: 600,
  }),
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 12,
  }),
  grid: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
    '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
    '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
  }),
  card: css({
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
      border: '1px solid rgba(45,212,191,0.2)',
    },
  }),
  imgWrap: css({
    overflow: 'hidden',
    position: 'relative',
    height: 200,
  }),
  img: css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s ease',
    '&:hover': { transform: 'scale(1.05)' },
  }),
  countryBadge: css({
    position: 'absolute',
    top: 12,
    left: 12,
    padding: '4px 10px',
    background: 'rgba(15,23,42,0.85)',
    backdropFilter: 'blur(8px)',
    borderRadius: 24,
    color: '#2dd4bf',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
  }),
  activeBadge: css({
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '4px 10px',
    background: 'rgba(239,68,68,0.85)',
    backdropFilter: 'blur(8px)',
    borderRadius: 24,
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  }),
  activeDot: css({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#fff',
    display: 'inline-block',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.4 },
    },
  }),
  body: css({
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  }),
  eventType: css({
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#a78bfa',
    marginBottom: 8,
  }),
  name: css({
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 10,
  }),
  severityRow: css({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  }),
  severityDot: css({
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  }),
  description: css({
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginBottom: 16,
    flex: 1,
  }),
  progressWrap: css({
    marginBottom: 16,
    marginTop: 'auto',
  }),
  progressBar: css({
    width: '100%',
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    margin: '6px 0',
  }),
  progressFill: css({
    height: '100%',
    background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)',
    borderRadius: 4,
    transition: 'width 0.5s ease',
  }),
  footer: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  }),
  selectBtn: css({
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(45,212,191,0.12)',
    border: '1px solid rgba(45,212,191,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2dd4bf',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
    '&:hover': { background: '#2dd4bf', color: '#0f172a' },
  }),
  fadeIn: css({
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  }),
}))

export default function DisastersPage() {
  const { styles } = useStyles()
  const router = useRouter()
  const [disasters, setDisasters] = useState<Disaster[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    const data = await getDisasters()
    setDisasters(data)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  function handleSelect(disaster: Disaster) {
    localStorage.setItem('selectedDisaster', JSON.stringify(disaster))
    router.push(`/donor/companies?disaster_id=${disaster.id}`)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading disasters..." />
      </div>
    )
  }

  return (
    <div className={`${styles.page} ${styles.fadeIn}`}>
      <div className={styles.breadcrumb}>
        <HomeOutlined />
        <span>/</span>
        <span>Active Disasters</span>
      </div>

      <div className={styles.header}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Active Disasters</Title>
          <Text type="secondary">Select an emergency to view its campaign pool and contribute</Text>
        </div>
        <Button
          icon={<ReloadOutlined spin={refreshing} />}
          onClick={() => load(true)}
          loading={refreshing}
        >
          Refresh
        </Button>
      </div>

      <div className={styles.grid}>
        {disasters.map((disaster: Disaster) => {
          const severityColor = getSeverityColor(disaster.severity)
          const pct = disaster.raised && disaster.goal
            ? Math.round((disaster.raised / disaster.goal) * 100)
            : 0

          return (
            <div
              key={disaster.id}
              className={styles.card}
              onClick={() => handleSelect(disaster)}
              data-testid={`disaster-card-${disaster.id}`}
            >
              {/* Image */}
              <div className={styles.imgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={disaster.image || `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80`}
                  alt={disaster.name}
                  className={styles.img}
                />
                <span className={styles.countryBadge}>{disaster.country}</span>
                {disaster.status === 'active' && (
                  <span className={styles.activeBadge}>
                    <span className={styles.activeDot} />
                    Active
                  </span>
                )}
              </div>

              {/* Body */}
              <div className={styles.body}>
                <div className={styles.eventType}>{disaster.event_type}</div>
                <div className={styles.name}>{disaster.name}</div>

                <div className={styles.severityRow}>
                  <span className={styles.severityDot} style={{ background: severityColor, boxShadow: `0 0 6px ${severityColor}80` }} />
                  <Text style={{ color: severityColor, fontSize: 12, fontWeight: 700 }}>
                    {disaster.severity?.charAt(0).toUpperCase() + disaster.severity?.slice(1)} urgency
                  </Text>
                </div>

                <p className={styles.description}>{disaster.description}</p>

                {/* Pool progress */}
                {disaster.raised != null && disaster.goal != null && (
                  <div className={styles.progressWrap}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Pool funded</span>
                      <span style={{ color: '#2dd4bf', fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        ${disaster.raised.toLocaleString('en-US')} raised
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                        / ${disaster.goal.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                )}

                <div className={styles.footer}>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600 }}>
                    {new Date(disaster.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                  <div
                    className={styles.selectBtn}
                    onClick={e => { e.stopPropagation(); handleSelect(disaster) }}
                    data-testid={`disaster-select-${disaster.id}`}
                  >
                    <ArrowRightOutlined />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
