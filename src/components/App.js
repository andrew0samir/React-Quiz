import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';

const initialState = {
    questions: [],
    // 'loading' , 'error' , 'ready' , 'active' , finished'
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
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
            }
        case 'start':
            return {
                ...state,
                status: "active"
            }
        case 'newAnswer':
            const CurQuestion = state.questions.at(state.index);

            return {
                ...state,
                answer: action.payload,
                points: action.payload === CurQuestion.correctOption ?
                    state.points + CurQuestion.points : state.points
            }
        default:
            throw new Error("Unknown Action");
    }
}


export default function App() {

    const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState)

    const numQuestions = questions.length;

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
                <Question
                    question={questions[index]}
                    dispatch={dispatch}
                    answer={answer}
                />
            }
        </Main>

    </div>
}
