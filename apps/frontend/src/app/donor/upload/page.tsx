'use client'

import { useState } from 'react'
import { Typography, Breadcrumb, Button, Upload } from 'antd'
import type { UploadFile } from 'antd'
import {
  CloudUploadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { createStyles } from 'antd-style'

const { Title, Text } = Typography
const { Dragger } = Upload

const useStyles = createStyles(({ css }) => ({
  page: css({
    padding: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    '@media (min-width: 768px)': {
      padding: '32px 40px',
    },
  }),
  card: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '28px',
    marginBottom: 20,
  }),
  draggerWrap: css({
    '.ant-upload-drag': {
      background: 'rgba(15,23,42,0.45) !important',
      border: '2px dashed rgba(255,255,255,0.12) !important',
      borderRadius: '12px !important',
      transition: 'all 0.2s ease',
      '&:hover': {
        border: '2px dashed #2dd4bf !important',
        background: 'rgba(45,212,191,0.04) !important',
      },
    },
    '.ant-upload-drag-icon': {
      marginBottom: '12px !important',
    },
  }),
  draggerContent: css({
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  }),
  fileRow: css({
    background: 'rgba(15,23,42,0.45)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(15,23,42,0.65)',
      border: '1px solid rgba(255,255,255,0.12)',
    },
  }),
  fileIcon: css({
    fontSize: 22,
    flexShrink: 0,
  }),
  fileInfo: css({
    flex: 1,
    minWidth: 0,
  }),
  typeBadge: css({
    display: 'inline-block',
    padding: '1px 8px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginLeft: 8,
  }),
  deleteBtn: css({
    color: 'rgba(255,255,255,0.35)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: 8,
    transition: 'all 0.15s ease',
    flexShrink: 0,
    '&:hover': {
      color: '#ef4444',
      background: 'rgba(239,68,68,0.1)',
    },
  }),
  submitBtn: css({
    width: '100%',
    height: 52,
    fontSize: 16,
    fontWeight: 700,
    background: '#2dd4bf',
    color: '#0f172a',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover:not(:disabled)': {
      background: '#5eead4',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  }),
  successCard: css({
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: 16,
    padding: '48px 32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    animation: 'fadeInUp 0.4s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(12px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  }),
  infoCard: css({
    background: 'rgba(15,23,42,0.45)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 20,
  }),
}))

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

export default function DonorUploadPage() {
  const { styles } = useStyles()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleRemove = (uid: string) => {
    setFileList(prev => prev.filter(f => f.uid !== uid))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSubmitting(false)
    setSubmitted(true)
  }

  const isPdf = (file: UploadFile) => {
    const name = file.name || ''
    return name.toLowerCase().endsWith('.pdf')
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <Breadcrumb
          style={{ marginBottom: 28 }}
          items={[
            { title: <Link href="/"><HomeOutlined /> Home</Link> },
            { title: <Link href="/donor/disasters">Donor</Link> },
            { title: 'Upload Evidence' },
          ]}
        />
        <div className={styles.successCard}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            color: '#4ade80',
          }}>
            <CheckCircleOutlined />
          </div>
          <Title level={3} style={{ margin: 0, color: '#4ade80' }}>Evidence submitted successfully!</Title>
          <Text style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.6, textAlign: 'center' }}>
            Your files will be reviewed by the coordinator and processed by GenLayer.
          </Text>
          <Link href="/donor/disasters">
            <Button
              style={{
                marginTop: 8,
                background: 'rgba(45,212,191,0.12)',
                color: '#2dd4bf',
                border: '1px solid rgba(45,212,191,0.25)',
                borderRadius: 10,
                height: 44,
                padding: '0 28px',
                fontWeight: 600,
              }}
            >
              Back to Disasters
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        style={{ marginBottom: 28 }}
        items={[
          { title: <Link href="/"><HomeOutlined /> Home</Link> },
          { title: <Link href="/donor/disasters">Donor</Link> },
          { title: 'Upload Evidence' },
        ]}
      />

      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 6 }}>Upload Evidence</Title>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
          Submit photos, reports, and documentation for your campaign contribution
        </Text>
      </div>

      {/* Upload Area */}
      <div className={styles.card}>
        <div className={styles.draggerWrap}>
          <Dragger
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            multiple
            beforeUpload={() => false}
            onChange={info => {
              setFileList(info.fileList)
            }}
            fileList={[]}
            showUploadList={false}
          >
            <div className={styles.draggerContent}>
              <CloudUploadOutlined style={{ fontSize: 48, color: '#2dd4bf' }} />
              <Text strong style={{ fontSize: 16, display: 'block' }}>
                Drag &amp; drop images or PDFs here
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>or click to browse</Text>
            </div>
          </Dragger>
        </div>
        <Text style={{ display: 'block', marginTop: 12, color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center' }}>
          Supported: JPG, PNG, WEBP, PDF &middot; Max 10MB per file
        </Text>
      </div>

      {/* File list */}
      {fileList.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
            Files to submit ({fileList.length})
          </Text>
          {fileList.map(file => {
            const pdf = isPdf(file)
            const sizeStr = file.size ? formatSize(file.size) : '—'
            return (
              <div key={file.uid} className={styles.fileRow}>
                <span className={styles.fileIcon} style={{ color: pdf ? '#ef4444' : '#2dd4bf' }}>
                  {pdf ? <FilePdfOutlined /> : <FileImageOutlined />}
                </span>
                <div className={styles.fileInfo}>
                  <Text strong style={{ display: 'block', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file.name}
                    <span
                      className={styles.typeBadge}
                      style={{
                        background: pdf ? 'rgba(239,68,68,0.12)' : 'rgba(45,212,191,0.12)',
                        color: pdf ? '#ef4444' : '#2dd4bf',
                      }}
                    >
                      {pdf ? 'PDF' : 'IMAGE'}
                    </span>
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{sizeStr}</Text>
                </div>
                <button className={styles.deleteBtn} onClick={() => handleRemove(file.uid)}>
                  <DeleteOutlined />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Submit button */}
      <Button
        className={styles.submitBtn}
        disabled={fileList.length === 0}
        loading={submitting}
        onClick={handleSubmit}
        style={{
          width: '100%',
          height: 52,
          fontSize: 16,
          fontWeight: 700,
          background: fileList.length === 0 ? 'rgba(45,212,191,0.3)' : '#2dd4bf',
          color: '#0f172a',
          border: 'none',
          borderRadius: 12,
        }}
      >
        {submitting ? 'Submitting...' : 'Submit Evidence'}
      </Button>

      {/* Info card */}
      <div className={styles.infoCard}>
        <SafetyOutlined style={{ fontSize: 22, color: '#2dd4bf', marginTop: 2, flexShrink: 0 }} />
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>
          Submitted evidence is reviewed by the coordinator and forwarded to GenLayer AI for semantic validation.
          Approved evidence triggers escrow release to the coordinator.
        </Text>
      </div>
    </div>
  )
}
