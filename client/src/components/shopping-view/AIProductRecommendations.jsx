
"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/shopping-view/product-card"
import { useNavigate } from "react-router-dom"
import { Loader2, RefreshCw, Sparkles, TrendingUp, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function AIProductRecommendations({ currentProduct, userPreferences = {} }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recommendationType, setRecommendationType] = useState("similar")
  const [lastUpdated, setLastUpdated] = useState(null)
  
  const navigate = useNavigate()
  const { toast } = useToast()

  const recommendationTypes = [
    { id: "similar", label: "Similar Items", icon: TrendingUp },
    { id: "trending", label: "Trending Now", icon: Sparkles },
    { id: "personalized", label: "For You", icon: Heart }
  ]

  useEffect(() => {
    if (!currentProduct?._id) return
    fetchRecommendations()
  }, [currentProduct, recommendationType])

  const fetchRecommendations = async () => {
    if (!currentProduct) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            _id: currentProduct._id,
            title: currentProduct.title,
            category: currentProduct.category,
            price: currentProduct.price,
            salePrice: currentProduct.salePrice,
            description: currentProduct.description || "",
            brand: currentProduct.brand
          },
          action: "recommend",
          type: recommendationType,
          userPreferences
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`)
      }

      const data = await response.json()
      setRecommendations(data.recommendations || [])
      setLastUpdated(new Date())
      
      if (data.recommendations?.length === 0) {
        toast({
          title: "No recommendations found",
          description: "Try browsing our categories for similar products",
          variant: "default"
        })
      }
    } catch (error) {
      console.error("AI Recommendations error:", error)
      setError(error.message)
      
      // Fallback to mock data
      setRecommendations(getMockRecommendations())
      
      toast({
        title: "Using fallback recommendations",
        description: "AI service unavailable, showing similar products",
        variant: "default"
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockRecommendations = () => [
    {
      _id: "mock1",
      title: `Premium ${currentProduct?.category || 'Fashion'} Collection`,
      category: currentProduct?.category || 'fashion',
      price: 149,
      salePrice: 119,
      image: "/placeholder-image.jpg",
      rating: 4.5,
      description: "High-quality alternative with premium features",
      reason: "Similar style with enhanced durability",
      totalStock: 15
    },
    {
      _id: "mock2",
      title: `Essential ${currentProduct?.category || 'Fashion'} Basic`,
      category: currentProduct?.category || 'fashion', 
      price: 89,
      salePrice: 69,
      image: "/placeholder-image.jpg",
      rating: 4.2,
      description: "Budget-friendly option with great value",
      reason: "More affordable with similar functionality",
      totalStock: 25
    },
    {
      _id: "mock3",
      title: `Designer ${currentProduct?.category || 'Fashion'} Limited`,
      category: currentProduct?.category || 'fashion',
      price: 299,
      salePrice: 249,
      image: "/placeholder-image.jpg",
      rating: 4.8,
      description: "Exclusive design with premium materials", 
      reason: "Upgraded version with luxury features",
      totalStock: 8
    }
  ]

  const handleRecommendationClick = (product) => {
    // Track recommendation click for future improvements
    console.log("Recommendation clicked:", product.title)
    navigate(`/shop/product/${product._id}`)
  }

  const handleAddToCart = (productId) => {
    // This would integrate with your cart system
    console.log("Add to cart clicked for:", productId)
    toast({
      title: "Added to cart!",
      description: "Product added successfully",
    })
  }

  if (loading && recommendations.length === 0) {
    return (
      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-gray-500">Analyzing products for you...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && recommendations.length === 0) {
    return (
      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Unable to load recommendations</p>
            <Button 
              variant="outline" 
              onClick={fetchRecommendations}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recommendations.length) return null

  return (
    <Card className="mt-10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            AI-Powered Recommendations
          </CardTitle>
          <div className="flex gap-2">
            {recommendationTypes.map(type => {
              const Icon = type.icon
              return (
                <Button
                  key={type.id}
                  variant={recommendationType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRecommendationType(type.id)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-3 h-3" />
                  {type.label}
                </Button>
              )
            })}
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((product, index) => (
            <div key={product._id || `ai-rec-${index}`} className="relative">
              <ProductCard
                product={product}
                onClick={() => handleRecommendationClick(product)}
                handleAddToCart={() => handleAddToCart(product._id)}
                className="h-full"
              />
              
              {product.reason && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 text-xs bg-blue-100 text-blue-800"
                >
                  AI: {product.reason}
                </Badge>
              )}
              
              {recommendationType === "trending" && (
                <Badge 
                  variant="secondary"
                  className="absolute top-2 right-2 text-xs bg-red-100 text-red-800"
                >
                  🔥 Trending
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchRecommendations}
            disabled={loading}
            className="text-xs"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
