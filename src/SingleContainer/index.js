import Quill from "quill";
import OuterContainer from "../outerContainer";
import './index.css';

const Module = Quill.import('core/module');
const Delta = Quill.import('delta');

class SingleContainerWrapper extends OuterContainer {
	static create(value) {
		let domNode = super.create(value);
		domNode.setAttribute('style', `width: 100%; position: relative;`);
		return domNode;
	}

	constructor(scroll, domNode, value) {
		super(scroll, domNode, value);

		domNode.addEventListener('click', (evt) => {
			if(evt.target === this.domNode) {
				this.remove();
			}
		});
	}

	optimize(context) {
		super.optimize(context);
		let firstChild = this.children.head;
		if(firstChild && firstChild.next && !firstChild.next.domNode.getAttribute('style')) {
			firstChild.next.domNode.setAttribute('style', 'position: relative;');
		}
	}
}

SingleContainerWrapper.blotName = 'single-container-wrapper';
SingleContainerWrapper.tagName = 'DIV';
SingleContainerWrapper.className = 'ql-single-container-wrapper';


export default class SingleContainer extends Module {

	static register() {
		Quill.register(SingleContainerWrapper);
	}

	constructor(quill, options) {
		super(quill, options);
	}

	insert() {
		const quill = this.quill;	
		const range = quill.getSelection(true);
		const index = (range || {}).index;
		if(index === undefined) return;
    let currentBlot = quill.getLeaf(index)[0]
		if(this.isInSingleContainer(currentBlot)) return;


		let SingleDelta = new Delta()
			.retain(index)
			.insert({'container-flag': {container: SingleContainerWrapper.blotName} });

		quill.updateContents(
			SingleDelta,
			Quill.sources.USER
		);
		const [line, offset] = quill.getLine(index);
		line.parent.addFocusedChange();
	}

	isInSingleContainer(current) {
		return current && current.parent
			? current.parent instanceof SingleContainerWrapper
				? true
				: this.isInSingleContainer(current.parent)
			: false
		}
}