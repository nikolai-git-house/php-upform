<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    public function scopeByFullName($query, $firstname, $lastname) {
        $query->where('firstname', $firstname)->where('lastname', $lastname);
    }
}
