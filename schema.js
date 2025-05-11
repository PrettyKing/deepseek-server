import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    askDeepSeek(prompt: String!): String!
  }
`);

export const resolvers = {
  Query: {
    messages: () => [],
  },
  Mutation: {
    sendMessage: async (_, { content }, context) => {
      const apiKey = context.env["DEEPSEEK_API_KEY"];
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content }],
            model: "deepseek-chat",
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );
      if (!response.ok) {
        const errText = await response.text();
        throw new Error("DeepSeek API 调用失败: " + errText);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        role: "assistant",
      };
    },
  },
};
