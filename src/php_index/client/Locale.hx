package php_index.client;

/** Provides the localization table. **/
interface Locale {
  function error(): String;
  function indexOf(directory: String): String;
  function modifiedAt(): String;
  function name(): String;
  function parentDirectory(): String;
  function size(): String;
}
