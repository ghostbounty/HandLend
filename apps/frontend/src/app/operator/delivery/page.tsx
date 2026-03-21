'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card, Form, Input, Select, Button, Table, Tag, Space,
  Typography, Divider, message
} from 'antd'
import {
  QrcodeOutlined, SyncOutlined, SaveOutlined,
  EnvironmentOutlined, ClockCircleOutlined, CheckCircleOutlined,
  WarningOutlined, LoadingOutlined,
} from '@ant-design/icons'
import { syncDeliveries } from '@/lib/api'
import type { DeliveryQueueItem } from '@/lib/mockData'

const { Title, Text } = Typography

const STORAGE_KEY = 'handlend_queue'

const OPERATOR_OPTIONS = [
  { value: 'Carlos Mendez', label: 'Carlos Mendez' },
  { value: 'Ana Torres', label: 'Ana Torres' },
]

function getSyncTag(status: string) {
  switch (status) {
    case 'pending': return <Tag icon={<ClockCircleOutlined />} color="warning">Pending</Tag>
    case 'sending': return <Tag icon={<LoadingOutlined />} color="processing">Sending...</Tag>
    case 'synced': return <Tag icon={<CheckCircleOutlined />} color="success">Synced</Tag>
    case 'error': return <Tag icon={<WarningOutlined />} color="error">Error</Tag>
    default: return <Tag>{status}</Tag>
  }
}

export default function DeliveryPage() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [queue, setQueue] = useState<DeliveryQueueItem[]>([])
  const [syncing, setSyncing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setQueue(JSON.parse(stored)) } catch {}
    }
    form.setFieldsValue({ operator_name: 'Carlos Mendez', gps_status: 'GPS captured: -33.047, -71.607' })
  }, [form])

  function saveQueue(newQueue: DeliveryQueueItem[]) {
    setQueue(newQueue)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newQueue))
  }

  function handleSimulateQR() {
    const rand = Math.floor(Math.random() * 9000) + 1000
    form.setFieldValue('qr_result', `QR-2026-03-21-${rand}`)
    message.success('QR simulated successfully')
  }

  async function handleSave() {
    try {
      const values = await form.validateFields(['operator_name', 'lot_id', 'qr_result'])
      setSaving(true)
      const item: DeliveryQueueItem = {
        client_event_id: crypto.randomUUID(),
        operator_name: values.operator_name,
        lot_id: values.lot_id,
        qr_result: values.qr_result,
        gps_status: 'GPS captured: -33.047, -71.607',
        note: values.note || '',
        timestamp: new Date().toISOString(),
        sync_status: 'pending',
      }
      const newQueue = [item, ...queue]
      saveQueue(newQueue)
      form.resetFields(['lot_id', 'qr_result', 'note'])
      form.setFieldsValue({ operator_name: values.operator_name, gps_status: 'GPS captured: -33.047, -71.607' })
      message.success('Delivery saved to queue')
    } catch {
      // validation error — antd handles display
    } finally {
      setSaving(false)
    }
  }

  async function handleSync() {
    const pending = queue.filter(e => e.sync_status === 'pending')
    if (pending.length === 0) {
      message.info('No pending deliveries to sync')
      return
    }

    setSyncing(true)
    const sending = queue.map(e =>
      e.sync_status === 'pending' ? { ...e, sync_status: 'sending' as const } : e
    )
    saveQueue(sending)

    await new Promise(r => setTimeout(r, 2000))

    await syncDeliveries(pending)

    const synced = sending.map(e =>
      e.sync_status === 'sending' ? { ...e, sync_status: 'synced' as const } : e
    )
    saveQueue(synced)
    setSyncing(false)
    message.success(`${pending.length} delivery(s) synced`)
  }

  const pendingCount = queue.filter(e => e.sync_status === 'pending').length

  const columns = [
    {
      title: 'Lot',
      dataIndex: 'lot_id',
      key: 'lot_id',
      render: (v: string) => <Text code>{v}</Text>,
    },
    {
      title: 'Operator',
      dataIndex: 'operator_name',
      key: 'operator_name',
    },
    {
      title: 'QR',
      dataIndex: 'qr_result',
      key: 'qr_result',
      ellipsis: true,
      render: (v: string) => <Text code style={{ fontSize: '12px' }}>{v}</Text>,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (v: string) => {
        try {
          const d = new Date(v)
          return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
        } catch { return v }
      },
    },
    {
      title: 'Status',
      dataIndex: 'sync_status',
      key: 'sync_status',
      render: getSyncTag,
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: DeliveryQueueItem) => (
        <Button
          size="small"
          onClick={() => router.push('/operator/settlement/1')}
        >
          View status
        </Button>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={2} style={{ margin: 0 }}>Delivery register</Title>
        <Button
          type={pendingCount > 0 ? 'primary' : 'default'}
          icon={<SyncOutlined spin={syncing} />}
          onClick={handleSync}
          loading={syncing}
        >
          {pendingCount > 0 ? `Sync pending (${pendingCount})` : 'Sync'}
        </Button>
      </div>

      <Card title="New delivery" style={{ marginBottom: '24px' }}>
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="operator_name"
              label="Operator"
              rules={[{ required: true, message: 'Select an operator' }]}
            >
              <Select size="large" options={OPERATOR_OPTIONS} />
            </Form.Item>

            <Form.Item
              name="lot_id"
              label="Lot ID"
              rules={[{ required: true, message: 'Enter the lot ID' }]}
            >
              <Input size="large" placeholder="LOT-001" />
            </Form.Item>

            <Form.Item
              name="qr_result"
              label="QR result"
              rules={[{ required: true, message: 'Enter or simulate the QR' }]}
              style={{ gridColumn: '1 / -1' }}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input size="large" placeholder="Scan or simulate the QR code" />
                <Button size="large" icon={<QrcodeOutlined />} onClick={handleSimulateQR}>
                  Simulate QR scan
                </Button>
              </Space.Compact>
            </Form.Item>

            <Form.Item name="gps_status" label="GPS status">
              <Input
                size="large"
                readOnly
                prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                style={{ background: '#f6ffed' }}
              />
            </Form.Item>

            <Form.Item name="note" label="Note (optional)">
              <Input.TextArea rows={2} placeholder="Observations about the delivery..." />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
            >
              Save delivery
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider>Delivery queue ({queue.length})</Divider>

      {queue.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '32px', color: '#8c8c8c' }}>
            <ClockCircleOutlined style={{ fontSize: '36px', marginBottom: '12px' }} />
            <div>No deliveries recorded yet</div>
          </div>
        </Card>
      ) : (
        <Table
          dataSource={queue}
          columns={columns}
          rowKey="client_event_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 700 }}
          size="middle"
        />
      )}
    </div>
  )
}
