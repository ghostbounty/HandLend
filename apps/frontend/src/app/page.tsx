'use client'

import { useState } from 'react'
import { Typography, Tag } from 'antd'
import {
  ArrowRightOutlined, QrcodeOutlined, SafetyCertificateOutlined,
  RiseOutlined, CheckCircleOutlined, TeamOutlined
} from '@ant-design/icons'
import { createStyles } from 'antd-style'
import { useRouter } from 'next/navigation'

const { Text } = Typography

const FILTERS = ['All', 'Earthquake', 'Flood', 'Drought', 'Food Security']

const CAMPAIGNS = [
  {
    id: 1, title: 'Valparaíso Earthquake Relief', country: 'Chile',
    category: 'Earthquake',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80',
    progress: 78, raised: '$78k', goal: '$100k', operators: 3, deliveries: 36,
  },
  {
    id: 2, title: 'Piura Flood Emergency Response', country: 'Peru',
    category: 'Flood',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80',
    progress: 54, raised: '$27k', goal: '$50k', operators: 2, deliveries: 14,
  },
  {
    id: 3, title: 'Gran Chaco Food Security Initiative', country: 'Paraguay',
    category: 'Drought',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    progress: 31, raised: '$9.3k', goal: '$30k', operators: 1, deliveries: 8,
  },
]

const METRICS = [
  { label: 'Total Raised', value: '$1.2M', trend: '+12% this month' },
  { label: 'Active Missions', value: '24', trend: '6 new this week' },
  { label: 'Verified Deliveries', value: '1,847', trend: 'All on-chain' },
  { label: 'Active Operators', value: '89', trend: 'Across 12 countries' },
]

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px 24px 48px',
    maxWidth: 1280,
    margin: '0 auto',
    '@media (min-width: 768px)': { padding: '32px 40px 64px' },
  }),
  filterBar: css({
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 24,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  }),
  filterBtn: css({
    padding: '8px 20px',
    borderRadius: 24,
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.6)',
    transition: 'all 0.15s',
    '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  }),
  filterBtnActive: css({
    background: '#2dd4bf !important',
    color: '#0f172a !important',
    border: '1px solid #2dd4bf !important',
    boxShadow: '0 4px 12px rgba(45,212,191,0.3)',
  }),
  hero: css({
    position: 'relative',
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 460,
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: 32,
    boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
    cursor: 'default',
  }),
  heroImg: css({
    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
    transition: 'transform 0.7s ease',
    '&:hover': { transform: 'scale(1.03)' },
  }),
  heroOverlay: css({
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
  }),
  heroContent: css({
    position: 'relative',
    width: '100%',
    padding: '32px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    '@media (min-width: 768px)': {
      padding: '48px 56px',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
  }),
  heroLeft: css({ maxWidth: 560 }),
  heroBadge: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    background: 'rgba(45,212,191,0.15)',
    border: '1px solid rgba(45,212,191,0.3)',
    borderRadius: 24,
    color: '#2dd4bf',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 16,
    backdropFilter: 'blur(8px)',
  }),
  heroTitle: css({
    fontSize: 36,
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    marginBottom: 12,
    '@media (min-width: 768px)': { fontSize: 52 },
  }),
  heroDesc: css({
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 24,
    maxWidth: 420,
  }),
  heroBtns: css({
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  }),
  btnPrimary: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    background: '#2dd4bf',
    color: '#0f172a',
    borderRadius: 24,
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: '0 4px 16px rgba(45,212,191,0.35)',
    '&:hover': { filter: 'brightness(1.1)', transform: 'translateY(-1px)' },
  }),
  btnSecondary: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    borderRadius: 24,
    fontWeight: 700,
    fontSize: 15,
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': { background: 'rgba(255,255,255,0.18)' },
  }),
  progressCard: css({
    width: '100%',
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.1)',
    flexShrink: 0,
    '@media (min-width: 768px)': { width: 280 },
  }),
  progressLabel: css({
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4,
  }),
  progressValue: css({
    color: '#fff',
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: '-0.02em',
  }),
  progressBar: css({
    width: '100%',
    height: 10,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    overflow: 'hidden',
    margin: '12px 0',
  }),
  progressFill: css({
    height: '100%',
    background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)',
    borderRadius: 8,
    boxShadow: '0 0 12px rgba(45,212,191,0.5)',
    transition: 'width 0.6s ease',
  }),
  progressStats: css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginTop: 16,
  }),
  progressStat: css({
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '10px',
    textAlign: 'center',
  }),
  sectionHeader: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  }),
  sectionTitle: css({
    color: '#fff',
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '-0.01em',
    '@media (min-width: 768px)': { fontSize: 26 },
  }),
  viewAll: css({
    color: '#2dd4bf',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    '&:hover': { opacity: 0.8 },
  }),
  campaignGrid: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
    marginBottom: 40,
    '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
    '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
  }),
  campaignCard: css({
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
  cardImg: css({
    height: 200,
    width: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s ease',
    '&:hover': { transform: 'scale(1.05)' },
  }),
  cardImgWrap: css({
    overflow: 'hidden',
    position: 'relative',
  }),
  cardCountry: css({
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
  cardBody: css({
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  }),
  cardCategory: css({
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#2dd4bf',
    marginBottom: 8,
  }),
  cardTitle: css({
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: 16,
  }),
  cardProgress: css({
    marginTop: 'auto',
  }),
  cardProgressBar: css({
    width: '100%',
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    margin: '8px 0',
  }),
  cardProgressFill: css({
    height: '100%',
    background: '#2dd4bf',
    borderRadius: 4,
    transition: 'width 0.5s ease',
  }),
  cardFooter: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  }),
  addBtn: css({
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(45,212,191,0.12)',
    border: '1px solid rgba(45,212,191,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2dd4bf',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': { background: '#2dd4bf', color: '#0f172a' },
  }),
  metricsSection: css({
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 28,
    padding: '32px 28px',
    position: 'relative',
    overflow: 'hidden',
    '@media (min-width: 768px)': { padding: '48px 48px' },
  }),
  metricsGlow: css({
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    width: 200,
    height: 200,
    background: 'rgba(45,212,191,0.05)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  }),
  metricsHeader: css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  }),
  metricsGrid: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
    '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
  }),
  metricItem: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  }),
  metricLabel: css({
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }),
  metricValue: css({
    color: '#2dd4bf',
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    '@media (min-width: 768px)': { fontSize: 44 },
  }),
  metricTrend: css({
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: 600,
  }),
}))

