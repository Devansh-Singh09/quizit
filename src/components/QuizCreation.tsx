'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useForm } from 'react-hook-form'
import { quizCreationSchema } from '@/schemas/form/quiz'
import { z } from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BookOpen, CopyCheck } from 'lucide-react'
import { Separator } from './ui/separator'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import { get } from 'http'
import { useRouter } from 'next/navigation'
import LoadingQuestions from './LoadingQuestions'


type Props = {
  topicParam:string
}

type Input=z.infer<typeof quizCreationSchema>

const QuizCreation = ({topicParam}: Props) => {
  const router=useRouter()
  const [showLoader,setShowLoader]=React.useState(false);
  const [finished,setFinished]=React.useState(false);
  const { mutate: getQuestions } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post("/api/game", { amount, topic, type });
      return response.data;
    },  
  })

    const form=useForm<Input>(
        {
            resolver:zodResolver(quizCreationSchema),
            defaultValues:{
                amount:4,
                topic:topicParam,
                type:"open_ended"
            }
        }
    )

    function onSubmit (input:Input){
      setShowLoader(true)
        getQuestions({
          amount:input.amount,
          topic:input.topic,
          type:input.type 
        },{
          onSuccess:({gameId})=>{
            setFinished(true);
            setTimeout(()=>{

              if(form.getValues('type')=='open_ended'){
                router.push(`/play/open_ended/${gameId}`)
              }else{
                router.push(`/play/mcq/${gameId}`)
              }

            },1000);
            
          },
          onError :() =>{
            setShowLoader(false)
          }
        })
    }

    form.watch()
    if(showLoader){
      return <LoadingQuestions finished={finished} />;
    }
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <Card className="bg-white-50 dark:bg-grey-950 border border-black-500 dark:border-black-700 shadow-lg transition-all transform hover:scale-105 duration-200">
    <CardHeader className="bg-orange-500 dark:bg-orange-800 text-white py-4 px-6 rounded-t-lg">
      <CardTitle className="text-2xl font-bold">
        Create Quiz
      </CardTitle>
      <CardDescription>
        Choose a Topic
      </CardDescription>
    </CardHeader>
    <CardContent className="bg-white dark:bg-gray-950 px-6 py-4 rounded-b-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-800 dark:text-orange-200">Topic</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter a Topic" 
                    {...field} 
                    className="border border-orange-300 dark:border-orange-700 focus:ring focus:ring-orange-200 dark:focus:ring-orange-800"
                  />
                </FormControl>
                <FormDescription className="text-orange-600 dark:text-orange-400">
                  Please provide a topic to create a quiz.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-800 dark:text-orange-200">Number of Questions</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter number of questions" 
                    {...field} 
                    type="number"
                    min={1}
                    max={10}
                    onChange={e => form.setValue('amount', parseInt(e.target.value))}
                    className="border border-orange-300 dark:border-orange-700 focus:ring focus:ring-orange-200 dark:focus:ring-orange-800"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button 
              type="button"
              onClick={() => form.setValue("type", "mcq")}
              className={`w-1/2 rounded-none rounded-l-lg hover:bg-orange-400 ${form.getValues("type") === "mcq" ? "bg-orange-500 text-white" : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"} transition-colors duration-200`}
            >
              <CopyCheck className="w-8 h-8 mr-2" /> Multiple Choice
            </Button>
            <Separator orientation="vertical" className="bg-orange-300 dark:bg-orange-700" />
            <Button 
              type="button"
              onClick={() => form.setValue("type", "open_ended")}
              className={`w-1/2 rounded-none rounded-r-lg hover:bg-orange-400 ${form.getValues("type") === "open_ended" ? "bg-orange-500 text-white" : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"}`}
            >
              <BookOpen className="w-4 h-4 mr-2" /> Open Ended
            </Button>
          </div>

          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200">
            Submit
          </Button>
        </form>
      </Form>
    </CardContent>
  </Card>
</div>

  )
}

export default QuizCreation