<?php

require __DIR__ . '/vendor/autoload.php';

$handle = fopen('./options.txt', 'r');
if ($handle) {
    echo 'Working...';

    $data = [];

    while (($line = fgets($handle)) !== false) {
        $data[] = [
            'value' => Webpatser\Uuid\Uuid::generate(4)->__toString(),
            'text' => $line
        ];
    }

    fclose($handle);

    echo json_encode($data, JSON_PRETTY_PRINT);
}
