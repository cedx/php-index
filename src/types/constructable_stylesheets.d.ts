// https://github.com/Microsoft/TypeScript/issues/30022
declare interface DocumentOrShadowRoot {
	adoptedStyleSheets: CSSStyleSheet[];
}
