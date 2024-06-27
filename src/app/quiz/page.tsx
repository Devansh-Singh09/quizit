import QuizCreation from '@/components/QuizCreation'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import { title } from 'process'
import React from 'react'

type Props = {
  searchParams: {
    topic?:string;
  };
};
export const metadata={
    title:"Quiz | Quizit",
}
const QuizPage = async ({searchParams}: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
      redirect("/");
    }
  return (
    <QuizCreation topicParam={searchParams.topic?? ""}/>
  )
}

export default QuizPage