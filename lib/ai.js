import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';

// Update model names here to change them globally across all API routes.
// Three tiers: faster (cheap/quick tasks), real (standard generation), deeper (complex reasoning)

export const models = {
  faster: groq('llama-3.3-70b-versatile'),       // fast, cheap — naming, tagging, simple lists
  real: google('gemini-3.1-flash-lite'),          // standard work — most generation tasks
  deeper: google('gemini-3.5-pro'),               // heavier reasoning — complex or long-form tasks
};
