'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card, Typography, Timeline, Button, Spin, Tag, Space
} from 'antd'
import {
  ReloadOutlined, ArrowLeftOutlined, ClockCircleOutlined,
} from '@ant-design/icons'
import { getMissionTimeline } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TimelineEvent = any

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()
    const hours = d.getHours().toString().padStart(2, '0')
    const mins = d.getMinutes().toString().padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${mins}`
  } catch {
    return dateStr
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'green'
    case 'in_progress': return 'blue'
    default: return 'gray'
  }
}

const PENDING_EVENTS = [
  { id: 'p1', title: 'Advance deducted', description: 'The operational advance will be deducted from escrow.' },
  { id: 'p2', title: 'Margin transferred', description: 'The operational margin will be transferred to the coordinator.' },
  { id: 'p3', title: 'Operation closed', description: 'The mission will be marked as completed.' },
]

export default function TimelinePage() {
  const params = useParams()
  const router = useRouter()
  const missionId = Number(params.missionId)

  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    const data = await getMissionTimeline(missionId)
    setEvents(data)
    setLoading(false)
    setRefreshing(false)
  }, [missionId])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading history..." />
      </div>
    )
  }

  const completedItems = events.map((event: TimelineEvent) => ({
    color: getStatusColor(event.status),
    label: formatDate(event.happened_at),
    children: (
      <div>
        <Text strong style={{ fontSize: '15px', display: 'block' }}>{event.title}</Text>
        <Text type="secondary" style={{ fontSize: '13px' }}>{event.description}</Text>
        <div style={{ marginTop: 4 }}>
          {event.status === 'completed' && <Tag color="green">Completed</Tag>}
          {event.status === 'in_progress' && <Tag color="blue">In progress</Tag>}
        </div>
      </div>
    ),
  }))

  const pendingItems = PENDING_EVENTS.map(e => ({
    color: 'gray' as const,
    label: <Text type="secondary" style={{ fontSize: '12px' }}>Pending</Text>,
    dot: <ClockCircleOutlined style={{ color: '#d9d9d9' }} />,
    children: (
      <div style={{ opacity: 0.45 }}>
        <Text strong style={{ fontSize: '14px', display: 'block', color: '#8c8c8c' }}>{e.title}</Text>
        <Text style={{ fontSize: '13px', color: '#bfbfbf' }}>{e.description}</Text>
      </div>
    ),
  }))

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/donor/disasters')}
        style={{ marginBottom: '16px' }}
      >
        Back to disasters
      </Button>

      {/* Mission summary */}
      <Card style={{ marginBottom: '24px', background: '#f6ffed', border: '1px solid #b7eb8f' }}>
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontSize: '16px' }}>Active mission</Text>
          <Text type="secondary">LogiHumanitas / Valparaiso Earthquake</Text>
          <Tag color="green">In execution</Tag>
        </Space>
      </Card>

      <Card
        title="Event history"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => load(true)}
            loading={refreshing}
          >
            Refresh
          </Button>
        }
      >
        <Timeline
          mode="left"
          items={[...completedItems, ...pendingItems]}
        />
      </Card>
    </div>
  )
}
