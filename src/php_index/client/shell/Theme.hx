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
			case Auto: "tonality";
			case Dark: "dark_mode";
			case Light: "light_mode";
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

/** A dropdown menu allowing to switch the color mode. **/
class ThemeDropdown extends View {

	/** The label of the dropdown menu. **/
	@:attribute var label = "";

	/** The handler invoked when a value has been selected. **/
	@:attribute var onChange: Callback<Theme> = function() {};

	/** The icon of the dropdown menu. **/
	@:state var icon: String = Auto.icon;

	/** Renders this view. **/
	function render() '
		<li class="nav-item dropdown">
			<a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
				<i class="icon icon-fill">$icon</i>
				<if ${label.length > 0}><span class="ms-2">$label</span></if>
			</a>
			<ul class="dropdown-menu dropdown-menu-end">
				<ThemeSelector onChange=${triggerChange}/>
			</ul>
		</li>
	';

	/** Triggers a theme change. **/
	function triggerChange(theme: Theme) {
		icon = theme.icon;
		onChange.invoke(theme);
	}
}

/** A component allowing to switch the color mode. **/
class ThemeSelector extends View {

	/** The handler invoked when a value has been selected. **/
	@:attribute var onChange: Callback<Theme> = function() {};

	/** The current theme. **/
	@:state public var theme: Theme = {
		final colorMode = Browser.window.localStorage.getItem("theme");
		AbstractEnum.getValues(Theme).contains(colorMode) ? colorMode : Auto;
	}

	/** The media query used to check the system theme. **/
	final mediaQuery = Browser.window.matchMedia("(prefers-color-scheme: dark)");

	/** Applies the theme to the document. **/
	function applyTheme() {
		Browser.document.documentElement.dataset.bsTheme = if (theme == Auto) mediaQuery.matches ? Dark : Light else theme;
		onChange.invoke(theme);
	}

	/** Changes the current theme. **/
	function changeTheme(colorMode: Theme) if (colorMode != theme) {
		Browser.window.localStorage.setItem("theme", theme = colorMode);
		applyTheme();
	}

	/** Renders this view. **/
	function render() '
		<>
			<for ${colorMode in AbstractEnum.getValues(Theme)}>
				<li>
					<button class="dropdown-item d-flex align-items-center justify-content-between" onclick=${changeTheme(colorMode)}>
						<span><i class="icon icon-fill me-1">${colorMode.icon}</i> ${colorMode.label}</span>
						<if ${theme == colorMode}><i class="icon ms-2">check</i></if>
					</button>
				</li>
			</for>
		</>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		applyTheme();
		mediaQuery.addEventListener("change", applyTheme);
		beforeUnmounting(() -> mediaQuery.removeEventListener("change", applyTheme));
	}
}
