<?php declare(strict_types=1);

// Setup the class loader.
const phpArchive = false;
$rootPath = phpArchive ? "phar://index.phar" : (new SplFileInfo(__DIR__))->getPath();
spl_autoload_register(fn($class) => include "$rootPath/lib/".str_replace("\\", "/", $class).".php");

// Start the application.
\php\Boot::__hx__init();
\directory_index\server\Application::main();
\haxe\EntryPoint::run();
