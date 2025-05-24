import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';

const initialState = {
    questions: [],
    // 'loading' , 'error' , 'ready' , 'active' , finished'
    status: 'loading',
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
        default:
            throw new Error("Unknown Action");
    }
}


export default function App() {

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(function () {
        fetch('http://localhost:9000/questions')
            .then(res => res.json())
            .then(data => dispatch({ type: "dataRecevied", payload: data }))
            .catch(err => dispatch({ type: "dataFailed" }))
    }, [])

    return <div className="app">
        <Header />

        <Main className='main'>
            <p>1/15</p>
            <p>Question?</p>
        </Main>

    </div>
}
