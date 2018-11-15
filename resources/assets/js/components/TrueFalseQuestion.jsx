import React, { Component } from 'react';
import PropTypes from 'prop-types';

const OPTIONS = [
    {
        value: 'true',
        text: 'Yes'
    },
    {
        value: 'false',
        text: 'No'
    }
];

class TrueFalseQuestion extends Component
{
    constructor() {
        super();

        this.state = {
            text: ''
        };
    }

    render() {
        const { answer, allowOtherOn } = this.props;

        return <div>
        { OPTIONS.map((option) => {
            return [
            <button key={option.value} 
                className={`btn btn-block ${ answer && answer.value === option.value ? 'btn-success' : 'btn-outline-secondary' }`} 
                style={{ marginTop: '0.5rem', marginRight: '0.5rem', marginBottom: '0.5rem', maxWidth: '300px' }}
                onClick={() => { this._toggleOption(option) }}
                >{ option.text }</button>,
                (allowOtherOn && allowOtherOn === option.value) ? <input className="form-control" /> : null
            ];
        }) }
    </div>;
    }

    /*
     * PRIVATE
     */
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
}
TrueFalseQuestion.propTypes = {
    question: PropTypes.object.isRequired,
    answer: PropTypes.object,
    allowOtherOn: PropTypes.string
};

export default TrueFalseQuestion;