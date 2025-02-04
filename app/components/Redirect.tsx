"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use from next/navigation
import { useEffect } from "react";

export function Redirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return null;
}
