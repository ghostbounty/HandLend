'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  List, Card, Tag, Button, Spin, Typography,
  Progress, Space, Breadcrumb,
} from 'antd'
import {
  CheckCircleOutlined, ArrowRightOutlined, HomeOutlined,
  ClockCircleOutlined, ArrowLeftOutlined,
} from '@ant-design/icons'
import { getCompaniesByDisaster } from '@/lib/api'

const { Title, Text, Paragraph } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Company = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Disaster = any

function getTrustColor(score: number) {
  if (score >= 85) return '#52c41a'
  if (score >= 70) return '#1890ff'
  return '#fa8c16'
}

function CompaniesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const disasterId = Number(searchParams.get('disaster_id'))

  const [companies, setCompanies] = useState<Company[]>([])
  const [disaster, setDisaster] = useState<Disaster | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('selectedDisaster')
    if (stored) {
      try { setDisaster(JSON.parse(stored)) } catch {}
    }
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getCompaniesByDisaster(disasterId || 1)
      setCompanies(data)
      setLoading(false)
    }
    load()
  }, [disasterId])

  function handleView(company: Company) {
    router.push(`/donor/company/${company.id}?disaster_id=${disasterId}`)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading companies..." />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          { title: <a href="/donor/disasters"><HomeOutlined /> Disasters</a> },
          { title: disaster?.name || `Disaster #${disasterId}` },
          { title: 'Logistics Companies' },
        ]}
      />

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/donor/disasters')}
        style={{ marginBottom: '16px' }}
      >
        Back to disasters
      </Button>

      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Available Logistics Companies</Title>
        {disaster && (
          <Space style={{ marginTop: '8px' }}>
            <Text type="secondary">For the emergency:</Text>
            <Tag color="red">{disaster.name}</Tag>
            <Tag color="blue">{disaster.country}</Tag>
          </Space>
        )}
      </div>

      <List
        dataSource={companies}
        rowKey="id"
        renderItem={(company: Company) => (
          <List.Item style={{ padding: '0 0 16px 0' }}>
            <Card style={{ width: '100%' }} hoverable>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <Space align="center" style={{ marginBottom: '8px' }}>
                    <Title level={4} style={{ margin: 0 }}>{company.name}</Title>
                    {company.verification_status === 'active' && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>Verified</Tag>
                    )}
                  </Space>

                  <Space wrap style={{ marginBottom: '12px' }}>
                    <Text type="secondary"><strong>Capacity:</strong> {company.capacity}</Text>
                    <Text type="secondary"><strong>Coverage:</strong> {company.coverage}</Text>
                    <Text type="secondary">
                      <ClockCircleOutlined /> {company.response_time}
                    </Text>
                  </Space>

                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ color: '#595959', margin: 0, fontSize: '13px', fontStyle: 'italic' }}
                  >
                    {company.genlayer_summary?.slice(0, 80)}{company.genlayer_summary?.length > 80 ? '...' : ''}
                  </Paragraph>
                </div>

                <div style={{ textAlign: 'center', minWidth: '140px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Trust Score
                  </Text>
                  <Text
                    strong
                    style={{
                      fontSize: '28px',
                      color: getTrustColor(company.trust_score),
                      display: 'block',
                    }}
                  >
                    {company.trust_score}
                  </Text>
                  <Progress
                    percent={company.trust_score}
                    showInfo={false}
                    strokeColor={getTrustColor(company.trust_score)}
                    style={{ marginBottom: '12px' }}
                  />
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    onClick={() => handleView(company)}
                    block
                  >
                    View details
                  </Button>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spin size="large" /></div>}>
      <CompaniesContent />
    </Suspense>
  )
}
