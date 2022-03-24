import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import type { NextPage } from 'next'
import Head from 'next/head'

const FinancePersonalTrackingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Finance Personal Tracking</title>
      </Head>
    </>
  )
}

export default FinancePersonalTrackingPage
export const getServerSideProps = withAuthRequired({
  redirectTo: '/auth/signin',
})
