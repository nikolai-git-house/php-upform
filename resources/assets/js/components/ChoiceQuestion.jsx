import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

class ChoiceQuestion extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            other: null 
        };

        this.debouncedStoreOrUpdateAnswer = debounce(this._storeOrUpdateAnswer, 500);
    }

    render() {
        const { other } = this.state;
        const { question, answers = [] } = this.props;
        const answerValues = answers.map((answer) => answer.value);
        const otherOptionValues = question.answer_options.filter((option) => option.text.toLowerCase().includes('please specify')).map((option) => option.value);
        const otherAnswers = answers.filter((answer) => otherOptionValues.includes(answer.value));

        return <div>
            { question.answer_options.map((option) => {
                if (option.text && option.text.toLowerCase().includes('please specify') && answerValues.includes(option.value)) {
                    return (<div key={option.id}>
                        <button
                            className={`btn ${ answerValues.includes(option.value) ? 'btn-success' : 'btn-outline-secondary' }`} 
                            style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}
                            onClick={() => { this.toggleOption(option) }}
                            >{ option.text }</button>
                        <br/>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={ other || (otherAnswers.length && otherAnswers[0].extra && otherAnswers[0].extra.other) || '' }
                            onChange={(e) => { this._onTextChanged(e.target.value) }} 
                            style={{ marginTop: '0.5rem' }}
                            />
                    </div>); 
                }
                return (
                    <button key={option.id} 
                    className={`btn ${ answerValues.includes(option.value) ? 'btn-success' : 'btn-outline-secondary' }`} 
                    style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}
                    onClick={() => { this.toggleOption(option) }}
                    >{ option.text }</button>
                );
            }) }
        </div>;
    }

    toggleOption(option) {
        const { question, answers = [] } = this.props;
        const answerValues = answers.map((answer) => answer.value);

        if (answerValues.includes(option.value)) {
            const filteredAnswers = answers.filter((answer) => {
                return answer.value === option.value;
            })
            this.props.removeAnswer(filteredAnswers[0]);
        } else {
            this.props.storeAnswer({
                value: option.value,
                text: option.text,
                question_id: question.id,
                answer_option_id: option.id
            });
        }
    }

    _onTextChanged(value) {
        this.setState({
            other: value
        });
        this.debouncedStoreOrUpdateAnswer();
    }

    _storeOrUpdateAnswer() {
        const { answers, question } = this.props;
        const { other } = this.state;

        const otherOptionValues = question.answer_options.filter((option) => option.text.toLowerCase().includes('please specify')).map((option) => option.value);
        const otherAnswers = answers.filter((answer) => otherOptionValues.includes(answer.value));

        if (otherAnswers.length) {
            const newAnswer = Object.assign({}, otherAnswers[0], { 
                extra: {
                    other
                }
            });

            this.props.storeAnswer(newAnswer);
        }
    }
}

ChoiceQuestion.propTypes = {
    question: PropTypes.object.isRequired,
    removeAnswer: PropTypes.func.isRequired,
    storeAnswer: PropTypes.func.isRequired,
    answers: PropTypes.array
};

export default ChoiceQuestion;