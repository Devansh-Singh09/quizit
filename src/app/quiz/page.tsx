import QuizCreation from '@/components/QuizCreation'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import { title } from 'process'
import React from 'react'

type Props = {}
export const metadata={
    title:"Quiz | Quizit",
}
const QuizPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
      redirect("/");
    }
  return (
    <QuizCreation/>
  )
}

export default QuizPage