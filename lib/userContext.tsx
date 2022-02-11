import { AuthSession, SupabaseClient, User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

export type UserContextType = {
  session: AuthSession | null;
  user: User | null;
  signOut: () => void;
};

const UserContext = createContext<UserContextType>({
  session: null,
  user: null,
  signOut: () => {},
});

export const UserContextProvider = (props: any) => {
  const supabaseClient: SupabaseClient = props.supabaseClient;
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabaseClient.auth.session();
    setSession(session);
    setUser(session?.user || null);

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event: any, session: AuthSession | null) => {
        setSession(session);
        setUser(session?.user || null);

        if (_event === "PASSWORD_RECOVERY") {
          router.push("/auth/recover-password");
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    session,
    user,
    signOut: () => {
      supabaseClient.auth.signOut();
    },
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider.");
  }

  return context;
};
