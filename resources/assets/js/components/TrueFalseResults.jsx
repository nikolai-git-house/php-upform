import React, { Component } from "react";
import PropTypes from "prop-types";

class TrueFalseResults extends Component {
  render() {
    const { answers, analytics } = this.props;

    const truePercentage = analytics["true"];
    const falsePercentage = analytics["false"];

    let trueBackgroundColor = answers[0].value === "true" ? "bg-success" : "";
    let falseBackgroundColor = answers[0].value === "false" ? "bg-success" : "";
    if (permission == "true") {
      trueBackgroundColor = "";
      falseBackgroundColor = "";
    }
    return (
      <div>
        {permission == "false" && (
          <p style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}>
            <span className="badge badge-pill badge-success">&nbsp;</span>
            &nbsp; <span className="align-middle">Your response</span>
          </p>
        )}
        <p style={{ marginBottom: "0.2rem", marginTop: "0.8rem" }}>Yes</p>
        <div className="progress">
          <div
            className={`progress-bar ${trueBackgroundColor}`}
            role="progressbar"
            style={{ width: `${truePercentage * 100}%` }}
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.round(truePercentage * 100)}%
          </div>
        </div>
        <p style={{ marginBottom: "0.2rem", marginTop: "0.8rem" }}>No</p>
        <div className="progress">
          <div
            className={`progress-bar ${falseBackgroundColor}`}
            role="progressbar"
            style={{ width: `${falsePercentage * 100}%` }}
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.round(falsePercentage * 100)}%
          </div>
        </div>
      </div>
    );
  }
}

TrueFalseResults.propTypes = {
  analytics: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired
};

export default TrueFalseResults;
