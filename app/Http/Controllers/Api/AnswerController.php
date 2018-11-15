<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Organisation;
use App\Models\Answer;
use App\Http\Requests\StoreAnswerRequest;
use App\Models\Survey;
use App\Models\Submission;
use App\Models\Question;
use App\Models\AnswerOption;
use Auth;

class AnswerController extends Controller
{
    protected $organisation;

    /**
     * Display a listing of the resource.
     *
     * @param Survey $survey
     * @return \Illuminate\Http\Response
     */
    public function index(Survey $survey)
    {
        $submission = Submission::findOrCreateForOrganisationAndSurvey($this->currentOrganisation(), $survey);

        return $submission->answers;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Survey $survey
     * @param StoreAnswerRequest $request
     *
     * @return Answer|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model
     */
    public function store(Survey $survey, StoreAnswerRequest $request)
    {
        $submission = Submission::findOrCreateForOrganisationAndSurvey($this->currentOrganisation(), $survey);

        $question = Question::findOrFail($request->input('question_id'));

        $answerOptionId = $request->input('answer_option_id');
        if ($answerOptionId) {
            $answerOption = AnswerOption::findOrFail($answerOptionId);
        }

        $answerId = $request->input('id');

        $answer = new Answer();
        if ($answerId) {
            $answer = Answer::findOrFail($answerId);
        }
        
        $answer->value = $request->input('value');
        $answer->text = $request->input('text');
        $answer->extra = $request->input('extra');
        $answer->question()->associate($question);
        $answer->survey()->associate($survey);
        $answer->submission()->associate($submission);
        $answer->save();

        return $answer;
    }

    /**
     * Delete an answer from a submission.
     *
     * @param Survey $survey
     * @param Answer $answer
     * @param \Illuminate\Http\Request $request
     *
     * @return Answer
     * @throws \Exception
     */
    public function destroy(Survey $survey, Answer $answer, Request $request)
    {
        // TODO: Check if the organisation can delete the answer.

        $answer->delete();

        return $answer;
    }
}
