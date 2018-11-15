<?php

namespace App\Listeners;

use App\Providers\App\Events\InvitationCreating;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class GenerateInvitationUUID
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  InvitationCreating  $event
     * @return void
     */
    public function handle(InvitationCreating $event)
    {
        $event->model->uuid = (string) Uuid::generate(4);
    }
}
