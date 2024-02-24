/** Displays the list of file system entities. **/
class Listing extends View {

	/** The list of file system entities. **/
	@:state var entities: EntityList = new EntityList();

	/** The search form. **/
	@:ref final form: FormElement;

	/** The current filter. **/
	@:state var filter = "";

	/** The view corresponding to the file listing. **/
	function listing(attr: {}) '
		<let items=${entities.filter(filter)}>
			<table class="table table-hover table-sticky table-striped mb-0">
				<tbody>
					<for ${entity in items}></for>
				</tbody>
			</table>
		</let>
	';

	/** Renders this view. **/
	function render() '
		<ActionBar>
			<form class="flex-grow-1 flex-sm-grow-0" noValidate onsubmit=${submitForm} ref=$form spellcheck=${false}>
				<div class="input-group">
					<input class="form-control" name="filter" placeholder=${messages.search()} required type="search" value=$filter/>
					<button class="btn btn-success">
						<i class="icon">search</i>
					</button>
					<if ${filter.length > 0}>
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
	';

	/** Resets the form. **/
	function resetForm(event: Event) {
		event.preventDefault();
		filter = "";
	}

	/** Submits the form. **/
	function submitForm(event: Event) {
		event.preventDefault();
		filter = (new FormData(form).get("filter"): String).trim();
	}
}
