'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Tag, Button, Spin, Typography, Row, Col, Space, Breadcrumb, Badge } from 'antd'
import {
  EnvironmentOutlined, ThunderboltOutlined, ArrowRightOutlined, ReloadOutlined, HomeOutlined,
} from '@ant-design/icons'
import { getDisasters } from '@/lib/api'

const { Title, Text, Paragraph } = Typography

function getSeverityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'red'
    case 'high': return 'orange'
    case 'medium': return 'gold'
    case 'low': return 'green'
    default: return 'default'
  }
}

function getSeverityLabel(severity: string) {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'Critical'
    case 'high': return 'High'
    case 'medium': return 'Medium'
    case 'low': return 'Low'
    default: return severity
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active': return <Badge status="error" text="Active" />
    case 'ongoing': return <Badge status="processing" text="Ongoing" />
    case 'resolved': return <Badge status="success" text="Resolved" />
    default: return <Badge status="default" text={status} />
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Disaster = any

export default function DisastersPage() {
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
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          { title: <><HomeOutlined /> HandLend</> },
          { title: 'Select disaster' },
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Active Disasters</Title>
          <Text type="secondary">Select an emergency to explore available logistics companies</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => load(true)} loading={refreshing}>
          Refresh
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {disasters.map((disaster: Disaster) => (
          <Col key={disaster.id} xs={24} md={12} xl={8}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Button
                  key="select"
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  onClick={() => handleSelect(disaster)}
                  style={{ margin: '0 12px' }}
                  block
                >
                  Select
                </Button>
              ]}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Title level={4} style={{ margin: 0, flex: 1, paddingRight: '8px' }}>
                    {disaster.name}
                  </Title>
                  {getStatusBadge(disaster.status)}
                </div>

                <Space wrap>
                  <Tag color="blue" icon={<EnvironmentOutlined />}>
                    {disaster.country}
                  </Tag>
                  <Tag color="purple" icon={<ThunderboltOutlined />}>
                    {disaster.event_type}
                  </Tag>
                  <Tag color={getSeverityColor(disaster.severity)}>
                    Urgency: {getSeverityLabel(disaster.severity)}
                  </Tag>
                </Space>

                <Paragraph
                  ellipsis={{ rows: 3 }}
                  style={{ color: '#595959', margin: 0, fontSize: '14px' }}
                >
                  {disaster.description}
                </Paragraph>

                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Registered: {new Date(disaster.created_at).toLocaleDateString('en-US')}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
