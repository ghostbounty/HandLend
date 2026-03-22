'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
  Typography, InputNumber, Button, Alert, Tag, Spin,
} from 'antd'
import {
  WalletOutlined, CheckCircleOutlined, LoadingOutlined,
  ArrowLeftOutlined, DollarOutlined, SafetyOutlined, HomeOutlined,
} from '@ant-design/icons'
import { createStyles } from 'antd-style'
import { postContributionIntent, postContributionConfirm } from '@/lib/api'

const { Title, Text } = Typography

type TxState = 'idle' | 'pending_signature' | 'sending' | 'confirmed'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Disaster = any

const WALLET_ADDRESS = '0xDemo1234...abcd5678'
const WALLET_BALANCE = 1250

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px',
    maxWidth: 700,
    margin: '0 auto',
    '@media (min-width: 768px)': { padding: '32px 40px' },
  }),
  breadcrumb: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: 600,
    '& a': { color: 'rgba(255,255,255,0.55)', textDecoration: 'none' },
    '& a:hover': { color: '#2dd4bf' },
  }),
  backBtn: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    marginBottom: 20,
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  }),
  card: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px 28px',
    marginBottom: 24,
  }),
  walletBar: css({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    background: 'rgba(74,222,128,0.08)',
    border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: 14,
    marginBottom: 24,
  }),
  feeRow: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  }),
  divider: css({
    height: 1,
    background: 'rgba(255,255,255,0.08)',
    margin: '4px 0',
  }),
  stateAlert: css({
    padding: '16px 20px',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  }),
  confirmBtn: css({
    width: '100%',
    height: 52,
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 16,
    background: '#2dd4bf',
    border: 'none',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    '&:hover': {
      filter: 'brightness(1.1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 24px rgba(45,212,191,0.35)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
      filter: 'none',
      boxShadow: 'none',
    },
  }),
  infoBar: css({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 20px',
    background: 'rgba(56,189,248,0.06)',
    border: '1px solid rgba(56,189,248,0.15)',
    borderRadius: 14,
    marginTop: 16,
  }),
  fadeIn: css({
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  }),
}))

