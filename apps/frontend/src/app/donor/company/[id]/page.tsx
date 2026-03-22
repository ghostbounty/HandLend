'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  Typography, Tag, Progress, Spin,
  Space, Row, Col
} from 'antd'
import { RobotOutlined, CheckCircleOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { createStyles } from 'antd-style'
import { getCompany } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Company = any

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px',
    maxWidth: 900,
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
    marginBottom: 24,
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  }),
  card: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '28px',
    marginBottom: 24,
    transition: 'all 0.25s ease',
  }),
  headerRow: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
  }),
  trustBlock: css({
    textAlign: 'center',
    minWidth: 160,
  }),
  descTable: css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    '& > div': {
      padding: '14px 18px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      '&:nth-child(odd)': { borderRight: '1px solid rgba(255,255,255,0.06)' },
    },
  }),
  descLabel: css({
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: 4,
  }),
  descValue: css({
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
  }),
  genLayerCard: css({
    background: 'rgba(56,189,248,0.06)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(56,189,248,0.15)',
    borderRadius: 20,
    padding: '24px 28px',
    marginBottom: 24,
  }),
  genLayerTitle: css({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 700,
    color: '#38bdf8',
    marginBottom: 16,
  }),
  genLayerText: css({
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    lineHeight: 1.7,
  }),
  assessmentCard: css({
    background: 'rgba(15,23,42,0.4)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: '18px 20px',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '20%',
      bottom: '20%',
      width: 3,
      borderRadius: 4,
    },
  }),
  assessGreen: css({
    '&::before': { background: '#4ade80' },
  }),
  assessAmber: css({
    '&::before': { background: '#fbbf24' },
  }),
  assessRed: css({
    '&::before': { background: '#f87171' },
  }),
  assessPurple: css({
    '&::before': { background: '#a78bfa' },
  }),
  assessLabel: css({
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: 8,
  }),
  contributeBtn: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    height: 52,
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 16,
    background: '#2dd4bf',
    border: 'none',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      filter: 'brightness(1.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(45,212,191,0.35)',
    },
  }),
  backToPoolBtn: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 400,
    margin: '12px auto 0',
    height: 44,
    borderRadius: 14,
    fontWeight: 600,
    fontSize: 14,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
    },
  }),
  fadeIn: css({
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  }),
  planTable: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 0,
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    '& > div': {
      display: 'grid',
      gridTemplateColumns: '180px 1fr',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      '&:last-child': { borderBottom: 'none' },
    },
  }),
  planLabel: css({
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: 600,
    borderRight: '1px solid rgba(255,255,255,0.06)',
  }),
  planValue: css({
    padding: '12px 16px',
    color: '#fff',
    fontSize: 13,
  }),
}))

