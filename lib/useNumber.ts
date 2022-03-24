const useNumber = () => {
  const numberFormat = (number: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(number)
  }

  return {
    numberFormat,
  }
}

export default useNumber
