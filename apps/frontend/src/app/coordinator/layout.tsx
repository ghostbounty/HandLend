'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Spin } from 'antd'
import { useAuth } from '@/lib/authContext'

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublicPage = pathname === '/coordinator/apply'

  useEffect(() => {
    if (!isPublicPage && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isPublicPage, router])

  if (isPublicPage) return <>{children}</>

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" tip="Redirecting to login..." />
      </div>
    )
  }

  return <>{children}</>
}
