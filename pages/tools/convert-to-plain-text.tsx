import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useString } from '@/lib/useString'

const CopyPlaintext: NextPage = () => {
  const [plainText, setPlainText] = useState<string>('')
  const [rawText, setRawText] = useState<string>('')

  const [nbsp, setNbsp] = useState<boolean>(false)

  const { stringNoHtml, noNbsp } = useString()

  useEffect(() => {
    if (nbsp) {
      setPlainText(stringNoHtml(noNbsp(rawText)))
    } else {
      setPlainText(stringNoHtml(rawText))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbsp])

  const handleTransform = (data: any) => {
    setRawText(data)
    setPlainText(stringNoHtml(data))
  }

  return (
    <>
      <Head>
        <title>Copy Plaintext - Phake.dev</title>
      </Head>

      <section>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className={`input-control --no-padding`}>
            <textarea
              name="raw"
              id="text-raw"
              rows={30}
              placeholder="Enter your text"
              onChange={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleTransform(e.target.value)
              }}
            />
          </div>
          <div className="input-control --no-padding">
            <textarea name="plaintext" id="plaintext" placeholder="Your plain text" rows={30} value={plainText} disabled />

            <div className="absolute top-1 right-0">
              <div className={`input-control input-control--checkbox !mt-0 mr-8`}>
                <input id="nbsp" type="checkbox" checked={nbsp} onChange={() => setNbsp(!nbsp)} />

                <label htmlFor="nbsp">{'&nbsp;'}</label>
              </div>
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
    </>
  )
}

export default CopyPlaintext
