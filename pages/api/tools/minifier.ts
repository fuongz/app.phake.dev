import { NextApiRequest, NextApiResponse } from 'next'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body

    const minified = await postcss([autoprefixer(), cssnano()]).process(text)

    return res.status(200).json({
      data: minified.css,
    })
  }
}
