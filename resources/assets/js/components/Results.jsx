import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import QuestionResult from "./QuestionResult";
import Header from "./ResultsHeader";
import { destroyQuiz, runBoot } from "../stories/index";

class Results extends Component {
  constructor(props) {
    super(props);

    this.questionCounter = 0;
    this.state = {
      question: ""
    };
  }

  render() {
    this.questionCounter = 0;
    const { survey, organisation } = this.props;
    const categories = this.mapQuestionsToCategories(survey.questions);
    let title,
      subtitle = "";
    if (permission == "true") {
      title = "EFC Benchmark Report";
      subtitle = "Dashboard";
    } else {
      title = organisation.name;
      subtitle = "Benchmark Report";
    }
    //console.log("categories", categories);
    //console.log("questions", survey.questions);
    return (
      <div className="container-fluid">
        <Header title={title} subtitle={subtitle} />
        {permission == "true" && (
          <div
            className="row"
            style={{
              paddingTop: "1rem",
              paddingBottom: "1rem"
            }}
          >
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginLeft: 40, marginRight: 40 }}
              onClick={() => this.props.onAdd()}
            >
              Add new question
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#exportModal"
            >
              ExportData
            </button>
          </div>
        )}
        {categories.map(category => {
          return this.renderCategory(category);
        })}
        <div
          className="modal fade"
          id="removeModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure to delete this question?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={() => this.onRemoveQuestion(this.state.question)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="exportModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Where do you want to export data?</p>
              </div>
              <div className="modal-footer">
                <a href={excelurl}>
                  <button type="button" className="btn btn-secondary">
                    Excel
                  </button>
                </a>
                <a href={csvurl}>
                  <button type="button" className="btn btn-primary">
                    CSV
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
     * PRIVATE
     */
  mapQuestionsToCategories(questions = []) {
    const categories = [];

    const sortedQuestions = questions.sort(
      (a, b) => a.subcategory.category_id - b.subcategory.category_id
    );
    console.log(sortedQuestions);

    let currentCategory = null;
    sortedQuestions.forEach(question => {
      if (categories.length) {
        currentCategory = categories[categories.length - 1];
      }
      if (
        !currentCategory ||
        currentCategory.id !== question.subcategory.category.id
      ) {
        currentCategory = {
          id: question.subcategory.category.id,
          name: question.subcategory.category.name,
          color: question.subcategory.category.color,
          questions: []
        };
        categories.push(currentCategory);
      }
      currentCategory.questions.push(question);
    });

    return categories;
  }

  renderCategory(category) {
    return (
      <div key={category.id}>
        <div className="row">
          <div
            className="col"
            style={{
              color: "white",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              backgroundColor: category.color
            }}
          >
            <h5 style={{ marginBottom: 0 }}>{category.name}</h5>
          </div>
        </div>
        <div className="row">
          {category.questions.map(question => {
            return this.renderQuestion(question);
          })}
        </div>
      </div>
    );
  }

  renderQuestion(question) {
    this.questionCounter++;
    const { answers } = this.props;

    const filteredAnswers = answers.filter(answer => {
      return answer.question_id == question.id;
    });

    return (
      <div
        key={question.id}
        className="col-12 col-md-6 col-lg-4 col-xl-3"
        style={{
          paddingTop: "1rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #D8D8D8",
          borderRight: "1px solid #D8D8D8"
        }}
      >
        <p className="text-muted" style={{ marginBottom: 0 }}>
          {question.subcategory.name}
        </p>
        <QuestionResult
          answers={filteredAnswers}
          survey={this.props.survey}
          question={question}
          counter={this.questionCounter}
          onEdit={question => this.props.onEdit(question)}
        />
        {permission == "true" && (
          <button
            type="button"
            className="btn btn-danger"
            data-toggle="modal"
            data-target="#removeModal"
            onClick={() => {
              this.setState({ question: question });
            }}
          >
            Remove question
          </button>
        )}
      </div>
    );
  }

  onRemoveQuestion(question) {
    let survey = this.props.survey;
    destroyQuiz(survey, question);
    runBoot();
    //console.log(question.id);
  }

  onExportData() {}
}

Results.propTypes = {
  survey: PropTypes.object.isRequired,
  organisation: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};

export default Results;
