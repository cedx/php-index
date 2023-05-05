import sys.io.File;
using Lambda;

/** Builds the documentation. **/
function main()
	["CHANGELOG.md", "LICENSE.md"].iter(file -> File.copy(file, 'docs/${file.toLowerCase()}'));
