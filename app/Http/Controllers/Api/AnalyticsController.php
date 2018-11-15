<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Organisation;
use App\Models\Survey;
use App\Models\Question;
use Auth;

class AnalyticsController extends Controller
{
    protected $organisation;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Survey $survey, Question $question)
    {
        return $this->calculateAnalyticsForQuestionFromSurvey($question, $survey);
    }

    /*
     * PRIVATE
     */
    private function calculateAnalyticsForQuestionFromSurvey($question, $survey)
    {
        switch ($question->type) {
            case Question::TYPE_MULTIPLE_CHOICE:
            case Question::TYPE_SINGLE_CHOICE:
            case Question::TYPE_AMOUNT_RANGE:
                return $this->calculateAnalyticsForChoiceBasedQuestionFromSurvey($question, $survey);
            case Question::TYPE_AMOUNT:
            case Question::TYPE_AMOUNT_CURRENCY:
                return $this->calculateAnalyticsForAmountBasedQuestionFromSurvey($question, $survey);
            case Question::TYPE_TRUE_FALSE:
            case Question::TYPE_TRUE_FALSE_CONTEXT:
                return $this->calculateAnalyticsForTrueFalseQuestionFromSurvey($question, $survey);
            case Question::TYPE_ORDER:
                return $this->calculateAnalyticsForOrderBasedQuestionFromSurvey($question, $survey);
            default:
                return [];
        }
    }

    private function calculateAnalyticsForChoiceBasedQuestionFromSurvey($question, $survey)
    {
        $response = [];
        $submissionCount = $survey->answers()
            ->where('question_id', $question->id)
            ->distinct('submission_id')
            ->count('submission_id');

        foreach ($question->answerOptions as $answerOption) {
            $timesSelectedCount = $survey->answers()
                ->where('question_id', $question->id)
                ->where('value', $answerOption->value)
                ->count();
            
            $response[$answerOption->value] = $timesSelectedCount / $submissionCount;
        }
        return $response;
    }

    private function calculateAnalyticsForAmountBasedQuestionFromSurvey($question, $survey)
    {
        $response = [];
        $answers = $survey->answers()
            ->where('question_id', $question->id)
            ->get();
       
        $total = 0.0;
        $highest = 0.0;
        foreach ($answers as $answer) {
            if ($answer->extra['amount'] > $highest) {
                $highest = $answer->extra['amount'];
            }
            $total += $answer->extra['amount'];
        }
        return [
            'highest' => $highest,
            'average' => $total / $answers->count()
        ];
    }

    private function calculateAnalyticsForOrderBasedQuestionFromSurvey($question, $survey)
    {
        $response = [];
        $submissionCount = $survey->answers()
            ->where('question_id', $question->id)
            ->distinct('submission_id')
            ->count('submission_id');

        foreach ($question->answerOptions as $answerOption) {
            $timesSelectedCount = $survey->answers()
                ->where('question_id', $question->id)
                ->where('value', $answerOption->value)
                ->count();
            
            $response[$answerOption->value] = $timesSelectedCount / $submissionCount;
        }
        return $response;
    }

    private function calculateAnalyticsForTrueFalseQuestionFromSurvey($question, $survey)
    {
        $count = $survey->answers()
            ->where('question_id', $question->id)
            ->count();

        $trueCount = $survey->answers()
            ->where('question_id', $question->id)
            ->where('value', 'true')
            ->count();

        $falseCount = $survey->answers()
            ->where('question_id', $question->id)
            ->where('value', 'false')
            ->count();

        return [
            'true' => $trueCount / $count,
            'false' => $falseCount / $count
        ];
    }
}
