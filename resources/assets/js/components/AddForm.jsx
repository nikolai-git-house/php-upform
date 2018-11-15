import React, { Component } from "react";
import { runAddQuiz } from "../stories/index";

let qtype = [
  { key: 0, value: "Multiple Choice" },
  { key: 1, value: "Single Choice" },
  { key: 2, value: "True or False" },
  { key: 3, value: "Amount of Currency" },
  { key: 4, value: "Amount" },
  { key: 5, value: "Amount Range" },
  { key: 6, value: "Order" }
];
let choice_on_off = [true, true, false, false, false, true, true];
class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "1",
      subcategory: [],
      choices: [],
      type: "0"
    };

    this.onChange = this.onChange.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
  }
  componentWillMount() {
    this.setState({ subcategory: this.props.data[0]["subcategories"] });
  }
  onChange(event) {
    //console.log(event.target.value);
    let id = event.target.value;
    this.setState({ category: event.target.value });
    this.setState({ subcategory: this.props.data[id - 1]["subcategories"] });
  }
  onChangeType(event) {
    let id = event.target.value;
    this.setState({ type: id });
    this.setState({ choices: [] });
  }
  addChoice() {
    let choice = document.getElementById("choice").value;
    if (choice) {
      let arr = this.state.choices;
      arr.push(choice);
      arr.unique();
      this.setState({ choices: arr });
    }
  }
  onSubmit() {
    let survey = this.props.survey;

    let category = document.getElementById("category").value;
    let subcategory = document.getElementById("subcategory").value;
    let title = document.getElementById("title").value;
    let choices = this.state.choices;
    let type = qtype[this.state.type].key;
    let type_text = qtype[this.state.type].value;
    let question = {
      type: type_text,
      text: title,
      subcategory_id: subcategory,
      answers: choices
    };
    let flag = choice_on_off[type];
    //question = JSON.stringify(question);
    console.log("question=", question);
    if (subcategory && title && (choices.length || !flag))
      runAddQuiz(survey, question);
    else alert("Please fill all fields!");
  }
  render() {
    return (
      <div className="container-fluid">
        <h1>Add a question</h1>
        <h2>Category</h2>
        <div className="form-group">
          <label htmlFor="category">Select / add a category</label>
          <select
            className="form-control"
            id="category"
            onChange={this.onChange}
            value={this.state.category}
          >
            {this.props.data.map(category => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subcategory">Select / add a subcategory</label>
          <select className="form-control" id="subcategory">
            {this.state.subcategory.map(subcategory => (
              <option value={subcategory.id} key={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <h2>Question type</h2>
          <label>Select the type of question</label>
          <br />
          <select
            type="text"
            placeholder="Your question"
            id="type"
            onChange={this.onChangeType}
            value={this.state.type}
          >
            {qtype.map(type => (
              <option value={type.key} key={type.key}>
                {type.value}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <h2>Question</h2>
          <label>Full question</label>
          <br />
          <input type="text" placeholder="Your question" id="title" />
        </div>
        {choice_on_off[this.state.type] && (
          <div className="form-group">
            <h2>Answers</h2>
            <label>Submit a choice</label>
            <br />
            <input type="text" placeholder="Choice" id="choice" />
            <br />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.addChoice()}
            >
              {" "}
              Add choice
            </button>
            <br />
            <br />
            <label>Overview</label>
            <br />
            <textarea
              rows="3"
              id="overview"
              value={this.state.choices.toString()}
            />
          </div>
        )}
        <div style={{ backgroundColor: "#eaeaea" }}>
          <h2>Add question</h2>
          <br />
          <label>
            Double check before submitting your question to all the members. In
            this version you cannot edit the questions afterwards.
          </label>
          <br />
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#submitModal"
          >
            {" "}
            Submit
          </button>
          <button
            className="btn btn-primary"
            onClick={() => this.props.exitForm()}
            style={{ marginRight: "1rem" }}
          >
            Back to overview
          </button>
          <br />
        </div>
        <div
          className="modal fade"
          id="submitModal"
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
                <p>Are you sure to submit this question?</p>
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
                  onClick={() => this.onSubmit()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Array.prototype.unique = function() {
  let a = [];
  for (let i = 0; i < this.length; i++) {
    let current = this[i];
    if (a.indexOf(current) < 0) a.push(current);
  }

  this.length = 0;
  for (let i = 0; i < a.length; i++) {
    this.push(a[i]);
  }

  return this;
};
export default AddForm;
