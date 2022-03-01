import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useString } from "../../lib/useString";
import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";

const fetchSchema = yup.object({
  url: yup.string().required(),
  selector: yup.string().required(),
  remember: yup.boolean().optional(),
});

const APP_FETCH_KEY = "app.phakedev.fetchData";

const FetchTool: NextPage = () => {
  const [pageErrors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [isPlainText, setIsPlainText] = useState<boolean>(false);
  const [haveClasses, setHaveClasses] = useState<boolean>(false);
  const [nbsp, setNbsp] = useState<boolean>(false);

  const [fetchResult, setFetchResult] = useState<string>("");
  const [rawResult, setRawResult] = useState<string>("");

  const { stringNoHtml, htmlNoClasses, noNbsp } = useString();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fetchSchema),
  });

  useEffect(() => {
    const savedQuery = JSON.parse(localStorage.getItem(APP_FETCH_KEY) || "{}");
    if (savedQuery && savedQuery.url && savedQuery.selector) {
      setValue("url", savedQuery.url);
      setValue("selector", savedQuery.selector);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const extraQuery = async () => {
      let result: any = rawResult;

      if (isPlainText) {
        result = stringNoHtml(rawResult);
      }

      if (nbsp) {
        result = noNbsp(result);
      }

      if (haveClasses) {
        const { data, errors }: any = await htmlNoClasses(result);
        if (data && !errors) {
          result = data;
        }
      }

      setFetchResult(result);
    };

    extraQuery();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlainText, nbsp, haveClasses, rawResult]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { url, selector, remember } = data;

      if (remember) {
        localStorage.setItem(
          APP_FETCH_KEY,
          JSON.stringify({
            url,
            selector,
          })
        );
      }

      const response = await fetch(
        `/api/tools/fetch?url=${url}&selector=${encodeURIComponent(selector)}`
      ).then((res) => res.json());

      if (response.data) {
        setFetchResult(response.data);
        setRawResult(response.data);
      } else {
        setFetchResult("");
        setRawResult("");
      }
      setErrors("");
    } catch (err: any) {
      setErrors(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Fetch - Phake.dev</title>
      </Head>

      <section className="relative">
        <h1 className="text-2xl font-semibold">Fetch</h1>

        {pageErrors ? (
          <p className={"alert alert-danger py-4 rounded-lg mb-4"}>
            {pageErrors}
          </p>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`input-control flex-shrink w-full ${
              errors.url?.type && "input-control--errors"
            }`}
          >
            <label htmlFor="url">URL</label>
            <input id="url" placeholder="Your url" {...register("url")} />
          </div>

          <div
            className={`input-control flex-shrink w-full ${
              errors.selector?.type && "input-control--errors"
            }`}
          >
            <label htmlFor="selector">Selector</label>
            <input
              id="selector"
              placeholder="Selector eg. #content"
              {...register("selector")}
            />
          </div>

          <div className={`input-control input-control--checkbox block w-full`}>
            <input
              id="remember"
              type="checkbox"
              checked
              {...register("remember")}
            />

            <label htmlFor="remember">Remember last fetch</label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary mt-4 mb-8 ${
              loading ? "is-loading" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Fetching...
              </div>
            ) : (
              <>Fetch</>
            )}
          </button>

          <div className="relative">
            <div className={`loader ${loading ? "" : "!hidden"}`} />

            <div className="input-control">
              <label htmlFor="plainText" className="!flex items-center w-full">
                <span>Result:</span>
                <div className="ml-auto">
                  <div
                    className={`input-control input-control--checkbox !mt-0 mr-8`}
                  >
                    <input
                      id="nbsp"
                      type="checkbox"
                      checked={nbsp}
                      onChange={() => setNbsp(!nbsp)}
                    />

                    <label htmlFor="nbsp">{"&nbsp;"}</label>
                  </div>

                  <div
                    className={`input-control input-control--checkbox !mt-0 mr-8`}
                  >
                    <input
                      id="haveClasses"
                      type="checkbox"
                      checked={haveClasses}
                      onChange={() => setHaveClasses(!haveClasses)}
                    />

                    <label htmlFor="haveClasses">classes</label>
                  </div>

                  <div
                    className={`input-control input-control--checkbox !mt-0`}
                  >
                    <input
                      id="isPlainText"
                      type="checkbox"
                      checked={isPlainText}
                      onChange={() => setIsPlainText(!isPlainText)}
                    />

                    <label htmlFor="isPlainText">Plain Text</label>
                  </div>
                </div>
              </label>
              <textarea
                name="plaintext"
                id="plaintext"
                placeholder="Result"
                rows={15}
                value={fetchResult}
                disabled
              />
              <span
                onClick={(e) => {
                  navigator.clipboard.writeText(fetchResult);
                }}
                className="absolute top-6 right-0 bg-blue-600 px-4 py-2 rounded-bl-lg text-sm uppercase font-semibold tracking-tight cursor-pointer hover:bg-blue-800 transition hover:transition"
              >
                Copy
              </span>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default FetchTool;

export const getServerSideProps = withAuthRequired({
  redirectTo: "/auth/signin",
});
