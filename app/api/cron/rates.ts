import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>,
) {
  if (request.method === "POST") {
    response.status(405);
    return;
  }

  const authHeader = request.headers?.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401);
  }

  response.status(200).json({ message: "Hello from Next.js!" });
}
