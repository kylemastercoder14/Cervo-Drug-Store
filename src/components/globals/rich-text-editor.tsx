import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Toolbar from "./tool-bar";
import Heading from "@tiptap/extension-heading";

const RichTextEditor = ({
  description,
  onChange,
  disabled,
}: {
  description: string;
  onChange: (richText: string) => void;
  disabled?: boolean;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold",
          levels: [2],
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "rounded-md bg-themeBlack border-themeGray text-themeTextGray border min-h-[150px] border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-1 text-sm shadow-sm",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  return (
    <div className="flex flex-col justify-stretch">
      <Toolbar editor={editor} />
      <EditorContent disabled={disabled} editor={editor} />
    </div>
  );
};

export default RichTextEditor;
