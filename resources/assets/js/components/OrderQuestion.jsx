import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value, number}) =>
    <div className="card" style={{ cursor: 'move', marginBottom: '0.5rem' }}>
        <div className="card-body">
        {number}. {value}
        </div>
    </div>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((option, index) => (
        <SortableItem key={`item-${index}`} index={index} value={option.text} number={index + 1} />
      ))}
    </ul>
  );
});

class OrderQuestion extends Component
{
    constructor(props) {
        super(props);

        const { question, answers } = props;
        const optionValues = question.answer_options.map((option) => option.value);

        let answersToSort = [];
        if (answers && answers.length) {
            answersToSort = answers.filter((answer) => optionValues.includes(answer.value));
        } else {
            answersToSort = question.answer_options.map((option, index) => ({
                question_id: question.id,
                answer_option_id: option.id,
                value: option.value,
                text: option.text,
                extra: {
                    order: index
                }
            }));
        }

        this.state = {
            answers: answersToSort.sort((a, b) => (a && a.extra && a.extra.order) > (b && b.extra && b.extra.order))
        }
    }

    componentWillReceiveProps(nextProps) {
        const { question, answers } = nextProps;
        const optionValues = question.answer_options.map((option) => option.value);

        if (nextProps.answers !== this.props.answers) {
            this.setState({
                answers: answers
                .filter((answer) => optionValues.includes(answer.value))
                .sort((a, b) => (a && a.extra && a.extra.order) > (b && b.extra && b.extra.order))
            });
        }
    }

    render() {
        const { answers } = this.state;
        const { question } = this.props;

        return <div className="no-selection">
            <SortableList items={answers} onSortEnd={(params) => this.onSortEnd(params)} />
        </div>;
    }

    onSortEnd({oldIndex, newIndex}) {
        const { storeAnswers } = this.props;
        this.setState({
          answers: arrayMove(this.state.answers, oldIndex, newIndex),
        });

        storeAnswers(this.state.answers.map((answer, index) => ({ ...answer, extra: { order: index } })))
      }
}

OrderQuestion.propTypes = {
    question: PropTypes.object.isRequired,
    answers: PropTypes.array,
    storeAnswers: PropTypes.func.isRequired
};

export default OrderQuestion;
