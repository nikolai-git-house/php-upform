<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    public static function findOrCreateForOrganisationAndSurvey($organisation, $survey)
    {
        $submission = Submission::where('survey_id', $survey->id)
            ->where('organisation_id', $organisation->id)
            ->first();
        if (!$submission) {
            $submission = new Submission();
            $submission->organisation_id = $organisation->id;
            $submission->survey_id = $survey->id;
            $submission->save();
        }
        return $submission;
    }

    /*
     * Relationships
     */
    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }
}
