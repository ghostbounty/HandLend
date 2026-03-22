'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Statistic, Alert, Typography, Space, Spin,
  Row, Col, Button, Divider,
} from 'antd'
import {
  DollarOutlined, TruckOutlined, SyncOutlined,
  ReloadOutlined, CheckCircleOutlined, WarningOutlined,
  TeamOutlined, ArrowRightOutlined, BarChartOutlined,
  SettingOutlined, FileSearchOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { createStyles } from 'antd-style'
import { getCoordinatorDashboard } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DashboardData = any

/* ── Glass-themed styles (ADR-009) ── */
const useStyles = createStyles(({ css }) => ({
  statCard: css({
    position: 'relative',
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '24px 24px 24px 28px',
    overflow: 'hidden',
    transition: 'all 0.25s ease',
    cursor: 'default',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.14)',
    },
    /* translucent accent bar on the left */
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '20%',
      bottom: '20%',
      width: 3,
      borderRadius: 4,
      transition: 'height 0.25s ease',
    },
    '.ant-statistic-title': {
      color: 'rgba(255,255,255,0.55)',
      fontSize: 13,
      marginBottom: 8,
    },
  }),
  accentTeal: css({
    '&::before': { background: '#2dd4bf' },
    '&:hover::before': { top: '10%', bottom: '10%' },
    '&:hover': { boxShadow: '0 12px 32px rgba(45,212,191,0.12)' },
  }),
  accentGreen: css({
    '&::before': { background: '#4ade80' },
    '&:hover::before': { top: '10%', bottom: '10%' },
    '&:hover': { boxShadow: '0 12px 32px rgba(74,222,128,0.12)' },
  }),
  accentAmber: css({
    '&::before': { background: '#fbbf24' },
    '&:hover::before': { top: '10%', bottom: '10%' },
    '&:hover': { boxShadow: '0 12px 32px rgba(251,191,36,0.12)' },
  }),
  accentBlue: css({
    '&::before': { background: '#38bdf8' },
    '&:hover::before': { top: '10%', bottom: '10%' },
    '&:hover': { boxShadow: '0 12px 32px rgba(56,189,248,0.12)' },
  }),
  iconBubble: css({
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
  }),
  alertCard: css({
    background: 'rgba(15,23,42,0.45)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  }),
  quickActions: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginTop: 8,
  }),
  quickCard: css({
    background: 'rgba(15,23,42,0.45)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    '&:hover': {
      transform: 'translateY(-2px)',
      border: '1px solid rgba(45,212,191,0.25)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    },
  }),
  sectionLabel: css({
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 12,
  }),
  fadeIn: css({
    animation: 'dashFadeIn 0.4s ease-out',
    '@keyframes dashFadeIn': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  }),
}))

export default function DashboardPage() {
  const { styles } = useStyles()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    const result = await getCoordinatorDashboard()
    setData(result)
    setLastUpdated(new Date())
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(() => load(true), 30000)
    return () => clearInterval(interval)
  }, [load])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    )
  }

  const alerts: string[] = data?.alerts || []
  const hasPendingSync = (data?.pending_sync || 0) > 0

  return (
    <div className={styles.fadeIn} style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Operational dashboard</Title>
          {lastUpdated && (
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Last updated: {lastUpdated.toLocaleTimeString('en-US')} · Auto-refresh every 30s
            </Text>
          )}
        </div>
        <Button
          icon={<ReloadOutlined spin={refreshing} />}
          onClick={() => load(true)}
          loading={refreshing}
        >
          Refresh
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.sectionLabel}>Overview</div>
      <Row gutter={[16, 16]} style={{ marginBottom: '28px' }}>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.statCard} ${styles.accentTeal}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div className={styles.iconBubble} style={{ background: 'rgba(45,212,191,0.12)', color: '#2dd4bf' }}>
                <DollarOutlined />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>Committed funds</span>
            </div>
            <Statistic
              value={data?.total_funds || 0}
              suffix="USDC"
              valueStyle={{ color: '#2dd4bf', fontWeight: 800, fontSize: 28 }}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.statCard} ${styles.accentGreen}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div className={styles.iconBubble} style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                <TruckOutlined />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>Recorded deliveries</span>
            </div>
            <Statistic
              value={data?.total_deliveries || 0}
              valueStyle={{ color: '#4ade80', fontWeight: 800, fontSize: 28 }}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.statCard} ${hasPendingSync ? styles.accentAmber : styles.accentGreen}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div
                className={styles.iconBubble}
                style={{
                  background: hasPendingSync ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)',
                  color: hasPendingSync ? '#fbbf24' : '#4ade80',
                }}
              >
                <SyncOutlined />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>Pending sync</span>
            </div>
            <Statistic
              value={data?.pending_sync || 0}
              suffix={hasPendingSync
                ? <WarningOutlined style={{ color: '#fbbf24', fontSize: 16 }} />
                : <CheckCircleOutlined style={{ color: '#4ade80', fontSize: 16 }} />
              }
              valueStyle={{ color: hasPendingSync ? '#fbbf24' : '#4ade80', fontWeight: 800, fontSize: 28 }}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.statCard} ${styles.accentBlue}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div className={styles.iconBubble} style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}>
                <TeamOutlined />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>Active operators</span>
            </div>
            <Statistic
              value={2}
              valueStyle={{ color: '#38bdf8', fontWeight: 800, fontSize: 28 }}
            />
          </div>
        </Col>
      </Row>

      {/* ── Alerts ── */}
      {alerts.length > 0 && (
        <>
          <div className={styles.sectionLabel}>Alerts</div>
          <Space direction="vertical" style={{ width: '100%', marginBottom: '24px' }} size="middle">
            {alerts.map((alert, idx) => (
              <Alert
                key={idx}
                type="warning"
                message={alert}
                showIcon
                icon={<WarningOutlined />}
              />
            ))}
          </Space>
        </>
      )}

      {alerts.length === 0 && (
        <div className={styles.alertCard}>
          <div className={styles.iconBubble} style={{ background: 'rgba(45,212,191,0.12)', color: '#2dd4bf' }}>
            <CheckCircleOutlined style={{ fontSize: 20 }} />
          </div>
          <div>
            <Text strong style={{ display: 'block', lineHeight: 1.3 }}>No active alerts</Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              All operations are running normally.
            </Text>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className={styles.sectionLabel}>Quick Actions</div>
      <div className={styles.quickActions}>
        <Link href="/coordinator/operators" style={{ textDecoration: 'none' }}>
          <div className={styles.quickCard}>
            <div className={styles.iconBubble} style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}>
              <TeamOutlined />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', lineHeight: 1.3 }}>Operator management</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Manage field operators</Text>
            </div>
            <ArrowRightOutlined style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }} />
          </div>
        </Link>
        <Link href="/coordinator/planning" style={{ textDecoration: 'none' }}>
          <div className={styles.quickCard}>
            <div className={styles.iconBubble} style={{ background: 'rgba(45,212,191,0.12)', color: '#2dd4bf' }}>
              <BarChartOutlined />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', lineHeight: 1.3 }}>Mission planning</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Create and review missions</Text>
            </div>
            <ArrowRightOutlined style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }} />
          </div>
        </Link>
        <Link href="/coordinator/evidence" style={{ textDecoration: 'none' }}>
          <div className={styles.quickCard}>
            <div className={styles.iconBubble} style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa' }}>
              <FileSearchOutlined />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', lineHeight: 1.3 }}>Evidence Review</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Review operator submissions</Text>
            </div>
            <ArrowRightOutlined style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }} />
          </div>
        </Link>
      </div>
    </div>
  )
}
