'use client'

import { useEffect, useState } from 'react'
import {
  Card, Form, Input, Button, Steps, Alert, Typography,
  Space, Descriptions, message, Spin
} from 'antd'
import {
  BankOutlined, UserOutlined, SafetyCertificateOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { getCoordinatorOrganization, postCoordinatorOrganization } from '@/lib/api'

const { Title, Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Organization = any

const REGISTRATION_STEPS = [
  { title: 'Company data', icon: <BankOutlined /> },
  { title: 'Legal representative', icon: <UserOutlined /> },
  { title: 'Verification', icon: <SafetyCertificateOutlined /> },
]

export default function CoordinatorCompanyPage() {
  const [form] = Form.useForm()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const org = await getCoordinatorOrganization()
      setOrganization(org)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      await new Promise(r => setTimeout(r, 1000))
      const updated = await postCoordinatorOrganization(values)
      setOrganization({ ...organization, ...updated, ...values })
      setEditing(false)
      message.success('Details updated successfully')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error('Error updating details')
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit() {
    if (organization) {
      form.setFieldsValue({
        name: organization.name,
        legal_rep_name: organization.legal_rep_name,
        legal_rep_email: organization.legal_rep_email,
        doc_number: organization.doc_number,
      })
    }
    setEditing(true)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    )
  }

  const stepIndex = organization?.status === 'verified' ? 2 : organization ? 1 : 0

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Company registration</Title>

      {/* Steps */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps
          current={stepIndex}
          items={REGISTRATION_STEPS}
          style={{ padding: '8px 0' }}
        />
      </Card>

      {/* Verification alert */}
      {organization?.status === 'verified' && (
        <Alert
          type="success"
          icon={<CheckCircleOutlined />}
          message="Company verified and active on the platform"
          description="Your company is enabled to operate on the HandLend platform."
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Organization data */}
      {organization && !editing && (
        <Card
          title={
            <Space>
              <BankOutlined />
              <span>Organization details</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
          extra={
            <Button onClick={handleEdit}>Update details</Button>
          }
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Company name">{organization.name}</Descriptions.Item>
            <Descriptions.Item label="Document number">{organization.doc_number}</Descriptions.Item>
            <Descriptions.Item label="Legal representative">{organization.legal_rep_name}</Descriptions.Item>
            <Descriptions.Item label="Representative email">{organization.legal_rep_email}</Descriptions.Item>
            <Descriptions.Item label="Status" span={2}>
              {organization.status === 'verified'
                ? <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> Verified</span>
                : organization.status
              }
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Edit / create form */}
      {(editing || !organization) && (
        <Card title={editing ? 'Update details' : 'Register company'} style={{ marginBottom: '24px' }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Company name"
              rules={[{ required: true, message: 'Enter the company name' }]}
            >
              <Input size="large" placeholder="E.g.: LogiHumanitas SpA" prefix={<BankOutlined />} />
            </Form.Item>

            <Form.Item
              name="doc_number"
              label="Document number (RUT / RUC / Tax ID)"
              rules={[{ required: true, message: 'Enter the document number' }]}
            >
              <Input size="large" placeholder="E.g.: 76.543.210-K" />
            </Form.Item>

            <Form.Item
              name="legal_rep_name"
              label="Representative full name"
              rules={[{ required: true, message: 'Enter the representative name' }]}
            >
              <Input size="large" placeholder="E.g.: Roberto Fernández" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="legal_rep_email"
              label="Representative email"
              rules={[
                { required: true, message: 'Enter the email' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input size="large" placeholder="representative@company.com" />
            </Form.Item>

            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                icon={<SafetyCertificateOutlined />}
              >
                {editing ? 'Update details' : 'Register company'}
              </Button>
              {editing && (
                <Button onClick={() => setEditing(false)}>Cancel</Button>
              )}
            </Space>
          </Form>
        </Card>
      )}
    </div>
  )
}
