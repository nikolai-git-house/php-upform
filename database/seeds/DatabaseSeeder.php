<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);

        DB::table('users')->insert([
        	'name' => 'admin',
        	'email' => 'admin@admin.com',
        	'password' => bcrypt('1234'),
        	'remember_token' => '1111',
        	'password_valid_until' => '9999-12-31 23:59:59',
        	'organisation_id' => '1',
        ]);

        DB::table('users')->insert([
        	'name' => 'user',
        	'email' => 'executive@admin.com',
        	'password' => bcrypt('1234'),
        	'remember_token' => '1111',
        	'password_valid_until' => '9999-12-31 23:59:59',
        	'organisation_id' => '1',
        ]);

        DB::table('users')->insert([
        	'name' => 'user2',
        	'email' => 'user@admin.com',
        	'password' => bcrypt('1234'),
        	'remember_token' => '1111',
        	'password_valid_until' => '9999-12-31 23:59:59',
        	'organisation_id' => '1',
        ]);

         DB::table('organisations')->insert([
        	'name' => 'test',
        	'email_domain' => 'admin.com',
        	'import_identifier' => '1111',
        ]);
    }
}
