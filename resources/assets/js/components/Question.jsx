import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import ChoiceQuestion from './ChoiceQuestion';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import AmountQuestion from './AmountQuestion';
import AmountCurrencyQuestion from './AmountCurrencyQuestion';
import TextQuestion from './TextQuestion'
import TrueFalseQuestion from './TrueFalseQuestion';
import OrderQuestion from './OrderQuestion';
import {runAddOrUpdateAnswer, runRemoveAnswer, runAddOrUpdateAnswers} from '../stories/index';

const TYPE_MULTIPLE_CHOICE = 'multiple_choice';
const TYPE_SINGLE_CHOICE = 'single_choice';
const TYPE_TEXT = 'text';
const TYPE_TRUE_FALSE = 'true_false';
const TYPE_TRUE_FALSE_CONTEXT = 'true_false_context';
const TYPE_AMOUNT = 'amount';
const TYPE_AMOUNT_CURRENCY = 'amount_currency';
const TYPE_AMOUNT_RANGE = 'amount_range';
const TYPE_ORDER = 'order';

class Question extends Component
{
    render() {
        const { question, answers } = this.props;

        const { subcategory } = question;
        const { category } = subcategory;

        return <div>
            <div className="row">
                <div className="col" style={{color: 'white', paddingTop: '0.5rem', paddingBottom: '0.5rem', backgroundColor: category.color}}>
                    <h5 className="container" style={{marginBottom: 0}}>{category.name}</h5> 
                </div>
            </div>
            <div className="row">
                <div key={question.id} className="col" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                    <div className="container">
                        <p className="text-muted" style={{marginBottom: 0}}>{subcategory.name}</p>
                        <h5 style={{marginBottom: '32px'}}>{question.sort_number + 1}. {question.text}</h5>
                        { this.renderQuestionForm(question, answers) }
                    </div>
                </div>
            </div>
        </div> ;


    }

    addOrUpdateAnswer(answer) {
        const { survey } = this.props;
        runAddOrUpdateAnswer(survey, answer);
    }

    addOrUpdateAnswers(answers) {
        const { survey } = this.props;
        runAddOrUpdateAnswers(survey, answers);
    }

    removeAnswer(answer) {
        const { survey } = this.props;
        runRemoveAnswer(survey, answer);
    }

    renderQuestionForm(question, answers) {
        switch (question.type) {
            case TYPE_MULTIPLE_CHOICE:
                return <ChoiceQuestion question={question} answers={answers} storeAnswer={(answer) => this.addOrUpdateAnswer(answer)} removeAnswer={(answer) => this.removeAnswer(answer)}/>
            case TYPE_TEXT:
                return <TextQuestion question={question} answer={answers.length ? answers[0] : null} storeAnswer={(answer) => this.addOrUpdateAnswer(answer)} />
            case TYPE_TRUE_FALSE:
                return <TrueFalseQuestion question={question} answer={answers.length ? answers[0] : null} storeAnswer={(answer) => this.addOrUpdateAnswer(answer)} />
            case TYPE_TRUE_FALSE_CONTEXT:
                return <TrueFalseQuestion question={question} answer={answers.length ? answers[0] : null} allowOtherOn={'false'} storeAnswer={(answer) => this.addOrUpdateAnswer(answer)} />
            case TYPE_AMOUNT:
                return <AmountQuestion question={question} answer={answers.length ? answers[0] : null} storeAnswer={(answer) => this.addOrUpdateAnswer(answer)} />
            case TYPE_AMOUNT_CURRENCY:
                return <AmountCurrencyQuestion question={question} answer={answers.length ? answers[0] : null} storeAnswer={(answer) => this.addOrUpdateAnswer(answer)} />
            case TYPE_AMOUNT_RANGE:
            case TYPE_SINGLE_CHOICE:
                return <SingleChoiceQuestion question={question} answer={answers.length ? answers[0] : null} storeAnswer={(answer) => this.addOrUpdateAnswer(answer)} />
            case TYPE_ORDER:
                return <OrderQuestion question={question} answers={answers} storeAnswers={(answers) => this.addOrUpdateAnswers(answers)} />
        }
    }
}

Question.propTypes = {
    question: PropTypes.object.isRequired,
    survey: PropTypes.object.isRequired,
    answers: PropTypes.array.isRequired
};

export default Question;
