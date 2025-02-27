const VISION_API_KEY = process.env.NEXT_PUBLIC_VISION_API_KEY || '';
const VISION_API_ENDPOINT = process.env.NEXT_PUBLIC_VISION_API_ENDPOINT || '';

export interface DetectedFood {
  name: string;
  confidence: number;
  category?: string;
}

export async function detectFoodInImage(imageData: string): Promise<DetectedFood[]> {
  // Remove the "data:image/jpeg;base64," prefix if present
  const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');

  try {
    const response = await fetch(`${VISION_API_ENDPOINT}?key=${VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10
            },
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (data.responses?.[0]?.error) {
      console.error('Vision API error:', data.responses[0].error);
      return [];
    }

    // Combine object detection and label detection results
    const objects = data.responses[0].localizedObjectAnnotations || [];
    const labels = data.responses[0].labelAnnotations || [];
    
    const foodItems = new Set<string>();
    const results: DetectedFood[] = [];

    // Add objects that are likely food
    objects
      .filter((obj: any) => isFoodRelated(obj.name))
      .forEach((obj: any) => {
        if (!foodItems.has(obj.name)) {
          foodItems.add(obj.name);
          results.push({
            name: obj.name,
            confidence: obj.score,
            category: determineFoodCategory(obj.name)
          });
        }
      });

    // Add labels that are likely food
    labels
      .filter((label: any) => isFoodRelated(label.description))
      .forEach((label: any) => {
        if (!foodItems.has(label.description)) {
          foodItems.add(label.description);
          results.push({
            name: label.description,
            confidence: label.score,
            category: determineFoodCategory(label.description)
          });
        }
      });

    return results;
  } catch (error) {
    console.error('Error detecting food:', error);
    return [];
  }
}

function isFoodRelated(text: string): boolean {
  const foodKeywords = [
    'food', 'fruit', 'vegetable', 'meat', 'dairy', 
    'bread', 'beverage', 'drink', 'grocery', 'produce'
  ];
  return foodKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
}

function determineFoodCategory(foodName: string): string {
  // This is a simple mock implementation
  // You should expand this with proper food category mapping
  const categories = {
    meat: ['chicken', 'beef', 'pork', 'fish'],
    dairy: ['milk', 'cheese', 'yogurt'],
    produce: ['apple', 'banana', 'spinach', 'tomato'],
    pantry: ['bread', 'pasta', 'rice']
  };

  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => foodName.toLowerCase().includes(item))) {
      return category;
    }
  }

  return 'other';
}
