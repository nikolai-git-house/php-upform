<?php

namespace App\Importers;

use Maatwebsite\Excel\Facades\Excel;
use App\Models\Organisation;
use App\Models\Contact;
use App\Models\CurrencyRate;
use App\Models\Survey;
use App\Models\Submission;
use App\Models\Answer;
use App\Models\Question;
use App\Models\AnswerOption;

class HistoricDataImporter
{
    const KEY_ACCOUNTS_FILE = 'accounts';
    const KEY_CONTACTS_FILE = 'contacts';
    const KEY_FINANCES_FILE = 'finances';
    const KEY_AREAS_FILE = 'areas';
    const KEY_PARTNERSHIPS_FILE = 'partnerships';
    const KEY_SUPPORT_TYPES_FILE = 'support';
    const KEY_SUBFOUNDATION_TYPES_FILE = 'subfoundation';
    const KEY_CURRENCY_RATES_FILE = 'rates';

    const FILE_PATH_KEYS = [self::KEY_ACCOUNTS_FILE, self::KEY_CONTACTS_FILE, self::KEY_FINANCES_FILE, self::KEY_AREAS_FILE, self::KEY_PARTNERSHIPS_FILE, self::KEY_SUPPORT_TYPES_FILE, self::KEY_SUBFOUNDATION_TYPES_FILE, self::KEY_CURRENCY_RATES_FILE];

    /** @var array */
    protected $filePaths;

    /**
     * Constructor
     *
     * @param array $filePaths
     *
     * @throws \Exception
     */
    public function __construct($filePaths = [])
    {
        foreach (self::FILE_PATH_KEYS as $filePathKey) {
            if (!isset($filePaths[$filePathKey])) {
                throw new \Exception('All file path keys are required!');
            }
        }
        $this->filePaths = $filePaths;
    }

    public function import()
    {
        $this->importCurrencyRates($this->filePaths[self::KEY_CURRENCY_RATES_FILE]);
        // $this->importOrganisations($this->filePaths[self::KEY_ACCOUNTS_FILE]);
        // $this->importContacts($this->filePaths[self::KEY_CONTACTS_FILE]);
        // $this->importFinances($this->filePaths[self::KEY_FINANCES_FILE]);
        // $this->importAreas($this->filePaths[self::KEY_AREAS_FILE]);
        // $this->importPartnerships($this->filePaths[self::KEY_PARTNERSHIPS_FILE]);
    }

    private function importNew()
    {
        Excel::load(database_path('data/new_data.xlsx'), function ($reader) use ($callable) {
            $data = $reader->get();

            dd($data);
        });
    }

    private function importOrganisations($filePath)
    {
        $this->readCSVFileLineByLine($filePath, function ($row) {
            $organisation = Organisation::byImportIdentifier($row->accountid)->first();
            if (!$organisation) {
                $organisation = new Organisation();
            }
            $organisation->import_identifier = $row->accountid;
            $organisation->name = $row->name;
            if (!empty($row->emailaddress1)) {
                $organisation->email_domain = substr(strrchr($row->emailaddress1, "@"), 1);
            }
            $organisation->save();
        });
    }

    private function importContacts($filePath)
    {
        $this->readCSVFileLineByLine($filePath, function ($row) {
            $organisation = Organisation::byImportIdentifier($row->accountid1)->firstOrFail();
            $contact = Contact::byFullName($row->firstname, $row->lastname)->first();
            if (!$contact) {
                $contact = new Contact();
            }
            $contact->firstname = $row->firstname;
            $contact->lastname = $row->lastname;
            $contact->email = $row->emailaddress1;
            $contact->organisation_id = $organisation->id;
            $contact->save();
        });
    }

    private function importCurrencyRates($filePath)
    {
        $this->readCSVFileLineByLine($filePath, function ($row) {
            $rate = CurrencyRate::where('year', $row->year)->where('code', $row->currency_code_currency)->first();
            if (!$rate) {
                $rate = new CurrencyRate();
            }
            $rate->name = $row->currency;
            $rate->code = $row->currency_code_currency;
            $rate->symbol = $row->currency_symbol_currency;
            $rate->year = intval($row->year);
            $rate->rate = $row->average_exchange_rate_1;
            $rate->save();
        });
    }

