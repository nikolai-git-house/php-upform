<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use SoftDeletes;

    protected $fillable = ['type', 'text', 'sort_number', 'subcategory_id'];

    const TYPE_MULTIPLE_CHOICE = 'multiple_choice';
    const TYPE_SINGLE_CHOICE = 'single_choice';
    const TYPE_TEXT = 'text';
    const TYPE_TRUE_FALSE = 'true_false';
    const TYPE_TRUE_FALSE_CONTEXT = 'true_false_context';
    const TYPE_AMOUNT = 'amount';
    const TYPE_AMOUNT_CURRENCY = 'amount_currency';
    const TYPE_AMOUNT_RANGE = 'amount_range';
    const TYPE_ORDER = 'order';

    const TYPES = [self::TYPE_MULTIPLE_CHOICE, self::TYPE_SINGLE_CHOICE, self::TYPE_TEXT, self::TYPE_TRUE_FALSE, self::TYPE_TRUE_FALSE_CONTEXT, self::TYPE_AMOUNT, self::TYPE_AMOUNT_CURRENCY, self::TYPE_AMOUNT_RANGE, self::TYPE_ORDER];

    /*
     * Relationships 
     */
    public function answerOptions()
    {
        return $this->hasMany(AnswerOption::class)->orderBy('sort_number');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function surveys()
    {
        return $this->belongsToMany(Survey::class)->withTimestamps();
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }
}
