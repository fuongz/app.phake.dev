import { yupResolver } from "@hookform/resolvers/yup";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Section from "../../components/common/section";
import enforceAuthenticated from "../../lib/enforcedAuthenticated";
import * as yup from "yup";

const pageScraperSchema = yup.object({
  url: yup.string().required(),
  title: yup.string().required(),
  summary: yup.string().required(),
  content: yup.string().required(),
  thumbnail: yup.string().required(),
});

const APP_FETCH_KEY = "app.phakedev.scraperData";

const PageBlogScraper: NextPage = () => {
  const [pageErrors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [fetchResult, setFetchResult] = useState<any>(null);
  const [rawResult, setRawResult] = useState<any>(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pageScraperSchema),
  });

  useEffect(() => {
    const savedQuery = JSON.parse(localStorage.getItem(APP_FETCH_KEY) || "{}");
    if (savedQuery) {
      Object.keys(savedQuery).forEach((key) => {
        setValue(key, savedQuery[key]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scaper
  const scrape = async (data: any) => {
    try {
      setLoading(true);

      if (data.remember) {
        localStorage.setItem(
          APP_FETCH_KEY,
          JSON.stringify({
            ...data,
          })
        );
      }

      const response = await fetch(`/api/tools/web-scraper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data.url,
          title: encodeURIComponent(data.title),
          summary: encodeURIComponent(data.summary),
          content: encodeURIComponent(data.content),
          thumbnail: encodeURIComponent(data.thumbnail),
        }),
      }).then((res) => res.json());

      console.log(response);

      if (response.data) {
        setFetchResult(response.data);
        setRawResult(response.data);
      } else {
        setFetchResult(null);
        setRawResult(null);
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
        <title>Blog Scraper - Phake.dev</title>
      </Head>

      <Section title="Blog Scraper" errors={pageErrors}>
        <form onSubmit={handleSubmit(scrape)}>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`input-control col-span-3 ${
                errors.url?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="url">URL</label>
              <input
                id="url"
                placeholder="Blog post url"
                {...register("url")}
              />
            </div>

            <div
              className={`input-control  ${
                errors.title?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="title">Post Title Selector</label>
              <input
                id="title"
                placeholder="eg. #entry-title"
                {...register("title")}
              />
            </div>

            <div
              className={`input-control  ${
                errors.summary?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="summar">Post Summary Selector</label>
              <input
                id="summary"
                placeholder="eg. #entry-summary"
                {...register("summary")}
              />
            </div>

            <div
              className={`input-control  ${
                errors.content?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="content">Post Content Selector</label>
              <input
                id="content"
                placeholder="eg. #entry-content"
                {...register("content")}
              />
            </div>

            <div
              className={`input-control  ${
                errors.thumbnail?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="thumbnail">Post Thumbnail Selector</label>
              <input
                id="thumbnail"
                placeholder="eg. img#entry-thumbnails"
                {...register("thumbnail")}
              />
            </div>
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
                Scraping...
              </div>
            ) : (
              <>Scrape</>
            )}
          </button>

          <div className={`input-control input-control--checkbox ml-4`}>
            <input
              id="remember"
              type="checkbox"
              checked
              {...register("remember")}
            />

            <label htmlFor="remember">Remember options</label>
          </div>
        </form>
        {rawResult ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(rawResult).map((key) => {
              const value = rawResult[key];

              return (
                <div key={key} className={`input-control`}>
                  <label htmlFor="thumbnail" className="capitalize">
                    {key}
                  </label>
                  <input id={key} value={value} disabled />
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </Section>
    </>
  );
};

export default PageBlogScraper;
export const getServerSideProps = enforceAuthenticated();
