@extends('layouts.main')

@section('content')
    <div id="app"></div>
@endsection
	<script>
	var admindomain=["vouw.co","efc.be"];
	var permission = "false";
	var organization = {!!Auth::user()->organisation!!};
	if(admindomain.includes(organization.email_domain))
		permission = "true";
	var excelurl = "{!!url('user/exportExcel')!!}"
	var csvurl = "{!!url('user/exportCsv')!!}"
	</script>
	
@section('scripts')
<script src="{{ mix('js/app.js') }}"></script>
@endsection
