import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const SignupPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [acceptTermService, setAcceptTermService] = useState<boolean>(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
    } catch (err: any) {
      setErrors(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>

      <div className={"flex pt-32 justify-center items-center"}>
        <div className={"max-w-md mx-auto rounded-lg"}>
          <h1
            className={`text-3xl font-semibold mb-2 text-center text-gray-200`}
          >
            Create account
          </h1>

          <p className={`mb-6 text-sm text-center text-gray-300`}>
            Already have an account?{" "}
            <Link href="/auth/signin">
              <a className="link">Sign in</a>
            </Link>
          </p>

          {errors ? (
            <p className={"alert alert-danger py-4 rounded-lg mb-4"}>
              {errors}
            </p>
          ) : null}

          {message ? (
            <p className={"alert alert-success py-4 rounded-lg mb-4"}>
              {message}
            </p>
          ) : null}

          <div className="border-t border-gray-700 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className={"input-control"}>
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  placeholder="Last name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={"input-control"}>
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={"input-control"}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={"input-control"}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={"input-control"}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            <div className={"input-control input-control--checkbox"}>
              <input
                id="acceptTermService"
                type="checkbox"
                checked={acceptTermService}
                onChange={(e) => {
                  setAcceptTermService(e.target.checked);
                }}
              />

              <label htmlFor="acceptTermService">
                I agree to the Term of Service and Privacy Statement.
              </label>
            </div>

            <div className="flex items-center mt-4">
              <button
                className={`btn btn-primary ${loading ? "is-loading" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSignup();
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
                    Submiting...
                  </>
                ) : (
                  "Sign up with email"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
