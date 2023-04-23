package php_index.client.listing;

import intl.DateFormat;
import intl.NumberFormat;
import intl.SimpleUnit;
import js.Browser;
import tink.Anon;
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

	/** The size in bytes of the largest file in the listing. **/
	@:computed var maxFileSize: Int = entities.items.fold((item, result) -> item.size > result ? item.size : result, 0);

	/** The localized messages. **/
	final messages: Messages = Container.instance.messages;

	/** The current path. **/
	final path = Browser.location.pathname.length > 1
		? Browser.location.pathname.removeTrailingSlashes()
		: Browser.location.pathname;

	/** Formats the specified size. **/
	function formatBytes(bytes: Float) {
		var index = 0;
		while (bytes >= 1_024 && index < byteUnits.length) {
			bytes /= 1_024;
			index++;
		}

		final options: NumberFormatOptions = cast {maximumFractionDigits: 2, style: Unit, unit: Byte};
		return bytes.toLocaleString(Container.instance.locale, Anon.merge(options, unit = byteUnits[index]));
	}

	/** The view corresponding to the file listing. **/
	function listing(attr: {}) '
		<table class="table table-hover table-sticky table-striped mb-0">
			<thead>
				<tr>
					<th onclick=${entities.orderBy("path")} scope="col">
						<span role="button">${messages.name()} <i class="bi bi-${entities.sort.getIcon('path')}"/></span>
					</th>
					<th onclick=${entities.orderBy("size")} scope="col">
						<span role="button">${messages.size()} <i class="bi bi-${entities.sort.getIcon('size')}"/></span>
					</th>
					<th class="d-none d-sm-table-cell" onclick=${entities.orderBy("modifiedAt")} scope="col">
						<span role="button">${messages.modifiedAt()} <i class="bi bi-${entities.sort.getIcon('modifiedAt')}"/></span>
					</th>
				</tr>
			</thead>
			<tbody>
				<if ${path.length > 1}>
					<tr>
						<td colSpan=${2}>
							<div class="text-truncate">
								<a href="..">
									<i class="bi bi-arrow-90deg-up me-2"/>${messages.parentDirectory()}
								</a>
							</div>
						</td>
						<td class="d-none d-sm-table-cell"/>
					</tr>
				</if>
				<for ${entity in entities.items}>
					<tr>
						<td>
							<div class="text-truncate">
								<a href=${entity.type == File ? entity.path : entity.path.addTrailingSlash()}>
									<i class=${['bi bi-${entity.icon} me-2' => true, "text-dark" => entity.type == File, "text-warning" => entity.type == Directory]}/>${entity.path}
								</a>
							</div>
						</td>
						<td>
							<if ${entity.type == Directory}>
								&ndash;
							<else>
								<let width=${Math.round((entity.size / maxFileSize) * 100)}>
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
	';

	/** Renders this view. **/
	function render() '
		<>
			<ActionBar>
				<let directories=${entities.items.count(item -> item.type == Directory)} files=${entities.items.count(item -> item.type == File)}>
					<div>TODO</div>
					<div class="hstack gap-3">
						<if ${directories > 0}>
							<div><b>${directories}</b> ${directories <= 1 ? messages.directory() : messages.directories()}</div>
						</if>
						<if ${directories > 0 && files > 0}>
							<div class="vr"/>
						</if>
						<if ${files > 0}>
							<div><b>${files}</b> ${files <= 1 ? messages.file() : messages.files()}</div>
						</if>
					</div>
				</let>
			</ActionBar>

			<article id="listing">
				<section class=${{"border-bottom": entities.length > 0}}>
					<h4 class="mb-0">${messages.indexOf(path)}</h4>
				</section>

				<switch ${entities.status}>
					<case ${Loading}>
						<section class="pt-0">
							<div class="alert alert-info d-flex align-items-center mb-0">
								<div class="spinner-border spinner-border-sm"/>
								<div class="ms-2">${messages.loading()}</div>
							</div>
						</section>
					<case ${Failed(_)}>
						<section class="pt-0">
							<div class="alert alert-danger d-flex align-items-center mb-0">
								<i class="bi bi-exclamation-circle-fill"/>
								<div class="ms-2">${messages.error()}</div>
							</div>
						</section>
					<case ${Done(_)}>
						<if ${entities.length > 0}>
							<listing/>
						<else>
							<section class="pt-0">
								<div class="alert alert-warning d-flex align-items-center mb-0">
									<i class="bi bi-exclamation-triangle-fill"/>
									<div class="ms-2">${messages.emptyDirectory()}</div>
								</div>
							</section>
						</if>
				</switch>
			</article>
		</>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() Browser.document.title = '${Browser.location.hostname} - $path';
}
