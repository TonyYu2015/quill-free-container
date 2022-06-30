import Quill from "quill";
import { CONTAINER_FLAG, EDIT_CONTAINER } from "./CONSTS"; 

const Container = Quill.import('blots/container');


export default function withWrapper(blot) {
	return class HighOrderWrapper extends blot {

		optimize(context) {
			if(this.statics.blotName === CONTAINER_FLAG && this.parent.statics.blotName !== this.domNode.dataset.container ) {
				const dataAttr = this.domNode.dataset;
				const childlength = dataAttr.childlength;
				this.wrap(dataAttr.container, {...dataAttr});
				this.updateLength(1);
				if(!childlength || +childlength === 0) {
					const blot = this.scroll.create('block');
					blot.wrapped = true;
					blot.wrap(EDIT_CONTAINER);
					this.parent.appendChild(blot.parent);
				}
			}else if(
				!this.wrapped
				&& !this.statics.requiredContainer
				&& ![EDIT_CONTAINER, CONTAINER_FLAG].includes(this.statics.blotName)
				&& this.parent.statics.blotName !== "list-container"
			) {
				let flag = this.getTheNearestFlag();
				if(
					flag !== null 
				) {
					let container = flag.domNode.dataset.container;
					let key = flag.domNode.dataset.key;
					this.wrap(EDIT_CONTAINER);
					this.parent.wrap(container, {key});
					this.wrapped = true;
				}	
			}
			super.optimize(context);
		}

		getTheNearestFlag() {
			let _that = this;
			let theFlag = null;
			let index = 0;
			let before = this;

			let next = null;
			let wip = this.prev || this.parent;
			let nextWork = function() {
				let blot = wip;
				index++;
				if(
					!theFlag
					&& blot.statics.blotName === CONTAINER_FLAG 
					&& index < +blot.domNode.dataset.childlength
					&& +blot.domNode.dataset.prevlength < +blot.domNode.dataset.childlength
				) {
					if(!_that.domNode.dataset.key) {
						theFlag = blot;
					} else {
						let thisLevel = +_that.domNode.dataset.key.split("-")[1];
						let blotLevel = +blot.domNode.dataset.key.split("-")[1];
						if(thisLevel > blotLevel) {
							theFlag = blot;
						}
					}
				}
				if(theFlag) return;

				while(!blot.prev) {
					blot = blot.parent;
					if(!blot) {
						wip = null;
						return;
					}
				}
				wip = blot.prev;
			};
			const beginWork = (blot) => {
				if(blot.next) {
					return blot.next;
				} else if(blot instanceof Container) {
					return blot.children.head;
				} else {
					return null;
				}
			};

			// debugger
			while(wip && wip !== this.scroll) {
				next = beginWork(wip);
				if(next === null || next === before) {
					before = wip;
					while(wip && !(wip instanceof Container)) {
						nextWork();
						if(theFlag) break;
					}
					if(theFlag) break;
					wip = !wip ? wip : wip.children.head;
				} else {
					wip = next;
				}
			}

			if(theFlag) {
				let len = +theFlag.domNode.dataset.prevlength + 1;
				theFlag.updatePrevLength(len);
			}


			return theFlag;
		}
	} 
}