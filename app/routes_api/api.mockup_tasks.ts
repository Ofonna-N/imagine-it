import {
  fetchPrintfulMockupTask,
  createPrintfulMockupTask,
} from "~/services/printful/printful_api";

/**
 * Resource route for Printful mockup-tasks API proxy.
 * Supports:
 *   - POST /api/mockup-tasks: Create a new mockup task
 *   - GET /api/mockup-tasks?id=...: Poll for a mockup task result
 */

export async function loader({ request }: { request: Request }) {
  // GET /api/mockup-tasks?id=...
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const data = await fetchPrintfulMockupTask(id);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function action({ request }: { request: Request }) {
  // POST /api/mockup-tasks
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const body = await request.json();
    const data = await createPrintfulMockupTask(body);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
