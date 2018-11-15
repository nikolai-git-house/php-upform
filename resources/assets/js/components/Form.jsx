import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Question from './Question';

class Form extends Component
{
    render() {
        const { answers, survey, currentQuestion } = this.props;

        const sortedQuestions = survey.questions.slice(0).sort((a, b) => {
            return a.sort_number - b.sort_number;
        });

        const currentAnswers = answers.filter((answer) => {
            return answer.question_id === currentQuestion.id;
        });

        const questionIndex = sortedQuestions.indexOf(currentQuestion);
        const previousQuestion = (questionIndex - 1 >= 0) ? sortedQuestions[questionIndex - 1] : null;
        const nextQuestion = (questionIndex + 1 < sortedQuestions.length) ? sortedQuestions[questionIndex + 1] : null;

        return <div>
            <div className="container-fluid">
                <Question question={currentQuestion} answers={currentAnswers} survey={survey} />
            </div>
            <div className="footer" style={{backgroundColor: '#F8F8F8', padding: '1rem 0'}}>
                <div className="container">
                    <div className="row text-center">
                        { (previousQuestion) ? <button className="btn btn-secondary float-left" onClick={() => this.props.goToQuestion(previousQuestion)} style={{marginRight: '1rem'}}>Previous question</button> : null }
                        <button className="btn btn-primary" onClick={() => this.props.exitForm()} style={{marginRight: '1rem'}}>Back to overview</button>
                        { (nextQuestion) ? <button className="btn btn-secondary float-right" onClick={() => this.props.goToQuestion(nextQuestion)}>Next question</button> : null }
                    </div>
                </div>
            </div>
        </div>
    }
}

Form.propTypes = {
    answers: PropTypes.array.isRequired,
    survey: PropTypes.object.isRequired,
    currentQuestion: PropTypes.object.isRequired,
    goToQuestion: PropTypes.func.isRequired,
    exitForm: PropTypes.func.isRequired
};

export default Form;