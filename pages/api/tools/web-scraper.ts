import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!req.body.url || !req.body.selectors) {
      return res.status(403).json({
        message: "Missing required parameters",
      });
    }

    const apiRes = await fetch(req.body.url?.toString()).then((res) =>
      res.text()
    );

    const vDom = new JSDOM(apiRes);

    const responseData = req.body.selectors.map(
      (selector: any, index: number) => {
        let element: any = vDom.window.document.querySelector(
          decodeURIComponent(selector.value)?.toString()
        );

        if (selector.type === "multiple-images") {
          element = vDom.window.document.querySelectorAll(
            `${decodeURIComponent(selector.value)?.toString()} img`
          );
        }
        return {
          key: `selector-${index}`,
          type: selector.type,
          value:
            selector.type === "multiple-images"
              ? element.length > 0
                ? [...element]?.map((e: any) => e?.getAttribute("src")?.trim())
                : []
              : selector.type === "image"
              ? element?.getAttribute("src")?.trim()
              : element?.innerHTML?.trim(),
        };
      }
    );

    return res.status(200).json({
      data: responseData,
    });
  }
}
