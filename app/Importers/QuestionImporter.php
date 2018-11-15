<?php

namespace App\Importers;

use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Question;
use App\Models\AnswerOption;

class QuestionImporter
{
    /** @var string */
    protected $filePath;

    /**
     * Constructor for the importer.
     *
     * @param string $filePath
     *
     * @throws Exception
     */
    public function __construct($filePath)
    {
        if (!file_exists($filePath)) {
            throw new Exception('Import file must exists!');
        }

        $this->filePath = $filePath;
    }

    /**
     * Imports questions from the given file path.
     *
     * @return void
     * @throws \Exception
     */
    public function import()
    {
        $data = json_decode(file_get_contents($this->filePath));

        $categories = $data->categories;
        $subcategories = $data->subcategories;
        $questions = $data->questions;

        foreach ($categories as $key => $categoryData) {
            $category = Category::findOrNew($categoryData->id);
            $category->id = $categoryData->id;
            $category->name = $categoryData->name;
            $category->color = $categoryData->color;
            $category->sort_number = $key;
            $category->save();
        }

        foreach ($subcategories as $key => $subcategoryData) {
            $subcategory = Subcategory::findOrNew($subcategoryData->id);
            $subcategory->id = $subcategoryData->id;
            $subcategory->name = $subcategoryData->name;
            $subcategory->category_id = $subcategoryData->category_id;
            $subcategory->sort_number = $key;
            $subcategory->save();
        }

        foreach ($questions as $key => $questionData) {
            if (!in_array($questionData->type, Question::TYPES)) {
                dd($questionData->type);
                throw new \Exception('Question type does not exist!');
            }

            $question = Question::findOrNew($questionData->id);
            $question->id = $questionData->id;
            $question->type = $questionData->type;
            $question->text = $questionData->question;
            $question->subcategory_id = $questionData->subcategory_id;
            $question->sort_number = $key;
            $question->save();

            if ($question->type === Question::TYPE_MULTIPLE_CHOICE ||
                $question->type === Question::TYPE_SINGLE_CHOICE ||
                $question->type === Question::TYPE_AMOUNT_RANGE ||
                $question->type === Question::TYPE_ORDER) {
                foreach ($questionData->options as $index => $optionData) {
                    $answerOption = AnswerOption::firstOrNew(['value' => $optionData->value]);
                    $answerOption->text = $optionData->text;
                    $answerOption->question_id = $question->id;
                    $answerOption->sort_number = $index;

                    if ($question->type === Question::TYPE_AMOUNT_RANGE) {
                        $answerOption->extra = [
                            'min' => $optionData->min,
                            'max' => $optionData->max
                        ];
                    }

                    $answerOption->save();
                }
            }
        }
    }
}
