"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function (){
    const session = useSession();
    return <div className="h-16 flex justify-between border-b p-4">
        SufflePlay
        {session.data?.user && <div role="button" onClick={()=>signOut()} className="w-auto p-3 flex items-center bg-red-600 rounded-xl">Logout</div>}
        {!session.data?.user && <div role="button" onClick={()=>signIn()} className="w-auto p-3 flex items-center bg-red-600 rounded-xl">Login</div>}
    </div>
}