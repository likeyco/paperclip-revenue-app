import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type OutputFormat =
  | "twitter_thread"
  | "linkedin_post"
  | "email_newsletter"
  | "instagram_caption";

const FORMAT_INSTRUCTIONS: Record<OutputFormat, string> = {
  twitter_thread:
    "Write a Twitter/X thread (3-7 tweets). Each tweet under 280 characters. Start with a hook. Use numbered format (1/, 2/, etc). End with a CTA or takeaway.",
  linkedin_post:
    "Write a professional LinkedIn post. Open with a strong hook line. Use short paragraphs and line breaks for readability. Include relevant insights. End with a question or CTA. Keep under 3000 characters.",
  email_newsletter:
    "Write an email newsletter snippet. Include a compelling subject line, a brief intro, key points as bullet points, and a clear CTA. Professional but conversational tone.",
  instagram_caption:
    "Write an Instagram caption. Start with a hook, tell a story or share value, use line breaks for readability, end with a CTA, and suggest 5-10 relevant hashtags at the end. Keep under 2200 characters.",
};

const FORMAT_LABELS: Record<OutputFormat, string> = {
  twitter_thread: "Twitter/X Thread",
  linkedin_post: "LinkedIn Post",
  email_newsletter: "Email Newsletter",
  instagram_caption: "Instagram Caption",
};

export async function repurposeContent(
  content: string,
  formats: OutputFormat[]
): Promise<Record<OutputFormat, string>> {
  const formatInstructions = formats
    .map(
      (f) =>
        `## ${FORMAT_LABELS[f]}\n${FORMAT_INSTRUCTIONS[f]}`
    )
    .join("\n\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are an expert content repurposer. Take the following content and repurpose it into the requested formats. Each format should be tailored for its platform while preserving the core message.

<content>
${content}
</content>

Please create the following formats. Separate each with "---FORMAT_SEPARATOR---" and prefix each with the format key in brackets like [twitter_thread]:

${formatInstructions}

Output each format prefixed with its key in brackets, separated by ---FORMAT_SEPARATOR---. Example:
[twitter_thread]
(content here)
---FORMAT_SEPARATOR---
[linkedin_post]
(content here)`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const results: Record<string, string> = {};
  const sections = responseText.split("---FORMAT_SEPARATOR---");

  for (const section of sections) {
    const trimmed = section.trim();
    for (const format of formats) {
      const prefix = `[${format}]`;
      if (trimmed.startsWith(prefix)) {
        results[format] = trimmed.slice(prefix.length).trim();
      }
    }
  }

  // Fallback: if parsing failed, put entire response in first format
  if (Object.keys(results).length === 0 && formats.length > 0) {
    results[formats[0]] = responseText;
  }

  return results as Record<OutputFormat, string>;
}
