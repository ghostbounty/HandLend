'use client'

import { Card, Typography, Space } from 'antd'
import { HeartOutlined, TeamOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { createStyles } from 'antd-style'

const { Title, Text } = Typography

const useStyles = createStyles(({ css }) => ({
  wrapper: css({
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    gap: 32,
  }),
  heading: css({
    textAlign: 'center',
  }),
  cardsRow: css({
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  }),
  roleCard: css({
    width: 220,
    background: 'rgba(15,23,42,0.55) !important',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1) !important',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    borderRadius: '16px !important',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      border: '1px solid rgba(45,212,191,0.4) !important',
      boxShadow: '0 12px 40px rgba(45,212,191,0.15)',
      transform: 'translateY(-4px)',
    },
  }),
  roleCardInner: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
  }),
  arrowRow: css({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 4,
  }),
}))

export default function LoginLandingPage() {
  const { styles } = useStyles()
  const router = useRouter()

  return (
    <div className={styles.wrapper} data-testid="login-landing-page">
      <div className={styles.heading}>
        <Title level={2} style={{ margin: 0, color: '#f1f5f9' }}>
          Welcome to <span style={{ color: '#2dd4bf' }}>HandLend</span>
        </Title>
        <Text type="secondary" style={{ fontSize: 15, marginTop: 8, display: 'block' }}>
          Choose your role to continue
        </Text>
      </div>

      <div className={styles.cardsRow}>
        {/* Donor card */}
        <Card
          className={styles.roleCard}
          bordered={false}
          onClick={() => router.push('/donor/login')}
          data-testid="role-card-donor"
        >
          <div className={styles.roleCardInner}>
            <HeartOutlined style={{ fontSize: 48, color: '#2dd4bf' }} />
            <Title level={4} style={{ margin: 0, color: '#f1f5f9' }}>
              I&apos;m a Donor
            </Title>
            <Text type="secondary" style={{ fontSize: 13, textAlign: 'center' }}>
              Fund humanitarian campaigns and track delivery impact
            </Text>
            <div className={styles.arrowRow}>
              <span>Go to Donor login</span>
              <ArrowRightOutlined />
            </div>
          </div>
        </Card>

        {/* Coordinator card */}
        <Card
          className={styles.roleCard}
          bordered={false}
          onClick={() => router.push('/coordinator/login')}
          data-testid="role-card-coordinator"
        >
          <div className={styles.roleCardInner}>
            <TeamOutlined style={{ fontSize: 48, color: '#2dd4bf' }} />
            <Title level={4} style={{ margin: 0, color: '#f1f5f9' }}>
              I&apos;m a Coordinator
            </Title>
            <Text type="secondary" style={{ fontSize: 13, textAlign: 'center' }}>
              Manage logistics operations and submit delivery evidence
            </Text>
            <div className={styles.arrowRow}>
              <span>Go to Coordinator login</span>
              <ArrowRightOutlined />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
