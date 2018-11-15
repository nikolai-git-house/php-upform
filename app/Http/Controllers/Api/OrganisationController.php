<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Organisation;
use Auth;

class OrganisationController extends Controller
{
    public function index()
    {
        $organisations = Organisation::with('users')->get();
        return response()->json($organisations);
    }

    public function show(Request $request)
    {
        $organisation = Auth::user()->organisation;
        $organisationId = $request->input('organisation_id');
        if ($organisationId) { // TODO: And role of the user is admin...
            $organisation = Organisation::findOrFail($organisationId);
        }
        return $organisation;
    }
}
