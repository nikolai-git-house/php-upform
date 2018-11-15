<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = ['name', 'year', 'number'];

    /*
    * Relationships
    */
    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class)->orderBy('sort_number')->withTimestamps();
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public static function findOrCreateForImportYear($year)
    {
        $survey = Survey::where('name', 'Import ' . $year)->first();
        ////////////////////////////////// Can be deleted ???///////////////
        if (!$survey) {
            $survey = new Survey();
            $survey->name = 'Import ' . $year;
            $survey->year = is_numeric($year) ? $year: 0;
            $survey->number = 1;
            $survey->save();
           // $questions = Question::where('id', '<', 27)->get();
            $questions = Question::take(26);
            foreach ($questions as $question) {
                $survey->questions()->save($question);
            }
        }
        return $survey;
    }

    public static function startNewSurveyWithNameAndYear($name, $year)
    {
        $survey = new Survey();
        $survey->name = $name;
        $survey->year = $year;
        $survey->number = 1;
        $survey->save();
        $questions = Question::where('id', '<', 27)->get();
        foreach ($questions as $question) {
            $survey->questions()->save($question);
        }
        return $survey;
    }
}
