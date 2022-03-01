import { yupResolver } from "@hookform/resolvers/yup";
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  withAuthRequired,
} from "@supabase/supabase-auth-helpers/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Section from "@/components/common/section";
import * as yup from "yup";

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

const UserProfilePage: NextPage = ({ user, profile }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageErrors, setErrors] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleUpdateInformation = async (data: any) => {
    try {
      setLoading(true);

      const { error } = await supabaseClient.auth.update({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      if (error) {
        throw error || new Error("An error occurred. Please try again.");
      }

      setMessage("Updated successfully.");
      setErrors("");
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
        <title>Update Profile - phake.dev</title>
      </Head>

      <Section title="Update Information" classes={`max-w-md mx-auto`}>
        <form className="mt-6" onSubmit={handleSubmit(handleUpdateInformation)}>
          <div className={`input-control`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={user?.email ? user.email : ""}
              disabled
            />
          </div>

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
                value={user?.user_metadata?.firstName}
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
                value={user?.user_metadata?.lastName}
                {...register("lastName")}
              />
              {errors.lastName?.type && (
                <p className="input-feedback">{errors.lastName?.message}</p>
              )}
            </div>
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
                "Update profile"
              )}
            </button>
          </div>
        </form>
      </Section>
    </>
  );
};

export default UserProfilePage;
export const getServerSideProps = withAuthRequired({
  redirectTo: "/auth/signIn",
  async getServerSideProps(ctx): Promise<any> {
    const { user } = await getUser(ctx);
    if (user) {
      const { data } = await supabaseServerClient(ctx)
        .from("users")
        .select("*")
        .eq("username", user.email)
        .single();

      if (data)
        return {
          props: {
            profile: data,
          },
        };
    }
  },
});
