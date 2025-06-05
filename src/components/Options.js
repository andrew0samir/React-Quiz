import { useQuiz } from "../contexts/QuizContext";

function Options() {
    const { questions,
        answer,
        index,
        dispatch } = useQuiz();
    const hasAnswered = answer !== null;
    const question = questions.at(index);
    return (
        <div className="options">
            {question.options.map((option, index) =>
                <button
                    className={`btn btn-option ${index === answer ? 'answer' : ''}
                    ${hasAnswered ?
                            index === question.correctOption ?
                                "correct" : "wrong"
                            : ""} `}
                    key={option}
                    disabled={hasAnswered}
                    onClick={() => dispatch({
                        type: 'newAnswer',
                        payload: index
                    })}
                >{option}</button>
            )}
        </div>
    )
}

export default Options
