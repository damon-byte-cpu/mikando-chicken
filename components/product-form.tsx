"use client"

import { useActionState, useEffect, useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createProduct, updateProduct } from "@/app/actions/products"
import { UploadButton } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ProductRecord } from "@/lib/products"

export function ProductForm({ product }: { product?: ProductRecord }) {
  const isEdit = Boolean(product)
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "")
  const [done, setDone] = useState(product?.done ?? false)

  const action = isEdit ? updateProduct : createProduct
  const [state, formAction, pending] = useActionState(action, undefined)

  useEffect(() => {
    if (state?.success) {
      toast.success(isEdit ? "Product updated" : "Product created")
      setOpen(false)
      if (!isEdit) {
        setImageUrl("")
        setDone(false)
      }
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, isEdit])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="outline" size="sm">
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              Add product
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details of this menu item." : "Add a new item to your menu."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          {isEdit && <input type="hidden" name="id" value={product!.id} />}
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <input type="hidden" name="done" value={done ? "true" : "false"} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={product?.name} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price ?? ""}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Image</Label>
            {imageUrl ? (
              <div className="flex items-center gap-3">
                <span className="relative size-16 overflow-hidden rounded-md border border-border">
                  <Image src={imageUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setImageUrl("")}>
                  Remove
                </Button>
              </div>
            ) : (
              <UploadButton
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.ufsUrl) {
                    setImageUrl(res[0].ufsUrl)
                    toast.success("Image uploaded")
                  }
                }}
                onUploadError={(err) => {
                  toast.error(err.message)
                }}
                appearance={{ button: "bg-primary text-primary-foreground text-sm" }}
              />
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="done-switch">Out of stock</Label>
              <p className="text-xs text-muted-foreground">Marks the item as unavailable</p>
            </div>
            <Switch id="done-switch" checked={done} onCheckedChange={setDone} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isEdit ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
