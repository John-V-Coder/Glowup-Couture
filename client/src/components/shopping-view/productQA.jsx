import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

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
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="font-semibold mb-2">Q: Is this compatible with all devices?</div>
            <div className="text-muted-foreground">
              A: Yes, these headphones work with any Bluetooth-enabled device including smartphones, tablets, and
              computers.
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="font-semibold mb-2">Q: How long does the battery last?</div>
            <div className="text-muted-foreground">
              A: The battery provides up to 30 hours of continuous playbook with ANC off, or 20 hours with ANC on.
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            Ask a Question
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}