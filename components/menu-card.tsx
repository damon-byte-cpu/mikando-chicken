import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ImageOff } from "lucide-react"
import type { ProductRecord } from "@/lib/products"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function MenuCard({ product }: { product: ProductRecord }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" aria-hidden="true" />
          </div>
        )}
        {product.done && (
          <Badge variant="destructive" className="absolute left-3 top-3">
            Out of Stock
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-balance font-heading text-lg font-semibold leading-tight text-card-foreground">
            {product.name}
          </h3>
          <span className="shrink-0 font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
        {product.description && (
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>
    </article>
  )
}
