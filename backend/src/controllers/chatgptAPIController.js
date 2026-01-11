import OpenAI from "openai";

let openai;
const getOpenAIClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

let requestCount = 0;
const MAX_REQUESTS = 250;

export const getCourseRecommendations = async (req, res) => {
  try {
    const { prompt, availableCourses } = req.body;
    if (!prompt || !prompt.trim()) return res.status(400).json({ message: "Prompt required" });

    if (requestCount >= MAX_REQUESTS) return res.status(429).json({ message: "API request limit reached" });

    requestCount++;
    const remainingRequests = MAX_REQUESTS - requestCount;

    console.log("Request Count:", requestCount);
    console.log("Remaining Requests:", remainingRequests);
    const openaiClient = getOpenAIClient();

    const courseList = availableCourses?.map(c => `- ${c.title}: ${c.description}`).join("\n") || "No courses available";

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are a course advisor.\nAvailable courses:\n${courseList}` },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    res.status(200).json({
      recommendation: completion.choices[0]?.message?.content || "",
      requestCount,
      remainingRequests: MAX_REQUESTS - requestCount,
    });


  } catch (error) {
    console.error("ChatGPT API Error:", error);

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Failed to get recommendations",
        error: error.message,
        requestCount,
        remainingRequests: MAX_REQUESTS - requestCount
      });
    }
  }
};

export const getRequestCount = async (req, res) => {
  res.status(200).json({ requestCount, maxRequests: MAX_REQUESTS, remainingRequests: MAX_REQUESTS - requestCount });
};
