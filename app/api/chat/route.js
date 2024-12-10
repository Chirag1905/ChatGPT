import axios from "axios";

export async function POST(req) {
  console.log("API Hit"); // Log when the API is called

  try {
    // Parse the request body to get the prompt
    const body = await req.json();
    const { prompt } = body;
    console.log("Received Prompt:", prompt); // Log the received prompt

    if (!prompt) {
      console.log("Error: Prompt is required"); // Log missing prompt
      return new Response(
        JSON.stringify({ message: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Sending request to OpenAI API..."); // Log before making the API request
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // Change the model if needed
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OpenAI API Response:", response.data.choices[0]?.message?.content); // Log the response from OpenAI
    return new Response(JSON.stringify(response.data.choices[0]?.message?.content), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "Error calling OpenAI API:",
      error.response?.data || error.message
    ); // Log the error details
    return new Response(
      JSON.stringify({
        message: error.response?.data || error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}