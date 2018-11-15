import React, { Component } from "react";
import PropTypes from "prop-types";

class ChoicesResults extends Component {
  render() {
    const { options, answers, analytics } = this.props;
    return (
      <div>
        {permission == "false" && (
          <p style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}>
            <span className="badge badge-pill badge-success">&nbsp;</span>
            &nbsp; <span className="align-middle">Your response</span>
          </p>
        )}
        {options.map(option => {
          let value = 0.0;
          if (analytics[option.value]) {
            value = analytics[option.value];
          }
          const isOwnAnswer =
            answers.filter(answer => {
              return answer.value === option.value;
            }).length > 0;

          let backgroundColor = isOwnAnswer ? "bg-success" : "";
          if (permission == "true") backgroundColor = "";
          return (
            <div key={option.id}>
              <p style={{ marginBottom: "0.2rem", marginTop: "0.8rem" }}>
                {option.text}
              </p>
              <div className="progress">
                <div
                  className={`progress-bar ${backgroundColor}`}
                  role="progressbar"
                  style={{ width: `${Math.round(value * 100)}%` }}
                  aria-valuenow={Math.round(value * 100)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {value > 0.05 ? Math.round(value * 100) + "%" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ChoicesResults.propTypes = {
  analytics: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired
};

export default ChoicesResults;
