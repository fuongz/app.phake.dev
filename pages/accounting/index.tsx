import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Tools.module.css'

const AccountingPage: NextPage = () => {
  const tools: any[] = [
    {
      name: 'Accounting',
      description: 'Accounting',
      items: [
        {
          name: 'Salary Slip',
          description: 'Salary Slip.',
          url: '/accounting/salary-slip',
        },
      ],
    },
  ]

  return (
    <>
      <Head>
        <title>Accounting - Phake SuperApps</title>
      </Head>

      {tools && tools.length
        ? tools.map((category) => (
            <div key={category.name}>
              <h1 className="mb-2 font-semibold">{category.name}</h1>

              <div className={styles['tools']}>
                {category.items && category.items.length > 0
                  ? category.items.map((tool: any) => (
                      <Link key={tool.url} href={tool.url}>
                        <a className={styles['tool']}>
                          <span className={styles['tool-name']}>{tool.name}</span>
                          <span className={styles['tool-description']}>{tool.description}</span>
                        </a>
                      </Link>
                    ))
                  : 'No items.'}
              </div>
            </div>
          ))
        : 'No tools.'}
    </>
  )
}
export default AccountingPage
