/*
 * Copyright (C)2005-2021 Haxe Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

package php;

/**
	The `Phar` class provides a high-level interface to accessing and creating PHAR archives.
	@see https://www.php.net/manual/en/class.phar.php
**/
@:native("Phar")
extern class Phar extends RecursiveDirectoryIterator implements Countable implements php.ArrayAccess<String, PharFileInfo> {
	@:phpClassConst static final BZ2: Int;
	@:phpClassConst static final COMPRESSED: Int;
	@:phpClassConst static final GZ: Int;
	@:phpClassConst static final MD5: Int;
	@:phpClassConst static final NONE: Int;
	@:phpClassConst static final OPENSSL: Int;
	@:phpClassConst static final PHAR: Int;
	@:phpClassConst static final PHP: Int;
	@:phpClassConst static final PHPS: Int;
	@:phpClassConst static final SHA1: Int;
	@:phpClassConst static final SHA256: Int;
	@:phpClassConst static final SHA512: Int;
	@:phpClassConst static final TAR: Int;
	@:phpClassConst static final ZIP: Int;

	final static function apiVersion(): String;
	final static function canCompress(type: Int = 0): Bool;
	final static function canWrite(): Bool;
	final static function createDefaultStub(?index: String, ?webIndex: String): String;

	function new(fname: String, ?flags: Int, ?alias: String);

	function buildFromDirectory(base_dir: String, ?regex: String): NativeAssocArray<String>;
	function compress(compression: Int, ?extension: String): Phar;
	function count(): Int;
	function offsetExists(offset: String): Bool;
	function offsetGet(offset: String): PharFileInfo;
	function offsetSet(offset: String, value: Dynamic): Void;
	function offsetUnset(offset: String): Void;
	function setStub(stub: String, len: Int = -1): Bool;
}
