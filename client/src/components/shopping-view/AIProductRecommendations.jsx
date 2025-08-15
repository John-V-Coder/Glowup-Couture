"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/shopping-view/product-card"
import { useNavigate } from "react-router-dom"
import { Loader2, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AIProductRecommendations({ currentProduct }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    if (currentProduct?._id) {
      loadRecommendations()
    }
  }, [currentProduct])

  const loadRecommendations = () => {
    setLoading(true)
    
    // Simulate loading time
    setTimeout(() => {
      setRecommendations(getMockRecommendations())
      setLoading(false)
    }, 1000)
  }

  const getMockRecommendations = () => {
    if (!currentProduct) return []

    return [
      {
        _id: "rec1",
        title: `Premium ${currentProduct.category || 'Product'} Collection`,
        category: currentProduct.category || 'general',
        price: Math.round((currentProduct.price || 100) * 1.2),
        salePrice: Math.round((currentProduct.price || 100) * 0.9),
        image: currentProduct.image || "/placeholder-image.jpg",
        rating: 4.5,
        description: "High-quality alternative with premium features",
        reason: "Similar style with enhanced durability",
        totalStock: 15
      },
      {
        _id: "rec2",
        title: `Essential ${currentProduct.category || 'Product'} Basic`,
        category: currentProduct.category || 'general',
        price: Math.round((currentProduct.price || 100) * 0.8),
        salePrice: Math.round((currentProduct.price || 100) * 0.6),
        image: currentProduct.image || "/placeholder-image.jpg",
        rating: 4.2,
        description: "Budget-friendly option with great value",
        reason: "More affordable with similar functionality",
        totalStock: 25
      },
      {
        _id: "rec3",
        title: `Designer ${currentProduct.category || 'Product'} Limited`,
        category: currentProduct.category || 'general',
        price: Math.round((currentProduct.price || 100) * 1.5),
        salePrice: Math.round((currentProduct.price || 100) * 1.3),
        image: currentProduct.image || "/placeholder-image.jpg",
        rating: 4.8,
        description: "Exclusive design with premium materials",
        reason: "Upgraded version with luxury features",
        totalStock: 8
      }
    ]
  }

  const handleRecommendationClick = (product) => {
    navigate(`/shop/product/${product._id}`)
  }

  const handleAddToCart = (productId) => {
    console.log("Add to cart:", productId)
    // Add your cart logic here
  }

  if (!currentProduct) return null

  if (loading) {
    return (
      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Recommended For You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-gray-500">Finding similar products...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          Recommended For You
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((product, index) => (
            <div key={product._id} className="relative">
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
                  {product.reason}
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadRecommendations}
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