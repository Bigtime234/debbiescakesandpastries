import React from 'react'
import GoogleLogin from "./google-login"
import GoogleLogout from "./google-logout"
import { auth } from "@/server/auth"
import { UserButton } from "./user-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"


export default async function Nav() {
    const session = await auth()
    return (
        <header className=" py-8">
            <nav>
                <ul className="flex justify-between items-center">
                    <li>
                        <Link href={"/"} aria-label="sprout and scribble">Debbies store</Link>
                         </li>
                    {!session ? (
                    <li>
                        <Button>
                            <Link className="flex gap-2" href="/login"><LogIn size={16}/><span>Login</span></Link>
                        </Button>
                    </li>

                    ): (
                          <li>
                        
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

