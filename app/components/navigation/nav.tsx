import React from 'react'
import GoogleLogin from "./google-login"
import GoogleLogout from "./google-logout"
import { auth } from "@/server/auth"
import { UserButton } from "./user-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"
import CartDrawer from '../cart/cart-drawer'
import Image from 'next/image'

export default async function Nav() {
    const session = await auth()
    return (
        <>
            {/* Spacer div to prevent content from hiding behind fixed navbar */}
            <div className={`${!session ? 'h-36 md:h-40 lg:h-44 xl:h-48' : 'h-24 md:h-28 lg:h-32 xl:h-36'}`}></div>
            
            <header className="fixed top-0 left-0 right-0 z-50 py-4 shadow-lg bg-gradient-to-r from-pink-400 via-rose-300 to-pink-300 backdrop-blur-sm border-b border-pink-200/30">
                <nav className="container mx-auto px-4">
                    <ul className="flex justify-between items-center gap-4">
                        {/* Logo Section */}
                        <li className='flex-shrink-0'>
                            <Link 
                                href={"/"} 
                                aria-label="Debbie's Cakes & Pastries" 
                                className="block rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                            >
                                <Image
                                    src="/DebbiesLogopurple.jpg"
                                    alt="Debbie's Cakes & Pastries Logo"
                                    width={200}
                                    height={120}
                                    className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 xl:h-24 rounded-xl object-cover filter brightness-110 contrast-110 saturate-110 transition-all duration-300"
                                    priority
                                />
                            </Link>
                        </li>
                       
                        {/* Title Section - Hidden on mobile, visible on larger screens */}
                        <li className="hidden lg:block flex-1 text-center px-4">
                            <h1 className="text-2xl xl:text-4xl font-dancing-script font-serif text-black drop-shadow-lg">
                                Welcome to Debbies cakes and pastries 😋
                            </h1>
                        </li>
                       
                        {/* Navigation Actions */}
                        <li className="flex items-center gap-2 md:gap-3 lg:gap-4">
                            {/* Cart Drawer - Only show when logged in */}
                            {session && (
                                <div className='relative flex items-center'>
                                    <CartDrawer/>
                                </div>
                            )}
                            
                            {/* Login/User Button */}
                            {!session ? (
                                <Button className="bg-white/95 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-pink-200/50 hover:border-pink-300 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-xl backdrop-blur-sm transform hover:scale-105 hover:-translate-y-0.5">
                                    <Link className="flex items-center gap-1.5 sm:gap-2" href="/login">
                                        <LogIn size={14} className="sm:size-4 md:size-5"/>
                                        <span className="hidden xs:inline">Sign in</span>
                                        <span className="xs:hidden">In</span>
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center transform hover:scale-105 transition-all duration-300">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
                                        <UserButton expires={session?.expires ?? ""} user={session?.user}/>
                                    </div>
                                </div>
                            )}
                            
                            {/* About Us Button */}
                            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-400 hover:to-pink-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-rose-300/30 hover:border-rose-200/50 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-xl backdrop-blur-sm transform hover:scale-105 hover:-translate-y-0.5">
                                <Link href="/socials" className="flex items-center">
                                    <span className="hidden sm:inline font-serif">About us</span>
                                    <span className="sm:hidden font-serif text-xs">About</span>
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </nav>
              
                
                {/* Not Signed In Message */}
                {!session && (
                    <div className="bg-amber-400/90 text-amber-900 py-2 px-4 text-center border-t border-amber-300/30">
                        <p className="text-sm md:text-base font-medium flex items-center justify-center gap-2">
                            <span>⚠️</span>
                            <span>You are not signed in</span>
                            <Link href="/login" className="underline hover:text-amber-800 font-semibold ml-2">
                                Sign in now
                            </Link>
                        </p>
                    </div>
                )}
            </header>
        </>
    )
}