export default function DiscoveryPage() {
  const { styles } = useStyles()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? CAMPAIGNS
    : CAMPAIGNS.filter(c => c.category === activeFilter)

  return (
    <div className={styles.page}>
      {/* Category Filters */}
      <div className={styles.filterBar}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(f)}
            data-testid={`filter-${f.toLowerCase().replace(' ', '-')}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section className={styles.hero} data-testid="hero-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80"
          alt="Humanitarian aid delivery"
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          {/* Left side */}
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <SafetyCertificateOutlined style={{ fontSize: 13 }} />
              Verified on Avalanche
            </div>
            <h2 className={styles.heroTitle}>
              Valparaíso Earthquake<br />Relief Mission
            </h2>
            <p className={styles.heroDesc}>
              12 remote communities. 3 verified operators. Every delivery lot tracked from escrow to recipient — provably on-chain.
            </p>
            <div className={styles.heroBtns}>
              <button
                className={styles.btnPrimary}
                onClick={() => router.push('/donor/disasters')}
                data-testid="hero-fund-btn"
              >
                Fund Campaign
                <ArrowRightOutlined style={{ fontSize: 14 }} />
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => router.push('/operator/delivery')}
                data-testid="hero-deliver-btn"
              >
                <QrcodeOutlined style={{ fontSize: 14 }} />
                Register Delivery
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className={styles.progressCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className={styles.progressLabel}>Target Raised</div>
                <div className={styles.progressValue}>78%</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={styles.progressLabel}>Milestone</div>
                <span style={{
                  display: 'inline-block', padding: '4px 10px',
                  background: 'rgba(251,191,36,0.2)', color: '#fbbf24',
                  borderRadius: 24, fontSize: 11, fontWeight: 700
                }}>Pending</span>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '78%' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'center', fontWeight: 600 }}>
              $78k / $100k Goal
            </p>
            <div className={styles.progressStats}>
              <div className={styles.progressStat}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>3</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>Operators</div>
              </div>
              <div className={styles.progressStat}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>36</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>Deliveries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Grid */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Regional Opportunities</h3>
        <span className={styles.viewAll} onClick={() => router.push('/donor/disasters')}>
          View all <ArrowRightOutlined style={{ fontSize: 12 }} />
        </span>
      </div>

      <div className={styles.campaignGrid} data-testid="campaign-grid">
        {filtered.map(c => (
          <div
            key={c.id}
            className={styles.campaignCard}
            onClick={() => router.push('/donor/disasters')}
            data-testid={`campaign-card-${c.id}`}
          >
            <div className={styles.cardImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={c.title} className={styles.cardImg} />
              <span className={styles.cardCountry}>{c.country}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardCategory}>{c.category}</div>
              <div className={styles.cardTitle}>{c.title}</div>
              <div className={styles.cardProgress}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Progress</span>
                  <span style={{ color: '#2dd4bf', fontWeight: 700 }}>{c.progress}%</span>
                </div>
                <div className={styles.cardProgressBar}>
                  <div className={styles.cardProgressFill} style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <div className={styles.cardFooter}>
                <div>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{c.raised}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}> / {c.goal}</span>
                </div>
                <div
                  className={styles.addBtn}
                  onClick={e => { e.stopPropagation(); router.push('/donor/disasters') }}
                  data-testid={`btn-fund-${c.id}`}
                >
                  +
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Protocol Metrics */}
      <div className={styles.metricsSection} data-testid="metrics-section">
        <div className={styles.metricsGlow} />
        <div className={styles.metricsHeader}>
          <div>
            <h4 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.01em' }}>
              Protocol Transparency
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Real-time performance across the Avalanche ledger.
            </p>
          </div>
          <span style={{ color: '#2dd4bf', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Full Analytics →
          </span>
        </div>
        <div className={styles.metricsGrid}>
          {METRICS.map(m => (
            <div key={m.label} className={styles.metricItem}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricTrend}>{m.trend}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
