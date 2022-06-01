import { yupResolver } from '@hookform/resolvers/yup'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const cssMinifierFormSchema = yup.object({
  text: yup.string().required(),
})

const CssMinifierPage: NextPage = () => {
  const [minifiedOutput, setMinifiedOutput] = useState<any>('')
  const [pageErrors, setPageErrors] = useState<any>('')

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(cssMinifierFormSchema),
  })

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/tools/minifier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json())

      if (response) {
        setMinifiedOutput(response.data)
      } else {
        setMinifiedOutput('')
      }
    } catch (err: any) {
      console.error(err)
      setPageErrors(err.message)
    }
  }

  return (
    <>
      <Head>
        <title>CSS - Minifier - Phake.Dev</title>
      </Head>

      <div className="container mx-auto px-4">
        <h1 className="text-2xl mb-2 font-semibold">CSS Minifier</h1>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`input-control !mt-8 ${errors.text?.type && 'input-control--errors'}`}>
              <label htmlFor="text">Input CSS:</label>
              <textarea id="text" rows={20} {...register('text')} placeholder="Input CSS..." />

              <div className="mt-4">
                <button type="submit" className="btn btn-primary block w-full">
                  Minify
                </button>
              </div>
            </div>

            <div className={`input-control !mt-8`}>
              <label htmlFor="minifiedOutput">Minified Output:</label>
              <textarea id="minifiedOutput" rows={20} value={minifiedOutput} placeholder="Minified Output..." disabled />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default CssMinifierPage
