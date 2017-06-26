import Component from "inferno-component";
import {VNode} from "inferno/core/VNodes";

export interface IThemeProviderProps {
	overwrite?: boolean;
	theme?: any;
}

export default class ThemeProvider extends Component<IThemeProviderProps, {}> {
	static defaultProps = { overwrite: false };

	public getChildContext() {
		const { overwrite, theme } = this.props;
		const previousTheme = this.context.theme;

		return {
			theme: {
				...!overwrite ? previousTheme || {} : {},
				...theme
			}
		};
	}

	public render() {
		return this.props.children;
	}
}
