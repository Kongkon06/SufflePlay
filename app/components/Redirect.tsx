"use client";

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use from next/navigation
import { useEffect } from "react";


export function Redirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function redirectToDashboard() {
      if (session?.user) {
        const sessionData = await getSession();
        const creatorId = sessionData?.user?.db_id ?? "";
        router.push(`/dashboard`);
      }
    }

    redirectToDashboard();
  }, [session, router]);

  return null;
}
