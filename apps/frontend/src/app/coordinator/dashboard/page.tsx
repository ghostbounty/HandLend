'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Card, Statistic, Alert, Typography, Space, Spin,
  Row, Col, Button, Divider
} from 'antd'
import {
  DollarOutlined, TruckOutlined, SyncOutlined,
  ReloadOutlined, CheckCircleOutlined, WarningOutlined,
  TeamOutlined, ArrowRightOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { getCoordinatorDashboard } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DashboardData = any

export default function DashboardPage() {
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

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
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

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', border: '1px solid #91caff' }}>
            <Statistic
              title={
                <Space>
                  <DollarOutlined style={{ color: '#1890ff' }} />
                  <span>Committed funds</span>
                </Space>
              }
              value={data?.total_funds || 0}
              suffix="USDC"
              valueStyle={{ color: '#1890ff', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)', border: '1px solid #b7eb8f' }}>
            <Statistic
              title={
                <Space>
                  <TruckOutlined style={{ color: '#52c41a' }} />
                  <span>Recorded deliveries</span>
                </Space>
              }
              value={data?.total_deliveries || 0}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: (data?.pending_sync || 0) > 0
                ? 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)'
                : 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              border: (data?.pending_sync || 0) > 0 ? '1px solid #ffd591' : '1px solid #b7eb8f',
            }}
          >
            <Statistic
              title={
                <Space>
                  <SyncOutlined style={{ color: (data?.pending_sync || 0) > 0 ? '#fa8c16' : '#52c41a' }} />
                  <span>Pending sync</span>
                </Space>
              }
              value={data?.pending_sync || 0}
              suffix={(data?.pending_sync || 0) > 0
                ? <WarningOutlined style={{ color: '#fa8c16', fontSize: '16px' }} />
                : <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              }
              valueStyle={{ color: (data?.pending_sync || 0) > 0 ? '#fa8c16' : '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)', border: '1px solid #b7eb8f' }}>
            <Statistic
              title={
                <Space>
                  <TeamOutlined style={{ color: '#52c41a' }} />
                  <span>Active operators</span>
                </Space>
              }
              value={2}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alerts */}
      {alerts.length > 0 && (
        <>
          <Divider orientation="left">
            <Space>
              <WarningOutlined style={{ color: '#fa8c16' }} />
              Active alerts
            </Space>
          </Divider>
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
        <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f', marginBottom: '24px' }}>
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
            <div>
              <Text strong>No active alerts</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '13px' }}>
                All operations are running normally.
              </Text>
            </div>
          </Space>
        </Card>
      )}

      {/* Quick actions */}
      <Link href="/coordinator/operators">
        <Button type="link" icon={<ArrowRightOutlined />} style={{ paddingLeft: 0 }}>
          Go to operator management
        </Button>
      </Link>
    </div>
  )
}
