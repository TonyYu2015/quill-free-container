# quill-free-container
a base module for create container module in quill, hope it can help you

## Requirements

[quilljs](https://github.com/quilljs/quill) v2.0.0.-dev.4

## Installation

    npm install quill-free-container

## Usage
first you should register this module before others 

    import Quill from 'quill';
    import FreeContainer from 'quill-free-container';

    Quill.register({
      'modules/freeContainer': FreeContainer
    });

    export default Quill;

then you can use it like this

    new Delta.insert('container-flag', {container: 'yourContainerBlotName'});

some examples maybe show how to use it specifically, online Demo, git Repository

## Community
Contribute on [Issues](https://github.com/TonyYu2015/quill-free-container/issues), I glad to hear your suggestion
