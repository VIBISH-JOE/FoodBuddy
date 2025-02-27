"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Mic, ArrowLeft, Check } from "lucide-react"
import { analyzeImageWithGemini, GeminiDetectedFood } from '@/lib/gemini-api'
import { useFoodInventory } from "@/context/FoodInventoryContext"

interface DetectedFoodItem extends GeminiDetectedFood {
  selected: boolean;
}

type NutritionInfo = {
  protein: number;
  iron: number;
  vitaminC: number;
  calories: number;
};

export default function ScanPage() {
  const [scanComplete, setScanComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("camera")
  const [isScanning, setIsScanning] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [detectedItems, setDetectedItems] = useState<DetectedFoodItem[]>([])
  const [textInput, setTextInput] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const { addItem } = useFoodInventory()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      processImage(imageData);
    }
  };

  const processImage = async (imageData: string) => {
    setIsScanning(true);
    try {
      const detected = await analyzeImageWithGemini(imageData);
      const itemsWithSelection = detected.map(item => ({
        ...item,
        selected: true
      }));
      setDetectedItems(itemsWithSelection);
      setScanComplete(true);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleItemSelection = (index: number) => {
    setDetectedItems(items => 
      items.map((item, i) => 
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    }
    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab]);

  const handleScan = () => {
    captureImage();
  }

  const handleVoiceInput = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      setTranscript("Add 2 milk packets, expiry in 5 days")
    }, 3000)
  }

  const resetScan = () => {
    setScanComplete(false)
    setTranscript("")
    setTextInput("")
  }

  const handleAddToInventory = async () => {
    const selectedItems = detectedItems.filter(item => item.selected);
    
    for (const item of selectedItems) {
      try {
        // Convert Gemini nutrition values to our format
        const nutrition: NutritionInfo = {
          protein: item.nutritionalValues.protein,
          iron: 0, // Not provided by Gemini, using default
          vitaminC: 0, // Not provided by Gemini, using default
          calories: item.nutritionalValues.calories
        };

        const expiryDate = item.expiryDate ? new Date(item.expiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days if not provided
        
        // First, add to MongoDB
        const response = await fetch('/api/foods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: item.name,
            category: item.category,
            expiryDate,
            nutrition,
            quantity: 1,
            servingSize: 100, // default serving size in grams
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add item to database');
        }

        // Then update local state through context
        addItem({
          id: crypto.randomUUID(),
          name: item.name,
          quantity: 1,
          expiryDate,
          servingSize: 100,
          nutrition,
        });
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
    router.push("/inventory");
  };

  const handleTextInput = () => {
    const items = textInput.split(',').map(item => item.trim());
    items.forEach(item => {
      addItem({
        id: crypto.randomUUID(),
        name: item,
        quantity: 1,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days
        servingSize: 100,
        nutrition: {
          protein: 0,
          iron: 0,
          vitaminC: 0,
          calories: 0
        }
      });
    });
    router.push("/inventory");
  };

  const renderCameraView = () => (
    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
      {isScanning ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Point camera at food items</p>
          </div>
        </>
      )}
    </div>
  );

  const renderDetectedItems = () => (
    <div className="space-y-3">
      {detectedItems.length === 0 ? (
        <p className="text-center text-gray-500">No food items detected. Try scanning again.</p>
      ) : (
        detectedItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
              item.selected ? 'bg-primary/5 border-primary/30' : 'bg-white'
            }`}
            onClick={() => toggleItemSelection(index)}
          >
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Category: {item.category}
              </p>
              {item.expiryDate && (
                <p className="text-sm text-gray-500">
                  Expires: {item.expiryDate}
                </p>
              )}
              <div className="text-xs text-gray-400 mt-1">
                <p>Calories: {item.nutritionalValues.calories}/100g</p>
                <p>Protein: {item.nutritionalValues.protein}g</p>
                <p>Carbs: {item.nutritionalValues.carbs}g</p>
                <p>Fats: {item.nutritionalValues.fats}g</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => toggleItemSelection(index)}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">Add Food Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="camera" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="camera">Camera Scan</TabsTrigger>
              <TabsTrigger value="voice">Voice Input</TabsTrigger>
              <TabsTrigger value="text">Text Input</TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="mt-4">
              {!scanComplete ? (
                <div className="space-y-4">
                  {renderCameraView()}
                  <Button className="w-full" onClick={handleScan} disabled={isScanning}>
                    {isScanning ? "Scanning..." : "Start Scanning"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700">
                      {detectedItems.length > 0 
                        ? `${detectedItems.length} items detected!`
                        : 'Scan complete - no items detected'}
                    </span>
                  </div>

                  {renderDetectedItems()}

                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={resetScan}>
                      Scan Again
                    </Button>
                    <Button 
                      className="w-full"
                      onClick={handleAddToInventory}
                      disabled={!detectedItems.some(item => item.selected)}
                    >
                      Add to Inventory
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="voice" className="mt-4">
              <div className="space-y-4">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  {isListening ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                            <Mic className="h-4 w-4 text-primary animate-pulse" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Listening...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Mic className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Tap to speak</p>
                    </div>
                  )}
                </div>

                {transcript && (
                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <p className="text-sm font-medium">Transcript:</p>
                    <p className="text-sm">{transcript}</p>
                  </div>
                )}

                {transcript ? (
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={resetScan}>
                      Try Again
                    </Button>
                    <Button className="w-full" onClick={handleAddToInventory}>
                      Save to Inventory
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleVoiceInput} disabled={isListening}>
                    {isListening ? "Listening..." : "Start Speaking"}
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-4">
              <div className="space-y-4">
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={4}
                  placeholder="Enter food items separated by commas"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={resetScan}>
                    Clear
                  </Button>
                  <Button className="w-full" onClick={handleTextInput} disabled={!textInput.trim()}>
                    Add to Inventory
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-gray-500">
          <p className="text-center">
            {activeTab === "camera"
              ? "Tip: Make sure items are clearly visible and barcodes are facing the camera"
              : activeTab === "voice"
              ? "Tip: Speak clearly and mention the quantity and expiry date of the items"
              : "Tip: Separate multiple items with commas"}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}