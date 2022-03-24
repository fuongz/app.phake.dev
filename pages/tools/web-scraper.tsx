import { yupResolver } from '@hookform/resolvers/yup'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Section from '@/components/common/section'
import * as yup from 'yup'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import { downloadFromUrl } from '@/utils/image'
import { useString } from '@/lib/useString'

const pageScraperSchema = yup.object({
  url: yup.string().required(),
})

type Selector = {
  key: string
  value: string
  type: string
}

const APP_FETCH_KEY = 'app.phakedev.scraperData'

const PageWebScraper: NextPage = () => {
  const [pageErrors, setErrors] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [fetchResult, setFetchResult] = useState<any>(null)
  const [rawResult, setRawResult] = useState<any>(null)

  const [selectors, setSelectors] = useState<Selector[]>([
    {
      key: 'selector-0',
      value: '#selector-0',
      type: 'text',
    },
  ])

  const { stringNoHtml, noNbsp } = useString()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pageScraperSchema),
  })

  useEffect(() => {
    const savedQuery = JSON.parse(localStorage.getItem(APP_FETCH_KEY) || '{}')
    if (savedQuery) {
      Object.keys(savedQuery).forEach((key) => {
        setValue(key, savedQuery[key])
        if (key === 'selectors') {
          setSelectors(savedQuery[key])
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scaper
  const scrape = async (data: any) => {
    try {
      setLoading(true)

      if (data.remember) {
        localStorage.setItem(
          APP_FETCH_KEY,
          JSON.stringify({
            ...data,
          })
        )
      }

      const response = await fetch(`/api/tools/web-scraper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: data.url,
          selectors: data.selectors.map((selector: any) => ({
            ...selector,
            value: encodeURIComponent(selector.value),
          })),
        }),
      }).then((res) => res.json())

      if (response.data) {
        setFetchResult(response.data)
        setRawResult(response.data)
      } else {
        setFetchResult(null)
        setRawResult(null)
      }
      setErrors('')
    } catch (err: any) {
      setErrors(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addSelector = () => {
    setSelectors([
      ...selectors,
      {
        key: `selector-${selectors.length}`,
        value: `#selector-${selectors.length}`,
        type: 'text',
      },
    ])
  }

  return (
    <>
      <Head>
        <title>Web Scraper - Phake.dev</title>
      </Head>

      <Section title="Web Scraper" errors={pageErrors} classes={'mb-16'}>
        <form onSubmit={handleSubmit(scrape)}>
          <div className="grid grid-cols-3 gap-4">
            <div className={`input-control col-span-3 ${errors.url?.type && 'input-control--errors'}`}>
              <label htmlFor="url">URL</label>
              <input id="url" placeholder="Web url" {...register('url')} />
            </div>

            {selectors ? (
              selectors.map((selector, index) => {
                return (
                  <div key={`selector-${index}`} className="col-span-3 grid grid-cols-10 gap-4">
                    <div className={`input-control col-span-2`}>
                      <label htmlFor={`type-${selector.key}`}>Type #{selector.key}</label>
                      <select id={`type-${selector.key}`} {...register(`selectors[${index}].type`)}>
                        <option value="text">String</option>
                        <option value="textarea">Textarea</option>
                        <option value="image">Image</option>
                        <option value="multiple-images">Multiple-images</option>
                      </select>
                    </div>

                    <div className={`input-control col-span-8`}>
                      <label htmlFor={selector.key}>Selector #{selector.key}</label>
                      <input id={selector.key} placeholder="eg. #entry-title" {...register(`selectors[${index}].value`)} />
                    </div>
                  </div>
                )
              })
            ) : (
              <></>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 mb-8">
            <button type="button" className={`btn btn-success`} onClick={addSelector}>
              + Add selector
            </button>

            <button type="submit" className={`btn btn-primary ${loading ? 'is-loading' : ''}`} disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scraping...
                </div>
              ) : (
                <>Scrape</>
              )}
            </button>

            <div className={`input-control input-control--checkbox ml-4 !mt-0`}>
              <input id="remember" type="checkbox" checked {...register('remember')} />

              <label htmlFor="remember">Remember options</label>
            </div>
          </div>
        </form>
        {rawResult ? (
          <div>
            {rawResult.map((e: any) => {
              const { key, value, type } = e

              return (
                <div key={key} className={`input-control`}>
                  <label htmlFor="thumbnail" className="capitalize">
                    {key}
                  </label>
                  {type === 'multiple-images' ? (
                    <>
                      <textarea name="plaintext" id="plaintext" placeholder="Result" rows={5} value={value?.join('\n')} disabled />

                      <div className={`input-control hidden`}>
                        <label htmlFor="urlIgnore">URL Ignore</label>
                        <input id="urlIgnore" placeholder="eg. #entry-title" />
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => {
                          downloadFromUrl(value)
                        }}
                      >
                        Download all images
                      </button>
                    </>
                  ) : type === 'textarea' ? (
                    <>
                      <div className="relative">
                        <textarea name="plaintext" id="plaintext" placeholder="Result" rows={15} value={stringNoHtml(noNbsp(value))} disabled />
                        <div className="absolute top-1 right-0">
                          <span
                            onClick={(e) => {
                              navigator.clipboard.writeText(stringNoHtml(noNbsp(value)))
                            }}
                            className=" bg-blue-600 px-4 py-2 rounded-bl-lg text-sm uppercase font-semibold tracking-tight cursor-pointer hover:bg-blue-700"
                          >
                            Copy
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <input id={key} value={stringNoHtml(noNbsp(value))} disabled />
                      {type === 'image' && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            downloadFromUrl(value)
                          }}
                        >
                          Download
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          ''
        )}
      </Section>
    </>
  )
}

export default PageWebScraper
