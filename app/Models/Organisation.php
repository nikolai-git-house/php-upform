<?php

namespace App\Models;

use App\User;
use App\Models\Submission;
use Illuminate\Database\Eloquent\Model;

class Organisation extends Model
{
    use HasImportIdentifier;

    /*
     * RELATIONSHIPS
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function submissions()
    {
    	return $this->hasMany(Submission::class);
    }
}
