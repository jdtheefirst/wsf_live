import {
  Controller,
  InviteToStageParams,
  getSessionFromReq,
} from "@/lib/controller";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

// TODO: validate request with Zod

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const controller = new Controller();

  try {
    const session = getSessionFromReq(req);
    const reqBody = await req.json();
    await controller.inviteToStage(session, reqBody as InviteToStageParams);

    return Response.json({});
  } catch (err) {
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 });
    }

    return new Response(null, { status: 500 });
  }
}
