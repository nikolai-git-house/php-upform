import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import {getState} from '../data/store';

class AmountCurrencyQuestion extends Component
{
    constructor() {
        super();

        this.state = {
            value: '',
            currency: '',
            currencies: ''
        };

        this.debouncedStoreOrUpdateAnswer = debounce(this._storeOrUpdateAnswer, 500);
    }

    componentWillMount() {
        const { answer } = this.props;
        this.setState({
            value: (answer && answer.extra && answer.extra.original_amount) || '',
            currency: { code: (answer && answer.extra && answer.extra.original_currency) || 'eur' }
        });

        const storeState = getState();

        this.setState({
            currencies: storeState.currencies
        });
    }

    render() {
        const { value, currency, currencies } = this.state; 


        return <div className="input-group">
            <div className="input-group-prepend">
                <label className="input-group-text">Amount</label>
            </div>
            <select className="custom-select" 
                id="inputGroupSelect01" 
                style={{ maxWidth: '20%' }} 
                value={currency.code}
                onChange={(e) => {
                    const currency = currencies.filter((currentCurrency) => currentCurrency.code === e.target.value);
                    this.setState({ currency });
                    this.debouncedStoreOrUpdateAnswer();
                }}>
                { [<option key={'eur'} value="eur">Euro €</option>].concat(currencies.map((currentCurrency) => {
                    return (<option key={currentCurrency.code} value={currentCurrency.code}>{currentCurrency.name} {currentCurrency.symbol}</option>);
                })) }
            </select>
            <input type="number" step="1" className="form-control" value={value} onChange={(e) => { this._onTextChanged(e.target.value); }} />
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
        const { value, currency } = this.state;

        const newAnswer = Object.assign({}, answer, { 
            value: (currency.rate || 1 ) * value,
            question_id: question.id,
        }, {
            extra: {
                amount: (currency.rate || 1 ) * value,
                original_amount: value,
                original_currency: currency.code
            }
        });

        this.props.storeAnswer(newAnswer);
    }
}

AmountCurrencyQuestion.propTypes = {
    storeAnswer: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.object
};

export default AmountCurrencyQuestion;