import { Block } from "./coverBlots";
import { EDIT_CONTAINER } from "../CONSTS";

export default class ContainerFlag extends Block {
  static create (value = {}) {
    const node = super.create();
		node.setAttribute("style", "display: none; position: absolute; left: 0; top: -1px;");
		node.setAttribute("contenteditable", false);
		Object.entries(value).forEach(item => {
			node.setAttribute(`data-${item[0]}`, item[1]);
		});
		node.setAttribute(`data-prevlength`, 0);
		if(!node.hasAttribute('data-childlength')) {
			node.setAttribute(`data-childlength`, 0);
		}
		if(!node.hasAttribute('data-key')) {
			node.setAttribute(`data-key`, genId("flag"));
		}
    return node
  }


	static formats(domNode) {
		const formats = {}
		Object.entries(domNode.dataset).forEach(item => {
			formats[item[0]] = item[1];
		});
		return formats;
	}

	updateLength(len) {
		if(this.domNode.dataset.prevlength === this.domNode.dataset.childlength) {
			this.domNode.dataset.childlength = len;
		}
		this.domNode.dataset.prevlength = len;
	}

	updatePrevLength(len) {
		this.domNode.dataset.prevlength = len;
	}

	optimize(context) {
		this.updateLevel();
		super.optimize(context);
	}

	updateLevel() {
		let flagKey = this.domNode.dataset.key;
		let level = flagKey.split("-")[1];
		if(!level) {
			let theFlag = this.findTheclosetFlag(this);
			let levelgap = +this.domNode.dataset.levelgap || 0;
			if(theFlag) {
				let parentLevel = +theFlag.domNode.dataset.key.split("-")[1];
				this.domNode.dataset.key = `${flagKey}-${parentLevel + levelgap + 1}`;
			} else {
				this.domNode.dataset.key = `${flagKey}-${levelgap}`;
			}
		}
	}

	findTheclosetFlag(blot) {
		if(blot.parent) {
			if(blot.parent.statics.blotName === EDIT_CONTAINER) {
				return blot.parent.prev;
			} else {
				this.findTheclosetFlag(blot.parent);
			}
		}
		return null;
	}
}

ContainerFlag.blotName = "container-flag";
ContainerFlag.tagName = "p";
ContainerFlag.className = "ql-container-flag";


function genId(str) {
	return `${str}_${Math.random().toString(32).slice(2, 6)}`;
}