package php_index.client.io;

import intl.DateFormat;
import intl.NumberFormat.NumberFormatOptions;
import intl.NumberFormat.NumberFormatStyle;
import intl.SimpleUnit;
import js.Browser;
import js.html.Event;
import js.html.FormData;
import js.html.FormElement;
import php_index.base.io.FileSystemEntity;
import tink.Anon;
import tink.state.Promised;
using StringTools;
using haxe.io.Path;
using intl.NumberFormat.NumberFormatTools;

/** Displays the list of file system entities. **/
class Listing extends View {

	/** The byte units. **/
	final byteUnits: Array<SimpleUnit> = [Byte, Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte];

	/** The formatter used to format the dates. **/
	final dateFormatter = new DateFormat(Container.instance.locale, {dateStyle: Medium, timeStyle: Short});

	/** The list of file system entities. **/
	@:state var entities: EntityList = new EntityList();

	/** The search form. **/
	@:ref final form: FormElement;

	/** The loading state. **/
	@:state var loading: Promised<List<FileSystemEntity>> = Loading;

	/** The localized messages. **/
	final messages: Messages = Container.instance.messages;

	/** The current path. **/
	final path = location.pathname.length > 1
		? location.pathname.removeTrailingSlashes()
		: location.pathname;

	/** The current query. **/
	@:state var query = "";

	/** Formats the specified size. **/
	function formatBytes(bytes: Float) {
		var index = 0;
		while (bytes >= 1_024 && index < byteUnits.length) {
			bytes /= 1_024;
			index++;
		}

		final options: NumberFormatOptions = cast {maximumFractionDigits: 2, style: NumberFormatStyle.Unit, unit: Byte};
		return bytes.toLocaleString(Container.instance.locale, Anon.merge(options, unit = byteUnits[index]));
	}

	/** The view corresponding to the file listing. **/
	function listing(attr: {}) '
		<let items=${entities.filter(query)}>
			<if ${items.length == 0}>
				<section>
					<div class="alert alert-warning mb-0">
						<i class="icon icon-fill fw-bold me-1">warning</i> ${messages.emptyResultSet()}
					</div>
				</section>
			<else>
				<table class="table table-hover table-sticky table-striped mb-0">
					<thead>
						<tr>
							<th onclick=${entities.orderBy("path")} scope="col">
								<span role="button">${messages.name()} <i class="icon">${entities.sort.getIcon('path')}</i></span>
							</th>
							<th onclick=${entities.orderBy("size")} scope="col">
								<span role="button">${messages.size()} <i class="icon">${entities.sort.getIcon('size')}</i></span>
							</th>
							<th class="d-none d-sm-table-cell" onclick=${entities.orderBy("modifiedAt")} scope="col">
								<span role="button">${messages.modifiedAt()} <i class="icon">${entities.sort.getIcon('modifiedAt')}</i></span>
							</th>
						</tr>
					</thead>
					<tbody>
						<if ${path.length > 1}>
							<tr>
								<td colSpan=${2}>
									<div class="text-truncate">
										<a href="..">
											<i class="icon fs-5 me-2 text-secondary">drive_folder_upload</i>${messages.parentDirectory()}
										</a>
									</div>
								</td>
								<td class="d-none d-sm-table-cell"/>
							</tr>
						</if>
						<for ${entity in items}>
							<tr>
								<td>
									<div class="text-truncate">
										<a href=${entity.type == File ? entity.path : entity.path.addTrailingSlash()}>
											<i class=${[
												"icon fs-5 me-2" => true,
												"text-secondary" => entity.type == File,
												"icon-fill text-warning" => entity.type == Directory
											]}>${entity.icon}</i>${entity.path}
										</a>
									</div>
								</td>
								<td>
									<if ${entity.type == Directory}>
										&ndash;
									<else>
										<let width=${Math.round((entity.size / entities.maxFileSize) * 100)}>
											<div class="px-1" style=${{background: 'linear-gradient(90deg, rgb(22 88 152 / 15%) $width%, transparent 0)'}}>
												${formatBytes(entity.size)}
											</div>
										</let>
									</if>
								</td>
								<td class="d-none d-sm-table-cell">
									<time dateTime=${entity.modifiedAt}>
										${dateFormatter.format(entity.modifiedAt)}
									</time>
								</td>
							</tr>
						</for>
					</tbody>
				</table>
			</if>
		</let>
	';

	/** Renders this view. **/
	function render() '
		<>
			<ActionBar>
				<form class="flex-grow-1 flex-sm-grow-0" noValidate onsubmit=${submitForm} ref=$form spellcheck=${false}>
					<div class="input-group">
						<input class="form-control" name="query" placeholder=${messages.search()} required type="search" value=$query/>
						<button class="btn btn-success">
							<i class="icon">search</i>
						</button>
						<if ${query.length > 0}>
							<button class="btn btn-danger" onclick=${resetForm}>
								<i class="icon">close</i>
							</button>
						</if>
					</div>
				</form>

				<div class="d-none d-sm-block">
					<div class="hstack gap-3">
						<let directories=${entities.items.count(item -> item.type == Directory)} files=${entities.items.count(item -> item.type == File)}>
							<if ${directories > 0}>
								<div><b>$directories</b> ${directories <= 1 ? messages.directory() : messages.directories()}</div>
							</if>
							<if ${directories > 0 && files > 0}>
								<div class="vr"/>
							</if>
							<if ${files > 0}>
								<div><b>$files</b> ${files <= 1 ? messages.file() : messages.files()}</div>
							</if>
						</let>
					</div>
				</div>
			</ActionBar>

			<article>
				<section class="border-bottom">
					<h4 class="mb-0">${messages.indexOf(path)}</h4>
				</section>

				<switch $loading>
					<case ${Loading}>
						<section>
							<div class="alert alert-info mb-0">
								<div class="spinner-border spinner-border-sm me-1"/> ${messages.loading()}
							</div>
						</section>
					<case ${Failed(error)}>
						<section>
							<div class="alert alert-danger mb-0">
								<i class="icon icon-fill fw-bold me-1">error</i> ${error.message}
							</div>
						</section>
					<case ${Done(items)}>
						<if ${items.length > 0}>
							<listing/>
						<else>
							<section>
								<div class="alert alert-warning mb-0">
									<i class="icon icon-fill fw-bold me-1">warning</i> ${messages.emptyDirectory()}
								</div>
							</section>
						</if>
				</switch>
			</article>
		</>
	';

	/** Resets the form. **/
	function resetForm(event: Event) {
		event.preventDefault();
		query = "";
	}

	/** Submits the form. **/
	function submitForm(event: Event) {
		event.preventDefault();
		query = (new FormData(form).get("query"): String).trim();
	}

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		document.title = '${location.hostname} - $path';
		entities.fetch().handle(outcome -> switch outcome {
			case Failure(_): loading = Failed(new Error(messages.error()));
			case Success(items): loading = Done(items); entities.orderBy("path");
		});
	}
}
