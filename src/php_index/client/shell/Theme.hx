package php_index.client.shell;

import js.Browser;
import php_index.base.AbstractEnum;

/** Defines the available color modes. **/
enum abstract Theme(String) to String {

	/** The color mode is automatic. **/
	var Auto = "auto";

	/** The theme is dark. **/
	var Dark = "dark";

	/** The theme is light. **/
	var Light = "light";

	/** The icon corresponding to this theme. **/
	public var icon(get, never): String;
		function get_icon() return switch abstract {
			case Auto: "circle-half";
			case Dark: "moon-stars-fill";
			case Light: "brightness-high-fill";
		}

	/** The label corresponding to this theme. **/
	public var label(get, never): String;
		function get_label() return {
			final messages = Container.instance.messages;
			switch abstract {
				case Auto: messages.auto();
				case Dark: messages.dark();
				case Light: messages.light();
			}
		}
}

/** A dropdown menu that allows to switch the theme mode. **/
class ThemeSelector extends View {

	/** The localized messages. **/
	final messages: Messages = Container.instance.messages;

	/** The current theme. **/
	@:state var theme: Theme = Auto;

	/** Changes the current theme. **/
	function changeTheme(mode: Theme) {
		theme = mode;
		Browser.document.documentElement.dataset.bsTheme = mode;
	}

	/** Renders this view. **/
	function render() '
		<li class="nav-item dropdown">
			<a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
				<i class="bi bi-${theme.icon}"/>
			</a>
			<ul class="dropdown-menu dropdown-menu-end">
				<for ${mode in AbstractEnum.getValues(Theme)}>
					<li>
						<button class=${{active: theme == mode, "dropdown-item d-flex align-items-center": true}} onclick=${changeTheme(mode)}>
							<i class="bi bi-${mode.icon} me-2"/> ${mode.label)}
						</button>
					</li>
				</for>
			</ul>
		</li>
	';
}
