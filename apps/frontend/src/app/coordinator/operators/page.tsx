'use client'

import { useEffect, useState } from 'react'
import {
  Card, Table, Tag, Button, Modal, Form, Input,
  Typography, Space, Spin, Badge, message
} from 'antd'
import {
  PlusOutlined, UserAddOutlined, CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { getCoordinatorOperators, postCoordinatorOperator, putCoordinatorOperator } from '@/lib/api'

const { Title } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Operator = any

function getStatusTag(status: string) {
  switch (status) {
    case 'active': return <Tag color="success" icon={<CheckCircleOutlined />}>Active</Tag>
    case 'inactive': return <Tag color="error" icon={<StopOutlined />}>Inactive</Tag>
    default: return <Tag>{status}</Tag>
  }
}

export default function OperatorsPage() {
  const [form] = Form.useForm()
  const [operators, setOperators] = useState<Operator[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getCoordinatorOperators()
      setOperators(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCreate() {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      const op = await postCoordinatorOperator(values)
      setOperators(prev => [...prev, op])
      setModalOpen(false)
      form.resetFields()
      message.success('Operator added successfully')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error('Error adding the operator')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(operator: Operator) {
    const newStatus = operator.status === 'active' ? 'inactive' : 'active'
    setTogglingId(operator.id)
    // Optimistic update
    setOperators(prev => prev.map(o => o.id === operator.id ? { ...o, status: newStatus } : o))
    await putCoordinatorOperator(operator.id, { status: newStatus })
    setTogglingId(null)
    message.success(`Operator ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  }

  const activeCount = operators.filter(o => o.status === 'active').length

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Operator) => (
        <Button
          size="small"
          danger={record.status === 'active'}
          type={record.status !== 'active' ? 'primary' : 'default'}
          icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
          loading={togglingId === record.id}
          onClick={() => handleToggle(record)}
        >
          {record.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading operators..." />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Operator management</Title>
          <Space style={{ marginTop: '8px' }}>
            <Badge color="green" text={`${activeCount} active`} />
            <Badge color="red" text={`${operators.length - activeCount} inactive`} />
          </Space>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          New operator
        </Button>
      </div>

      <Card>
        <Table
          dataSource={operators}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'No operators registered. Create the first one.' }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <UserAddOutlined />
            New operator
          </Space>
        }
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={handleCreate}
        okText="Add"
        cancelText="Cancel"
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item
            name="name"
            label="Full name"
            rules={[{ required: true, message: 'Enter the operator name' }]}
          >
            <Input size="large" placeholder="E.g.: María González" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Enter the email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input size="large" placeholder="operator@company.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
