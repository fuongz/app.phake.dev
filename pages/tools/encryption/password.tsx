import { NextPage } from 'next'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'

const passwordGeneratorFormSchema = yup.object({
  passwordLength: yup.number().optional(),
  hasSymbols: yup.boolean().optional(),
  hasNumbers: yup.boolean().optional(),
  hasLowerCase: yup.boolean().optional(),
  hasUpperCase: yup.boolean().optional(),
})

const PasswordGeneratorPage: NextPage = () => {
  const [yourPassword, setYourPassword] = useState('')

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(passwordGeneratorFormSchema),
  })

  const generateStrongPassword = ({ length, hasSymbols, hasNumbers, hasLowerCase, hasUpperCase }: any) => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz'
    const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const integers = '0123456789'
    const exCharacters = '!@#$%^&*_-=+'

    // Generate a random password
    const generatePassword = (length: number, chars: string) => {
      let password = ''
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    // Create password
    const createPassword = (length: number, hasNumbers: boolean, hasSymbols: boolean, hasLowerCase: boolean, hasUpperCase: boolean) => {
      let chars = ''

      if (hasLowerCase) {
        chars += alpha
      }

      if (hasUpperCase) {
        chars += alphaUpper
      }

      if (hasNumbers) {
        chars += integers
      }

      if (hasSymbols) {
        chars += exCharacters
      }
      return generatePassword(length, chars)
    }

    return createPassword(length, hasNumbers, hasSymbols, hasLowerCase, hasUpperCase)
  }

  const range = (from: number, to: number) => {
    const range = []
    for (let i = from; i <= to; i++) {
      range.push({
        label: i,
        value: i,
      })
    }
    return range
  }

  const onSubmit = (data: any) => {
    setYourPassword(
      generateStrongPassword({
        length: data.passwordLength,
        hasSymbols: data.hasSymbols,
        hasNumbers: data.hasNumbers,
        hasLowerCase: data.hasLowercaseChars,
        hasUpperCase: data.hasUppercaseChars,
      })
    )
  }

  return (
    <>
      <Head>
        <title>Password Generator - Phake.Dev</title>
      </Head>

      <div className="container max-w-md mx-auto px-4">
        <h1 className="text-2xl mb-2 font-semibold">Password Generator</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className={`input-control`}>
            <label htmlFor="passwordLength">Password Length</label>
            <select id="passwordLength" {...register('passwordLength')} defaultValue={16}>
              <optgroup label="Weak">
                {range(6, 15).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Strong">
                {range(16, 128).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className={`input-control input-control--checkbox`}>
            <label htmlFor="hasSymbols">Include Symbols (eg. !@#$%^&*_-=+):</label>
            <input type="checkbox" id="hasSymbols" {...register('hasSymbols')} defaultChecked={true} />
          </div>

          <div className={`input-control input-control--checkbox`}>
            <label htmlFor="hasNumbers">Include Numbers (eg. 01234):</label>
            <input type="checkbox" id="hasNumbers" {...register('hasNumbers')} defaultChecked={true} />
          </div>

          <div className={`input-control input-control--checkbox`}>
            <label htmlFor="hasLowercaseChars">Include Lowercase Characters (eg. abcde):</label>
            <input type="checkbox" id="hasLowercaseChars" {...register('hasLowercaseChars')} defaultChecked={true} />
          </div>

          <div className={`input-control input-control--checkbox`}>
            <label htmlFor="hasUppercaseChars">Include Uppercase Characters (eg. ABCDE):</label>
            <input type="checkbox" id="hasUppercaseChars" {...register('hasUppercaseChars')} defaultChecked={true} />
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Generate Password
          </button>

          <div className={`input-control !mt-8`}>
            <label htmlFor="yourPassword">Your new password:</label>
            <input id="yourPassword" value={yourPassword} disabled />
          </div>
        </form>
      </div>
    </>
  )
}

export default PasswordGeneratorPage
