'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  Card, Typography, Tag, Progress, Button, Spin,
  Descriptions, Space, Divider, Row, Col, Statistic
} from 'antd'
import { RobotOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { getCompany } from '@/lib/api'

const { Title, Text, Paragraph } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Company = any

export default function CompanyProfilePage() {
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

  function handleContinue() {
    if (!company) return
    localStorage.setItem('selectedCompany', JSON.stringify(company))
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

  const trustColor = company.trust_score >= 85 ? '#3f8600' : company.trust_score >= 70 ? '#1890ff' : '#d46b08'
  const trustStroke = company.trust_score >= 85 ? '#52c41a' : company.trust_score >= 70 ? '#1890ff' : '#fa8c16'

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.back()}
        style={{ marginBottom: '16px' }}
      >
        Back
      </Button>

      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>{company.name}</Title>
              {company.verification_status === 'active' && (
                <Tag
                  color="success"
                  icon={<CheckCircleOutlined />}
                  style={{ marginTop: '8px', fontSize: '14px', padding: '4px 12px' }}
                >
                  Verified
                </Tag>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Statistic
                title="Trust Score"
                value={company.trust_score}
                suffix="/ 100"
                valueStyle={{ color: trustColor, fontSize: '36px' }}
              />
              <Progress
                percent={company.trust_score}
                showInfo={false}
                strokeColor={trustStroke}
                style={{ width: '200px' }}
              />
            </div>
          </div>

          <Descriptions bordered column={2}>
            <Descriptions.Item label="Capacity">{company.capacity}</Descriptions.Item>
            <Descriptions.Item label="Coverage">{company.coverage}</Descriptions.Item>
            <Descriptions.Item label="Response time">{company.response_time}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color="success">Active</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>

      {/* GenLayer Analysis */}
      <Card
        style={{ marginBottom: '24px', background: '#e6f7ff', border: '1px solid #91caff' }}
        title={
          <Space>
            <RobotOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
            <span style={{ color: '#1890ff', fontWeight: 600 }}>GenLayer Analysis (Verification AI)</span>
          </Space>
        }
      >
        <Paragraph style={{ fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
          {company.genlayer_summary}
        </Paragraph>
      </Card>

      {/* Plan Operativo */}
      {company.operational_plan && (
        <Card title="Operational Plan" style={{ marginBottom: '24px' }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Cargo capacity">{company.operational_plan.cargo_capacity}</Descriptions.Item>
            <Descriptions.Item label="Estimated time">{company.operational_plan.estimated_time}</Descriptions.Item>
            <Descriptions.Item label="Coverage">{company.operational_plan.coverage}</Descriptions.Item>
            <Descriptions.Item label="Infrastructure">{company.operational_plan.infrastructure}</Descriptions.Item>
            <Descriptions.Item label="Last-mile strategy">{company.operational_plan.last_mile_strategy}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Capacity Assessment */}
      {company.assessment && (
        <Card title="Capacity Assessment" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card size="small" title="Can execute" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <Text>{company.assessment.can_execute}</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title="Available resources" style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
                <Text>{company.assessment.resources}</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title="Identified risks" style={{ background: '#fff2f0', border: '1px solid #ffccc7' }}>
                <Text>{company.assessment.risks}</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title="Limitations" style={{ background: '#f9f0ff', border: '1px solid #d3adf7' }}>
                <Text>{company.assessment.limitations}</Text>
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Button
          type="primary"
          size="large"
          onClick={handleContinue}
          style={{ padding: '0 48px', height: '52px', fontSize: '16px' }}
        >
          Continue with this company
        </Button>
      </div>
    </div>
  )
}
