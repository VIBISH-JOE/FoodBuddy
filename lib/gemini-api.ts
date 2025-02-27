import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface GeminiDetectedFood {
  name: string;
  confidence: number;
  category: string;
  expiryDate?: string;
  nutritionalValues: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    vitamins: string[];
  };
}

const FOOD_ANALYSIS_PROMPT = `Analyze this image and provide detailed information about any food items you see. For each item:
1. Identify the food name and category (produce, dairy, meat, etc.)
2. Estimate its typical expiry timeframe from today
3. Provide detailed nutritional information including:
   - Calories (per 100g)
   - Protein content
   - Carbohydrates
   - Fats
   - Key vitamins and minerals

Format the response as a JSON array with each item having the following structure:
{
  "name": "food name",
  "category": "food category",
  "expiryDate": "estimated expiry date",
  "nutritionalValues": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fats": number,
    "vitamins": ["vitamin list"]
  }
}`;

export async function analyzeImageWithGemini(imageData: string): Promise<GeminiDetectedFood[]> {
  try {
    // Remove data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    // Create model and chat
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Prepare the image data
    const imageBytes = Buffer.from(base64Image, 'base64');
    
    // Generate content
    const result = await model.generateContent([
      FOOD_ANALYSIS_PROMPT,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBytes.toString('base64')
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      const parsedResults = JSON.parse(text);
      return parsedResults.map((item: any) => ({
        ...item,
        confidence: 0.9 // Gemini doesn't provide confidence scores, using default high value
      }));
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    return [];
  }
} 