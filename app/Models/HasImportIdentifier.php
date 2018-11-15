<?php

namespace App\Models;

trait HasImportIdentifier
{
    public function scopeByImportIdentifier($query, $identifier)
    {
        return $query->where('import_identifier', $identifier);
    }
}