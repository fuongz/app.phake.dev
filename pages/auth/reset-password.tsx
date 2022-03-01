import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUser } from "@/packages/auth";
import { supabaseClient } from "@/packages/auth";

const ResetPasswordPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const router = useRouter();
  const { user } = useUser();

  if (user) {
    router.push("/");
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.api.resetPasswordForEmail(
        email
      );

      if (error) {
        throw error;
      }

      setErrors("");
      setMessage("Please check your email for a reset link.");
    } catch (err: any) {
      setErrors(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"w-80 mx-auto rounded pt-20"}>
      <h3 className="font-semibold text-xl block mb-4">Forgot password</h3>

      {errors ? (
        <p className={"alert alert-danger py-4 rounded"}>{errors}</p>
      ) : null}

      {message ? (
        <p className={"alert alert-success py-4 rounded"}>{message}</p>
      ) : null}

      <div className={"input-control"}>
        <label htmlFor="email">Your email</label>
        <input
          id="email"
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
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
            handleSubmit();
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
            "Submit"
          )}
        </button>

        <Link href="/auth/signin">
          <a className="ml-auto link">Back to Signin</a>
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
