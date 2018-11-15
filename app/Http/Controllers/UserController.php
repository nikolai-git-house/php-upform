<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Excel;
use App\Exports\DataExport;
use App\Models\Organisation;
use App\Models\Question;


class UserController extends Controller
{
    public function exportExcelFile()
    {
    	// admin organisation ID 207 - Efc.be 80 - Vouw.co
    	$id = request()->user()->organisation_id;
    	
		if ($id == 207 || $id == 80) {
		
        return Excel::download(new DataExport, 'data.xls');
    	}
    	return redirect('/');
    	
    }

    public function exportCsvFile()
    {
    	// admin organisation ID 207 - Efc.be 80 - Vouw.co

    	$id = request()->user()->organisation_id;

    	if ($id == 207 || $id == 80) {
        return Excel::download(new DataExport, 'data.csv');
        }
    	return redirect('/');
    	
    }
}
