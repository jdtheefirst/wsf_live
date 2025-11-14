// app/api/suggestions/route.ts
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      belt_level,
      program_slug,
      topic_title,
      topic_description,
      country_code,
      county_code,
    } = await request.json();

    // Validate required fields
    if (
      !belt_level ||
      !program_slug ||
      !topic_title ||
      !topic_description ||
      !country_code
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert suggestion into database
    const { data, error } = await supabase
      .from("live_suggestions")
      .insert({
        user_id: user.id,
        belt_level,
        program_slug,
        topic_title: topic_title.trim(),
        topic_description: topic_description.trim(),
        country_code,
        county_code,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting suggestion:", error);
      return NextResponse.json(
        { error: "Failed to save suggestion" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in suggestions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
