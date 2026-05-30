import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "moderator") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const client = await clerkClient();

  const target = await client.users.getUser(id);
  if (target.publicMetadata?.role === "moderator") {
    return Response.json({ error: "No podés desbanear a otro moderador" }, { status: 403 });
  }

  await client.users.unbanUser(id);

  return Response.json({ ok: true });
}
