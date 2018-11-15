import React, { Component } from "react";
import PropTypes from "prop-types";
import Humanize from "humanize-plus";

class AmountResults extends Component {
  render() {
    const { answers, analytics, isCurrency } = this.props;
    const amount = answers[0] && answers[0].extra && answers[0].extra.amount;
    const average = analytics["average"];
    const highest = amount > average ? amount : average;

    let backgroundColor = "bg-success";
    if (permission == "true") backgroundColor = "";
    return (
      <div>
        {permission == "false" && (
          <p style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}>
            <span className="badge badge-pill badge-success">&nbsp;</span>
            &nbsp; <span className="align-middle">Your response</span>
          </p>
        )}
        <p style={{ marginBottom: "0.2rem", marginTop: "0.8rem" }}>
          Amount: {isCurrency ? "€" : ""}
          {Humanize.compactInteger(amount, 1)}
        </p>
        <div className="progress">
          <div
            className={`progress-bar ${backgroundColor}`}
            role="progressbar"
            style={{ width: `${(amount / highest) * 100}%` }}
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <p style={{ marginBottom: "0.2rem", marginTop: "0.8rem" }}>
          Average: {isCurrency ? "€" : ""}
          {Humanize.compactInteger(average, 1)}
        </p>
        <div className="progress">
          <div
            className={`progress-bar`}
            role="progressbar"
            style={{ width: `${(average / highest) * 100}%` }}
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>
    );
  }
}

AmountResults.propTypes = {
  analytics: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired
};

export default AmountResults;
