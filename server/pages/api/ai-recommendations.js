
import OpenAI from "openai";

// AI Recommendations endpoint
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { product, reviews, action = "recommend" } = req.body;

  if (!product) {
    return res.status(400).json({ message: "Product data required" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Handle different AI actions
    switch (action) {
      case "recommend":
        return await getProductRecommendations(openai, product, res);
      case "reviewSuggestions":
        return await getReviewSuggestions(openai, product, req.body.userRating, res);
      case "analyzeReviews":
        return await analyzeReviews(openai, reviews, res);
      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("AI API error:", error);
    return res.status(500).json({ 
      message: "AI service temporarily unavailable",
      recommendations: getMockRecommendations(product)
    });
  }
}

async function getProductRecommendations(openai, product, res) {
  const prompt = `
    Based on this product:
    Title: ${product.title}
    Category: ${product.category}
    Price: $${product.price || product.salePrice || 'N/A'}
    Description: ${product.description || 'No description'}
    
    Generate 3 similar product recommendations with realistic details.
    Return as JSON array with this structure:
    [
      {
        "_id": "rec1",
        "title": "Product name",
        "category": "${product.category}",
        "price": number,
        "salePrice": number,
        "image": "/placeholder-image.jpg",
        "rating": 4.0-5.0,
        "description": "Brief description",
        "reason": "Why this is recommended"
      }
    ]
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: "You are a product recommendation AI. Generate realistic, relevant product suggestions." 
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "[]";
  
  let recommendations = [];
  try {
    recommendations = JSON.parse(responseText);
    if (!Array.isArray(recommendations)) {
      recommendations = getMockRecommendations(product);
    }
  } catch (parseError) {
    recommendations = getMockRecommendations(product);
  }

  return res.status(200).json({ recommendations });
}

async function getReviewSuggestions(openai, product, userRating, res) {
  const prompt = `
    A user is writing a review for:
    Product: ${product.title}
    Category: ${product.category}
    Rating given: ${userRating}/5 stars
    
    Provide 3 specific, helpful suggestions for what they should mention in their review.
    Focus on quality, value, usability, delivery experience, etc.
    
    Return as JSON array of strings.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: "You help users write better product reviews with specific, actionable suggestions." 
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 300
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "[]";
  
  let suggestions = [];
  try {
    suggestions = JSON.parse(responseText);
    if (!Array.isArray(suggestions)) {
      suggestions = getDefaultSuggestions(userRating);
    }
  } catch (parseError) {
    suggestions = getDefaultSuggestions(userRating);
  }

  return res.status(200).json({ suggestions });
}

async function analyzeReviews(openai, reviews, res) {
  if (!reviews || reviews.length < 3) {
    return res.status(400).json({ message: "Need at least 3 reviews for analysis" });
  }

  const reviewSummary = reviews.map(r => 
    `Rating: ${r.rating}/5 - "${r.text}"`
  ).join('\n');

  const prompt = `
    Analyze these customer reviews:
    
    ${reviewSummary}
    
    Provide insights as JSON:
    {
      "overallSentiment": "positive/negative/mixed description",
      "commonPraises": ["praise1", "praise2", "praise3"],
      "commonConcerns": ["concern1", "concern2", "concern3"],
      "averageRating": number,
      "totalReviews": ${reviews.length}
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: "You analyze customer reviews to extract key insights and sentiment." 
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 600
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "{}";
  
  let analysis = {};
  try {
    analysis = JSON.parse(responseText);
  } catch (parseError) {
    analysis = {
      overallSentiment: "Mixed customer feedback",
      commonPraises: [],
      commonConcerns: [],
      averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      totalReviews: reviews.length
    };
  }

  return res.status(200).json({ analysis });
}

function getMockRecommendations(product) {
  return [
    {
      _id: "rec1",
      title: `Premium ${product.category} Collection`,
      category: product.category,
      price: (product.price || 100) * 1.2,
      salePrice: (product.price || 100) * 0.9,
      image: "/placeholder-image.jpg",
      rating: 4.5,
      description: "High-quality alternative with premium features",
      reason: "Similar style with enhanced durability"
    },
    {
      _id: "rec2", 
      title: `Essential ${product.category} Basic`,
      category: product.category,
      price: (product.price || 100) * 0.8,
      salePrice: (product.price || 100) * 0.6,
      image: "/placeholder-image.jpg",
      rating: 4.2,
      description: "Budget-friendly option with great value",
      reason: "More affordable with similar functionality"
    },
    {
      _id: "rec3",
      title: `Designer ${product.category} Limited`,
      category: product.category,
      price: (product.price || 100) * 1.5,
      salePrice: (product.price || 100) * 1.3,
      image: "/placeholder-image.jpg", 
      rating: 4.8,
      description: "Exclusive design with premium materials",
      reason: "Upgraded version with luxury features"
    }
  ];
}

function getDefaultSuggestions(rating) {
  if (rating >= 4) {
    return [
      "Mention what you loved most about the product quality",
      "Share how it met or exceeded your expectations", 
      "Describe the value for money you received"
    ];
  } else if (rating >= 3) {
    return [
      "Explain what worked well and what could be improved",
      "Share if it met your basic expectations",
      "Mention any surprises (good or bad) about the product"
    ];
  } else {
    return [
      "Describe the specific issues you encountered",
      "Explain how it differed from your expectations",
      "Mention if there were any redeeming qualities"
    ];
  }
}
