import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Confirm password must match")
    .required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  acceptTermService: yup.boolean().isTrue().required(),
});

const SignupPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageErrors, setErrors] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSignup = async (data: any) => {
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
        },
        {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        }
      );

      if (error || !user) {
        throw error || new Error("An error occurred. Please try again.");
      }

      setErrors("");
      setMessage("Signed up successfully. Please check your email to verify.");
      setTimeout((): void => {
        router.push("/auth/signin");
      }, 3000);
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

          {pageErrors ? (
            <p className={"alert alert-danger py-4 rounded-lg mb-4"}>
              {pageErrors}
            </p>
          ) : null}

          {message ? (
            <p className={"alert alert-success py-4 rounded-lg mb-4"}>
              {message}
            </p>
          ) : null}

          <form
            className="border-t border-gray-700 mt-6"
            onSubmit={handleSubmit(handleSignup)}
          >
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`input-control ${
                  errors.firstName?.type && "input-control--errors"
                }`}
              >
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  placeholder="First name"
                  {...register("firstName")}
                />
                {errors.firstName?.type && (
                  <p className="input-feedback">{errors.firstName?.message}</p>
                )}
              </div>
              <div
                className={`input-control ${
                  errors.lastName?.type && "input-control--errors"
                }`}
              >
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  placeholder="Last name"
                  {...register("lastName")}
                />
                {errors.lastName?.type && (
                  <p className="input-feedback">{errors.lastName?.message}</p>
                )}
              </div>
            </div>

            <div
              className={`input-control ${
                errors.email?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                {...register("email")}
              />
              {errors.email?.type && (
                <p className="input-feedback">{errors.email?.message}</p>
              )}
            </div>

            <div
              className={`input-control ${
                errors.password?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password?.type && (
                <p className="input-feedback">{errors.password?.message}</p>
              )}
            </div>

            <div
              className={`input-control ${
                errors.passwordConfirmation?.type && "input-control--errors"
              }`}
            >
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                {...register("passwordConfirmation")}
              />
              {errors.passwordConfirmation?.type && (
                <p className="input-feedback">
                  {errors.passwordConfirmation?.message}
                </p>
              )}
            </div>

            <div
              className={`input-control input-control--checkbox ${
                errors.acceptTermService?.type && "input-control--errors"
              }`}
            >
              <input
                id="acceptTermService"
                type="checkbox"
                {...register("acceptTermService")}
              />

              <label htmlFor="acceptTermService">
                I agree to the Term of Service and Privacy Statement.
              </label>
            </div>

            <div className="flex items-center mt-4">
              <button
                className={`btn btn-primary ${loading ? "is-loading" : ""}`}
                type="submit"
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
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
