
import { GoogleGenAI, Type } from "@google/genai";
import { Category, UrgencyLevel, UserRole } from "../types";

// Initialize Gemini Client
// NOTE: In a real production app, ensure this key is not exposed to the client if possible, 
// or use proxy/limitations. For this demo, we use the env var directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Analyzes a raw text request from a user and structures it into JSON.
 */
export const analyzeRequest = async (text: string): Promise<{
  title: string;
  description: string;
  category: string;
  urgency: number;
  location: string;
} | null> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze this social aid request: "${text}". Extract the item title, a polite description, the category (Food, Clothes, Baby, Hygiene, Other), urgency level (1-5 where 5 is life-threatening), and a vague location (city/area).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: Object.values(Category) },
            urgency: { type: Type.INTEGER },
            location: { type: Type.STRING },
          },
          required: ["title", "description", "category", "urgency", "location"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
};

/**
 * Generates a community impact summary based on current stats.
 */
export const getCommunityInsights = async (
  activeNeeds: number,
  matches: number,
  recentCategoryTrend: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a 2-sentence inspirational "Community Impact Summary" for a dashboard. 
      Data: ${activeNeeds} active needs, ${matches} successful matches this week. 
      Trend: High demand in ${recentCategoryTrend}. 
      Tone: Professional, hopeful, data-driven.`,
    });

    return response.text || "Community activity is stable. Matches are increasing steadily as more givers join the platform.";
  } catch (error) {
    console.error("Gemini Summary Failed:", error);
    return "Unable to generate real-time insights at this moment.";
  }
};

/**
 * Generates a detailed "Community Pulse" story.
 */
export const getCommunityPulse = async (): Promise<{
  story: string;
  prediction: string;
  hotspots: string[];
}> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a "Community Pulse" analysis for a social aid platform in Toronto.
      Include:
      1. A "story" paragraph (approx 40 words) summarizing recent needs vs offers (mention winter clothing surge).
      2. A "prediction" sentence for the next 7 days based on weather (cold).
      3. A list of 3 "hotspot" areas (neighborhoods).
      
      Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                story: { type: Type.STRING },
                prediction: { type: Type.STRING },
                hotspots: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No response");
  } catch (error) {
    return {
        story: "Community activity is high this week with a noticeable increase in requests for winter essentials across the downtown core.",
        prediction: "Expect a 15% increase in demand for warm clothing as temperatures drop.",
        hotspots: ["Scarborough", "North York", "Downtown"]
    };
  }
};

/**
 * Generates personalized dashboard tips.
 */
export const getDashboardTips = async (role: UserRole): Promise<string[]> => {
    try {
        const prompt = role === 'NEEDER' 
           ? "Give 3 short, punchy tips for someone requesting help on a donation platform."
           : "Give 3 short, punchy tips for someone donating items on a social good platform.";
        
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tips: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        
        if (response.text) {
            return JSON.parse(response.text).tips;
        }
        return ["Check back often.", "Be specific in your requests.", "Update your location."];
    } catch (e) {
        return ["Activity peaks at 6pm.", "Weekends see more donations.", "Keep notifications on."];
    }
}

/**
 * Generates personalized recommendations for the user profile.
 */
export const getProfileInsights = async (
  role: UserRole,
  location: string,
  preferences: string[] = []
): Promise<string> => {
  try {
    const prompt = role === 'NEEDER' 
      ? `I am a "Needer" in ${location} looking for ${preferences.join(', ')}. Give me 2 short, helpful tips or updates about local aid availability.`
      : `I am a "Giver" in ${location} interested in donating ${preferences.join(', ')}. Give me 2 short, motivating tips on what is most needed nearby right now.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Welcome to the community! Check the marketplace to see the latest activity near you.";
  } catch (error) {
    return "Explore the marketplace to find new ways to connect with your neighbors.";
  }
};

/**
 * Optimizes a user's raw description to be more polite and clear.
 */
export const optimizeDescription = async (text: string, type: 'NEED' | 'OFFER'): Promise<string> => {
  try {
    const prompt = type === 'NEED' 
      ? `Rewrite this request to be polite, clear, and empathetic (approx 2 sentences): "${text}"`
      : `Rewrite this donation offer to be friendly, clear, and inviting (approx 2 sentences): "${text}"`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (e) {
    return text;
  }
};
