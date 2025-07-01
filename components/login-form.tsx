"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Login } from '@/lib/actions/authgoogle'
import { Session } from 'next-auth'
import { auth } from "@/server/auth"



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-10" style={{ minHeight: "400px" }}>
            <div className="flex flex-col gap-8 h-full justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome to Debbie's Cakes store
                  </h1>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                     Home
                  </Link>
                </div>
                
                <p className="  text-black text-2xl font-serif">
                  Sign in to access your personalized dashboard and start 
                  exploring our exquisite collection of cakes and pastries.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <p className=" mb-2 text-white">
                    Secure authentication powered by
                  </p>
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-6 text-lg bg-primary/90"
                    variant="outline"
                    onClick={() => Login()}
                    
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-8 w-8 "
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-white">Continue with Google</span>
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-md text-muted-foreground">
                    Get started now to enjoy exclusive benefits:
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <li className="font-medium font-sans text-black">• Personalized recommendations</li>
                    <li className="font-medium font-sans text-black">• Faster checkout experience</li>
                    <li className="font-medium font-sans text-black">• Order history tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="https://placehold.co/600x800?text=Delicious+Cakes" 
              alt="Artisan cakes and pastries from Debbie's bakery"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs *:[a]:underline *:[a]:underline-offset-4">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
