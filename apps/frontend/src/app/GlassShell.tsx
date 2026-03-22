'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Typography, Button } from 'antd'
import {
  HeartOutlined, ToolOutlined, TeamOutlined, HomeOutlined,
  UserOutlined, LogoutOutlined, RocketOutlined,
} from '@ant-design/icons'
import { createStyles } from 'antd-style'
import clsx from 'clsx'
import { useAuth } from '@/lib/authContext'

const { Text } = Typography

const useStyles = createStyles(({ css }) => ({
  sider: css({
    background: 'rgba(15,23,42,0.7)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    width: 260,
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }),
  logo: css({
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 8,
    cursor: 'pointer',
  }),
  navItem: css({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    margin: '2px 8px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: 500,
    '&:hover': {
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.85)',
      transform: 'translateX(2px)',
    },
  }),
  navItemActive: css({
    background: 'rgba(45,212,191,0.12) !important',
    color: '#2dd4bf !important',
    fontWeight: 600,
    boxShadow: 'inset 0 0 0 1px rgba(45,212,191,0.2)',
  }),
  navIcon: css({
    fontSize: 18,
    width: 20,
    textAlign: 'center',
  }),
  siderBottom: css({
    padding: '16px 12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }),
  mobileNav: css({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    background: 'rgba(15,23,42,0.92)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 20px',
  }),
  mobileNavItem: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '6px 16px',
    borderRadius: 12,
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    transition: 'all 0.15s',
  }),
  mobileNavItemActive: css({
    color: '#2dd4bf',
    background: 'rgba(45,212,191,0.1)',
  }),
}))

const NAV_ALL = [
  { label: 'Discover', icon: <HomeOutlined />, path: '/', match: '/', roles: null },
  { label: 'Donate', icon: <HeartOutlined />, path: '/donor/disasters', match: '/donor', roles: null },
  { label: 'Operator', icon: <ToolOutlined />, path: '/operator/delivery', match: '/operator', roles: null },
  { label: 'Coordinator', icon: <TeamOutlined />, path: '/coordinator/dashboard', match: '/coordinator', roles: ['coordinator'] },
  { label: 'Account', icon: <UserOutlined />, path: '/account', match: '/account', roles: null },
]

export default function GlassShell({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles()
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  const NAV = NAV_ALL.filter(
    (item) => item.roles === null || (user?.role && item.roles.includes(user.role)),
  )

  const isActive = (match: string) =>
    match === '/' ? pathname === '/' : pathname.startsWith(match)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* ── Desktop Sidebar ── */}
      <div id="desktop-sidebar" style={{ display: 'none' }}>
        <div className={styles.sider}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => router.push('/')}>
            <Text strong style={{ color: '#2dd4bf', fontSize: 20, letterSpacing: '-0.5px', display: 'block' }}>
              Hand<span style={{ color: '#fff' }}>Lend</span>
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Humanitarian Protocol
            </Text>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '8px 0' }}>
            {NAV.map(item => (
              <div
                key={item.path}
                className={clsx(styles.navItem, isActive(item.match) && styles.navItemActive)}
                onClick={() => router.push(item.path)}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Bottom CTAs */}
          <div className={styles.siderBottom}>
            <Button
              type="primary"
              block
              size="large"
              style={{ borderRadius: 24, fontWeight: 700, background: '#2dd4bf', borderColor: '#2dd4bf', color: '#0f172a' }}
              onClick={() => router.push('/donor/disasters')}
              data-testid="btn-fund-campaign"
            >
              Fund Campaign
            </Button>
            <Button
              block
              size="middle"
              icon={<ToolOutlined />}
              style={{ borderRadius: 24, fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
              onClick={() => router.push('/operator/delivery')}
              data-testid="btn-register-delivery"
            >
              Register Delivery
            </Button>
            {isAuthenticated && user?.role !== 'coordinator' && (
              <Button
                block
                size="middle"
                icon={<RocketOutlined />}
                style={{ borderRadius: 24, fontWeight: 600, background: 'rgba(45,212,191,0.08)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.25)' }}
                onClick={() => router.push('/coordinator/apply')}
                data-testid="btn-become-coordinator"
              >
                Become a Coordinator
              </Button>
            )}
            {isAuthenticated ? (
              <Button
                block
                size="middle"
                icon={<LogoutOutlined />}
                danger
                style={{ borderRadius: 24, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,77,79,0.4)' }}
                onClick={handleLogout}
                data-testid="btn-logout"
              >
                Log Out
              </Button>
            ) : (
              <Button
                block
                size="middle"
                icon={<UserOutlined />}
                style={{ borderRadius: 24, fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
                onClick={() => router.push('/login')}
                data-testid="btn-login"
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div id="main-layout" style={{ background: 'transparent', marginLeft: 0, minHeight: '100vh' }}>
        {children}
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className={styles.mobileNav} id="mobile-nav">
        {NAV.map(item => (
          <div
            key={item.path}
            className={clsx(styles.mobileNavItem, isActive(item.match) && styles.mobileNavItemActive)}
            onClick={() => router.push(item.path)}
            data-testid={`mobile-nav-${item.label.toLowerCase()}`}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (min-width: 768px) {
          #desktop-sidebar { display: block !important; }
          #main-layout { margin-left: 260px !important; }
          #mobile-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          #main-layout { padding-bottom: 80px; }
        }
      `}</style>
    </div>
  )
}
