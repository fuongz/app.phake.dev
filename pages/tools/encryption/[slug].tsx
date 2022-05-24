import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import crypto from 'crypto'
import { useRouter } from 'next/router'

const EncryptionPage: NextPage = () => {
  const [hash, setHash] = useState<any>('')
  const [plainText, setPlainText] = useState<string>('')

  const router = useRouter()
  const listHash = [
    {
      key: 'sha256',
      name: 'SHA256 Generator',
      hash: 'sha256',
    },
    {
      key: 'sha512',
      name: 'SHA512 Generator',
      hash: 'sha512',
    },
    {
      key: 'md5',
      name: 'MD5 Generator',
      hash: 'md5',
    },
    {
      key: 'base64',
      name: 'Base64 Encode',
      hash: 'base64',
    },
    {
      key: 'base64-decode',
      name: 'Base64 Decode',
      hash: 'base64-decode',
    },
    {
      key: 'password',
      name: 'Strong Password Generator',
      hash: 'password',
    },
  ]

  const handleConvert = (data: any) => {
    let result = ''

    if (hash.key === 'base64') {
      result = Buffer.from(data).toString('base64')
    } else if (hash.key === 'base64-decode') {
      result = Buffer.from(data, 'base64').toString('utf8')
    } else {
      result = crypto.createHash(hash.hash).update(data).digest('hex')
    }

    if (!data) {
      setPlainText('')
    } else {
      setPlainText(result)
    }
  }

  useEffect(() => {
    const { slug } = router.query
    if (slug) {
      const data = listHash.find((item) => item.key === slug)
      if (!data) {
        router.push('/')
      } else {
        setHash(data)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug])

  return (
    <>
      <Head>
        <title>{hash.name} Encode - Phake.dev</title>
      </Head>

      <main>
        <section className="relative">
          <h1 className="text-2xl font-semibold mb-4">{hash.name}</h1>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className={`input-control --no-padding`}>
              <textarea
                name="raw"
                id="text-raw"
                rows={30}
                placeholder="Type (or paste) your text here"
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleConvert(e.target.value)
                }}
              />
            </div>
            <div className="input-control --no-padding">
              <textarea name="plaintext" id="plaintext" placeholder="Your string" rows={30} value={plainText} disabled />

              <div className="absolute top-1 right-0">
                <span
                  onClick={(e) => {
                    navigator.clipboard.writeText(plainText)
                  }}
                  className=" bg-blue-600 px-4 py-2 rounded-bl-lg text-sm uppercase font-semibold tracking-tight cursor-pointer hover:bg-blue-700"
                >
                  Copy
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default EncryptionPage
