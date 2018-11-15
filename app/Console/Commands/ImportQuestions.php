<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Importers\QuestionImporter;

class ImportQuestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'efc:import-questions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import initial questions from a json file.';

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
        $importer = new QuestionImporter(database_path('data/questions.json'));
        $importer->import();
    }
}
