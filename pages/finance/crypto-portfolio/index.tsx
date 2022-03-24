import Section from '@/components/common/section'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import type { NextPage } from 'next'
import Head from 'next/head'

const CryptoPortfolioPage: NextPage = () => {
  const addNew = () => {
    console.log('add new')
  }

  return (
    <>
      <Head>
        <title>Crypto Portfolio - PhakeDev Apps</title>
      </Head>

      <Section title="My Portfolio" buttonText="Add new" buttonClick="/finance/crypto-portfolio/add-new"></Section>
    </>
  )
}

export default CryptoPortfolioPage
export const getServerSideProps = withAuthRequired({
  redirectTo: '/auth/signin',
})
