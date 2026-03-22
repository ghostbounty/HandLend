'use client'

import { useState } from 'react'
import {
  Form, Input, Button, Typography, Steps, Alert, Divider, Tag,
} from 'antd'
import {
  BankOutlined, FileTextOutlined, CheckCircleOutlined,
  SafetyCertificateOutlined, RocketOutlined, TeamOutlined,
  GlobalOutlined, PhoneOutlined, ArrowRightOutlined, ArrowLeftOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { createStyles } from 'antd-style'
import { useAuth } from '@/lib/authContext'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '32px 24px',
    maxWidth: 680,
    margin: '0 auto',
  }),
  card: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '32px',
    marginBottom: 24,
  }),
  stepIcon: css({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'rgba(45,212,191,0.12)',
    border: '1px solid rgba(45,212,191,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    color: '#2dd4bf',
    marginBottom: 16,
  }),
  submitBtn: css({
    height: 48,
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 15,
  }),
  successCard: css({
    background: 'rgba(45,212,191,0.06)',
    border: '1px solid rgba(45,212,191,0.25)',
    borderRadius: 20,
    padding: '48px 32px',
    textAlign: 'center',
  }),
}))

const STEPS = [
  { title: 'Organization', icon: <BankOutlined /> },
  { title: 'Details', icon: <FileTextOutlined /> },
  { title: 'Certify', icon: <SafetyCertificateOutlined /> },
]

