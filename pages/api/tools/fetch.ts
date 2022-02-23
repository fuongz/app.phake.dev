import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (!req.query.url)
      return res.status(404).json({
        message: "URL Not found",
      });

    const apiRes = await fetch(req.query.url?.toString()).then((res) =>
      res.text()
    );

    const vDom = new JSDOM(apiRes);
    let dataResponse: any = vDom.window.document.documentElement.innerHTML;

    if (req.query.selector) {
      dataResponse = vDom.window.document.querySelector(
        req.query.selector?.toString()
      )?.innerHTML;
    }

    return res.status(200).json({
      data: dataResponse.trim(),
    });
  }
}
