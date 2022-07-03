import Quill from "quill";

const Container = Quill.import('blots/container');

export default class Resize extends Container {
	static create(value) {
		let domNode = super.create(value);

		const styleArr = [
			`position: absolute;`,
			`top: 0;`,
			`left: ${value.width}%;`,
			`height: 100%;`,
			`width: 2px;`,
			// `background-color: red;`,
			`cursor: col-resize;`,
		];
		domNode.setAttribute('style', styleArr.reduce((a, b) => a + ` ${b}`));
		return domNode;
	}

	constructor(scroll, domNode, value) {
		super(scroll, domNode, value);
		addResizeMove(domNode);
	}

	optimize(context) {
		let left = this.domNode.style.left;
		if(~left.indexOf('px')) {
			let percent = this.transferPxToPercent(left);
			let firstContainer = this.parent.children.head;
			let secondContainer = this.parent.children.head.next;
			firstContainer.domNode.style.width = `${percent}%`;
			secondContainer.domNode.style.width = `${100 - percent}%`;
			this.domNode.style.left = `${percent}%`;
		}
	}

	transferPxToPercent(px) {
		let parentWidth = parseInt(this.parent.domNode.clientWidth);
		let curDomNodeWidth = parseInt(px);
		return Math.floor((curDomNodeWidth / parentWidth) * 100);
	}
}

Resize.blotName = 'layout-resize';
Resize.tagName = 'DIV';
Resize.className = 'ql-layout-resize';


function	addResizeMove(moveEle, mouseDownEle) {
		if(!moveEle instanceof HTMLElement) {
			throw new Error("传入正确的html元素");
		}
		mouseDownEle = mouseDownEle || moveEle;

		const mouseDown = function(e) {
			e = e || window.event;
			if(e.target !== mouseDownEle) return;

			let maxLeft = moveEle.parentElement.clientWidth - moveEle.clientWidth;
			let maxTop = moveEle.parentElement.clientHeight - moveEle.clientHeight;

			let leftSpace = e.clientX - moveEle.offsetLeft;
			let topSpace = e.clientY - moveEle.offsetTop;

			function mouseMove(e) {
				e = e || window.event;
				e.preventDefault();

				let left = e.clientX - leftSpace;
				let top = e.clientY - topSpace;

				moveEle.style.left = left > 0 ? (left > maxLeft ? `${maxLeft}px` : `${left}px`) : 0;
				moveEle.style.top = top > 0 ? (top > maxTop ? `${maxTop}px` : `${top}px`) : 0;
				return false;
			}

			document.addEventListener('mousemove', mouseMove);
			document.addEventListener('mouseup', () => {
				document.removeEventListener('mousemove', mouseMove);
			});
		}

		mouseDownEle.addEventListener('mousedown', mouseDown);
	}