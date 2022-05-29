import { yupResolver } from '@hookform/resolvers/yup'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const bcryptFormSchema = yup.object({
  yourString: yup.string().required(),
  yourSalt: yup.number().min(1).max(10).required(),
})

const BcryptPage: NextPage = () => {
  const [yourHash, setYourHash] = useState('')

  const {
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(bcryptFormSchema),
  })

  useEffect(() => {
    const subscription = watch(async (value) => {
      const { yourString, saltRounds } = value
      if (yourString && saltRounds) {
        const query = new URLSearchParams({
          string: yourString,
          rounds: saltRounds,
        })

        const response = await fetch(`/api/tools/bcrypt?${query}`).then((res) => res.json())

        if (response) {
          setYourHash(response.data)
        }
      } else {
        setYourHash('')
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <>
      <Head>
        <title>Bcrypt - Phake.Dev</title>
      </Head>

      <div className="container max-w-xl mx-auto px-4">
        <h1 className="text-2xl mb-2 font-semibold">Bcrypt</h1>
        <form className="flex flex-col">
          <div className={`input-control !mt-8 ${errors.yourString?.type && 'input-control--errors'}`}>
            <label htmlFor="yourString">Your string:</label>
            <input id="yourString" type="text" {...register('yourString')} placeholder="Your string" />
          </div>

          <div className={`input-control !mt-8 ${errors.saltRounds?.type && 'input-control--errors'}`}>
            <label htmlFor="yourString">Salt rounds:</label>
            <input id="saltRounds" type="number" {...register('saltRounds')} defaultValue={10} placeholder="Salt rounds" />
          </div>

          <div className={`input-control !mt-8`}>
            <label htmlFor="yourHash">Your hash:</label>
            <input id="yourHash" className="text-xs" value={yourHash} disabled placeholder="Your hash" />
          </div>
        </form>
      </div>
    </>
  )
}

export default BcryptPage
