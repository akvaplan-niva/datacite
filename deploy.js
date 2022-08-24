import { serve } from "https://deno.land/std@0.152.0/http/server.ts";

async function handler(request) {
  const { pathname } = new URL(request.url);
  const deno = Object.keys(Deno);
  return Response.json({ path: pathname, deno })
}

serve(handler);
