import Component from "inferno-component";
import createElement from "inferno-create-element";

import connectFactory from "alef/es/bindings/connectFactory";

export default connectFactory(Component, createElement);
