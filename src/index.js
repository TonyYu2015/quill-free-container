import Quill from "quill";
import * as coverBlots from "./blots/coverBlots";
import Container from './blots/container';
import ContainerFlag from './blots/container_flag';
import EditContainer from './blots/editContainer';
import { EDIT_CONTAINER } from "./CONSTS";

const Module = Quill.import('core/module');


export default class FreeContainer extends Module {
	static register() {
		Object.keys(coverBlots).forEach(blotKey => {
			Quill.register(coverBlots[blotKey]);
		})
		Quill.register({'blots/wrapperContainer': Container});
		Quill.register(ContainerFlag);
		Quill.register(EditContainer);
	}

	constructor(quill, options) {
		super(quill, options);
		const _this = this;
		quill.keyboard.addBinding(
			{
				key: 'Backspace'
			}, {
				offset: 0
			}, function freeBackspace(range, context) {
				const [line] = this.quill.getLine(range.index);
				const [prev] = this.quill.getLine(range.index - 1);
				if(!_this.isInSameContainer(line, prev)) {
					return false;
				}
				this.quill.setSelection(range.index - 1);
				return true;
			}
		);

		let thisBinding = quill.keyboard.bindings['Backspace'].pop();
		quill.keyboard.bindings['Backspace'].splice(1, 0, thisBinding);
	}

	isInSameContainer(line, prev) {
		let lineEditContainer = this.findEditContainer(line);
		let prevEditContainer = this.findEditContainer(prev);
		return lineEditContainer === prevEditContainer;
	}

	findEditContainer(blot) {
		if(blot.parent) {
			if(blot.parent.statics.blotName === EDIT_CONTAINER) {
				return blot.parent;
			} else {
				return this.findEditContainer(blot.parent);
			}
		}
	}
}