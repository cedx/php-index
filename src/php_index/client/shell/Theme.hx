package php_index.client.shell;

import js.Browser;
import php_index.base.AbstractEnum;

/** Defines the available color modes. **/
enum abstract Theme(String) from String to String {

	/** The theme is light. **/
	var Light = "light";

	/** The theme is dark. **/
	var Dark = "dark";

	/** The color mode is automatic. **/
	var Auto = "auto";

	/** The icon corresponding to this theme. **/
	public var icon(get, never): String;
		function get_icon() return switch abstract {
			case Auto: "circle-half";
			case Dark: "moon-stars-fill";
			case Light: "brightness-high-fill";
		}

	/** The label corresponding to this theme. **/
	public var label(get, never): String;
		function get_label() {
			final messages = Container.instance.messages;
			return switch abstract {
				case Auto: messages.auto();
				case Dark: messages.dark();
				case Light: messages.light();
			}
		}
}

/** A dropdown menu that allows to switch the color mode. **/
class ThemeSelector extends View {

	/** The media query used to check the system theme. **/
	final mediaQuery = Browser.window.matchMedia("(prefers-color-scheme: dark)");

	/** The current theme. **/
	@:state var theme: Theme = {
		final colorMode = Browser.window.localStorage.getItem("theme");
		AbstractEnum.getValues(Theme).contains(colorMode) ? colorMode : Auto;
	}

	/** Applies the theme to the document. **/
	function applyTheme()
		Browser.document.documentElement.dataset.bsTheme = if (theme == Auto) mediaQuery.matches ? Dark : Light else theme;

	/** Changes the current theme. **/
	function changeTheme(colorMode: Theme) {
		Browser.window.localStorage.setItem("theme", theme = colorMode);
		applyTheme();
	}

	/** Renders this view. **/
	function render() '
		<li class="nav-item dropdown">
			<a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
				<i class="bi bi-${theme.icon}"/>
			</a>
			<ul class="dropdown-menu dropdown-menu-end">
				<for ${colorMode in AbstractEnum.getValues(Theme)}>
					<li>
						<button class=${{active: theme == colorMode, "dropdown-item d-flex align-items-center": true}} onclick=${changeTheme(colorMode)}>
							<i class="bi bi-${colorMode.icon} me-2"/> ${colorMode.label)}
						</button>
					</li>
				</for>
			</ul>
		</li>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		applyTheme();
		mediaQuery.addEventListener("change", applyTheme);
		beforeUnmounting(() -> mediaQuery.removeEventListener("change", applyTheme));
	}
}
