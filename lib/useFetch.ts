export const $proxyFetch = async (url: string, options: any = {}, responseType = 'json') => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_PROXY_SERVER_URL || 'http://localhost:8080'}/${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (responseType === 'blob') {
    return response.blob()
  } else if (responseType === 'text') {
    return response.text()
  } else {
    return response.json()
  }
}

export const $fetch = async (url: string, options: any = {}, responseType = 'json') => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (responseType === 'blob') {
    return response.blob()
  } else if (responseType === 'text') {
    return response.text()
  } else {
    return response.json()
  }
}

export const useFetch = () => {
  return {
    $proxyFetch,
    $fetch,
  }
}
