export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  console.log(authHeader);
  console.log(process.env.CRON_SECRET);
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  return Response.json({ success: true });
}
