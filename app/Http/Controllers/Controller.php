<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Auth;
use App\Models\Organisation;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function currentOrganisation()
    {
        $organisation = Auth::user()->organisation ?? null;

        $organisationId = request()->input('organisation_id');
        if ($organisationId) { // TODO: And role of the user is admin...
            $organisation = Organisation::findOrFail($organisationId);
        }

        return $organisation;
    }
}
