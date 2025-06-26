interface HFResponse {
  choices: { message: { content: string } }[];
  error?: string;
}

export const DeepSeek = {
  generate: async (prompt: string, persona: 'product promoter' | 'enthusiast' = 'product promoter'): Promise<string> => {
    // Persona-specific system prompt
    const personaPrompt =
      persona === 'product promoter'
        ? `You are a world-class LinkedIn content strategist and SaaS product promoter.
Your posts are written for SaaS marketers and founders. You always:
- Start with a bold greeting  "Hey [your audience]! 🚀"
- Present a pain point or challenge SaaS companies face
- Introduce a SaaS product as the solution, highlighting unique features and benefits
- Use bullet points with relevant emojis to showcase product features or results
- End with a strong, actionable call-to-action (e.g., "Comment HOW below for a template!")
- Use hashtags relevant to SaaS and marketing
- Write in a persuasive, energetic, and professional tone
- Make the post highly engaging and conversion-focused
- Do NOT use ** or * for generating posts
- Do NOT use any Markdown formatting in your output.

Do NOT mention you are an AI or language model.`
        : `You are a passionate LinkedIn enthusiast who loves sharing insights and connecting with others.`;

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
              {
                role: "system",
                content: `${personaPrompt}

Your task is to generate engaging and professional yet friendly LinkedIn posts that:
- Hook the audience instantly
- Provide valuable insights in a friendly tone
- Encourage comments and interactions

Follow these strict rules:
1. NEVER repeat or paraphrase the user's prompt
2. ONLY output the final post (no notes, no explanation)
3. Follow this format exactly:
   - A short friendly greeting to the LinkedIn audience
   - A powerful hook question to spark curiosity
   - 3 bullet points with more emojis (each point should offer a tip, insight, or benefit)
   - Conclude with strong CTA phrases
   - A clear and friendly call-to-action for comments

Use a conversational and inspiring tone that sounds like a real human expert.`
              },
              {
                role: "user",
                content: `Create a LinkedIn post about: ${prompt}`
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const error: HFResponse = await response.json();
        throw new Error(error.error || "Generation failed");
      }

      const data: HFResponse = await response.json();
      const output = data.choices?.[0]?.message?.content || "No content generated";

      //console.log('RAW OUTPUT:', JSON.stringify(output));

      return output;
    } catch (error) {
      console.error("DeepSeek Error:", error);
      throw error;
    }
  }
};