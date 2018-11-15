<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnswerOption extends Model
{
    use SoftDeletes;

        /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'extra' => 'array'
    ];

        /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['value', 'text', 'sort_number', 'question_id'];

    public static function answerOptionForQuestionAndHistoricValue($question, $value)
    {
        return AnswerOption::where('question_id', $question->id)
            ->where('text', 'like', '%' . strtolower($value) . '%')->first();
    }

    /*
     * Relationships
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
