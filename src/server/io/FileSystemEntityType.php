<?php namespace php_index\io;

/**
 * Defines the type of a file system entity.
 */
enum FileSystemEntityType: string {

	/**
	 * The file system entity is a directory.
	 */
	case directory = "directory";

	/**
	 * The file system entity is a file.
	 */
	case file = "file";
}
