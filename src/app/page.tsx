import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignInButton from "@/components/signin btn";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";



export default async function Home() {
  const session=await getAuthSession()
  if(session?.user){
    //user is logged in
    return redirect('/dashboard')
  }
  return(
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  <Card className="w-[300px]">
    <CardHeader>
      <CardTitle>Welcome to Quizit!</CardTitle>
      <CardDescription>
        A quiz app that allows you to create and share quizzes with your friends.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <SignInButton text="Sign In with Google!"/>
    </CardContent>
  </Card>
 </div>
  );
}
