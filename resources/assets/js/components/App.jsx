import React, { Component } from "react";
import axios from "axios";
import Spinner from "react-spinkit";

import Results from "./Results";
import EditForm from "./Form";
import AddForm from "./AddForm";

import { getState, setState, addListener, removeListener } from "../data/store";
import {
  runLoadAnswersForSurvey,
  runBoot,
  getCategories
} from "../stories/index";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      organisation: null,
      survey: null,
      answers: null,
      isLoading: true,
      isEditing: false,
      isAdding: false,
      currentQuestion: null
    };
  }

  componentWillMount() {
    this.storeListener = addListener(state => {
      this.setState({
        organisation: state.organisation,
        survey: state.survey,
        answers: state.answers
      });
    });
    getCategories().then(res => {
      console.log("categories=", res.data);
      this.setState({ categories: res.data });
    });
    runBoot().then(() => {
      setTimeout(() => {
        this.setState({
          isLoading: false
        });
      }, 1);
    });
  }

  componentWillUnmount() {
    removeListener(this.storeListener);
  }

  render() {
    const { isEditing, survey, isLoading, isAdding } = this.state;
    if (isLoading) {
      return this.renderLoader();
    } else if (isEditing) {
      return this.renderForm();
    } else if (isAdding) {
      return this.renderAddQuiz();
    } else if (survey) {
      return this.renderSurveyResults();
    } else {
      return this.renderNoActiveSurvey();
    }
  }

  /*
     * PRIVATE
     */
  renderNoActiveSurvey() {
    return (
      <div className="container">
        <h1>There's currently no survey active. Check back soon.</h1>
      </div>
    );
  }

  renderSurveyResults() {
    const { survey, organisation, answers } = this.state;

    return (
      <Results
        survey={survey}
        answers={answers}
        organisation={organisation}
        onEdit={question => this.onQuestionEdit(question)}
        onAdd={() => this.onAddQuiz()}
      />
    );
  }

  renderForm() {
    const { survey, answers, currentQuestion } = this.state;
    return (
      <EditForm
        answers={answers}
        survey={survey}
        currentQuestion={currentQuestion}
        goToQuestion={question => this.onQuestionEdit(question)}
        exitForm={() => {
          this.exitForm();
        }}
      />
    );
  }
  renderAddQuiz() {
    const { survey } = this.state;
    return (
      <AddForm
        exitForm={() => {
          this.exitAddForm();
        }}
        data={this.state.categories}
        survey={survey}
      />
    );
  }
  renderLoader() {
    return (
      <div className="row">
        <div className="col-sm-12 text-center" style={{ height: "100vh" }}>
          <Spinner
            name="ball-scale-ripple"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          />
        </div>
      </div>
    );
  }

  updateAnswers(survey) {
    return runLoadAnswersForSurvey(survey);
  }

  onQuestionEdit(question) {
    this.setState({
      isEditing: true,
      currentQuestion: question
    });
  }
  onAddQuiz() {
    this.setState({
      isAdding: true
    });
  }
  exitForm() {
    const { survey } = this.state;
    this.updateAnswers(survey);

    this.setState({
      isEditing: false,
      currentQuestion: null
    });
  }
  exitAddForm() {
    this.setState({
      isAdding: false
    });
  }
}

export default App;
