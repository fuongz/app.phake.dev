import { NextApiRequest, NextApiResponse } from 'next'
import * as bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!req.query.string || !req.query.rounds) {
      return res.status(404).json({
        message: 'Missing query params',
      })
    }

    const rounds = parseInt(req.query.rounds as string)
    const string = req.query.string as string

    const salt = await bcrypt.genSalt(rounds && rounds > 0 && rounds < 10 ? rounds : 10)
    const hash = await bcrypt.hash(string, salt)

    return res.status(200).json({
      data: hash,
    })
  }
}
