import Section from '@/components/common/section'
import useTransaction from '@/lib/crypto/useTransaction'
import { yupResolver } from '@hookform/resolvers/yup'
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import Head from 'next/head'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const FinanceCryptoPorfolioAddNew = () => {
  const [pageErrors, setPageErrors] = useState<string>('')
  const [pageMessage, setPageMessage] = useState<string>('')

  const {
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        tokenName: yup.string().required(),
        quantity: yup.number().required(),
        pricePerCoin: yup.number().required(),
        insertedDate: yup.date().required(),
      })
    ),
  })

  const { createTransaction } = useTransaction()

  const addTransaction = async (formData: any) => {
    try {
      const { data, error } = await createTransaction(formData)

      if (error) {
        throw error || new Error(error.message)
      }

      setPageMessage('Transaction added successfully!')
      reset()
    } catch (err: any) {
      console.log(err)
      setPageErrors(err.message)
    }
  }

  return (
    <>
      <Head>
        <title>Add new - Crypto Portfolio - PhakeDev Apps</title>
      </Head>

      <div className="w-1/2 mx-auto">
        <Section title="Add new">
          <form onSubmit={handleSubmit(addTransaction)}>
            <div className={`input-control ${errors.tokenName?.type && 'input-control--errors'}`}>
              <label htmlFor="tokenName">Token name</label>
              <input id="tokenName" placeholder="Token" {...register('tokenName')} />
              {errors.tokenName?.type && <p className="input-feedback">{errors.tokenName?.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`input-control ${errors.quantity?.type && 'input-control--errors'}`}>
                <label htmlFor="quantity">Quantity</label>
                <input id="quantity" step="0.000001" type="number" placeholder="Quantity" {...register('quantity')} />
                {errors.quantity?.type && <p className="input-feedback">{errors.quantity?.message}</p>}
              </div>

              <div className={`input-control ${errors.pricePerCoin?.type && 'input-control--errors'}`}>
                <label htmlFor="pricePerCoin">Price per Coin</label>
                <input id="pricePerCoin" step="0.000001" type="number" placeholder="Price per Coin" {...register('pricePerCoin')} />
                {errors.pricePerCoin?.type && <p className="input-feedback">{errors.pricePerCoin?.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`input-control ${errors.insertedDate?.type && 'input-control--errors'}`}>
                <label htmlFor="insertedDate">Date</label>
                <input id="insertedDate" type="datetime-local" placeholder="Price per Coin" {...register('insertedDate')} />
                {errors.insertedDate?.type && <p className="input-feedback">{errors.insertedDate?.message}</p>}
              </div>
            </div>

            <button className="btn btn-primary mt-6" type="submit">
              Add Transaction
            </button>
          </form>
        </Section>
      </div>
    </>
  )
}

export default FinanceCryptoPorfolioAddNew

export const getServerSideProps = withAuthRequired({
  redirectTo: '/auth/signin',
})
