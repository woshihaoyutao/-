import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export default function NewsEditor(props) {
  useEffect(() => {
    // console.log(props.content)
    //怎么把html代码片段转回成draft对象 从而到editorstate上
    //用html-to-draftjs
    const html = props.content;
    if (html === undefined) return; //解决HTML为空时trim（）报错问题
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [props.content]); //拿到以前撰写新闻时候的html代码片段
  const [editorState, setEditorState] = useState("");
  return (
    <div>
      <Editor
        editorState={editorState} //1
        toolbarClassName="toolbarClassName" //2
        wrapperClassName="wrapperClassName" //3
        editorClassName="editorClassName" //4       /2 3 4为控制样式的
        onEditorStateChange={(editorState) => setEditorState(editorState)} //5    1和5让Editor成为受控组件
        onBlur={() => {
          props.getContent(
            draftToHtml(convertToRaw(editorState.getCurrentContent()))
          );
        }}
      />
    </div>
  );
}
