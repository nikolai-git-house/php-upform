<?php

namespace App\Http\Controllers\Api;

use App\Models\AnswerOption;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Question;
use App\Models\Survey;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Survey $survey
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function index(Survey $survey)
    {
        return $survey->questions()
            ->with('answerOptions')
            ->with('subcategory.category')
            ->get();
    }

    /**
     * Display the specified resource.
     *
     * @param Survey $survey
     * @param Question $question
     * @return Question
     */
    public function show(Survey $survey, Question $question)
    {
        return $question->load('answerOptions');
    }

    public function store($survey_id)
    {
        $dataQuestion = request()->validate([
            'type' => 'required',
            'text' => 'required',
            'subcategory_id' => 'required',
            'answers' => empty(request()->answers) ? '' : 'required'
        ]);

        $dataQuestion['type'] == 'Multiple Choice' ? $dataQuestion['type'] = 'multiple_choice' : false;
        $dataQuestion['type'] == 'Single Choice' ? $dataQuestion['type'] = 'single_choice' : false;
        $dataQuestion['type'] == 'True or False' ? $dataQuestion['type'] = 'true_false' : false;
        $dataQuestion['type'] == 'Amount of Currency' ? $dataQuestion['type'] = 'amount_currency' : false;
        $dataQuestion['type'] == 'Amount' ? $dataQuestion['type'] = 'amount' : false;
        $dataQuestion['type'] == 'Amount Range' ? $dataQuestion['type'] = 'amount_range' : false;
        $dataQuestion['type'] == 'Order' ? $dataQuestion['type'] = 'order' : false;

        $dataQuestion['sort_number'] = Question::all()->last()->id + 1;

        $question = Question::create($dataQuestion);
        $question->surveys()->attach($survey_id);


        if ($dataQuestion['answers']) {
            $sort_number = 0;
            foreach ($dataQuestion['answers'] as $answerText) {
                $dataAnswer = [
                    'text' => $answerText,
                    'sort_number' => $sort_number,
                    'question_id' => $question->id,
                    'value' => $answerText
                ];

                AnswerOption::create($dataAnswer);
                $sort_number++;
            }
        }

        $survey = Survey::find($survey_id);

        return self::index($survey);
    }

    public function destroy($survey_id, $question_id)
    {
        Question::destroy($question_id);
        $questions = Survey::find($survey_id)->questions()->get();

        return $questions;
    }
}
