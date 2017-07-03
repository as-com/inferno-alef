import Inferno from "inferno";
import {VNode, Props, InfernoChildren, getFlagsForElementVnode} from "inferno";
import {Rule} from "alef/es/types/Rule";
import Renderer from "alef/es/Renderer";
import combineRules from "alef/es/combineRules";
import resolvePassThrough from "alef/es/utils/resolvePassThrough";
import extractPassThroughProps from "alef/es/utils/extractPassThroughProps";
import {isString} from "inferno-shared";

export type AlefComponent<P> = ((props: P & Props & { _alefRule: any, children: InfernoChildren }, context: object) => VNode);

// TODO: Refactor to prevent polymorphism?
export default function createComponent<P>(rule: Rule,
                                        type: AlefComponent<any> | string | Function = "div",
                                        passThroughProps: (() => string[]) | string[] = []): AlefComponent<P> {
	const displayName = typeof rule === "function" && rule.name ? rule.name : "AlefComponent";

	const AlefComponent = ({children, _alefRule, ...ruleProps},
	                       {renderer, theme}: { renderer: Renderer, theme: any }) => {
		const combinedRule = _alefRule
			? combineRules(rule, _alefRule)
			: rule;

		// compose passThrough props from arrays or functions
		const resolvedPassThrough = resolvePassThrough(passThroughProps, ruleProps);

		// if the component renders into another Alef component
		// we pass down the combinedRule as well as both
		if ((type as any)._isAlefComponent) {
			return Inferno.createVNode(16, type, null, children, {
				_alefRule: combinedRule,
				passThrough: resolvedPassThrough,
				...ruleProps
			}, null, null, true);
			// return createElement(
			// 	type,
			// 	{
			// 		_alefRule: combinedRule,
			// 		passThrough: resolvedPassThrough,
			// 		...ruleProps
			// 	},
			// 	children
			// );
		}

		const componentProps = extractPassThroughProps(
			resolvedPassThrough,
			ruleProps
		);

		ruleProps.theme = theme || {};

		if (ruleProps.style) {
			componentProps.style = ruleProps.style;
		}
		const cls = ruleProps.className
			? `${ruleProps.className} `
			: "";
		const className =
			cls + renderer.renderRule(combinedRule, ruleProps);

		if (ruleProps.id) {
			componentProps.id = ruleProps.id;
		}

		if (ruleProps.innerRef) {
			componentProps.ref = ruleProps.innerRef;
		}

		const customType = ruleProps.is || type;

		const flags = isString(customType) ? getFlagsForElementVnode(customType) : 16;

		return Inferno.createVNode(flags, customType, className, children, componentProps, null, null, true);
		// return createElement(customType, componentProps, children);
	};

	(AlefComponent as any)._isAlefComponent = true;

	return AlefComponent;
}
