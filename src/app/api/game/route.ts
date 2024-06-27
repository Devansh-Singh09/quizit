// import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError, optional } from "zod";
import axios from 'axios'
import { prisma } from "@/lib/db";

export async function POST(req:Request,res:Response) {
    try {
        const session= await getAuthSession()
        if(!session?.user){
            return NextResponse.json(
                { error: "You must be logged in to create the Quiz." },
                {
                  status: 401,
                }
              );
        }
        
        const body = await req.json()
        const {amount,topic,type} = quizCreationSchema.parse(body);

        console.log("hi");
        

        const game=await prisma.game.create({
            
            data:{
                gameType: type,
                timeStarted: new Date(),
                userId: session.user.id,
                topic,
            }
        })
        await prisma.topic_count.upsert({
            where :{ topic},
            create:{
                topic,
                count : 1
            },
            update :{
                count :{
                    increment :1
                }
            }
        })

        console.log("hi1");
        

        const {data}=await axios.post(`${process.env.API_URL}/api/questions`,{
            amount,
            topic,
            type,
        })

        if(type=="mcq"){
            type mcqQuestion ={
                question:string,
                answer:string,
                option1:string,
                option2:string,
                option3:string
            }
            const manyData=data.questions.map((question:mcqQuestion)=>{
                const options=[question.answer,question.option1,question.option2,question.option3].sort(()=>Math.random()-0.5)
                return {
                    question:question.question,
                    answer:question.answer,
                    options:JSON.stringify(options),
                    gameId:game.id,
                    questionType:'mcq'
                }
            })
            console.log("hi2");
            
            await prisma.question.createMany({
                data:manyData
            })

            console.log("hi3");
            
        }else if(type === 'open_ended'){
            type openQuestion ={
                question:string,
                answer:string,
            }
            await prisma.question.createMany({
                data:data.questions.map((question:openQuestion)=>{
                    return {
                        question:question.question,
                        answer:question.answer,
                        gameId:game.id,
                        questionType:'open_ended'
                    }
                })
            })
        }

        return NextResponse.json({
            gameId:game.id,
        
        },
    {status:200})

    } catch (error) {
        if(error instanceof ZodError){
            return NextResponse.json({error:error.issues},{status:400})
        }
        return NextResponse.json({error:"Something Wrong (Probably in Generating Question"},{status:510})
    }
}