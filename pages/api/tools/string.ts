import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { dom, type } = req.body;

    if (!dom || !type)
      return res.status(404).json({
        message: "DOM / Type Not found",
      });

    if (type === "remove-classes") {
      const vDom = new JSDOM(decodeURIComponent(dom));
      if (!vDom || !vDom.window || !vDom.window.document) {
        return res.status(404).json({
          message: "DOM Not found",
        });
      }
      vDom.window.document
        .querySelectorAll("*")
        .forEach((el) => el.removeAttribute("class"));
      return res.status(200).json({
        data: vDom.window.document.body?.innerHTML.trim(),
      });
    }

    return res.status(404).json({
      message: "Type not found.",
    });
  }
}
