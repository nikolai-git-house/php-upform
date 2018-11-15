<?php

namespace App\Events;

use App\Models\Invitation;

class InvitationCreating
{
    /**
     * @var Invitation
     */
    public $model;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Invitation $invitation)
    {
        $this->model = $invitation;
    }
}
