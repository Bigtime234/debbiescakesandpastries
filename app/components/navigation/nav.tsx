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
                            <Link href={"/"} aria-label="Debbie's Cakes & Pastries" className="flex items-center rounded-md">
                                <Image
                                    src="/DebbiesLogopurple.jpg"
                                    alt="Debbie's Cakes & Pastries Logo"
                                    width={200}
                                    height={120}
                                    className="h-16 w-auto md:h-20 lg:h-24 xl:h-28 rounded-md object-contain hover:scale-105 transition-all duration-300 drop-shadow-2xl filter brightness-110 contrast-110"
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
                        <li className="flex items-center gap-2 md:gap-4">
                            {/* Cart Drawer - Only show when logged in */}
                            {session && (
                                <div className='relative flex items-center'>
                                    <CartDrawer/>
                                </div>
                            )}
                            
                            {/* Login/User Button */}
                            {!session ? (
                                <Button className="bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200 shadow-md border-2 border-transparent hover:border-pink-200 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base font-medium rounded-lg">
                                    <Link className="flex items-center gap-2" href="/login">
                                        <LogIn size={16} className="md:size-10"/>
                                        <span className="hidden sm:inline">Sign in</span>
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center">
                                    <UserButton expires={session?.expires ?? ""} user={session?.user}/>
                                </div>
                            )}
                            
                            {/* About Us Button */}
                            <Button className="bg-rose-600 text-white hover:bg-rose-400 hover:text-rose-900 transition-all duration-200 shadow-md border-2 border-transparent hover:border-rose-300 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base font-medium rounded-lg">
                                <Link href="/socials" className="flex items-center">
                                    <span className="hidden sm:inline font-serif">About us</span>
                                    <span className="sm:hidden font-serif">About</span>
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </nav>
                
                {/* Mobile Title - Shows below navbar on smaller screens */}
                <div className="lg:hidden bg-pink-500/90 py-2 text-center border-t border-pink-300/30">
                    <h1 className="text-lg md:text-xl font-dancing-script font-serif text-black px-4">
                        Welcome to Debbies cakes and pastries 😋
                    </h1>
                </div>
                
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