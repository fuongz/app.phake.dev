import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Icon } from "@iconify/react";
import Link from "next/link";
import enforceAuthenticated from "../lib/enforcedAuthenticated";

const Home: NextPage = () => {
  const numberFormat = (num: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumSignificantDigits: 3,
    }).format(num);

  const services = [
    {
      id: "1",
      name: "Farm",
      description: "LP Farming",
      status: 1,
      icon: "cil:leaf",
      to: "/farm",
      balance: 15000,
      balance_unit: "$",
    },
    {
      id: "2",
      name: "Saving",
      description: "Saving",
      status: 2,
      icon: "fluent:savings-20-regular",
      to: "/saving",
      balance: 10000,
      balance_unit: "$",
    },
    {
      id: "3",
      name: "Banking",
      description: "Banks transaction tracking",
      status: 3,
      icon: "fluent:building-bank-28-regular",
      to: "/banking",
      balance: 150000,
      balance_unit: "$",
    },
  ];

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <section>
        <h3 className={`font-medium text-2xl`}>Service</h3>
        <div className={styles["tiles"]}>
          {services.map((service) => (
            <article key={service.id} className={styles["tile"]}>
              <div className={styles["tile-header"]}>
                <Icon icon={service.icon} className={`text-4xl`} />
                <h3>
                  <span>{service.name}</span>
                  <span>{service.description}</span>
                </h3>
              </div>
              <h2 className={styles["tile-currency"]}>
                {numberFormat(service.balance)}
              </h2>
              <Link href={service.to}>
                <a>
                  <span>Go to service</span>
                </a>
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-3 text-gray-500">
          Services are paid according to the current state of the currency and
          tariff.
        </p>
      </section>
    </>
  );
};

export const getServerSideProps = enforceAuthenticated();
export default Home;
