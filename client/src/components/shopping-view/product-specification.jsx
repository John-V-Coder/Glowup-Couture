import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProductSpecifications({ specifications }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {specifications ? (
            Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No specifications available</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}