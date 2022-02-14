import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
