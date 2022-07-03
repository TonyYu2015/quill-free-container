import Quill from "quill";
import Container from './container';
const Parchment = Quill.import('parchment');
const { BlockBlot, ContainerBlot, EmbedBlot } = Parchment;

export default class EditContainer extends Container {
}

EditContainer.blotName = "edit-container";
EditContainer.tagName = "DIV";
EditContainer.allowedChildren = [BlockBlot, ContainerBlot, EmbedBlot];