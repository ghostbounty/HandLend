'use client'

import { useEffect, useState } from 'react'
import {
  Card, Form, Input, Select, Button, Table, Tag, Space,
  Typography, Divider, Spin, message, Modal
} from 'antd'
import {
  SaveOutlined, SendOutlined, EyeOutlined,
} from '@ant-design/icons'
import { getCoordinatorPlans, postCoordinatorPlan } from '@/lib/api'
import { DISASTERS } from '@/lib/mockData'

const { Title, Text } = Typography
const { TextArea } = Input

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Plan = any

function getStatusTag(status: string) {
  switch (status) {
    case 'published': return <Tag color="success">Published</Tag>
    case 'draft': return <Tag color="default">Draft</Tag>
    case 'active': return <Tag color="processing">Active</Tag>
    default: return <Tag>{status}</Tag>
  }
}

export default function PlanningPage() {
  const [form] = Form.useForm()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [viewPlan, setViewPlan] = useState<Plan | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getCoordinatorPlans()
      setPlans(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(isDraft: boolean) {
    try {
      const values = await form.validateFields(['disaster_id', 'cargo_capacity', 'estimated_time', 'coverage', 'infrastructure', 'last_mile_strategy', 'human_resources'])
      setSubmitting(true)
      const plan = await postCoordinatorPlan({
        ...values,
        status: isDraft ? 'draft' : 'published',
      })
      setPlans(prev => [plan, ...prev])
      form.resetFields()
      message.success(isDraft ? 'Draft saved successfully' : 'Plan published successfully')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error('Error saving the plan')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      title: 'Disaster',
      dataIndex: 'disaster_id',
      key: 'disaster_id',
      render: (id: number) => {
        const d = DISASTERS.find(x => x.id === id)
        return d ? <Tag color="red">{d.name}</Tag> : `#${id}`
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Cargo capacity',
      dataIndex: 'cargo_capacity',
      key: 'cargo_capacity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Plan) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => setViewPlan(record)}>
          View details
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading plans..." />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <Title level={2}>Operational plan</Title>

      {/* Existing plans table */}
      <Card title={`Existing plans (${plans.length})`} style={{ marginBottom: '24px' }}>
        <Table
          dataSource={plans}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 600 }}
          locale={{ emptyText: 'No plans registered yet' }}
        />
      </Card>

      <Divider>New Plan</Divider>

      {/* New plan form */}
      <Card title="Create new operational plan" style={{ marginBottom: '24px' }}>
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="disaster_id"
              label="Associated disaster"
              rules={[{ required: true, message: 'Select a disaster' }]}
              style={{ gridColumn: '1 / -1' }}
            >
              <Select size="large" placeholder="Select the disaster">
                {DISASTERS.map(d => (
                  <Select.Option key={d.id} value={d.id}>
                    {d.name} — {d.country}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="cargo_capacity"
              label="Cargo capacity"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input size="large" placeholder="E.g.: 5 tons/day" />
            </Form.Item>

            <Form.Item
              name="estimated_time"
              label="Estimated time"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input size="large" placeholder="E.g.: 72h for first delivery" />
            </Form.Item>

            <Form.Item
              name="coverage"
              label="Coverage"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input size="large" placeholder="E.g.: Greater Valparaíso" />
            </Form.Item>

            <Form.Item
              name="infrastructure"
              label="Available infrastructure"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input size="large" placeholder="E.g.: 3 warehouses + 15 vehicles" />
            </Form.Item>

            <Form.Item
              name="risks"
              label="Identified risks"
              style={{ gridColumn: '1 / -1' }}
            >
              <TextArea rows={2} placeholder="Describe the operational risks" />
            </Form.Item>

            <Form.Item
              name="last_mile_strategy"
              label="Last-mile strategy"
              rules={[{ required: true, message: 'Required' }]}
              style={{ gridColumn: '1 / -1' }}
            >
              <TextArea rows={2} placeholder="How supplies will be delivered to the affected population" />
            </Form.Item>

            <Form.Item
              name="human_resources"
              label="Human resources"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input size="large" placeholder="E.g.: 40 volunteers + 8 drivers" />
            </Form.Item>

            <Form.Item name="needs" label="Needs and requirements">
              <Input size="large" placeholder="Additional resources you need" />
            </Form.Item>
          </div>

          <Space>
            <Button
              icon={<SaveOutlined />}
              onClick={() => handleSubmit(true)}
              loading={submitting}
            >
              Save draft
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleSubmit(false)}
              loading={submitting}
            >
              Publish plan
            </Button>
          </Space>
        </Form>
      </Card>

      {/* Detail modal */}
      <Modal
        title={`Plan operacional #${viewPlan?.id}`}
        open={!!viewPlan}
        onCancel={() => setViewPlan(null)}
        footer={<Button onClick={() => setViewPlan(null)}>Close</Button>}
        width={700}
      >
        {viewPlan && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div><Text type="secondary">Status:</Text> {getStatusTag(viewPlan.status)}</div>
            <div><Text type="secondary">Cargo capacity:</Text> <Text strong>{viewPlan.cargo_capacity}</Text></div>
            <div><Text type="secondary">Estimated time:</Text> <Text strong>{viewPlan.estimated_time}</Text></div>
            <div><Text type="secondary">Coverage:</Text> <Text strong>{viewPlan.coverage}</Text></div>
            <div><Text type="secondary">Infrastructure:</Text> <Text>{viewPlan.infrastructure}</Text></div>
            <div><Text type="secondary">Risks:</Text> <Text>{viewPlan.risks}</Text></div>
            <div><Text type="secondary">Last mile:</Text> <Text>{viewPlan.last_mile_strategy}</Text></div>
            <div><Text type="secondary">Human resources:</Text> <Text strong>{viewPlan.human_resources}</Text></div>
            <div><Text type="secondary">Needs:</Text> <Text>{viewPlan.needs}</Text></div>
          </Space>
        )}
      </Modal>
    </div>
  )
}
