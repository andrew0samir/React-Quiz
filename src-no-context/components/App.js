import { useEffect, useReducer } from 'react';

import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Timer from './Timer';
import Footer from './Footer';

const SECONDS_PER_QUESTION = 30;

const initialState = {
    questions: [],
    // 'loading' , 'error' , 'ready' , 'active' , finished'
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'dataRecevied':
            return {
                ...state,
                questions: action.payload,
                status: "ready"
            };
        case 'dataFailed':
            return {
                ...state,
                status: "error"
            };
        case 'start':
            return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * SECONDS_PER_QUESTION
            };
        case 'newAnswer':
            const CurQuestion = state.questions.at(state.index);

            return {
                ...state,
                answer: action.payload,
                points: action.payload === CurQuestion.correctOption ?
                    state.points + CurQuestion.points : state.points
            };
        case 'nextQuestion':
            return {
                ...state,
                index: state.index + 1,
                answer: null,
            };
        case 'finish':
            return {
                ...state,
                status: "finished",
                highscore: state.points > state.highscore ?
                    state.points : state.highscore
            };
        case 'restart':
            return {
                ...initialState,
                questions: state.questions,
                status: 'ready',
            }
        case 'tick':
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining === 0 ? 'finished' : state.status
            }
        default:
            throw new Error("Unknown Action");
    }
}


export default function App() {

    const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState)

    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

    useEffect(function () {
        fetch('http://localhost:9000/questions')
            .then(res => res.json())
            .then(data => dispatch({ type: "dataRecevied", payload: data }))
            .catch(err => dispatch({ type: "dataFailed" }))
    }, [])

    return <div className="app">
        <Header />

        <Main className='main'>
            {
                status === "loading" && <Loader />
            }
            {
                status === "error" && <Error />
            }
            {
                status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
            }
            {
                status === 'active' &&
                <>
                    <Progress
                        index={index}
                        numQuestions={numQuestions}
                        points={points}
                        maxPossiblePoints={maxPossiblePoints}
                        answer={answer}
                    />
                    <Question
                        question={questions[index]}
                        dispatch={dispatch}
                        answer={answer}
                    />
                    <Footer>
                        <Timer
                            dispatch={dispatch}
                            secondsRemaining={secondsRemaining}
                        />
                        <NextButton
                            dispatch={dispatch}
                            answer={answer}
                            index={index}
                            numQuestions={numQuestions}
                        />
                    </Footer>
                </>
            }
            {
                status === "finished" &&
                <FinishScreen
                    points={points}
                    maxPossiblePoints={maxPossiblePoints}
                    highscore={highscore}
                    dispatch={dispatch}
                />
            }
        </Main>

    </div>
}

/* features to be implemented 
    1- in the start screen could allow user to :
        - select number of questions 
        - filter questions by difficulty
    2- upload the highscore to the fake api 
        to refetch the value as initial state 
    3- could store all answers in array to allow user 
        to go back and forth to review answers   
*/