export default function CompanyProfilePage() {
  const { styles } = useStyles()
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const companyId = Number(params.id)
  const disasterId = searchParams.get('disaster_id')

  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getCompany(companyId)
      setCompany(data)
      setLoading(false)
    }
    load()
  }, [companyId])

  function handleContributeToPool() {
    router.push('/donor/fund')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    )
  }

  if (!company) return null

  const trustColor = company.trust_score >= 85 ? '#4ade80' : company.trust_score >= 70 ? '#38bdf8' : '#fbbf24'

  return (
    <div className={`${styles.page} ${styles.fadeIn}`}>
      <div className={styles.breadcrumb}>
        <HomeOutlined />
        <span>/</span>
        <a href="/donor/disasters">Disasters</a>
        <span>/</span>
        <a href={`/donor/companies?disaster_id=${disasterId}`}>Campaign Pool</a>
        <span>/</span>
        <span>{company.name}</span>
      </div>

      <button className={styles.backBtn} onClick={() => router.back()}>
        <ArrowLeftOutlined />
        Back
      </button>

      {/* Header Card */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#fff' }}>{company.name}</Title>
            {company.verification_status === 'active' && (
              <Tag
                icon={<CheckCircleOutlined />}
                style={{
                  marginTop: 10,
                  background: 'rgba(74,222,128,0.12)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80',
                  borderRadius: 24,
                  padding: '4px 14px',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Verified
              </Tag>
            )}
          </div>
          <div className={styles.trustBlock}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
              Trust Score
            </div>
            <div style={{ color: trustColor, fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
              {company.trust_score}<span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18, fontWeight: 600 }}>/ 100</span>
            </div>
            <Progress
              percent={company.trust_score}
              showInfo={false}
              strokeColor={trustColor}
              trailColor="rgba(255,255,255,0.08)"
              style={{ width: 200, marginTop: 8 }}
            />
          </div>
        </div>

        <div className={styles.descTable}>
          <div>
            <div className={styles.descLabel}>Capacity</div>
            <div className={styles.descValue}>{company.capacity}</div>
          </div>
          <div>
            <div className={styles.descLabel}>Coverage</div>
            <div className={styles.descValue}>{company.coverage}</div>
          </div>
          <div>
            <div className={styles.descLabel}>Response time</div>
            <div className={styles.descValue}>{company.response_time}</div>
          </div>
          <div>
            <div className={styles.descLabel}>Status</div>
            <div className={styles.descValue}>
              <Tag style={{
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.3)',
                color: '#4ade80',
                borderRadius: 24,
                fontWeight: 700,
              }}>
                Active
              </Tag>
            </div>
          </div>
        </div>
      </div>

      {/* GenLayer Analysis */}
      <div className={styles.genLayerCard}>
        <div className={styles.genLayerTitle}>
          <RobotOutlined style={{ fontSize: 20 }} />
          GenLayer Analysis (Verification AI)
        </div>
        <p className={styles.genLayerText}>{company.genlayer_summary}</p>
      </div>

      {/* Operational Plan */}
      {company.operational_plan && (
        <div className={styles.card}>
          <Title level={4} style={{ margin: '0 0 18px 0', color: '#fff' }}>Operational Plan</Title>
          <div className={styles.planTable}>
            <div>
              <div className={styles.planLabel}>Cargo capacity</div>
              <div className={styles.planValue}>{company.operational_plan.cargo_capacity}</div>
            </div>
            <div>
              <div className={styles.planLabel}>Estimated time</div>
              <div className={styles.planValue}>{company.operational_plan.estimated_time}</div>
            </div>
            <div>
              <div className={styles.planLabel}>Coverage</div>
              <div className={styles.planValue}>{company.operational_plan.coverage}</div>
            </div>
            <div>
              <div className={styles.planLabel}>Infrastructure</div>
              <div className={styles.planValue}>{company.operational_plan.infrastructure}</div>
            </div>
            <div>
              <div className={styles.planLabel}>Last-mile strategy</div>
              <div className={styles.planValue}>{company.operational_plan.last_mile_strategy}</div>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Assessment */}
      {company.assessment && (
        <div className={styles.card}>
          <Title level={4} style={{ margin: '0 0 18px 0', color: '#fff' }}>Capacity Assessment</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className={`${styles.assessmentCard} ${styles.assessGreen}`}>
                <div className={styles.assessLabel} style={{ color: '#4ade80' }}>Can execute</div>
                <Text style={{ color: 'rgba(255,255,255,0.75)' }}>{company.assessment.can_execute}</Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={`${styles.assessmentCard} ${styles.assessAmber}`}>
                <div className={styles.assessLabel} style={{ color: '#fbbf24' }}>Available resources</div>
                <Text style={{ color: 'rgba(255,255,255,0.75)' }}>{company.assessment.resources}</Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={`${styles.assessmentCard} ${styles.assessRed}`}>
                <div className={styles.assessLabel} style={{ color: '#f87171' }}>Identified risks</div>
                <Text style={{ color: 'rgba(255,255,255,0.75)' }}>{company.assessment.risks}</Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={`${styles.assessmentCard} ${styles.assessPurple}`}>
                <div className={styles.assessLabel} style={{ color: '#a78bfa' }}>Limitations</div>
                <Text style={{ color: 'rgba(255,255,255,0.75)' }}>{company.assessment.limitations}</Text>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Capacity reference notice */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: 14,
        marginBottom: 24,
      }}>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          This coordinator is a registered capacity provider. Pool funds are allocated to them by the protocol only after validated last-mile delivery evidence is submitted — not as a direct donation target.
        </Text>
      </div>

      {/* Pool contribution CTA */}
      <div style={{ padding: '0 0 32px', textAlign: 'center' }}>
        <button className={styles.contributeBtn} onClick={handleContributeToPool} data-testid="contribute-pool-from-coordinator">
          Contribute to Campaign Pool
        </button>
        <button className={styles.backToPoolBtn} onClick={() => router.back()}>
          Back to Campaign Pool
        </button>
      </div>
    </div>
  )
}
