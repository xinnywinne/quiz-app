const quizzes = require('../../data/quizzes.json');
const QUESTION = "questions";
const ANSWER = "answer";
const ANSWERS = "answers";

/**
 * Returns a list of quizzes with titles and IDs
 */
function getQuizzes(req, res, next) {
  const ret = Object.values(quizzes).map(quiz => {
    return {
      id: quiz.id,
      title: quiz.title
    };
  });
  return res.json(ret);
}

/** 
 * Returns quiz data for the given ID, omitting the answers
 */
function getQuiz(req, res, next) {
  const foundQuiz = Object.values(quizzes).find(quiz => quiz.id === req.params.id );
  if (foundQuiz) {
    //deep copy foundQuiz to returnQuiz
    let returnQuiz = JSON.parse(JSON.stringify(foundQuiz));
    returnQuiz[QUESTION].forEach(question => {
      delete question[ANSWER]
    });
    res.json(returnQuiz);
  } else {
    res.status(404).json({
      msg: `Quiz ${req.params.id} not exist`
    });
  }
}

/**
 * Handles a quiz submission and returns a graded result
 */
function postQuiz(req, res, next) {
  let questionRes = {};
  let correctNum = 0;
  let incorrectNum = 0;
  quizzes[req.params.id][QUESTION].forEach(question => {
    const found = req.body[ANSWERS].hasOwnProperty(question.id);
    //Compares the answers only when the request question.id exists in quizzes.
    if (found) {
      if (req.body[ANSWERS][question.id] === question.answer) {
        correctNum++;
        questionRes[question.id] = "True";
      } else {
        incorrectNum++;
        questionRes[question.id] = "False";
      }
    }
  });
  const quizRes = {
    "correct": correctNum,
    "incorrect": incorrectNum,
    "questions": questionRes
  };
  res.json(quizRes);
}

module.exports = {
  getQuizzes,
  getQuiz,
  postQuiz,
};
