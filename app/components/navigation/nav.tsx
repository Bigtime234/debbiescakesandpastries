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
        <header className=" py-8 shadow-md bg-[#F2F8Fc] rounded-3xl">
            <nav>
                <ul className="flex justify-between items-center md:gap-8 gap-4">
                    <li className='flex flex-1'>
                        <Link href={"/"} aria-label="Debbie's Cakes & Pastries" className="flex items-center">
                            <Image 
                                src="/DebbiesLogopurple.jpg" 
                                alt="Debbie's Cakes & Pastries Logo" 
                                width={150} 
                                height={100} 
                                className="h-50 w-auto md:h-50 lg:h-50 object-contain hover:scale-105 transition-transform duration-200 mix-blend-multiply"
                                priority
                            />
                        </Link>
                    </li>
                    
                     <li className="text-center">
                        <h1 className="hidden md:block text-5xl mb-6 text-center
               font-dancing-script font-serif text-black pr-30">
        Welcome to Debbies cakes and pastries 😋
          </h1>
                    </li>
                   
                    {session && (
                        <li className='relative flex items-center hover:bg-muted'>
                            <CartDrawer/>
                        </li>
                    )}
                    {!session ? (
                    <li className="flex items-center justify-center">
                        <Button>
                            <Link className="flex gap-2" href="/login"><LogIn size={16}/><span>Login</span></Link>
                        </Button>
                    </li>
                    ): (
                          <li className="flex items-center justify-center">
                       
                            <UserButton expires={session?.expires ?? ""} user={session?.user}/>
                       
                    </li>
                    )}


                 
                    <li>
                        <Button>
                            <Link href="/socials" >About us</Link>
                        </Button>
                    </li>
                   
           
                </ul>
             
            </nav>
        </header>
    )
}