"use client"

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react"

export default function Appbar(){
    const session = useSession();
    return <div className="h-16 w-full backdrop-blur-md fixed z-40 flex justify-between items-center border-b px-4">
    <h1 className="text-lg font-bol text-white">SufflePlay</h1>
    {session.data?.user ? (
      <Button
        role="button"
        aria-label="Logout"
        onClick={() => signOut()}
        className="w-auto p-3 flex items-center bg-red-600 hover:bg-red-700 cursor-pointer transition-colors"
      >
        Logout
      </Button>
    ) : (
      <Button
        aria-label="Login"
        onClick={() => signIn()}
        className="w-auto p-3 flex items-center bg-violet-600 hover:bg-violet-700 cursor-pointer transition-colors"
      >
        Login
      </Button>
    )}
  </div>
  
}