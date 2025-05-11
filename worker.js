import { execute, parse, Source } from "graphql";
import { schema, resolvers } from "./schema";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers });
      }

      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers });
      }
      const body = await request.json();
      const query = body.query;
      const variables = body.variables || {};

      const result = await execute({
        schema,
        document: parse(new Source(query)),
        variableValues: variables,
        rootValue: resolvers(env),
      });

      return new Response(JSON.stringify(result), {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response("Internal Server Error: " + error.message, {
        status: 500,
      });
    }
  },
};
