import { supabase } from "./supabase";

export const fetchUser = async (username: string, _callback: any = null) => {
  try {
    const { body } = await supabase
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
