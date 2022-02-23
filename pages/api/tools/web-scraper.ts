import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (
      !req.body.url ||
      !req.body.title ||
      !req.body.summary ||
      !req.body.content ||
      !req.body.thumbnail
    ) {
      return res.status(403).json({
        message: "Missing required parameters",
      });
    }

    const apiRes = await fetch(req.body.url?.toString()).then((res) =>
      res.text()
    );

    const vDom = new JSDOM(apiRes);

    const responseData: any = {
      title: null,
      summary: null,
      content: null,
      thumbnail: null,
    };

    responseData.title = vDom.window.document
      .querySelector(decodeURIComponent(req.body.title)?.toString())
      ?.innerHTML?.trim();

    responseData.summary = vDom.window.document
      .querySelector(decodeURIComponent(req.body.summary)?.toString())
      ?.innerHTML?.trim();

    responseData.content = vDom.window.document
      .querySelector(decodeURIComponent(req.body.content)?.toString())
      ?.innerHTML?.trim();

    responseData.thumbnail = vDom.window.document
      .querySelector(decodeURIComponent(req.body.thumbnail)?.toString())
      ?.getAttribute("src")
      ?.trim();

    return res.status(200).json({
      data: responseData,
    });
  }
}
