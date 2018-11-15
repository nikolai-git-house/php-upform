<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Survey;

class StartNewSurvey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'efc:start-survey {name} {year}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start a new survey with a given name and year.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $name = $this->argument('name');
        $year = $this->argument('year');
        Survey::startNewSurveyWithNameAndYear($name, $year);
    }
}
