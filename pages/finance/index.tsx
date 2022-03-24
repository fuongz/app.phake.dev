import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import useNumber from '@/lib/useNumber'

const Home: NextPage = () => {
  const { numberFormat } = useNumber()

  const services = [
    {
      id: '1',
      name: 'Budget and Expense Tracking',
      description: 'Save time on expense reports with everything in one place & approve with just one click.',
      status: 1,
      icon: 'cil:leaf',
      to: '/finance/personal-tracking',
      balance: 15000,
      balance_unit: 'vnd',
    },
    {
      id: '2',
      name: 'Crypto Portfolio',
      description: 'Keep up-to-date with your cryptocurrencies.',
      status: 1,
      icon: 'cil:leaf',
      to: '/finance/crypto-portfolio',
      balance: 15000,
      balance_unit: 'vnd',
    },
  ]

  return (
    <>
      <Head>
        <title>Finance - PhakeDev Apps</title>
      </Head>

      <section>
        <h3 className={`font-medium text-2xl`}>Service</h3>
        <div className={styles['tiles']}>
          {services.map((service) => (
            <article key={service.id} className={styles['tile']}>
              <div className={styles['tile-header']}>
                <h3>
                  <span>{service.name}</span>
                  <span>{service.description}</span>
                </h3>
              </div>
              {/* <h2 className={styles['tile-currency']}>{numberFormat(service.balance, service.balance_unit)}</h2> */}
              <Link href={service.to}>
                <a>
                  <span>Go to service</span>
                </a>
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-3 text-gray-500">Services are paid according to the current state of the currency and tariff.</p>
      </section>
    </>
  )
}

export const getServerSideProps = withAuthRequired({
  redirectTo: '/auth/signin',
})
export default Home
