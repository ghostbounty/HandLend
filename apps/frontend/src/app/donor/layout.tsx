'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Spin } from 'antd'
import { useAuth } from '@/lib/authContext'

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isLoginPage = pathname === '/donor/login'

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.replace('/donor/login')
    }
  }, [isAuthenticated, isLoginPage, router])

  if (isLoginPage) return <>{children}</>

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" tip="Redirecting to login..." />
      </div>
    )
  }

  return <>{children}</>
}