    private function importFinances($filePath)
    {
        $this->readCSVFileLineByLine($filePath, function ($row) {
            $organisation = Organisation::byImportIdentifier($row->accountid)->firstOrFail();
            $survey = Survey::findOrCreateForImportYear($row->new_value);
            $submission = Submission::findOrCreateForOrganisationAndSurvey($organisation, $survey);

            if (!empty($row->new_numberofgrants)) {
                $question = Question::findOrFail(9);
                $answer = Answer::createOrUpdateForSubmissionAndQuestionWithValue($submission, $question, intval($row->new_numberofgrants));
                $answer->extra = [
                    'amount' => $row->new_numberofgrants
                ];
                $answer->save();
            }
            if (!empty($row->new_totalexpenditure_base)) {
                $question = Question::findOrFail(7);
                $answer = Answer::createOrUpdateForSubmissionAndQuestionWithValue($submission, $question, $row->new_totalexpenditure_base);
                $answer->extra = [
                    'amount' => $row->new_totalexpenditure_base,
                    'original_amount' => $row->new_totalexpenditure,
                    'original_currency' => $row->transaction_currency_id_name
                ];
                $answer->save();
            }
            if (!empty($row->new_totalassets_base)) {
                $question = Question::findOrFail(6);
                $answer = Answer::createOrUpdateForSubmissionAndQuestionWithValue($submission, $question, $row->new_totalassets_base);
                $answer->extra = [
                    'amount' => $row->new_totalassets_base,
                    'original_amount' => $row->new_totalassets,
                    'original_currency' => $row->transaction_currency_id_name
                ];
                $answer->save();
            }
        });
    }

    private function importAreas($filePath)
    {
        $this->readCSVFileLineByLine($filePath, function ($row) {
            $submissions = Submission::where('organisation_id', $row->accountid)->get();
            $question = Question::findOrFail(1);
            foreach ($submissions as $submission) {
                $value = str_replace('undefined - ', '', $row->new_name);
                $value = str_replace(',', '', explode(' ', trim($value))[0]);
                if (strlen($value) > 1) {
                    $answerOption = AnswerOption::answerOptionForQuestionAndHistoricValue($question, $value);
                }
                if (isset($answerOption) && !empty($answerOption)) {
                    $answer = Answer::createOrUpdateForSubmissionAndQuestionWithAnswerOption($submission, $question, $answerOption);
                    $answer->save();
                } else {
                    echo 'Value could not be mapped: ' . $value . "\n";
                }
            }
        });
    }

    private function importPartnerships($filePath)
    {
        $this->readCSVFileLineByLine($filePath, function ($row) {
            $submissions = Submission::where('organisation_id', $row->accountid)->get();
            $question = Question::findOrFail(22);

            foreach ($submissions as $submission) {
                $value = null;
                switch (trim($row->new_name)) {
                    case 'corporates':
                        $value = 'Companies';
                        break;
                    case 'European authorities (select also public authorities)':
                        $value = ''; // TODO: To Check
                        break;
                    case 'Media':
                        $value = 'Media';
                        break;
                    case 'non-profit organisations':
                        $value = 'Cultural Institutions';
                        break;
                    case 'other':
                        $value = 'Other';
                        break;
                    case 'other foundations/funders/grantmakers':
                        $value = 'Other foundations';
                        break;
                    case 'public authorities':
                        $value = 'Public authorities';
                        break;
                    case 'university/research centres':
                        $value = 'Associations'; // TODO: To check
                        break;
                    default:
                        break;
                }
                if (!empty($value)) {
                    $answerOption = AnswerOption::answerOptionForQuestionAndHistoricValue($question, $value);
                }
                if (isset($answerOption) && !empty($answerOption)) {
                    $answer = Answer::createOrUpdateForSubmissionAndQuestionWithAnswerOption($submission, $question, $answerOption);
                    $answer->save();
                } else {
                    echo 'Value could not be mapped: ' . trim($row->new_value) . "\n";
                }
            }
        });
    }

    private function importSupportTypes($filePath)
    {
    }

    private function importSubfoundationtypes($filePath)
    {
    }

    private function readCSVFileLineByLine($filePath, $callable)
    {
        Excel::load($filePath, function ($reader) use ($callable) {
            $data = $reader->get();
            foreach ($data as $row) {
                if (is_callable($callable)) {
                    $callable($row);
                }
            }
        });
    }
}
