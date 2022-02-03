package php_index.client;

import js.Browser.location;
import js.lib.intl.DateTimeFormat;
import js.lib.intl.NumberFormat;
using haxe.io.Path;
using js.lib.Date;

/** The root view. **/
class Root extends View {

	/** The byte units. **/
	final byteMapping = ["", "K", "M", "G", "T", "P"];

	/** The formatter used to format the modification dates. **/
	final dateFormatter = new DateTimeFormat(Application.instance.language, cast {dateStyle: "medium", timeStyle: "short"});

	/** The list of file system entities. **/
	@:state var entities: EntityList = new EntityList();

	/** The localization service. **/
	final locale = Application.instance.locale;

	/** The current path. **/
	final path = location.pathname.length > 1 ? location.pathname.removeTrailingSlashes() : location.pathname;

	/** The formatter used to format the file sizes. **/
	final sizeFormatter = new NumberFormat(Application.instance.language, {maximumFractionDigits: 2});

	/** Formats the specified size. **/
	function formatSize(bytes: Float) {
		var index = 0;
		while (bytes > 1024) {
			bytes /= 1024;
			index++;
		}

		return sizeFormatter.format(bytes) + byteMapping[index];
	}

	/** Renders this view. **/
	function render() '
		<div>
			<header>
				<Navbar/>
			</header>

			<main>
				<Title text=${location.hostname + " - " + path}/>

				<article id="listing">
					<h2>${locale.indexOf(path)}</h2>

					<switch ${entities.status}>
						<case ${Loading}>
							<div class="alert alert-info d-flex align-items-center">
								<div class="spinner-border spinner-border-sm"/>
								<div class="ms-2">${locale.loading()}</div>
							</div>

						<case ${Failed(_)}>
							<div class="alert alert-danger d-flex align-items-center">
								<i class="bi bi-exclamation-circle-fill"/>
								<div class="ms-2">${locale.error()}</div>
							</div>

						<case ${Done(_)}>
							<if ${entities.items.length == 0}>
								<div class="alert alert-warning d-flex align-items-center">
									<i class="bi bi-exclamation-triangle-fill"/>
									<div class="ms-2">${locale.emptyDirectory()}</div>
								</div>
							<else>
								<table class="table table-hover table-sticky table-striped">
									<thead>
										<tr>
											<th onclick=${entities.orderBy("path")} scope="col">
												<span role="button">${locale.name()} <i class="bi bi-${entities.sort.getIcon('path')}"/></span>
											</th>
											<th class="text-end" onclick=${entities.orderBy("size")} scope="col">
												<span role="button">${locale.size()} <i class="bi bi-${entities.sort.getIcon('size')}"/></span>
											</th>
											<th class="d-none d-sm-table-cell text-end" onclick=${entities.orderBy("modifiedAt")} scope="col">
												<span role="button">${locale.modifiedAt()} <i class="bi bi-${entities.sort.getIcon('modifiedAt')}"/></span>
											</th>
										</tr>
									</thead>
									<tbody>
										<if ${path.length > 1}>
											<tr>
												<td colSpan=${2}>
													<div class="text-truncate">
														<a href="..">
															<i class="bi bi-arrow-90deg-up me-2"/>${locale.parentDirectory()}
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
															<i class="bi bi-${entity.icon} me-2"/>${entity.path}
														</a>
													</div>
												</td>
												<td class="text-end">
													<if ${entity.type == Directory}>
														&ndash;
													<else>
														${formatSize(entity.size)}
													</if>
												</td>
												<td class="d-none d-sm-table-cell text-end">
													<time dateTime=${entity.modifiedAt}>${dateFormatter.format(entity.modifiedAt.fromHaxeDate())}</time>
												</td>
											</tr>
										</for>
									</tbody>
								</table>
							</if>
					</switch>
				</article>
			</main>
		</div>
	';
}
