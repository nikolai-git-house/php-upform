<?php

namespace App;

use Hash;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Carbon;
use App\Models\Organisation;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /*
     * RELATIONSHIPS
     */
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    /*
     * PUBLIC
     */
    /**
     * @return int
     */
    public function generateOTP()
    {
        $code = mt_rand(1000, 9999);
        $hash = Hash::make($code);
        $this->password = $hash;
        $this->password_valid_until = Carbon::now()->addMinutes(10); // TODO: Maybe make this configurable?
        $this->save();

        return $code;
    }
}
