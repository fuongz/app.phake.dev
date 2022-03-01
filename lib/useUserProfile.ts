import { supabaseClient } from "@/packages/auth";

export const fetchUser = async (username: string, _callback: any = null) => {
  try {
    const { body } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", username)
      .single();

    if (_callback) _callback(body);

    return {
      error: null,
      data: body,
    };
  } catch (err: any) {
    return { error: err, data: null };
  }
};
