'use client'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, App } from 'antd'
import { StyleProvider } from 'antd-style'
import enUS from 'antd/locale/en_US'
import useGlassTheme from '@/lib/glassTheme'

function ThemedApp({ children }: { children: React.ReactNode }) {
  const configProps = useGlassTheme()
  return (
    <ConfigProvider locale={enUS} {...configProps}>
      <App style={{ minHeight: '100vh', background: 'transparent' }}>
        {children}
      </App>
    </ConfigProvider>
  )
}

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <StyleProvider>
        <ThemedApp>{children}</ThemedApp>
      </StyleProvider>
    </AntdRegistry>
  )
}
