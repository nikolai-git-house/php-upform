import axios from "axios";
import { getState, setState } from "../data/store";

export const runLoadLatestSurvey = () => {
  return axios.get("/api/surveys").then(res => {
    if (res.data && res.data.length) {
      const survey = res.data[0];
      setState({
        survey
      });
      return res.data[0];
    }
    return res.data;
  });
};

export const runLoadAnswersForSurvey = survey => {
  return axios.get(`/api/surveys/${survey.id}/answers`).then(res => {
    setState({
      answers: res.data
    });
    return res.data;
  });
};

export const runLoadOrganisation = () => {
  return axios.get("/api/organisation").then(res => {
    setState({
      organisation: res.data
    });
    return res.data;
  });
};

export const runLoadCurrencies = () => {
  return axios.get("/api/currencies").then(res => {
    setState({
      currencies: res.data
    });
    return res.data;
  });
};

export const runAddQuiz = (survey, question) => {
  return axios.post(`/api/surveys/${survey.id}/questions`, question);
};
export const destroyQuiz = (survey, question) => {
  return axios.delete(`/api/surveys/${survey.id}/questions/${question.id}`);
};
const storeAnswer = (survey, answer) => {
  return axios.post(`/api/surveys/${survey.id}/answers`, answer);
};

export const runAddOrUpdateAnswer = (survey, answer) => {
  const state = getState();
  setState({
    answers: [
      ...state.answers.filter(currentAnswer => currentAnswer.id !== answer.id),
      answer
    ]
  });
  return storeAnswer(survey, answer).then(() =>
    runLoadAnswersForSurvey(survey)
  );
};

export const runAddOrUpdateAnswers = (survey, answers) => {
  const promises = answers.map(answer => storeAnswer(survey, answer));
  Promise.all(promises).then(() => runLoadAnswersForSurvey(survey));
};

const destroyAnswer = (survey, answer) => {
  return axios.delete(`/api/surveys/${survey.id}/answers/${answer.id}`);
};

export const runRemoveAnswer = (survey, answer) => {
  const state = getState();
  setState({
    answers: state.answers.filter(
      existingAnswer => answer.id !== existingAnswer.id
    )
  });
  return destroyAnswer(survey, answer).then(() =>
    runLoadAnswersForSurvey(survey)
  );
};

export const runBoot = () => {
  return runLoadLatestSurvey()
    .then(survey => runLoadAnswersForSurvey(survey))
    .then(() => runLoadOrganisation())
    .then(() => runLoadCurrencies());
};

export const getCategories = () => {
  return axios.get("/api/categories");
};
