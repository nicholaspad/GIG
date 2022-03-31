import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TaskHeading from '../../../components/form/TaskHeading'
import QuestionSingleChoice from '../../../components/form/QuestionSingleChoice'
import { useEffect } from 'react';


export default function Form() {

    const [questions, setQuestions] = useState([])
    const [currIndex, setCurrIndex] = useState(1)

    const removeQuestion = (index: number) => {
        var array = [...questions]
        array = array.slice(0, index).concat(array.slice(index+1, -1))
        // array.splice(index, 1)
        setQuestions(array)
        setCurrIndex(currIndex-1)
    }

    return (
        <Box>
            <TaskHeading/>
            {questions}

            <Button
                variant="contained"
                onClick={() => {
                    setQuestions(questions => [...questions,
                        <QuestionSingleChoice
                            key={currIndex}
                            index={currIndex}
                            removeQuestion={removeQuestion}
                        />
                    ])
                    setCurrIndex(currIndex+1)
                }}
            >+</Button>
        </Box>
    )
}