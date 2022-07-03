import Quill from "quill";
import withWrapper from "../withWrapper";
import Container from './container';

export const Block = withWrapper(Quill.import("blots/block"));
export const BlockEmbed = withWrapper(Quill.import("blots/block/embed"));
export const Header = withWrapper(Quill.import("formats/header"));


// the reason for the difference with above is that i can't get the blot direclty
const Q_List = Quill.import("formats/list");

class ListContainer extends Container {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL'

class ListItem_ extends Q_List {
	static register() {
		Quill.register(ListContainer);
	}
}

ListContainer.allowedChildren = [ListItem_];
ListItem_.requiredContainer = ListContainer;

export const ListItem = withWrapper(ListItem_);
