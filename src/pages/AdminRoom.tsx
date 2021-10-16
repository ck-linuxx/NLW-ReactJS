import { FormEvent, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"
import checkImg from "../assets/images/check.svg"
import answerImg from "../assets/images/answer.svg"

import { Button } from "../components/Button"
import { Question } from "../components/Question"
import { RoomCode } from "../components/RoomCode"
import { useAuth } from "../hooks/useAuth"
import { useRoom } from "../hooks/useRoom"
import { database } from "../services/firebase"

import "../styles/room.scss"

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory()
    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState("");
    const roomId = params.id

    const { title, questions } = useRoom(roomId)

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        // await database.ref(`rooms/${roomId}`).remove() //remover a sala do firebase
        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string){
        if (window.confirm("Tem certeza que você quer excluir esta pergunta?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1> {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question 
                                key={question.id} // key === item unico
                                content={question.content}
                                author={question.author}
                            >

                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={checkImg} alt="Remover pergunta" />
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={answerImg} alt="Remover pergunta" />
                            </button>

                            <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}