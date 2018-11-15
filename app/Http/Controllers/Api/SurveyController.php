<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Survey;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Survey::orderBy('year', 'desc')
            ->with('questions.subcategory.category')
            ->with('questions.answerOptions')
            ->get();
    }

    /**
     * Display the specified resource.
     *
     * @param $survey_id
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model
     */
    public function show($survey_id)
    {
        return Survey::with('questions.subcategory.category')
            ->findOrFail($survey_id);
    }

//    public function surveyStore()
//    {
//        $dataSurvey = request()->validate([
//            'name' => 'required',
//            'year' => 'required',
//            'number' => 'required'
//        ]);
//
//        $survey = Survey::create($dataSurvey);
//
//        return $survey;
//    }


}
