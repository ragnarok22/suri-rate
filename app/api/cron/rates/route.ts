import { saveRates } from "@/utils/data";
import { getCurrentRates } from "@/utils/places";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const rates = await getCurrentRates();
  await saveRates(rates);

  return Response.json({ updated: true });
}
