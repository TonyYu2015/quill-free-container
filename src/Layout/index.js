import Quill from "quill";
import Resize from './resize';
import OuterContainer from "../outerContainer";
import './index.css';

const Delta = Quill.import('delta');
const Module = Quill.import('core/module');

class LayoutOuterContainer extends OuterContainer {
	static create(value) {
		const domNode = super.create(value);
		domNode.setAttribute('style', 'width: 100%;');
		return domNode;
	}

	constructor(scroll, domNode, value) {
		super(scroll, domNode, value);
		domNode.addEventListener('click', (evt) => {
			if(evt.target === this.domNode) {
				this.remove();
			}
		});

		domNode.addEventListener('mouseenter', (e) => {
			let editContainer = this.children.tail;
			if(
				editContainer 
				&& editContainer.statics.blotName === 'edit-container' 
				) {
					let width = editContainer.children.head.domNode.style.width;
					let resize = this.scroll.create('layout-resize', {width: parseInt(width) || 0});
					editContainer.appendChild(resize);
			}
		});

		domNode.addEventListener('mouseleave', (e) => {
			let editContainer = this.children.tail;
			let tail = editContainer.children.tail;
			if(tail.statics.blotName === 'layout-resize') {
				tail.remove();
			}
		});
	}

	optimize(context) {
		super.optimize(context);
		let firstChild = this.children.head;
		if(firstChild && firstChild.next && !firstChild.next.domNode.getAttribute('style')) {
			firstChild.next.domNode.setAttribute('style', 'display: flex;');
		}
		
	}
}

LayoutOuterContainer.blotName = "layout-outer";
LayoutOuterContainer.tagName = "DIV";
LayoutOuterContainer.className = "ql-layout-outer";

export class LayoutContainer extends OuterContainer {
	static create(value) {
		const domNode = super.create(value);
		const styleArr = [
			value.flex ? `flex: ${value.flex};` : `width: ${value.width}%;`,
			`display: inline-block;`,
			`vertical-align: top;`,
			`word-break: break-all;`,
			`position: relative;`,
			`max-height: 1000px;`
		];
		domNode.setAttribute('style', styleArr.reduce((a, b) => a + ` ${b}`));
		return domNode;
	}

	static formats(domNode) {
		const dataAttr = domNode.dataset;
		return {
			width: dataAttr.width
		}
	}

	optimize(context) {
		super.optimize(context);
		let width = parseInt(this.domNode.style.width) || 0;
		if(this.width !== width && this.children.head) {
			this.width = width;
			this.children.head.domNode.dataset.width = width;
		}
		if(this.children.length > 0) {
			const editContainer = this.children.tail;
			if(editContainer) {
				const editorHeight = editContainer.domNode.clientHeight;
				if(editorHeight > 900) {
					editContainer.children.tail.remove();
				}
			}
		}
	}

}

LayoutContainer.blotName = "layout-container";
LayoutContainer.tagName = "DIV";
LayoutContainer.className = "ql-layout-container";

export default class Layout extends Module {

	static register() {
		Quill.register(LayoutOuterContainer);
		Quill.register(LayoutContainer);
		Quill.register(Resize);
	}

	constructor(quill, options) {
		super(quill, options);
	}

	insertLayout() {
		const quill = this.quill;	
		const range = quill.getSelection(true);
		const index = (range || {}).index;
		if(index === undefined) return;
		let columns = 2;
		let childlength = columns * 2 + 1;
		let width = Math.floor(100 / columns);

    let currentBlot = quill.getLeaf(index)[0];
		if(this.isInLayout(currentBlot)) return;

		let layoutDelta = new Delta()
			.retain(index)
			.insert({'container-flag': {container: LayoutOuterContainer.blotName, childlength, width} });
		for(let i = 0; i < columns; i++) {
			layoutDelta = layoutDelta.insert({'container-flag': {container: LayoutContainer.blotName, levelgap: 1, width} });
		}

		quill.updateContents(
			layoutDelta,
			Quill.sources.USER
		);

		const [line, offset] = quill.getLine(index + 1);
		line.parent.addFocusedChange();
	}

	isInLayout(current) {
		return current && current.parent
			? current.parent instanceof LayoutContainer
				? true
				: this.isInLayout(current.parent)
			: false;
	}
}