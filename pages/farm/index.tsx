import { NextPage } from "next";
import enforceAuthenticated from "../../lib/enforcedAuthenticated";
import styles from "../../styles/Farm.module.css";

const FarmHome: NextPage = () => {
  const numberFormat = (number: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  const farms: any = [
    {
      name: "BNB - BUSD",
      status: 1,
      startTime: "1/20/2022 11:00:00",
      base: {
        rate: {
          first: 0.0021,
          second: 473.5,
        },
        poolSize: {
          total: 117.00925,
          first: 2546.43,
          second: 5.38,
        },
      },
      current: {
        rate: {
          first: 0.0023,
          second: 429.8,
        },
      },
    },
  ];

  const farmList = farms.map((farm: any, index: number) => {
    const initialStaked =
      farm.base.poolSize.first +
      farm.base.poolSize.second * farm.base.rate.second;
    const currentStaked =
      farm.base.poolSize.first +
      farm.base.poolSize.second * farm.current.rate.second;
    const profit = currentStaked - initialStaked;

    return (
      <div key={`farm-${index}`} className={styles.farmItem}>
        <h1>{farm.name}</h1>
        <p className="flex w-full">
          Initial staked{" "}
          <span className="ml-auto">{numberFormat(initialStaked)}</span>
        </p>

        <p className="flex w-full">
          Current staked{" "}
          <span className="ml-auto">
            {numberFormat(currentStaked)} (
            <span
              className={`${
                profit < 0
                  ? "text-red-700"
                  : profit > 0
                  ? "text-green-600"
                  : "text-gray-700"
              }`}
            >
              {numberFormat(profit)}
            </span>
            )
          </span>
        </p>
      </div>
    );
  });

  return (
    <div className="container mx-auto px-4">
      <main>
        <div>{farmList}</div>
      </main>
    </div>
  );
};

export default FarmHome;
export const getServerSideProps = enforceAuthenticated();
