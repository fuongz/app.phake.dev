import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppLayout from "../components/layout";

// User Context
import { UserContextProvider } from "../lib/userContext";
import { supabase } from "../lib/supabase";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider supabaseClient={supabase}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </UserContextProvider>
  );
}

export default MyApp;
