import type { NextPage } from 'next'
import Head from 'next/head'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

const base64FormSchema = yup.object({})

const Base64FileEncodePage: NextPage = () => {
  const [base64String, setBase64String] = useState<any>('')
  const [busy, setBusy] = useState(false)

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(base64FormSchema),
  })

  const onSubmit = async (data: any) => {
    setBusy(true)
    setBase64String(null)

    const toBase64 = (file: any) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })

    const result = data.file[0] ? await toBase64(data.file[0]) : null
    setBase64String(result)
    setBusy(false)
  }

  return (
    <>
      <Head>
        <title>Base64 File Encode - Phake.Dev</title>
      </Head>

      <div className="container max-w-xl mx-auto px-4">
        <h1 className="text-2xl mb-2 font-semibold">Base64 Encode File</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className={`input-control`}>
            <label htmlFor="file">Select file:</label>
            <input type="file" id="file" {...register('file')} />
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Generate Password
          </button>

          <div className={`input-control !my-8 relative`}>
            <label htmlFor="base64String">Encoded:</label>
            <textarea name="base64String" id="base64String" placeholder="Result..." rows={20} value={base64String} disabled />
            {busy ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                <div className="flex bg-gray-800 bg-opacity-70 px-4 py-2 rounded">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Encoding...
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </form>
      </div>
    </>
  )
}

export default Base64FileEncodePage
