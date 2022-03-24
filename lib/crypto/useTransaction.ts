import { supabaseClient } from '@/packages/auth'
import { useEffect } from 'react'
import usePortfolio from './usePortfolio'

export type PortfolioTransaction = {
  tokenName: string
  quantity: number
  pricePerCoin: number
  insertedDate: Date
}

const useTransaction = () => {
  const { getUserPortfolio } = usePortfolio()

  useEffect(() => {
    const initUserPortfolio = async () => {
      try {
        const userId = supabaseClient.auth.user()?.id
        const { data, error } = await getUserPortfolio(userId)

        if (error) {
          throw error || new Error('Error fetching user portfolio')
        }

        return {
          data,
          error: null,
        }
      } catch (err) {
        return {
          data: null,
          error: err,
        }
      }
    }

    // initUserPortfolio()
  })

  const createTransaction = async (formData: PortfolioTransaction) => {
    try {
      const userId = supabaseClient.auth.user()?.id

      const { data, error } = await supabaseClient.from('fin_portfolio_transactions').insert([
        {
          portfolio_id: 1,
          coin_id: formData.tokenName,
          quantity: formData.quantity,
          price_per_coin: formData.pricePerCoin,
          inserted_at: formData.insertedDate,
          user_id: supabaseClient.auth.user()?.id,
        },
      ])

      if (error) {
        throw error || new Error('Error creating transaction')
      }

      return {
        error: null,
        data,
      }
    } catch (err: any) {
      console.log(err)
      return {
        data: null,
        error: err,
      }
    }
  }

  return {
    createTransaction,
  }
}

export default useTransaction