function FundContent() {
  const { styles } = useStyles()
  const router = useRouter()

  const [disaster, setDisaster] = useState<Disaster | null>(null)
  const [amount, setAmount] = useState<number>(100)
  const [txState, setTxState] = useState<TxState>('idle')

  useEffect(() => {
    try {
      const d = localStorage.getItem('selectedDisaster')
      if (d) setDisaster(JSON.parse(d))
    } catch {}
  }, [])

  const fee = +(amount * 0.005).toFixed(2)

  async function handleConfirm() {
    setTxState('pending_signature')

    await new Promise(r => setTimeout(r, 1500))
    setTxState('sending')

    const intent = await postContributionIntent({
      disaster_id: disaster?.id || 1,
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
    <div className={`${styles.page} ${styles.fadeIn}`}>
      <div className={styles.breadcrumb}>
        <HomeOutlined />
        <span>/</span>
        <a href="/donor/disasters">Disasters</a>
        <span>/</span>
        <span>Fund</span>
      </div>

      <button className={styles.backBtn} onClick={() => router.back()}>
        <ArrowLeftOutlined />
        Back
      </button>

      <Title level={2}>Confirm contribution</Title>

      {/* Context summary */}
      {!disaster ? (
        <Alert
          type="warning"
          message="Missing context"
          description="Please select a disaster before funding."
          showIcon
          style={{ marginBottom: '24px', borderRadius: 14 }}
          action={
            <Button type="primary" onClick={() => router.push('/donor/disasters')}>
              Select disaster
            </Button>
          }
        />
      ) : (
        <div className={styles.card}>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }}>
            Contributing to Campaign Pool
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Text strong style={{ fontSize: 18, color: '#fff' }}>
              {disaster.name}
            </Text>
            <Tag style={{
              background: 'rgba(45,212,191,0.12)',
              border: '1px solid rgba(45,212,191,0.3)',
              color: '#2dd4bf',
              borderRadius: 24,
              fontWeight: 700,
            }}>
              {disaster.country}
            </Tag>
            <Tag style={{
              background: 'rgba(45,212,191,0.08)',
              border: '1px solid rgba(45,212,191,0.2)',
              color: '#2dd4bf',
              borderRadius: 24,
              fontWeight: 700,
            }}>
              Campaign Pool
            </Tag>
          </div>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8, display: 'block' }}>
            Your contribution will be acredited to the disaster campaign pool. Allocation to coordinators happens via the protocol as validated deliveries are completed.
          </Text>
        </div>
      )}

      {/* Wallet */}
      <div className={styles.walletBar}>
        <WalletOutlined style={{ fontSize: 18, color: '#4ade80' }} />
        <div>
          <Text strong style={{ color: '#fff', fontSize: 13 }}>Wallet connected: </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{WALLET_ADDRESS}</Text>
        </div>
        <Tag style={{
          marginLeft: 'auto',
          background: 'rgba(74,222,128,0.12)',
          border: '1px solid rgba(74,222,128,0.3)',
          color: '#4ade80',
          borderRadius: 24,
          fontWeight: 700,
        }}>
          {WALLET_BALANCE.toLocaleString('en-US')} USDC
        </Tag>
      </div>

      {/* Amount */}
      <div className={styles.card}>
        <Title level={4} style={{ margin: '0 0 20px', color: '#fff' }}>Amount to contribute</Title>

        <Text style={{ color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 12, fontSize: 13 }}>
          Enter amount (min. 10 USDC — max. 1,000 USDC)
        </Text>
        <InputNumber
          size="large"
          min={10}
          max={1000}
          step={10}
          value={amount}
          onChange={(v) => setAmount(v || 10)}
          addonAfter="USDC"
          style={{ width: '100%', maxWidth: 300 }}
          disabled={isProcessing}
        />

        <div className={styles.divider} style={{ margin: '20px 0 12px' }} />

        <div className={styles.feeRow}>
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Contribution</Text>
          <Text strong style={{ color: '#fff' }}>{amount} USDC</Text>
        </div>
        <div className={styles.feeRow}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Estimated fee (0.5%)</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{fee} USDC</Text>
        </div>
        <div className={styles.divider} />
        <div className={styles.feeRow}>
          <Text strong style={{ color: '#fff' }}>Total</Text>
          <Text strong style={{ fontSize: 20, color: '#2dd4bf' }}>{amount + fee} USDC</Text>
        </div>

        {/* State alerts */}
        {txState === 'pending_signature' && (
          <div className={styles.stateAlert} style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <LoadingOutlined style={{ color: '#38bdf8', fontSize: 18, marginTop: 2 }} spin />
            <div>
              <Text strong style={{ color: '#38bdf8', display: 'block' }}>Waiting for wallet signature...</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Please confirm the transaction in your wallet.</Text>
            </div>
          </div>
        )}
        {txState === 'sending' && (
          <div className={styles.stateAlert} style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <LoadingOutlined style={{ color: '#38bdf8', fontSize: 18, marginTop: 2 }} spin />
            <div>
              <Text strong style={{ color: '#38bdf8', display: 'block' }}>Transaction sent. Confirming on Avalanche...</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>The transaction is being processed on the network.</Text>
            </div>
          </div>
        )}
        {txState === 'confirmed' && (
          <div className={styles.stateAlert} style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <CheckCircleOutlined style={{ color: '#4ade80', fontSize: 18, marginTop: 2 }} />
            <div>
              <Text strong style={{ color: '#4ade80', display: 'block' }}>
                Funds acredited to the {disaster?.name || 'Campaign'} Pool!
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Redirecting to campaign timeline...</Text>
            </div>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <LoadingOutlined spin />
                Processing...
              </>
            ) : (
              <>
                <DollarOutlined />
                Confirm contribution
              </>
            )}
          </button>
        </div>

        <div className={styles.infoBar}>
          <SafetyOutlined style={{ color: '#38bdf8', fontSize: 16 }} />
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            Your contribution is acredited to the Campaign Pool and locked in escrow on Avalanche. You can track how the pool is distributed as coordinators submit validated delivery evidence.
          </Text>
        </div>
      </div>
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
