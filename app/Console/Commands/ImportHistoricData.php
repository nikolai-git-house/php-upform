<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Importers\HistoricDataImporter;

class ImportHistoricData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'efc:import-historic-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import historic data from organisations who previously completed a survey.';

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
        $filePaths = [
            HistoricDataImporter::KEY_ACCOUNTS_FILE => database_path('data/account.csv'),
            HistoricDataImporter::KEY_CONTACTS_FILE => database_path('data/contact.csv'),
            HistoricDataImporter::KEY_FINANCES_FILE => database_path('data/FinancialProfile.csv'),
            HistoricDataImporter::KEY_AREAS_FILE => database_path('data/MainAreas.csv'),
            HistoricDataImporter::KEY_PARTNERSHIPS_FILE => database_path('data/Partnership.csv'),
            HistoricDataImporter::KEY_SUPPORT_TYPES_FILE => database_path('data/TypesOfSupport.csv'),
            HistoricDataImporter::KEY_SUBFOUNDATION_TYPES_FILE => database_path('data/SubFoundationType.csv'),
            HistoricDataImporter::KEY_CURRENCY_RATES_FILE => database_path('data/rates.xlsx'),
        ];

        $importer = new HistoricDataImporter($filePaths);
        $importer->import();
    }
}
