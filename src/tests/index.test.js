const {getQuizzes, getQuiz, postQuiz} = require('../routes');

const mockRequest = (id, body) => {
  return {
    params: {
      id
    },
    body
  };
};
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('API', () => {
  describe('getQuizzes', () => {
    it('returns a list of quizzes', () => {
      let req = mockRequest();
      let res = mockResponse();
      getQuizzes(req, res);
      expect(res.json).toHaveBeenCalledWith([{
        "id": "math",
        "title": "Basic Math Quiz",
      }, {
        "id": "english",
        "title": "Basic English Quiz",
      }]);
    });
  });

  describe('getQuiz', () => {
    it('returns the data for a quiz', () => {
      let req = mockRequest("math");
      let res = mockResponse();
      getQuiz(req, res);
      expect(res.json).toHaveBeenCalledWith({
        "id": "math",
        "title": "Basic Math Quiz",
        "questions": [{
          "id": "question_1",
          "text": "What is 1 + 1?",
          "options": ["1", "2", "3"],
        }, {
          "id": "question_2",
          "text": "True or false: 2 + 2 = 4",
          "options": ["True", "False"],
        }, {
          "id": "question_3",
          "text": "What is the square root of 49",
          "options": ["4", "6", "7"],
        }]
      });
      req = mockRequest("english");
      res = mockResponse();
      getQuiz(req, res);
      expect(res.json).toHaveBeenCalledWith({
        "id": "english",
        "title": "Basic English Quiz",
        "questions": [{
          "id": "question_1",
          "text": "True or false: 'New York City' is a proper noun",
          "options": ["True", "False"],
        }, {
          "id": "question_2",
          "text": "What's wrong with this sentence? 'Sitting on the park bench, the sun set slowly behind the mountains.'",
          "options": ["Run-on sentence", "Dangling participle", "Comma splice"],
        }, {
          "id": "question_3",
          "text": "Which of the following is a possessive pronoun?",
          "options": ["they're", "their", "there"],
        }]
      });
    });
    it('returns a 404 if the quiz cannot be found', () => {
      let req = mockRequest("music");
      let res = mockResponse();
      getQuiz(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('postQuiz', () => {
    it('returns the correct grades for the quiz',  () => {
      let req = mockRequest("math", {
        "answers": {
          "question_1": "2",
          "question_2": "True",
          "question_3": "7"
        }
      });
      let res = mockResponse();
      postQuiz(req, res);
      expect(res.json).toHaveBeenCalledWith({
        "correct": 3,
        "incorrect": 0,
        "questions": {
          "question_1": "True",
          "question_2": "True",
          "question_3": "True"
        }
      });
      req = mockRequest("math", {
        "answers": {
          "question_1": "1",
          "question_2": "False"
        }
      });
      res = mockResponse();
      postQuiz(req, res);
      expect(res.json).toHaveBeenCalledWith({
        "correct": 0,
        "incorrect": 2,
        "questions": {
          "question_1": "False",
          "question_2": "False"
        }
      });
    });
  });
});