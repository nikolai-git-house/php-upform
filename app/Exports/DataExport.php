<?php

namespace App\Exports;

use App\Models\Organisation;
use App\Models\Question;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DataExport implements ShouldAutoSize, FromCollection, WithStrictNullComparison, WithMapping, WithHeadings
{

    // Auth Checking!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    public function headings(): array
    {
        return [
            'Name',
            'Question',
            'Answer'
        ];
    }

    /**
     * @param $organisationsMap
     * @return array
     */
    public function map($organisationsMap): array
    {
        return [
            $organisationsMap['name'],
            $organisationsMap['question'],
            $organisationsMap['answer']
        ];
    }

    public function collection()
    {
        $organisations = Organisation::orderBy('name')->get();
        $map = [];

        foreach ($organisations as $organisation) {
            $organisationId = $organisation->id;

            $questions = Question::whereHas('answers.submission.organisation', function ($query) use ($organisationId) {
                $query->where('id', $organisationId);
            })->get();

            foreach ($questions as $question) {
                $answers = $question->answers()->whereHas('submission.organisation', function ($query) use ($organisationId) {
                    $query->where('id', $organisationId);
                })->get();

                foreach ($answers as $answer) {
                    $map[] = [
                        'name' => $organisation->name,
                        'question' => $question->text,
                        'answer' => $answer->text
                    ];
                }
            }
        }

        $organisationsMap = collect($map);

        return $organisationsMap;
    }
}
