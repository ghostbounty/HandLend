'use client'

import { Typography, Button, Tag, Divider, Avatar } from 'antd'
import {
  UserOutlined, MailOutlined, RocketOutlined, LogoutOutlined,
  CheckCircleOutlined, TeamOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { createStyles } from 'antd-style'
import { useAuth } from '@/lib/authContext'

const { Title, Text } = Typography

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '32px 24px',
    maxWidth: 560,
    margin: '0 auto',
  }),
  card: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '28px 32px',
    marginBottom: 20,
  }),
  row: css({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
  }),
  label: css({
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    minWidth: 100,
  }),
}))

export default function AccountPage() {
  const { styles } = useStyles()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: 'center', padding: '48px 32px' }}>
          <UserOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#f1f5f9', margin: '0 0 8px' }}>Not logged in</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Log in to view your account and manage your profile.
          </Text>
          <Button
            type="primary"
            size="large"
            style={{ borderRadius: 12, background: '#2dd4bf', borderColor: '#2dd4bf', color: '#0f172a', fontWeight: 700 }}
            onClick={() => router.push('/login')}
          >
            Log In
          </Button>
        </div>
      </div>
    )
  }

  const roleColor: Record<string, string> = {
    coordinator: '#2dd4bf',
    donor: '#38bdf8',
    member: 'rgba(255,255,255,0.5)',
  }
  const roleLabel: Record<string, string> = {
    coordinator: 'Coordinator',
    donor: 'Donor',
    member: 'Member',
  }

  return (
    <div className={styles.page}>
      <Title level={3} style={{ color: '#f1f5f9', marginBottom: 24 }}>My Account</Title>

      {/* Profile card */}
      <div className={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Avatar
            size={64}
            style={{ background: '#2dd4bf', color: '#0f172a', fontWeight: 700, fontSize: 28 }}
          >
            {user?.name?.[0] ?? 'U'}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 20, color: '#fff', display: 'block' }}>{user?.name}</Text>
            <Tag style={{
              background: `${roleColor[user?.role ?? 'member']}18`,
              border: `1px solid ${roleColor[user?.role ?? 'member']}40`,
              color: roleColor[user?.role ?? 'member'],
              borderRadius: 20,
              fontWeight: 700,
              marginTop: 4,
            }}>
              {user?.role === 'coordinator' && <TeamOutlined style={{ marginRight: 4 }} />}
              {user?.role === 'coordinator' && <CheckCircleOutlined style={{ marginRight: 4 }} />}
              {roleLabel[user?.role ?? 'member']}
            </Tag>
          </div>
        </div>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '0 0 16px' }} />

        <div className={styles.row}>
          <MailOutlined style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16 }} />
          <Text className={styles.label}>Email</Text>
          <Text style={{ color: 'rgba(255,255,255,0.75)' }}>{user?.email}</Text>
        </div>
        {user?.organization && (
          <div className={styles.row}>
            <TeamOutlined style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16 }} />
            <Text className={styles.label}>Organization</Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)' }}>{user.organization}</Text>
          </div>
        )}
      </div>

      {/* Become Coordinator CTA */}
      {user?.role !== 'coordinator' && (
        <div className={styles.card} style={{ border: '1px solid rgba(45,212,191,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <RocketOutlined style={{ fontSize: 28, color: '#2dd4bf', marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: 16, color: '#fff', display: 'block', marginBottom: 6 }}>
                Become a Coordinator
              </Text>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
                Register your humanitarian organization, get certified on-chain, and start managing logistics operations and disbursements.
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                style={{ borderRadius: 12, background: '#2dd4bf', borderColor: '#2dd4bf', color: '#0f172a', fontWeight: 700 }}
                onClick={() => router.push('/coordinator/apply')}
                data-testid="btn-become-coordinator"
              >
                Become a Coordinator
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Coordinator confirmed badge */}
      {user?.role === 'coordinator' && (
        <div className={styles.card} style={{ border: '1px solid rgba(45,212,191,0.25)', background: 'rgba(45,212,191,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircleOutlined style={{ fontSize: 24, color: '#2dd4bf' }} />
            <div>
              <Text strong style={{ color: '#2dd4bf', display: 'block' }}>Certified Coordinator</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Your account is certified. Manage operations from the{' '}
                <span
                  style={{ color: '#2dd4bf', cursor: 'pointer' }}
                  onClick={() => router.push('/coordinator/dashboard')}
                >
                  Coordinator Dashboard
                </span>.
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Log out */}
      <Button
        block
        size="large"
        icon={<LogoutOutlined />}
        danger
        style={{ borderRadius: 12, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,77,79,0.4)', marginTop: 8 }}
        onClick={() => { logout(); router.push('/login') }}
        data-testid="btn-logout"
      >
        Log Out
      </Button>
    </div>
  )
}
