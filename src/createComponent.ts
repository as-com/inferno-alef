import createElement from "inferno-create-element";
import {Rule} from "alef/es/types/Rule";
import Renderer from "alef/es/Renderer";
import combineRules from "alef/es/combineRules";
import resolvePassThrough from "alef/es/utils/resolvePassThrough";
import extractPassThroughProps from "alef/es/utils/extractPassThroughProps";
import {VNode, Props, InfernoChildren} from "inferno";

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
			return createElement(
				type,
				{
					_alefRule: combinedRule,
					passThrough: resolvedPassThrough,
					...ruleProps
				},
				children
			);
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
		componentProps.className =
			cls + renderer.renderRule(combinedRule, ruleProps);

		if (ruleProps.id) {
			componentProps.id = ruleProps.id;
		}

		if (ruleProps.innerRef) {
			componentProps.ref = ruleProps.innerRef;
		}

		const customType = ruleProps.is || type;
		return createElement(customType, componentProps, children);
	};

	(AlefComponent as any)._isAlefComponent = true;

	return AlefComponent;
}
