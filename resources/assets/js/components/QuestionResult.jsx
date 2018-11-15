import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Spinner from "react-spinkit";

import ChoicesResults from "./ChoicesResults";
import TrueFalseResults from "./TrueFalseResults";
import AmountResults from "./AmountResults";
import TextResults from "./TextResults";

const TYPE_MULTIPLE_CHOICE = "multiple_choice";
const TYPE_SINGLE_CHOICE = "single_choice";
const TYPE_TEXT = "text";
const TYPE_TRUE_FALSE = "true_false";
const TYPE_TRUE_FALSE_CONTEXT = "true_false_context";
const TYPE_AMOUNT = "amount";
const TYPE_AMOUNT_CURRENCY = "amount_currency";
const TYPE_AMOUNT_RANGE = "amount_range";
const TYPE_ORDER = "order";

class QuestionResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false, // If we have an answer, we can start loading the analytics
      analytics: null
    };
  }

  componentWillMount() {
    const { survey, question, answers } = this.props;
    if (answers.length) {
      this.loadAnalyticsForSurveyAndQuestion(survey, question);
    }
  }

  componentWillUpdate(nextProps) {
    const { survey, question, answers } = nextProps;

    if (nextProps.answers !== this.props.answers && answers.length) {
      this.loadAnalyticsForSurveyAndQuestion(survey, question);
    }
  }

  loadAnalyticsForSurveyAndQuestion(survey, question) {
    this.setState({
      isLoading: true
    });
    axios
      .get(`/api/surveys/${survey.id}/questions/${question.id}/analytics`)
      .then(res => {
        this.setState({
          analytics: res.data
        });
        setTimeout(() => {
          this.setState({
            isLoading: false
          });
        }, 1);
      });
  }

  render() {
    const { isLoading, analytics } = this.state;
    const { question, counter } = this.props;
    return (
      <div>
        <h5>
          {counter}. {question.text}
        </h5>
        {isLoading
          ? this.renderLoader()
          : analytics
            ? this.renderResults()
            : this.renderEmpty()}
      </div>
    );
  }

  renderLoader() {
    return (
      <div className="row" style={{ minHeight: "10rem" }}>
        <div className="col align-self-center text-center">
          <div className="d-inline-block">
            <Spinner name="line-scale-pulse-out-rapid" />
          </div>
        </div>
      </div>
    );
  }

  renderResults() {
    const { question, answers } = this.props;
    const { analytics } = this.state;

    const getQuestionResults = () => {
      switch (question.type) {
        case TYPE_MULTIPLE_CHOICE:
        case TYPE_SINGLE_CHOICE:
        case TYPE_AMOUNT_RANGE:
          return (
            <ChoicesResults
              options={question.answer_options}
              answers={answers}
              analytics={analytics}
            />
          );
        case TYPE_AMOUNT:
          return (
            <AmountResults
              answers={answers}
              analytics={analytics}
              isCurrency={false}
            />
          );
        case TYPE_AMOUNT_CURRENCY:
          return (
            <AmountResults
              answers={answers}
              analytics={analytics}
              isCurrency={true}
            />
          );
        case TYPE_TRUE_FALSE:
        case TYPE_TRUE_FALSE_CONTEXT:
          return <TrueFalseResults answers={answers} analytics={analytics} />;
        case TYPE_TEXT:
          return (
            <TextResults answer={answers && answers.length && answers[0]} />
          );
      }
    };

    return (
      <div>
        {getQuestionResults()}

        <p style={{ margin: "1.2rem 0" }}>
          {permission == "false" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.onEditClick()}
            >
              Edit
            </button>
          )}
        </p>
      </div>
    );
  }

  renderEmpty() {
    return (
      <div>
        <p style={{ margin: "1.2rem 0" }}>
          Complete this question to benchmark your organisation with other
          organisations.
        </p>
        <p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.onEditClick()}
          >
            Complete question
          </button>
        </p>
      </div>
    );
  }

  onEditClick() {
    const { onEdit, question } = this.props;
    onEdit(question);
  }
}

QuestionResult.propTypes = {
  survey: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  counter: PropTypes.number.isRequired,
  answers: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default QuestionResult;
