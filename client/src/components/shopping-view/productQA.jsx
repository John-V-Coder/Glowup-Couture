import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ProductQA() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Questions & Answers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold text-left">How can a small fashion brand effectively use social media to grow?</AccordionTrigger>
            <AccordionContent>
              A small fashion brand can effectively use social media by focusing on a few key platforms that align with their target audience, like Instagram or TikTok. Post high-quality images and videos of your products, use relevant hashtags, and engage directly with your followers. Collaborating with micro-influencers and running targeted ads are also great ways to increase visibility and attract new customers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold text-left">What is the most important element of a fashion marketing strategy?</AccordionTrigger>
            <AccordionContent>
              The most important element of a fashion marketing strategy is **brand identity**. Your brand's unique story, aesthetic, and values are what set you apart from competitors. A strong brand identity informs all your marketing efforts, from your social media content to your website design, ensuring a consistent and memorable experience for your customers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold text-left">How can I use content marketing to attract customers?</AccordionTrigger>
            <AccordionContent>
              Content marketing for a fashion brand involves creating valuable, non-promotional content that resonates with your audience. This could include blog posts about styling tips, behind-the-scenes videos of your design process, or lookbooks showcasing different ways to wear your pieces. By providing useful and entertaining content, you build trust and establish your brand as an authority in the industry.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="font-semibold text-left">Is it necessary to hire a professional photographer for my product shoots?</AccordionTrigger>
            <AccordionContent>
              While professional photography is highly recommended for high-end brands, it's not always necessary to hire a pro right away. You can achieve excellent results with a good smartphone camera, proper lighting (natural light is best), and a clean background. The goal is to capture your product clearly and attractively. As your brand grows, investing in professional photography can significantly elevate your brand's image.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="font-semibold text-left">How important is email marketing for a fashion business?</AccordionTrigger>
            <AccordionContent>
              Email marketing is incredibly important for a fashion business because it allows for direct and personalized communication with your customers. You can use email to announce new collections, offer exclusive promotions, send personalized recommendations, and even share a behind-the-scenes look at your brand. It's a powerful tool for customer retention and building a loyal community.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button variant="outline" className="w-full bg-transparent mt-4">
          Ask a Question
        </Button>
      </CardContent>
    </Card>
  )
}