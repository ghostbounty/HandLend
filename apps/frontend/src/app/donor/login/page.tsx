'use client'

import { useState } from 'react'
import {
  Card, Tabs, Form, Input, Button, Typography, Space, Alert, Divider,
} from 'antd'
import {
  UserOutlined, LockOutlined, MailOutlined, HeartOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { createStyles } from 'antd-style'
import { useAuth } from '@/lib/authContext'

const { Title, Text, Paragraph } = Typography

const useStyles = createStyles(({ css }) => ({
  wrapper: css({
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  }),
  card: css({
    width: '100%',
    maxWidth: 440,
    background: 'rgba(15,23,42,0.7) !important',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1) !important',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    borderRadius: '16px !important',
  }),
  logo: css({
    textAlign: 'center',
    marginBottom: 8,
  }),
  submitBtn: css({
    height: 44,
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
  }),
  footer: css({
    textAlign: 'center',
    marginTop: 16,
  }),
}))

export default function DonorLoginPage() {
  const { styles } = useStyles()
  const router = useRouter()
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: { email: string; password: string }) => {
    setError(null)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const result = login(values.email, values.password)
    setLoading(false)
    if (result.ok) {
      router.push('/donor/disasters')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleRegister = async (values: {
    name: string
    email: string
    password: string
  }) => {
    setError(null)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const result = register(values.name, values.email, values.password, 'donor')
    setLoading(false)
    if (result.ok) {
      router.push('/donor/disasters')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className={styles.wrapper} data-testid="donor-login-page">
      <Card className={styles.card} bordered={false}>
        {/* Logo / header */}
        <div className={styles.logo}>
          <Space direction="vertical" size={4}>
            <HeartOutlined style={{ fontSize: 40, color: '#2dd4bf' }} />
            <Title level={3} style={{ margin: 0, color: '#f1f5f9' }}>
              Donor Access
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Log in or create an account to fund campaigns
            </Text>
          </Space>
        </div>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
            data-testid="auth-error"
          />
        )}

        <Tabs
          activeKey={activeTab}
          onChange={(key) => { setActiveTab(key); setError(null) }}
          centered
          data-testid="auth-tabs"
          items={[
            {
              key: 'login',
              label: 'Log In',
              children: (
                <Form
                  layout="vertical"
                  onFinish={handleLogin}
                  autoComplete="off"
                  data-testid="login-form"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Enter a valid email' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Email"
                      size="large"
                      data-testid="login-email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                      size="large"
                      data-testid="login-password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      className={styles.submitBtn}
                      data-testid="login-submit"
                    >
                      Log In
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'register',
              label: 'Register',
              children: (
                <Form
                  layout="vertical"
                  onFinish={handleRegister}
                  autoComplete="off"
                  data-testid="register-form"
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Full name"
                      size="large"
                      data-testid="register-name"
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Enter a valid email' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Email"
                      size="large"
                      data-testid="register-email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please enter a password' },
                      { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                      size="large"
                      data-testid="register-password"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('Passwords do not match'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Confirm password"
                      size="large"
                      data-testid="register-confirm"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      className={styles.submitBtn}
                      data-testid="register-submit"
                    >
                      Create Account
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />

        <div className={styles.footer}>
          <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
            Demo: elena@donor.com / donor2026
          </Paragraph>
        </div>
      </Card>
    </div>
  )
}
