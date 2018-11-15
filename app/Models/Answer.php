<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{

        /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'extra' => 'array'
    ];

    public static function createOrUpdateForSubmissionAndQuestionWithValue($submission, $question, $value)
    {
        $answer = self::where('submission_id', $submission->id)
            ->where('question_id', $question->id)
            ->first();
        if (!$answer) {
            $answer = new Answer();
        }
        $answer->value = $value;
        $answer->survey()->associate($submission->survey);
        $answer->submission()->associate($submission);
        $answer->question()->associate($question);

        return $answer;
    }

    public static function createOrUpdateForSubmissionAndQuestionWithAnswerOption($submission, $question, $answerOption)
    {
        $answer = self::where('submission_id', $submission->id)
            ->where('question_id', $question->id)
            ->where('answer_option_id', $answerOption->id)
            ->first();
        if (!$answer) {
            $answer = new Answer();
        }
        $answer->value = $answerOption->value;
        $answer->text = $answerOption->text;
        $answer->survey()->associate($submission->survey);
        $answer->submission()->associate($submission);
        $answer->question()->associate($question);
        $answer->answerOption()->associate($answerOption);

        return $answer;
    }

    /*
     * Relationships
     */
    public function answerOption()
    {
        return $this->belongsTo(AnswerOption::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}