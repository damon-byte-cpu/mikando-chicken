"use client"

import Image from "next/image"
import { useTransition } from "react"
import { Trash2, ImageOff } from "lucide-react"
import { toast } from "sonner"
import { deleteProduct, toggleProductDone } from "@/app/actions/products"
import { ProductForm } from "@/components/product-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { ProductRecord } from "@/lib/products"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)
}

export function ProductRow({ product }: { product: ProductRecord }) {
  const [isPending, startTransition] = useTransition()

  function handleToggle(checked: boolean) {
    const fd = new FormData()
    fd.set("id", product.id)
    fd.set("done", checked ? "true" : "false")
    startTransition(async () => {
      await toggleProductDone(fd)
      toast.success(checked ? "Marked out of stock" : "Marked in stock")
    })
  }

  function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    const fd = new FormData()
    fd.set("id", product.id)
    startTransition(async () => {
      await deleteProduct(fd)
      toast.success("Product deleted")
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {product.imageUrl ? (
          <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-5" aria-hidden="true" />
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-card-foreground">{product.name}</h3>
          {product.done && <Badge variant="destructive">Out of Stock</Badge>}
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {product.description || "No description"}
        </p>
        <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Out of stock
          <Switch checked={product.done} onCheckedChange={handleToggle} disabled={isPending} />
        </label>
        <ProductForm product={product} />
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending} aria-label="Delete product">
          <Trash2 className="size-4 text-destructive" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
