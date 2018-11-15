import React, { Component } from "react";
import PropTypes from "prop-types";

class TextResults extends Component {
  render() {
    const { answer } = this.props;

    return (
      <div>
        {permission == "false" && (
          <p style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}>
            <strong>Your response:</strong>
            <br />
            {answer.value}
          </p>
        )}
      </div>
    );
  }
}

TextResults.propTypes = {
  answer: PropTypes.object.isRequired
};

export default TextResults;