export default function CoordinatorApplyPage() {
  const { styles } = useStyles()
  const router = useRouter()
  const { user, isAuthenticated, becomeCoordinator } = useAuth()
  const [step, setStep] = useState(0)
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [certified, setCertified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStep0 = (values: Record<string, string>) => {
    setFormData(prev => ({ ...prev, ...values }))
    setStep(1)
  }

  const handleStep1 = (values: Record<string, string>) => {
    setFormData(prev => ({ ...prev, ...values }))
    setStep(2)
  }

  const handleCertify = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setLoading(true)
    setError(null)
    // Simulate on-chain DAO registration delay
    await new Promise(r => setTimeout(r, 2200))
    const result = becomeCoordinator(
      formData.organization,
      formData.description ?? '',
    )
    setLoading(false)
    if (result.ok) {
      setCertified(true)
    } else {
      setError(result.error ?? 'Certification failed')
    }
  }

  if (certified) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#2dd4bf', marginBottom: 16 }} />
          <Title level={3} style={{ color: '#2dd4bf', margin: '0 0 8px' }}>
            Account Certified!
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 15, marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>{formData.organization}</strong> has been registered as a certified coordinator entity on the HandLend protocol.
          </Paragraph>
          <Tag style={{
            background: 'rgba(45,212,191,0.12)',
            border: '1px solid rgba(45,212,191,0.3)',
            color: '#2dd4bf',
            borderRadius: 20,
            fontWeight: 700,
            padding: '4px 14px',
            fontSize: 13,
            marginBottom: 28,
          }}>
            <SafetyCertificateOutlined style={{ marginRight: 6 }} />
            DAO Certified Coordinator
          </Tag>
          <br />
          <Button
            type="primary"
            size="large"
            icon={<TeamOutlined />}
            style={{ borderRadius: 12, background: '#2dd4bf', borderColor: '#2dd4bf', color: '#0f172a', fontWeight: 700 }}
            onClick={() => router.push('/coordinator/dashboard')}
          >
            Go to Coordinator Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ color: '#f1f5f9', margin: '0 0 4px' }}>
          <RocketOutlined style={{ color: '#2dd4bf', marginRight: 10 }} />
          Become a Coordinator
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Register your organization and get certified on the HandLend humanitarian protocol DAO.
        </Text>
      </div>

      <Steps
        current={step}
        items={STEPS.map(s => ({ title: s.title, icon: s.icon }))}
        style={{ marginBottom: 32 }}
        size="small"
      />

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 20, borderRadius: 12 }}
        />
      )}

      {/* Step 0 — Organization info */}
      {step === 0 && (
        <div className={styles.card}>
          <div className={styles.stepIcon}><BankOutlined /></div>
          <Title level={4} style={{ color: '#fff', margin: '0 0 4px' }}>Organization Information</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 13 }}>
            Tell us about the humanitarian organization you represent.
          </Text>
          <Form form={form} layout="vertical" onFinish={handleStep0} autoComplete="off">
            <Form.Item
              name="organization"
              label={<Text style={{ color: 'rgba(255,255,255,0.7)' }}>Organization name</Text>}
              rules={[{ required: true, message: 'Organization name is required' }]}
            >
              <Input
                prefix={<BankOutlined />}
                placeholder="e.g. LogiHumanitas SpA"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="registrationNumber"
              label={<Text style={{ color: 'rgba(255,255,255,0.7)' }}>Registration / Tax ID</Text>}
              rules={[{ required: true, message: 'Registration number is required' }]}
            >
              <Input
                prefix={<FileTextOutlined />}
                placeholder="e.g. 76.123.456-7"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="country"
              label={<Text style={{ color: 'rgba(255,255,255,0.7)' }}>Country of operation</Text>}
              rules={[{ required: true, message: 'Country is required' }]}
            >
              <Input
                prefix={<GlobalOutlined />}
                placeholder="e.g. Chile"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                icon={<ArrowRightOutlined />}
                className={styles.submitBtn}
                style={{ background: '#2dd4bf', borderColor: '#2dd4bf', color: '#0f172a' }}
              >
                Next: Operations Details
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      {/* Step 1 — Details */}
      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.stepIcon}><FileTextOutlined /></div>
          <Title level={4} style={{ color: '#fff', margin: '0 0 4px' }}>Operations & Mission</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 13 }}>
            Describe your organization's humanitarian mission and operational capacity.
          </Text>
          <Form form={form} layout="vertical" onFinish={handleStep1} autoComplete="off">
            <Form.Item
              name="description"
              label={<Text style={{ color: 'rgba(255,255,255,0.7)' }}>Mission description</Text>}
              rules={[{ required: true, message: 'Please describe your mission' }]}
            >
              <TextArea
                placeholder="Describe the humanitarian mission, areas of operation, and types of aid distributed..."
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
            <Form.Item
              name="contactName"
              label={<Text style={{ color: 'rgba(255,255,255,0.7)' }}>Primary contact name</Text>}
              rules={[{ required: true, message: 'Contact name is required' }]}
            >
              <Input prefix={<TeamOutlined />} placeholder="Full name" size="large" />
            </Form.Item>
            <Form.Item
              name="contactPhone"
              label={<Text style={{ color: 'rgba(255,255,255,0.7)' }}>Contact phone</Text>}
              rules={[{ required: true, message: 'Phone number is required' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="+56 9 1234 5678" size="large" />
            </Form.Item>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                block
                size="large"
                icon={<ArrowLeftOutlined />}
                style={{ borderRadius: 12, background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
                onClick={() => setStep(0)}
              >
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                icon={<ArrowRightOutlined />}
                className={styles.submitBtn}
                style={{ background: '#2dd4bf', borderColor: '#2dd4bf', color: '#0f172a' }}
              >
                Next: Certify
              </Button>
            </div>
          </Form>
        </div>
      )}

      {/* Step 2 — Certify */}
      {step === 2 && (
        <div className={styles.card}>
          <div className={styles.stepIcon}><SafetyCertificateOutlined /></div>
          <Title level={4} style={{ color: '#fff', margin: '0 0 4px' }}>Certify on HandLend DAO</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 13 }}>
            Review your information and submit for on-chain DAO certification. This will mark your account as a verified coordinator.
          </Text>

          {/* Summary */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
            {[
              ['Organization', formData.organization],
              ['Registration ID', formData.registrationNumber],
              ['Country', formData.country],
              ['Contact', formData.contactName],
              ['Phone', formData.contactPhone],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{label}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>{value}</Text>
              </div>
            ))}
          </div>

          {!isAuthenticated && (
            <Alert
              type="warning"
              message="You must be logged in to certify your account."
              showIcon
              style={{ marginBottom: 16, borderRadius: 12 }}
              action={
                <Button size="small" onClick={() => router.push('/login')}>Log In</Button>
              }
            />
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              block
              size="large"
              icon={<ArrowLeftOutlined />}
              style={{ borderRadius: 12, background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="primary"
              block
              size="large"
              icon={<SafetyCertificateOutlined />}
              loading={loading}
              className={styles.submitBtn}
              style={{ background: '#2dd4bf', borderColor: '#2dd4bf', color: '#0f172a' }}
              onClick={handleCertify}
              disabled={!isAuthenticated}
              data-testid="btn-certify"
            >
              {loading ? 'Submitting to DAO...' : 'Certify Account'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
