import { GetServerSideProps } from "next";
import { supabase } from "./supabase";

const enforceAuthenticated: (
  inner?: GetServerSideProps
) => GetServerSideProps = (inner) => {
  return async (context) => {
    const { req } = context;
    const { user, error } = await supabase.auth.api.getUserByCookie(req);

    if (error || !user) {
      return {
        props: {},
        redirect: {
          destination: "/auth/signin",
          permanent: false,
        },
      };
    }

    if (inner) {
      return inner(context);
    }

    return { props: {} };
  };
};

export default enforceAuthenticated;
