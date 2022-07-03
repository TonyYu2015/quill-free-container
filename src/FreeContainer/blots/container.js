import Quill from "quill";
import withWrapper from '../withWrapper';
import { CONTAINER_FLAG } from "../CONSTS";

const Container = Quill.import('blots/container');
const Parchment = Quill.import('parchment');
const { BlockBlot, ContainerBlot, EmbedBlot, InlineBlot } = Parchment;


export function withContainer(container) {
	class HighOrderContainer extends withWrapper(container) {

		checkMerge() {
			return super.checkMerge() && this.domNode.dataset.key === this.next.domNode.dataset.key;
		}

		static create(value) {
			let domNode = super.create(value);
			if(value && value.key) {
				domNode.dataset.key = value.key;
			}
			return domNode;
		}

		optimize(context) {
			super.optimize(context);
			if(
				this.parent 
				&& this.parent.children.head.statics.blotName === CONTAINER_FLAG 
			) {
				const theFlagBlot = this.parent.children.head;
				let len = 0;
				const calLen = (containerBlot) =>{
					containerBlot.children.forEach(blot =>{
						if(blot instanceof Container) {
							calLen(blot);
						} else {
							len++;
						}
					}) 
				}

				calLen(this.parent);
				theFlagBlot.updateLevel();
				theFlagBlot.updateLength(len);
			}

		}
	}
	HighOrderContainer.allowedChildren = [BlockBlot, ContainerBlot, EmbedBlot, InlineBlot];
	return HighOrderContainer;
}

export default withContainer(Container);