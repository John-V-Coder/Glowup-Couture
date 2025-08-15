// /pages/api/review-suggestions.js
import OpenAI from "openai"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { product, userRating } = req.body

  if (!product || !userRating) {
    return res.status(400).json({ message: "Missing required data" })
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const prompt = `
      A user is writing a review for this product:
      Title: ${product.title}
      Category: ${product.category}
      Description: ${product.description || 'No description'}
      
      They gave it a ${userRating}/5 star rating.
      
      Provide 3 helpful, specific suggestions for what they might want to mention in their review.
      Focus on aspects like quality, value, usability, delivery, etc.
      
      Return as JSON array of strings, each suggestion should be one sentence.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that provides writing suggestions for product reviews. Be constructive and specific." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const responseText = completion.choices[0]?.message?.content?.trim() || "[]"
    
    let suggestions = []
    try {
      suggestions = JSON.parse(responseText)
      if (!Array.isArray(suggestions)) {
        suggestions = [responseText]
      }
    } catch (parseError) {
      suggestions = ["Consider mentioning the product quality, value for money, and your overall experience."]
    }

    res.status(200).json({ suggestions })

  } catch (error) {
    console.error("Review suggestions error:", error)
    res.status(500).json({ 
      message: "Failed to get review suggestions",
      suggestions: ["Consider sharing your honest experience with the product."]
    })
  }
}

// /pages/api/analyze-reviews.js
import OpenAI from "openai"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { reviews } = req.body

  if (!reviews || !Array.isArray(reviews) || reviews.length < 3) {
    return res.status(400).json({ message: "Need at least 3 reviews for analysis" })
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const reviewSummary = reviews.map(r => 
      `Rating: ${r.rating}/5 - "${r.text}"`
    ).join('\n')

    const prompt = `
      Analyze these customer reviews and provide insights:
      
      ${reviewSummary}
      
      Provide:
      1. Overall sentiment (positive/negative/mixed)
      2. Top 3 most praised features
      3. Top 3 most common concerns
      
      Return as JSON object:
      {
        "overallSentiment": "description",
        "commonPraises": ["praise1", "praise2", "praise3"],
        "commonConcerns": ["concern1", "concern2", "concern3"]
      }
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert at analyzing customer reviews and extracting key insights." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    })

    const responseText = completion.choices[0]?.message?.content?.trim() || "{}"
    
    let analysis = {}
    try {
      analysis = JSON.parse(responseText)
    } catch (parseError) {
      analysis = {
        overallSentiment: "Mixed feedback from customers",
        commonPraises: [],
        commonConcerns: []
      }
    }

    res.status(200).json({ analysis })

  } catch (error) {
    console.error("Review analysis error:", error)
    res.status(500).json({ 
      message: "Failed to analyze reviews",
      analysis: null
    })
  }
}