import { Provider } from "@supabase/supabase-js";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useUser } from "../../lib/userContext";

const SignInPage: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loginType, setLoginType] = useState<string>("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        throw error || new Error("An error occurred. Please try again.");
      }
      setErrors("");
      setMessage("Logged in successfully.");
      router.push("/");
    } catch (err: any) {
      setErrors(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithProvider = async (provider: Provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({
        provider,
      });
      if (error) {
        throw error || new Error("An error occurred. Please try again.");
      }
      setErrors("");
    } catch (err: any) {
      setMessage("");
      setErrors(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"h-screen flex justify-center items-center"}>
      <div className={"max-w-sm mx-auto rounded"}>
        <h1 className={`text-3xl font-bold mb-4 text-center`}>
          Welcome to FinPhake
        </h1>

        {errors ? (
          <p className={"alert alert-danger py-4 rounded"}>{errors}</p>
        ) : null}

        {message ? (
          <p className={"alert alert-success py-4 rounded"}>{message}</p>
        ) : null}

        <button
          className={`btn btn-primary w-full flex items-center`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLoginWithProvider("github");
          }}
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
              Signing in...
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-3 inline w-4 h-4 mb-0.5"
              >
                <path
                  className="fill-current"
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              <span className="leading-none">Continue with Github</span>
            </>
          )}
        </button>

        {loginType === "email" ? (
          <div className="border-t border-gray-700 mt-6">
            <div className={"input-control"}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={"input-control"}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </div>

            <div className="flex items-center mt-4">
              <button
                className={`btn btn-primary ${loading ? "is-loading" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogin();
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
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
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              <Link href="/auth/reset-password">
                <a className="ml-auto link">Forgot password?</a>
              </Link>
            </div>
          </div>
        ) : (
          <p
            className={"link text-sm mt-2 text-center font-medium"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLoginType("email");
            }}
          >
            Sign in with email instead
          </p>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
