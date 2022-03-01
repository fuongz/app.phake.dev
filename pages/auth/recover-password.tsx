import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Form validation
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabaseClient } from "@/packages/auth";

const recoverPasswordSchema = yup.object({
  newPassword: yup.string().required(),
  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Confirm password must match")
    .required(),
});

const RecoverPasswordPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageErrors, setErrors] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(recoverPasswordSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.update({
        password: data.newPassword,
      });

      if (error) {
        throw error;
      }

      setErrors("");
      setMessage("Password updated successfully. Please log in.");
      setTimeout(async () => {
        await supabaseClient.auth.signOut();
        router.push("/auth/signin");
      }, 2000);
    } catch (err: any) {
      setErrors(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"w-80 mx-auto rounded pt-20"}>
      <h3 className="font-semibold text-xl block mb-4">Set new password</h3>

      {pageErrors ? (
        <p className={"alert alert-danger py-4 rounded"}>{pageErrors}</p>
      ) : null}

      {message ? (
        <p className={"alert alert-success py-4 rounded"}>{message}</p>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`input-control ${
            errors.newPassword?.type && "input-control--errors"
          }`}
        >
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            placeholder="New password"
            {...register("newPassword")}
          />
        </div>

        <div
          className={`input-control ${
            errors.newPasswordConfirmation?.type && "input-control--errors"
          }`}
        >
          <label htmlFor="passwordConfirmation">New password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="New password confirmation"
            {...register("newPasswordConfirmation")}
          />
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
                Updating...
              </>
            ) : (
              "Update your password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecoverPasswordPage;
