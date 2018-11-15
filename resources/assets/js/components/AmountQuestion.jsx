import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

class AmountQuestion extends Component
{
    constructor() {
        super();

        this.state = {
            value: '',
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


        return <div className="input-group">
            {/*<div className="input-group-prepend">*/}
                {/*<label className="input-group-text" for="inputGroupSelect01">Amount</label>*/}
            {/*</div>*/}
            <input type="number" step="1" class="form-control" value={value} onChange={(e) => { this._onTextChanged(e.target.value); }} />
        </div>
    }

    /*
     * PRIVATE
     */
    _onTextChanged(value) {
        this.setState({
            value
        });
        this.debouncedStoreOrUpdateAnswer();
    }

    _storeOrUpdateAnswer() {
        const { answer, question } = this.props;
        const { value } = this.state;

        const newAnswer = Object.assign({}, answer, { 
            value,
            question_id: question.id,
        });

        this.props.storeAnswer(newAnswer);
    }
}

AmountQuestion.propTypes = {
    storeAnswer: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.object
};

export default AmountQuestion;
