import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface GeminiDetectedFood {
  name: string;
  confidence: number;
  category: string;
  expiryDate?: string;
  shelfLife?: number;
  nutritionalValues: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    vitamins: string[];
  };
}

const FOOD_ANALYSIS_PROMPT = `You are a specialized food recognition system. Analyze the provided image and identify food items with their details.

For each food item visible in the image:

1. Name and Category:
   - Provide the specific name of the food item
   - Categorize it (produce, dairy, meat, grains, snacks, beverages, etc.)

2. Shelf Life and Expiry:
   - Provide the typical shelf life in days for this food item
   - Based on the shelf life, calculate an expiry date from today
   - Format as YYYY-MM-DD

3. Nutritional Information (per 100g):
   - Calories (kcal)
   - Protein (g)
   - Carbohydrates (g)
   - Fats (g)
   - List key vitamins and minerals present

Format your response as a JSON array. Example:
[{
  "name": "Apple",
  "category": "produce",
  "shelfLife": 14,
  "expiryDate": "2024-03-20",
  "nutritionalValues": {
    "calories": 52,
    "protein": 0.3,
    "carbs": 14,
    "fats": 0.2,
    "vitamins": ["Vitamin C", "Potassium"]
  }
}]

Be precise with measurements and ensure all numeric values are numbers, not strings.`;

export async function analyzeImageWithGemini(imageData: string): Promise<GeminiDetectedFood[]> {
  try {
    // Remove data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    // Create model and chat
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Generate content
    const result = await model.generateContent([
      FOOD_ANALYSIS_PROMPT,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      // Find the JSON array in the response using string indices
      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error('No JSON array found in response');
      }
      
      const jsonText = text.substring(startIndex, endIndex + 1);
      const parsedResults = JSON.parse(jsonText);
      
      // Validate and clean up the results
      const detectedItems = parsedResults.map((item: any) => {
        // If no expiry date but shelf life exists, calculate expiry date
        let expiryDate = item.expiryDate;
        const shelfLife = Number(item.shelfLife) || null;
        
        if (!expiryDate && shelfLife) {
          const date = new Date();
          date.setDate(date.getDate() + shelfLife);
          expiryDate = date.toISOString().split('T')[0];
        }

        const foodItem = {
          name: item.name || 'Unknown Item',
          category: item.category || 'other',
          confidence: 0.9, // Gemini doesn't provide confidence scores
          expiryDate: expiryDate || null,
          shelfLife: shelfLife,
          nutritionalValues: {
            calories: Number(item.nutritionalValues?.calories) || 0,
            protein: Number(item.nutritionalValues?.protein) || 0,
            carbs: Number(item.nutritionalValues?.carbs) || 0,
            fats: Number(item.nutritionalValues?.fats) || 0,
            vitamins: Array.isArray(item.nutritionalValues?.vitamins) ? item.nutritionalValues.vitamins : []
          }
        };

        // Save to MongoDB
        fetch('/api/foods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(foodItem)
        }).catch(err => console.error('Error saving to database:', err));

        return foodItem;
      });

      return detectedItems;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    return [];
  }
} 