"use client";
import { Tabs, TabsList, TabsTrigger } from "@/app/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export function AuthTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const isSignUp = pathname.endsWith("/sign-up");
  const activeTab = isSignUp ? "sign-up" : "sign-in";

  const handleTabChange = (value: string) => {
    if (value === "sign-in") {
      router.push("/sign-in");
    } else if (value === "sign-up") {
      router.push("/sign-up");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="w-full">
        <TabsTrigger value="sign-in" className="w-1/2">
          Sign In
        </TabsTrigger>
        <TabsTrigger value="sign-up" className="w-1/2">
          Sign Up
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}