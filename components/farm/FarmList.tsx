import Image from "next/image";
import dayjs from "dayjs";
import styles from "@/styles/Farm.module.css";
import FarmTd from "./Td";

/* eslint-disable @next/next/no-img-element */
const FarmList = (props: any) => {
  const { farms } = props;

  const numberFormat = (number: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  const getLPStaked = (farm: any, needFormat = false) => {
    const result =
      farm.base.poolSize.first +
      farm.base.poolSize.second * farm.base.rate.second;
    return needFormat ? numberFormat(result) : result;
  };

  const getCurrentStaked = (farm: any, needFormat = false) => {
    const result =
      farm.base.poolSize.first +
      farm.base.poolSize.second * farm.current.rate.second;
    return needFormat ? numberFormat(result) : result;
  };

  const getProfit = (farm: any) => {
    return getCurrentStaked(farm) - getLPStaked(farm);
  };

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-400">
          <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
            Vault
          </th>
          <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
            Network
          </th>
          <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">
            APR
          </th>
          <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
            LP Staked
          </th>
          <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
            Earned
          </th>
          <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
            Profit
          </th>
          <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 sm:text-gray-400 text-white">
            Date
          </th>
        </tr>
      </thead>
      <tbody className="text-gray-600 dark:text-gray-100">
        {farms ? (
          farms.map((farm: any, index: number) => (
            <tr key={farm.id}>
              <FarmTd>
                <div className="flex items-center">
                  <img
                    src={`https://baby-upload.s3.ap-southeast-1.amazonaws.com/images/farms/${farm.name
                      .replace(/ /gm, "")
                      .toLowerCase()}.svg`}
                    className="w-7 mr-2.5"
                    alt=""
                  />
                  <span className="font-medium">{farm.name}</span>
                </div>
              </FarmTd>

              <FarmTd>
                <div className="flex items-center">
                  <Image
                    src={`/icons/networks/${farm.network.toLowerCase()}.png`}
                    alt=""
                    width={28}
                    height={28}
                  />
                  <span className="font-medium ml-2.5">{farm.network}</span>
                </div>
              </FarmTd>
              <FarmTd>{farm.apr}</FarmTd>
              <FarmTd>{getLPStaked(farm, true)}</FarmTd>
              <FarmTd>0.00</FarmTd>
              <FarmTd value={getProfit(farm)} currency="USD"></FarmTd>
              <FarmTd>
                <div className="flex items-center">
                  <div className="sm:flex hidden flex-col">
                    {dayjs(farm.startTime).format("DD.MM.YYYY")}
                    <div className="text-gray-400 text-xs">
                      {dayjs(farm.startTime).format("HH:mm")}
                    </div>
                  </div>
                </div>
              </FarmTd>
            </tr>
          ))
        ) : (
          <>
            <tr>
              <FarmTd colSpan={5}>No data.</FarmTd>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};

export default FarmList;
