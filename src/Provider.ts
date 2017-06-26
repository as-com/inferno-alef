import Component from "inferno-component";
import {VNode} from "inferno/core/VNodes";

import Renderer from "alef/es/Renderer";

export interface IProviderProps {
	renderer: Renderer;
}

export default class Provider extends Component<IProviderProps, {}> {
	public getChildContext() {
		return { renderer: this.props.renderer };
	}

	// componentDidMount() {
	// 	render(this.props.renderer);
	// }

	public render() {
		return this.props.children;
	}
}
