import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Tools.module.css'

const ToolsIndexPage: NextPage = () => {
  const tools: any[] = [
    {
      name: 'Data',
      description: 'Data helpers',
      items: [
        {
          name: 'Fetch',
          description: 'Fetch HTML from a URL',
          url: '/tools/fetch',
        },
        {
          name: 'Web Scraper',
          description: 'Scrape a website',
          url: '/tools/web-scraper',
        },
      ],
    },
    {
      name: 'String',
      description: 'String helpers',
      items: [
        {
          name: 'Convert to plain text',
          description: 'Convert HTML to plain text',
          url: '/tools/convert-to-plain-text',
        },
      ],
    },
    {
      name: 'Encryption',
      description: 'Encryption helpers',
      items: [
        {
          name: 'Password Generator',
          description: 'Create a secure password using our generator tool.',
          url: '/tools/encryption/password',
        },
        {
          name: 'Bcrypt',
          description: 'Hash and compare text string using bcrypt.',
          url: '/tools/encryption/bcrypt',
        },
        {
          name: 'Convert file to Base64',
          description: 'Convert file to Base64 online.',
          url: '/tools/encryption/base64-file',
        },
        {
          name: 'Base64 Encode',
          description: 'Encode Plain data to Base64 numeral system.',
          url: '/tools/encryption/base64',
        },
        {
          name: 'Base64 Decode',
          description: 'Decode Base64 to plain text.',
          url: '/tools/encryption/base64-decode',
        },
        {
          name: 'SHA256 Generator',
          description: 'Generator Plain data to SHA256 numeral system.',
          url: '/tools/encryption/sha256',
        },
        {
          name: 'SHA512 Generator',
          description: 'Generator Plain data to SHA512 numeral system.',
          url: '/tools/encryption/sha512',
        },
        {
          name: 'MD5 Generator',
          description: 'Generator Plain data to MD5 numeral system.',
          url: '/tools/encryption/md5',
        },
      ],
    },
  ]

  return (
    <>
      <Head>
        <title>Apps - Phake.dev</title>
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

export default ToolsIndexPage
