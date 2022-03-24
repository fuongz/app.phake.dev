import { supabaseClient } from '@/packages/auth'

const usePortfolio = () => {
  const getUserPortfolio = async (userId: null | string = null) => {
    try {
      const userId = supabaseClient.auth.user()?.id
      const { data, error } = await supabaseClient.from('fin_portfolios').select('*').eq('user_id', userId).single()

      if (error) {
        throw error || new Error('Error fetching user portfolio')
      }

      return {
        data,
        error: null,
      }
    } catch (err: any) {
      console.log(err)
      return {
        data: null,
        error: err,
      }
    }
  }

  return { getUserPortfolio }
}

export default usePortfolio
