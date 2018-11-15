import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

class TextQuestion extends Component
{
    constructor() {
        super();

        this.state = {
            value: ''
        };

        this.debouncedStoreOrUpdateAnswer = debounce(this._storeOrUpdateAnswer, 500);
    }

    componentWillMount() {
        const { answer } = this.props;
        this.setState({
            value: (answer && answer.value) || ''
        });
    }

    render() {
        const { value } = this.state; 
        return <textarea className="form-control" rows="5" value={value} onChange={(e) => { this._onTextChanged(e.target.value); }}></textarea>;
    }

    /*
     * PRIVATE
     */
    _onTextChanged(value) {
        const { answer, question } = this.props;
        this.setState({
            value
        });
        this.debouncedStoreOrUpdateAnswer(Object.assign({}, answer, { 
            value,
            question_id: question.id
        }));
    }

    _storeOrUpdateAnswer(answer) {
        this.props.storeAnswer(answer);
    }
}

TextQuestion.propTypes = {
    storeAnswer: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.object
};

export default TextQuestion;