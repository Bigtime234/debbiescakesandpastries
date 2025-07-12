import React from 'react'
import GoogleLogin from "./google-login"
import GoogleLogout from "./google-logout"
import { auth } from "@/server/auth"
import { UserButton } from "./user-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"
import CartDrawer from '../cart/cart-drawer'


export default async function Nav() {
    const session = await auth()
    return (
        <header className=" py-8">
            <nav>
                <ul className="flex justify-between items-center md:gap-8 gap-4">
                    <li className='flex flex-1'>
                        <Link href={"/"} aria-label="sprout and scribble">Debbies store</Link>
                         </li>
                         <li className='relative flex items-center hover:bg-muted'>
                            <CartDrawer/>

                         </li>
                    {!session ? (
                    <li   className="flex items-center justify-center">
                        <Button>
                            <Link className="flex gap-2" href="/login"><LogIn size={16}/><span>Login</span></Link>
                        </Button>
                    </li>

                    ): (
                          <li    className="flex items-center justify-center">
                        
                            <UserButton expires={session?.expires ?? ""} user={session?.user}/>
                        
                    </li>
                    )}

                    
                  
                    <li>
                        <h1 className='bg-teal-600 text-4xl'>Hello</h1>
                        
                        
                         </li>
                         <li>
                        
                         </li>
            
                </ul>
              
            </nav>
        </header>
    )



}
