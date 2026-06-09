import { getProducts } from "@/lib/products"
import { ProductForm } from "@/components/product-form"
import { ProductRow } from "@/components/product-row"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"} on the menu
          </p>
        </div>
        <ProductForm />
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground">No products yet. Add your first menu item.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
