
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
import { useQuiz } from '../contexts/QuizContext';



export default function App() {

    const { questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch } = useQuiz();

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