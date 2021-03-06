import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AppLayout from '@/components/layout'

// User Context
import Loading from '@/components/loading'
import { UserProvider } from '@/packages/auth'
import { supabaseClient } from '@/packages/auth'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url: string) => {
      url !== router.pathname ? setLoading(true) : setLoading(false)
    }
    const handleComplete = (url: string) => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
  }, [router])

  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Loading loading={loading} />
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </UserProvider>
  )
}

export default MyApp
