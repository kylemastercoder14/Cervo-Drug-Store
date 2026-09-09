import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useRef } from "react";
import Toolbar from "./tool-bar";
import Heading from "@tiptap/extension-heading";

const editorExtensions = [
  StarterKit.configure({}),
  Heading.configure({
    HTMLAttributes: {
      class: "text-xl font-bold",
      levels: [2],
    },
  }),
];

const editorProps = {
  attributes: {
    class:
      "rounded-md border-zinc-200 text-themeTextGray border min-h-[100px] bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-1 text-sm shadow-sm",
  },
};

const RichTextEditor = ({
  onChange,
  disabled,
  value,
}: {
  value: string;
  onChange: (richText: string) => void;
  disabled?: boolean;
}) => {
  const latestValue = useRef(value || "");
  const editor = useEditor({
    extensions: editorExtensions,
    content: value || "",
    editorProps,
    onUpdate({ editor }) {
      latestValue.current = editor.getHTML();
    },
    onBlur({ editor }) {
      const nextValue = editor.getHTML();
      latestValue.current = nextValue;
      onChange(nextValue);
    },
    editable: !disabled,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div className="flex flex-col justify-stretch">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
