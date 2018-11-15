import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const mapIndexToLetter = (index) => {
    return ALPHABET.charAt(index % ALPHABET.length);
};

class SingleChoiceQuestion extends Component
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
        const { question, answer } = this.props;

        return <div>
            { question.answer_options.map((option, index) => {
                const optionSelected = answer && answer.value && answer.value === option.value
                if (option.text && option.text.toLowerCase().includes('please specify') && optionSelected) {
                    return (<div key={option.id}>
                        <button
                            className={`btn btn-block ${ answer && answer.value === option.value ? 'btn-success' : 'btn-outline-secondary' }`} 
                            style={{ marginTop: '0.5rem', marginRight: '0.5rem', maxWidth: '300px' }}
                            onClick={() => { this._toggleOption(option) }}
                        >{ mapIndexToLetter(index).toUpperCase() }. { option.text }</button>
                        <br/>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={ other || (answer && answer.extra && answer.extra.other) || '' }
                            onChange={(e) => { this._onTextChanged(e.target.value) }} 
                            style={{ marginTop: '0.5rem' }}
                            />
                    </div>); 
                }

                return <button key={option.id} 
                    className={`btn btn-block ${ optionSelected ? 'btn-success' : 'btn-outline-secondary' }`} 
                    style={{ marginTop: '0.5rem', marginRight: '0.5rem', maxWidth: '300px' }}
                    onClick={() => { this._toggleOption(option) }}
                    >{ mapIndexToLetter(index).toUpperCase() }. { option.text }</button>;
            }) }
        </div>;
    }

    _toggleOption(option) {
        const { question, answer } = this.props;

        if (!answer || answer.value !== option.value) {
            this.props.storeAnswer(Object.assign({}, answer, {
                value: option.value,
                text: option.text,
                question_id: question.id,
                answer_option_id: option.id
            }));
        }
    }

    _onTextChanged(value) {
        this.setState({
            other: value
        });
        this.debouncedStoreOrUpdateAnswer();
    }

    _storeOrUpdateAnswer() {
        const { answer, question } = this.props;
        const { other } = this.state;

        const otherOptionValues = question.answer_options.filter((option) => option.text.toLowerCase().includes('please specify')).map((option) => option.value);

        if (otherOptionValues.includes(answer.value)) {
            const newAnswer = Object.assign({}, answer, { 
                extra: {
                    other
                }
            });

            this.props.storeAnswer(newAnswer);
        }
    }
}

SingleChoiceQuestion.propTypes = {
    question: PropTypes.object.isRequired,
    answer: PropTypes.object,
    storeAnswer: PropTypes.func.isRequired,
};

export default SingleChoiceQuestion;