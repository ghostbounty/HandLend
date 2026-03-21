'use client'

import { useState } from 'react'
import { Layout, Button, Space, Typography, Badge, Avatar, Tooltip, Switch } from 'antd'
import {
  HeartOutlined, ToolOutlined, TeamOutlined, HomeOutlined,
  WalletOutlined, BellOutlined, MenuOutlined, CloseOutlined,
  SearchOutlined, ThunderboltOutlined, BarChartOutlined
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import { createStyles } from 'antd-style'
import clsx from 'clsx'

const { Sider, Content, Header } = Layout
const { Text } = Typography

const useStyles = createStyles(({ css, token }) => ({
  sider: css({
    background: 'rgba(15,23,42,0.7) !important',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    position: 'fixed !important' as 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
  }),
  logo: css({
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 8,
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
  topHeader: css({
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(15,23,42,0.8) !important',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  searchBar: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: '8px 16px',
    flex: 1,
    maxWidth: 360,
    cursor: 'text',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  }),
  iconBtn: css({
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontSize: 16,
    '&:hover': {
      background: 'rgba(255,255,255,0.12)',
      color: '#fff',
    },
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

const NAV = [
  { label: 'Discover', icon: <HomeOutlined />, path: '/', match: '/' },
  { label: 'Donor', icon: <HeartOutlined />, path: '/donor/disasters', match: '/donor' },
  { label: 'Operator', icon: <ToolOutlined />, path: '/operator/delivery', match: '/operator' },
  { label: 'Coordinator', icon: <TeamOutlined />, path: '/coordinator/dashboard', match: '/coordinator' },
]

export default function GlassShell({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles()
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (match: string) =>
    match === '/' ? pathname === '/' : pathname.startsWith(match)

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* ── Desktop Sidebar ── */}
      <div className="desktop-sidebar" style={{ display: 'none' }} id="desktop-sidebar">
        <div className={styles.sider} style={{ width: 260, overflow: 'hidden' }}>
          {/* Logo */}
          <div className={styles.logo}>
            <div
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            >
              <Text strong style={{ color: '#2dd4bf', fontSize: 20, letterSpacing: '-0.5px', display: 'block' }}>
                Hand<span style={{ color: '#fff' }}>Lend</span>
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Humanitarian Protocol
              </Text>
            </div>
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
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <Layout style={{ background: 'transparent', marginLeft: 0 }} id="main-layout">
        {/* Top Header */}
        <Header className={styles.topHeader}>
          <div className={styles.searchBar}>
            <SearchOutlined />
            <span>Search humanitarian initiatives...</span>
          </div>
          <Space size={8} style={{ marginLeft: 16 }}>
            <Tooltip title="Notifications">
              <Badge dot>
                <div className={styles.iconBtn}><BellOutlined /></div>
              </Badge>
            </Tooltip>
            <Tooltip title="Wallet: 0xDemo...abcd">
              <div className={styles.iconBtn}><WalletOutlined /></div>
            </Tooltip>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
            <Avatar
              style={{ background: '#2dd4bf', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}
              size={36}
            >
              D
            </Avatar>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ background: 'transparent', overflowY: 'auto' }}>
          {children}
        </Content>
      </Layout>

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
    </Layout>
  )
}
