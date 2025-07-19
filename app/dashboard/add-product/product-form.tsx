"use client"

import { useForm } from "react-hook-form"
import { zProductSchema, ProductSchema } from "@/types/product-schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DollarSign } from "lucide-react"
import Tiptap from "./tiptap"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { createProduct } from "@/lib/actions/create-product"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getProduct } from "@/lib/actions/get-products"
import { TbCurrencyNaira } from "react-icons/tb";

import { useEffect } from "react"


// Your form component
export default function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const editMode = searchParams.get("id")

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id)
      if (data.error) {
        toast.error(data.error)
        router.push("/dashboard/products")
        return
      }
      if (data.success) {
        const id = parseInt(editMode)
        form.setValue("title", data.success.title)
        form.setValue("description", data.success.description)
        form.setValue("price", data.success.price)
        form.setValue("id", id)
      }
    }
  }

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode))
    }
  }, [])

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      // Dismiss all loading toasts first
      toast.dismiss()
      
      if (data?.data?.error) {
        toast.error(data.data.error)
      }
      if (data?.data?.success) {
        toast.success(data.data.success)
        router.push("/dashboard/products")
      }
    },
    onError: (error) => {
      // Dismiss loading toasts on error too
      toast.dismiss()
      toast.error("Something went wrong")
    },
    onExecute: () => {
      if (editMode) {
        toast.loading("Editing Product...")
      } else {
        toast.loading("Creating Product...")
      }
    },
  })

  async function onSubmit(values: zProductSchema) {
    execute(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>
          {editMode
            ? "Make changes to existing product"
            : "Add a brand new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Saekdong Stripe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                    <FormControl>
                    <Tiptap 
                      val={field.value} 
                    />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <TbCurrencyNaira
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in Naira"
                        step="0.1"
                        min={0}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              {editMode ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}