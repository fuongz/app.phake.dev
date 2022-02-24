import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { NextPage } from "next";
import Head from "next/head";
import FarmList from "../../components/farm/FarmList";

const FarmHome: NextPage = () => {
  const { user }: any = useUser();

  const farms: any = [
    {
      id: 1,
      name: "BNB - BUSD",
      network: "Moonbeam",
      status: 1,
      startTime: "1/20/2022 11:00:00",
      apr: "19%",
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

  return (
    <>
      <Head>
        <title>Farms - PhakeApps</title>
      </Head>

      <main>
        {["phuongthephung@gmail.com", "senanarumi0805@gmail.com"].includes(
          user?.email
        ) && <FarmList farms={farms} />}
      </main>
    </>
  );
};

export default FarmHome;
export const getServerSideProps = withAuthRequired({
  redirectTo: "/auth/signin",
});
