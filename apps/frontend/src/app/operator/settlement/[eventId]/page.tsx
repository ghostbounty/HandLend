'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card, Typography, Tag, Steps, Spin, Space,
  Descriptions, Divider, Button
} from 'antd'
import {
  ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined,
  LoadingOutlined, TruckOutlined, FileSearchOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { getSettlementState } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Settlement = any

const SETTLEMENT_STEPS = [
  { key: 'delivery_recorded', title: 'Delivery recorded', icon: <TruckOutlined /> },
  { key: 'evidence_validated', title: 'Evidence validated', icon: <FileSearchOutlined /> },
  { key: 'settlement_processing', title: 'Settlement in progress', icon: <LoadingOutlined /> },
  { key: 'advance_deducted', title: 'Advance deducted', description: '-50 USDC', icon: <DollarOutlined /> },
  { key: 'margin_transferred', title: 'Margin transferred', description: '+450 USDC', icon: <CheckCircleOutlined /> },
]

export default function SettlementPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const [settlement, setSettlement] = useState<Settlement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getSettlementState(eventId)
      setSettlement(data)
      setLoading(false)
    }
    load()
  }, [eventId])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading settlement..." />
      </div>
    )
  }

  if (!settlement) return null

  const completed: string[] = settlement.steps_completed || []
  const currentStepIndex = SETTLEMENT_STEPS.findIndex(s => !completed.includes(s.key))
  const activeStep = currentStepIndex === -1 ? SETTLEMENT_STEPS.length : currentStepIndex

  const stepsItems = SETTLEMENT_STEPS.map((step, idx) => {
    const isCompleted = completed.includes(step.key)
    const isCurrent = idx === activeStep
    return {
      title: step.title,
      description: step.description,
      icon: isCompleted
        ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
        : isCurrent
          ? <LoadingOutlined style={{ color: '#1890ff' }} />
          : <ClockCircleOutlined style={{ color: '#d9d9d9' }} />,
      status: isCompleted ? 'finish' as const
        : isCurrent ? 'process' as const
          : 'wait' as const,
    }
  })

  const currency = settlement.currency || 'USDC'

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/operator/delivery')}
        style={{ marginBottom: '16px' }}
      >
        Back to deliveries
      </Button>

      <Title level={3}>Settlement Status</Title>

      {/* Summary card */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size={8}>
          <div>
            <Text type="secondary">Lot ID: </Text>
            <Text strong code>{settlement.lot_id}</Text>
          </div>
          <div>
            <Text type="secondary">Validation: </Text>
            {settlement.validation_status === 'accepted'
              ? <Tag color="success" icon={<CheckCircleOutlined />}>Accepted</Tag>
              : <Tag color="warning">{settlement.validation_status}</Tag>
            }
          </div>
          <div>
            <Text type="secondary">Settlement: </Text>
            {settlement.settlement_status === 'margin_transferred'
              ? <Tag color="success">Margin transferred</Tag>
              : <Tag color="processing">{settlement.settlement_status}</Tag>
            }
          </div>
        </Space>
      </Card>

      {/* Steps */}
      <Card title="Settlement progress" style={{ marginBottom: '24px' }}>
        <Steps
          current={activeStep}
          direction="vertical"
          items={stepsItems}
          style={{ padding: '16px 0' }}
        />
      </Card>

      {/* Financial summary */}
      <Card title="Financial summary" style={{ marginBottom: '24px' }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Operational advance">
            <Text style={{ color: '#cf1322' }}>-{settlement.operational_advance} {currency}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Margin transferred">
            <Text style={{ color: '#3f8600' }}>+{settlement.margin_transferred} {currency}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mission total">
            <Text strong>
              {(settlement.operational_advance || 0) + (settlement.margin_transferred || 0)} {currency}
            </Text>
          </Descriptions.Item>
        </Descriptions>
        {settlement.notes && (
          <>
            <Divider />
            <Text type="secondary">{settlement.notes}</Text>
          </>
        )}
      </Card>
    </div>
  )
}
