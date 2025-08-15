"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/shopping-view/product-card"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function AIProductRecommendations({ currentProduct }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentProduct?._id) return

    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/ai-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: {
              title: currentProduct.title,
              category: currentProduct.category,
              description: currentProduct.description || "",
            }
          })
        })

        if (!response.ok) throw new Error("Failed to fetch recommendations")

        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (error) {
        console.error("AI Recommendations error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [currentProduct])

  if (loading) {
    return (
      <div className="mt-10 flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2 text-gray-500">Fetching AI recommendations...</span>
      </div>
    )
  }

  if (!recommendations.length) return null

  return (
    <div className="space-y-6 mt-10">
      <h2 className="text-2xl font-bold">AI-Powered Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((product, index) => (
          <ProductCard
            key={product._id || `ai-rec-${index}`}
            product={product}
            onClick={() => navigate(`/products/${product._id}`)}
            handleAddToCart={() => console.log("Add to cart clicked for", product.title)}
          />
        ))}
      </div>
    </div>
  )
}
