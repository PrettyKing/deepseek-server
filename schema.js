import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    askDeepSeek(prompt: String!): String!
  }
`);

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const resolvers = (env) => ({
  askDeepSeek: async ({ prompt }) => {
    console.log("Received prompt:", prompt); // Log the received prompt
    try {
      // DeepSeek API 请求
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`, // 替换为你的 DeepSeek API Key
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      const data = await response.json();
      // 检查账户余额错误
      if (data.error && data.error.message === "Insufficient Balance") {
        return "账户余额不足，请充值后再试。";
      }
      // 检查请求错误
      if (data.error) {
        return data.error.message;
      }
      // 返回 DeepSeek 的回答
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim();
      }
      // 如果没有找到答案，返回默认消息
      return "对不起，我无法回答这个问题。请稍后再试。";
    } catch (error) {
      throw new Error(`DeepSeek API error: ${error.message}`);
    }
  },
});
