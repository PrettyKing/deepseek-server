import { ApolloServer } from "@apollo/server";
import { Router } from "itty-router";
import { typeDefs, resolvers } from "./schema";

const router = Router();
const server = new ApolloServer({ typeDefs, resolvers });
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

router.post("/chat", async (request, env) => {
  try {
    const { query, variables } = await request.json();
    const result = await server.executeOperation(
      { query, variables },
      { contextValue: { env } }
    );
    return new Response(JSON.stringify(result.body.singleResult), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
});

router.options("/chat", () => new Response(null, { headers }));
router.all("*", () => new Response("Not Found", { status: 404 }));

export default { fetch: router.handle };
