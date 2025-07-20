"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Login } from '@/lib/actions/authgoogle'
import { Session } from 'next-auth'
import { auth } from "@/server/auth"
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-8 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50", className)} {...props}>
      <Card className="overflow-hidden shadow-2xl border-0 max-w-5xl mx-auto mt-8">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left side - Form */}
          <div className="p-8 md:p-12 bg-white">
            <div className="flex flex-col gap-8 h-full justify-between" style={{ minHeight: "500px" }}>
              {/* Header section */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4 mb-4">
                  {/* Logo */}
                  <div className="relative w-24 h-24 mb-2">
                    <Image
                      src="/DebbiesLogopurple.jpg"
                      alt="Debbie's Cakes Logo"
                      width={96}
                      height={96}
                      className="rounded-full object-cover shadow-lg border-4 border-purple-100"
                      priority
                    />
                  </div>
                  
                  <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Welcome to Debbies Cakes
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-2 rounded-full"></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 text-lg leading-relaxed font-light">
                    Sign in to access your personalized dashboard and start 
                    exploring our exquisite collection of handcrafted cakes and pastries.
                  </p>
                </div>
              </div>

              {/* Authentication section */}
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4 font-medium">
                    Secure authentication powered by Google
                  </p>
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-4 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => Login()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="font-semibold">Continue with Google</span>
                  </Button>
                </div>

                {/* Benefits section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <p className="text-center text-gray-700 font-semibold mb-4">
                    🎂 Exclusive Member Benefits
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="font-medium">Personalized cake recommendations</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="font-medium">Express checkout experience</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="font-medium">Order history & reordering</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="font-medium">Early access to new flavors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
            <Image
              src="/DebbiesLogopurple.jpg"
              alt="Debbie's Cakes - Artisan bakery logo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 0px, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">Handcrafted with Love</h2>
                <p className="text-xl opacity-90 drop-shadow font-light"> creating sweet memories one cake at a time</p>
                <div className="w-20 h-1 bg-white mx-auto mt-4 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center pb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-800 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        <p className="text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:text-purple-800 underline underline-offset-4">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-purple-600 hover:text-purple-800 underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}