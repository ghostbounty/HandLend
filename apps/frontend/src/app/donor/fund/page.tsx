'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card, Typography, InputNumber, Button, Alert, Space,
  Divider, Tag, Row, Col, Spin
} from 'antd'
import {
  WalletOutlined, CheckCircleOutlined, LoadingOutlined,
  ArrowLeftOutlined, DollarOutlined, SafetyOutlined
} from '@ant-design/icons'
import { postContributionIntent, postContributionConfirm } from '@/lib/api'

const { Title, Text } = Typography

type TxState = 'idle' | 'pending_signature' | 'sending' | 'confirmed'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Disaster = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Company = any

const WALLET_ADDRESS = '0xDemo1234...abcd5678'
const WALLET_BALANCE = 1250

function FundContent() {
  const router = useRouter()

  const [disaster, setDisaster] = useState<Disaster | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [amount, setAmount] = useState<number>(100)
  const [txState, setTxState] = useState<TxState>('idle')

  useEffect(() => {
    try {
      const d = localStorage.getItem('selectedDisaster')
      const c = localStorage.getItem('selectedCompany')
      if (d) setDisaster(JSON.parse(d))
      if (c) setCompany(JSON.parse(c))
    } catch {}
  }, [])

  const fee = +(amount * 0.005).toFixed(2)

  async function handleConfirm() {
    setTxState('pending_signature')

    await new Promise(r => setTimeout(r, 1500))
    setTxState('sending')

    const intent = await postContributionIntent({
      disaster_id: disaster?.id || 1,
      company_id: company?.id || 1,
      amount,
      wallet_address: WALLET_ADDRESS,
    })

    await new Promise(r => setTimeout(r, 2000))

    await postContributionConfirm({
      intent_id: (intent as { intent_id?: string }).intent_id || 'mock-intent-1',
      tx_hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    })

    setTxState('confirmed')
    setTimeout(() => {
      router.push('/donor/timeline/1')
    }, 1000)
  }

  const isProcessing = txState !== 'idle'

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.back()}
        style={{ marginBottom: '16px' }}
      >
        Back
      </Button>

      <Title level={2}>Confirm contribution</Title>

      {/* Context summary */}
      <Card style={{ marginBottom: '24px', background: '#e6f7ff', border: '1px solid #91caff' }}>
        <Row gutter={[16, 12]}>
          <Col xs={24} sm={12}>
            <Text type="secondary">Selected emergency</Text>
            <div>
              <Text strong style={{ fontSize: '16px' }}>
                {disaster?.name || 'Valparaiso Earthquake'}
              </Text>
              <Tag color="blue" style={{ marginLeft: '8px' }}>
                {disaster?.country || 'Chile'}
              </Tag>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <Text type="secondary">Logistics company</Text>
            <div>
              <Text strong style={{ fontSize: '16px' }}>
                {company?.name || 'LogiHumanitas'}
              </Text>
              <Tag color="success" style={{ marginLeft: '8px' }}>
                {company?.trust_score || 92}/100
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Wallet */}
      <Alert
        type="success"
        icon={<WalletOutlined />}
        message={
          <span>
            <strong>Wallet connected:</strong> {WALLET_ADDRESS} &nbsp;
            <Tag color="green">Balance: {WALLET_BALANCE.toLocaleString('en-US')} USDC</Tag>
          </span>
        }
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Amount + states */}
      <Card title="Amount to contribute" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
              Enter amount (min. 10 USDC — max. 1,000 USDC)
            </Text>
            <InputNumber
              size="large"
              min={10}
              max={1000}
              step={10}
              defaultValue={100}
              value={amount}
              onChange={(v) => setAmount(v || 10)}
              addonAfter="USDC"
              style={{ width: '100%', maxWidth: '300px' }}
              disabled={isProcessing}
            />
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <Row gutter={[16, 8]}>
            <Col span={12}><Text>Contribution</Text></Col>
            <Col span={12} style={{ textAlign: 'right' }}><Text strong>{amount} USDC</Text></Col>
            <Col span={12}><Text type="secondary">Estimated fee (0.5%)</Text></Col>
            <Col span={12} style={{ textAlign: 'right' }}><Text type="secondary">{fee} USDC</Text></Col>
            <Col span={24}><Divider style={{ margin: '4px 0' }} /></Col>
            <Col span={12}><Text strong>Total</Text></Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>{amount + fee} USDC</Text>
            </Col>
          </Row>

          {/* State alerts */}
          {txState === 'pending_signature' && (
            <Alert
              type="info"
              icon={<LoadingOutlined />}
              message="Waiting for wallet signature..."
              description="Please confirm the transaction in your wallet."
              showIcon
            />
          )}
          {txState === 'sending' && (
            <Alert
              type="info"
              icon={<LoadingOutlined />}
              message="Transaction sent. Confirming on Avalanche..."
              description="The transaction is being processed on the network."
              showIcon
            />
          )}
          {txState === 'confirmed' && (
            <Alert
              type="success"
              icon={<CheckCircleOutlined />}
              message="Contribution confirmed! Funds locked in escrow."
              description="Redirecting to mission tracking..."
              showIcon
            />
          )}

          <Button
            type="primary"
            size="large"
            icon={isProcessing ? <LoadingOutlined /> : <DollarOutlined />}
            onClick={handleConfirm}
            block
            loading={isProcessing && txState !== 'confirmed'}
            disabled={txState === 'confirmed'}
            style={{ height: '52px', fontSize: '16px' }}
          >
            {isProcessing ? 'Processing...' : 'Confirm contribution'}
          </Button>

          <Alert
            type="info"
            icon={<SafetyOutlined />}
            message="Your contribution is recorded transparently. You will be able to view the full mission tracking."
            showIcon
          />
        </Space>
      </Card>
    </div>
  )
}

export default function FundPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spin size="large" /></div>}>
      <FundContent />
    </Suspense>
  )
}
