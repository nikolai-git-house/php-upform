<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\InvitationCreating;

class Invitation extends Model
{
    /**
     * @var array
     */
    protected $dispatchesEvents = [
        'creating' => InvitationCreating::class,
    ];
}
