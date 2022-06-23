import moment from 'moment'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '@/styles/Accounting.module.css'

const SalarySlipPage: NextPage = () => {
  const [isOfficial, setIsOfficial] = useState(true)
  const [gross, setGross] = useState<any>(0)

  const [salaryBreakdown, setSalaryBreakdown] = useState<any>({
    gross: 0,
    totalWorkingDays: 0,
    insurance: 0,
    insuranceRegisted: 4_730_000,
    socialInsurance: 0,
    healthInsurance: 0,
    unemploymentInsurance: 0,
    net: 0,
  })

  const feeData = {
    insuranceRegisted: 4_730_000,
    socialInsurancePercent: 8,
    healthInsurancePercent: 1.5,
    unemploymentInsurancePercent: 1,
  }

  const numberFormat = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })

  const calculate = async () => {
    const result: any = {
      ...salaryBreakdown,
      totalWorkingDays: calcBusinessDays(),
      insurance: 0,
      gross,
      isOfficial,
      ...feeData,
    }

    const socialInsurance = (result.insuranceRegisted * result.socialInsurancePercent) / 100
    const healthInsurance = (result.insuranceRegisted * result.healthInsurancePercent) / 100
    let unemploymentInsurance = (result.insuranceRegisted * result.unemploymentInsurancePercent) / 100

    if (result.isOfficial) {
      unemploymentInsurance = 0
    }

    const totalInsurances = socialInsurance + healthInsurance + unemploymentInsurance

    result.net = result.gross > 0 ? result.gross - totalInsurances : 0
    result.socialInsurance = socialInsurance
    result.healthInsurance = healthInsurance
    result.unemploymentInsurance = unemploymentInsurance

    setSalaryBreakdown(result)
  }

  const calcBusinessDays = () => {
    const startDay = moment().startOf('month')
    const endDay = moment().endOf('month')

    let businessDays = 0
    while (startDay.isSameOrBefore(endDay, 'day')) {
      if (startDay.day() !== 0 && startDay.day() !== 6) {
        businessDays++
      }
      startDay.add(1, 'd')
    }
    return businessDays
  }

  useEffect(() => {
    calculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficial, gross])

  return (
    <>
      <Head>
        <title>Salary Slip - Accounting - Phake SuperApps</title>
      </Head>

      <div className="container max-w-xl mx-auto px-4">
        <h1 className="text-2xl mb-2 font-semibold">Salary Slip</h1>
        <form className="flex flex-col">
          <div className={`input-control`}>
            <label htmlFor="gross">Gross:</label>
            <input
              type="number"
              id="gross"
              onChange={(e) => {
                setGross(e.target.value)
              }}
              placeholder="Type your gross salary..."
            />
          </div>

          <div className={`input-control input-control--checkbox`}>
            <label htmlFor="isOfficial">Is Offial Staff?</label>
            <input
              type="checkbox"
              id="isOfficial"
              value={isOfficial ? 1 : 0}
              checked={isOfficial}
              onChange={(e) => {
                setIsOfficial(e.target.checked)
              }}
            />
          </div>
        </form>

        <div className="mt-4">
          <table className={styles['table']}>
            <tbody>
              <tr>
                <td>Gross:</td>
                <td>{numberFormat.format(gross)}</td>
              </tr>
              <tr>
                <td>NET:</td>
                <td>{numberFormat.format(salaryBreakdown.net)}</td>
              </tr>
              <tr>
                <td>Total working days:</td>
                <td>{salaryBreakdown.totalWorkingDays}</td>
              </tr>
              <tr>
                <td>Registered insurance’s salary:</td>
                <td>{numberFormat.format(salaryBreakdown.insuranceRegisted)}</td>
              </tr>
              <tr>
                <td>Social Ins ({salaryBreakdown.socialInsurancePercent}%):</td>
                <td>{numberFormat.format(salaryBreakdown.insuranceRegisted)}</td>
              </tr>
              <tr>
                <td>Health Ins ({salaryBreakdown.healthInsurancePercent}%):</td>
                <td>{numberFormat.format(salaryBreakdown.healthInsurance)}</td>
              </tr>
              {!salaryBreakdown.isOfficial ? (
                <tr>
                  <td>Unemployment Ins ({salaryBreakdown.unemploymentInsurancePercent}%):</td>
                  <td>{numberFormat.format(salaryBreakdown.unemploymentInsurance)}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default SalarySlipPage
