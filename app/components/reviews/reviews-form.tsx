
"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
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
import { useSearchParams } from "next/navigation"
import { reviewSchema } from "@/types/reviews-schema"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { addReview } from "@/lib/actions/add-review"
import { toast } from "sonner"

export default function ReviewsForm() {
  const params = useSearchParams()
  const productID = Number(params.get("productID"))

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      productID,
    },
  })

  const { execute, status } = useAction(addReview, {
    onSuccess(result) {
      try {
        // Check if result.data exists before trying to destructure
        if (result && result.data) {
          const { error, success } = result.data as { error?: string; success?: boolean }
          if (error) {
            console.log(error)
            toast.error(error)
          }
          if (success) {
            toast.success("Review Added 👌")
            form.reset()
          }
        } else {
          // Handle case where result.data is undefined but action succeeded
          console.log("Action succeeded but result.data is undefined")
          toast.success("Review Added 👌")
          form.reset()
        }
      } catch (err) {
        console.error("Error in onSuccess callback:", err)
        toast.error("Review added but there was an issue with the callback")
      }
    },
    onError(error) {
      console.error("Action error:", error)
      toast.error("Failed to add review")
    }
  })

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    execute({
      comment: values.comment,
      rating: values.rating,
      productID,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={"secondary"}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How would you describe this product?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="Star Rating" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div
                          className="relative cursor-pointer"
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          key={value}
                        >
                          <Star
                            key={value}
                            onClick={() => {
                              const currentRating = form.getValues("rating")
                              // If clicking the same star that's already selected, unselect it
                              if (currentRating === value) {
                                form.setValue("rating", value - 1, {
                                  shouldValidate: true,
                                })
                              } else {
                                form.setValue("rating", value, {
                                  shouldValidate: true,
                                })
                              }
                            }}
                            className={cn(
                              "text-blue-500 bg-transparent transition-all duration-300 ease-in-out",
                              form.getValues("rating") >= value
                                ? "fill-blue-500"
                                : "fill-muted"
                            )}
                          />
                        </motion.div>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={status === "executing"}
              className="w-full"
              type="submit"
            >
              {status === "executing" ? "Adding Review..." : "Add Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}