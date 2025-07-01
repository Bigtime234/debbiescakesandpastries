"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Session } from "next-auth";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { z } from "zod"; 
import { settings } from "@/lib/actions/settings";
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image"; 
import { FormError } from "@/app/auth/form-error"
import { FormSuccess } from "@/app/auth/form-success" 
import { useAction } from "next-safe-action/hooks"
import { UploadButton } from "@/app/api/uploadthing/upload";

type SettingsForm = {
  session: Session
}

export default function SettingsCard({ session }: SettingsForm) {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [avatarUploading, setAvatarUploading] = useState(false)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.user?.name || "",
      image: session.user?.image || "",
    },
  })

  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        setSuccess(data.data.success)
        setError(undefined)
      }
      if (data?.data?.error) {
        setError(data.data.error)
        setSuccess(undefined)
      }
    },
    onError: (error) => {
      console.error("Action error:", error)
      setError("Something went wrong")
      setSuccess(undefined)
    },
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    console.log("Submitting values:", values)
    setError(undefined)
    setSuccess(undefined)
    execute(values)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4 mb-4">
                    {form.getValues("image") ? (
                      <div className="flex items-center gap-4">
                        <Image
                          src={form.getValues("image")!}
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                          alt="User Image"
                        />
                        <div className="upload-button-wrapper">
                          <UploadButton
                            endpoint="avatarUploader"
                            onUploadBegin={() => setAvatarUploading(true)}
                            onUploadError={(error) => {
                              form.setError("image", {
                                type: "validate",
                                message: error.message,
                              })
                              setAvatarUploading(false)
                            }}
                            onClientUploadComplete={(res) => {
                              form.setValue("image", res[0].url!)
                              setAvatarUploading(false)
                            }}
                            content={{
                              button({ ready }) {
                                if (avatarUploading) {
                                  return (
                                    <div className="flex items-center gap-2">
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                      <span>Uploading...</span>
                                    </div>
                                  )
                                }
                                return ready ? "Change Avatar" : "Getting Ready..."
                              },
                            }}
                            appearance={{
                              button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium border-none cursor-pointer transition-colors duration-200",
                              allowedContent: "text-gray-500 text-xs mt-1"
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="upload-button-wrapper">
                          <UploadButton
                            endpoint="avatarUploader"
                            onUploadBegin={() => setAvatarUploading(true)}
                            onUploadError={(error) => {
                              form.setError("image", {
                                type: "validate",
                                message: error.message,
                              })
                              setAvatarUploading(false)
                            }}
                            onClientUploadComplete={(res) => {
                              form.setValue("image", res[0].url!)
                              setAvatarUploading(false)
                            }}
                            content={{
                              button({ ready }) {
                                if (avatarUploading) {
                                  return (
                                    <div className="flex items-center gap-2">
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                      <span>Uploading...</span>
                                    </div>
                                  )
                                }
                                return ready ? "Upload Avatar" : "Getting Ready..."
                              },
                            }}
                            appearance={{
                              button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium border-none cursor-pointer transition-colors duration-200",
                              allowedContent: "text-gray-500 text-xs mt-1"
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <FormControl>
                    <Input
                      type="hidden"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error and Success Messages */}
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}

            {/* Submit Button - Made more visible */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={status === "executing" || avatarUploading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                {status === "executing" ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Settings"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}