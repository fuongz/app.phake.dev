import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

const RecoverPasswordPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.update({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setErrors("");
      setMessage("Password updated successfully. Please log in.");
      setTimeout(async () => {
        await supabase.auth.signOut();
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
    <div className={"max-w-sm mx-auto rounded pt-20"}>
      <h3 className="font-semibold text-xl block mb-4">Set new password</h3>

      {errors ? (
        <p className={"alert alert-danger py-4 rounded"}>{errors}</p>
      ) : null}

      {message ? (
        <p className={"alert alert-success py-4 rounded"}>{message}</p>
      ) : null}

      <div className={"input-control"}>
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
              Updating...
            </>
          ) : (
            "Update your password"
          )}
        </button>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
