# PHP Index
A [PHP](https://www.php.net) directory index generator, implemented in [TypeScript](https://www.typescriptlang.org).

![Screenshot](screenshot.webp)

## Usage
From a command prompt, you can invoke the `php_index` executable by using
the [`npx` command](https://docs.npmjs.com/cli/commands/npx):

```shell
$ npx @cedx/php-index --help

Build the PHP Index redistributable.

Usage:
  npx @cedx/php-index [options] [phar]

Arguments:
  phar            The path to the output Phar archive.

Options:
  -c, --compress  Compress the Phar archive.
  -p, --phpinfo   Add a link to the PHP information.
  -h, --help      Display this help.
  -v, --version   Output the version number.
```

TODO: to be further documented.
