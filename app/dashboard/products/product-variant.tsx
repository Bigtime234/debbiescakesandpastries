"use client"

import { VariantsWithImagesTags } from "@/lib/infer-types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { VariantSchema } from "@/types/variant-schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InputTags } from "./input-tags"
import VariantImages from "./variant-images"
import { useAction } from "next-safe-action/hooks"
import { createVariant } from "@/lib/actions/create-variant"
import { deleteVariant } from "@/lib/actions/delete-variant"
import { toast } from "sonner"
import { forwardRef, useEffect, useState, useCallback } from "react"

type VariantProps = {
  children: React.ReactNode
  editMode: boolean
  productID?: number
  variant?: VariantsWithImagesTags
}

// Type for action results
type ActionResult = {
  data?: {
    error?: string
    success?: string
  }
}

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ children, editMode, productID, variant }, ref) => {
    const form = useForm<z.infer<typeof VariantSchema>>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        variantImages: [],
        color: "#000000",
        editMode,
        id: undefined,
        productID,
        productType: "Black Notebook",
      },
    })

    const [open, setOpen] = useState(false)

    // Memoize the setEdit function to prevent unnecessary re-renders
    const setEdit = useCallback(() => {
      if (!editMode) {
        form.reset({
          tags: [],
          variantImages: [],
          color: "#000000",
          editMode: false,
          id: undefined,
          productID,
          productType: "Black Notebook",
        })
        return
      }
      
      if (editMode && variant) {
        form.reset({
          editMode: true,
          id: variant.id,
          productID: variant.productID,
          productType: variant.productType,
          color: variant.color,
          tags: variant.variantTags.map((tag) => tag.tag),
          variantImages: variant.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          })),
        })
      }
    }, [editMode, variant, form, productID])

    useEffect(() => {
      setEdit()
    }, [setEdit])

    const { execute, status } = useAction(createVariant, {
      onExecute() {
        toast.loading("Creating variant")
        setOpen(false)
      },
      onSuccess(data: ActionResult) {
        toast.dismiss()
        
        if (data?.data?.error) {
          toast.error(data.data.error)
        }
        if (data?.data?.success) {
          toast.success(data.data.success)
        }
      },
      onError(error) {
        toast.dismiss()
        
        toast.error("Failed to create variant")
        console.error("Create variant error:", error)
      },
    })

    const variantAction = useAction(deleteVariant, {
      onExecute() {
        toast.loading("Deleting variant")
        setOpen(false)
      },
      onSuccess(data: ActionResult) {
        toast.dismiss()
        
        if (data?.data?.error) {
          toast.error(data.data.error)
        }
        if (data?.data?.success) {
          toast.success(data.data.success)
        }
      },
      onError(error) {
        toast.dismiss()
        
        toast.error("Failed to delete variant")
        console.error("Delete variant error:", error)
      },
    })

    function onSubmit(values: z.infer<typeof VariantSchema>) {
      execute(values)
    }

    // Reset form when dialog closes
    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen)
      if (!newOpen) {
        // Small delay to allow dialog to close smoothly
        setTimeout(() => {
          setEdit()
        }, 100)
      }
    }

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px]">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit" : "Create"} your variant
            </DialogTitle>
            <DialogDescription>
              Manage your product variants here. You can add tags, images, and
              more.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pick a title for your variant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <InputTags
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variantImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Images</FormLabel>
                    <FormControl>
                      <VariantImages {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-4 items-center justify-center">
                {editMode && variant && (
                  <Button
                    variant={"destructive"}
                    type="button"
                    disabled={variantAction.status === "executing"}
                    onClick={(e) => {
                      e.preventDefault()
                      variantAction.execute({ id: variant.id })
                    }}
                  >
                    Delete Variant
                  </Button>
                )}
                <Button
                  type="submit"
                  className="min-w-[120px]"
                >
                  {status === "executing" ? "Submitting..." : editMode ? "Update Variant" : "Create Variant"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }
)

ProductVariant.displayName = "ProductVariant"