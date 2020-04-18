import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import ImageTool from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
// import Warning from '@editorjs/warning'
 
export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  paragraph: Paragraph,
  list: List,
  code: Code,
  linkTool: LinkTool,
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: 'http://localhost:5000/uploadByFile', // Your backend file uploader endpoint
        byUrl: 'http://localhost:5000/uploadByUrl', // Your endpoint that provides uploading by Url
      }
    }
  },
  raw: Raw,
  header: Header,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage
}

// export const  EDITOR_JS_TOOLS = {
//     header: {
//         class: Header,
//         inlineToolbar: ['link'],
//         config: {
//         placeholder: 'Header'
//         },
//         shortcut: 'CMD+SHIFT+H'
//     },

//     /**
//      * Or pass class directly without any configuration
//      */
//     image: {
//         class: SimpleImage,
//         inlineToolbar: ['link'],
//     },

//     list: {
//         class: List,
//         inlineToolbar: true,
//         shortcut: 'CTRL+SHIFT+L'
//     },

//     checklist: {
//         class: CheckList,
//         inlineToolbar: true,
//     },

//     quote: {
//         class: Quote,
//         inlineToolbar: true,
//         config: {
//         quotePlaceholder: 'Enter a quote',
//         captionPlaceholder: 'Quote\'s author',
//         },
//         shortcut: 'CMD+SHIFT+O'
//     },

//     warning: Warning,

//     marker: {
//         class:  Marker,
//         shortcut: 'CMD+SHIFT+M'
//     },

//     code: {
//         class:  Code,
//         // shortcut: 'CMD+SHIFT+C'
//     },

//     delimiter: Delimiter,

//     inlineCode: {
//         class: InlineCode,
//         shortcut: 'CMD+SHIFT+C'
//     },

//     linkTool: LinkTool,

//     raw: Raw,

//     embed: Embed,

//     table: {
//         class: Table,
//         inlineToolbar: true,
//         shortcut: 'CMD+ALT+T'
//     },

// }