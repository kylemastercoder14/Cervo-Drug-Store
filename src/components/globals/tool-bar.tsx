"use client";

import React from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const activeFormats = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      heading: currentEditor?.isActive("heading") ?? false,
      bold: currentEditor?.isActive("bold") ?? false,
      italic: currentEditor?.isActive("italic") ?? false,
      strike: currentEditor?.isActive("strike") ?? false,
      bulletList: currentEditor?.isActive("bulletList") ?? false,
      orderedList: currentEditor?.isActive("orderedList") ?? false,
    }),
  });

  if (!editor) return null;
  return (
    <div className="border border-input bg-transparent rounded">
      <Toggle
        size="sm"
        pressed={activeFormats?.heading}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="w-4 h-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={activeFormats?.bold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={activeFormats?.italic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={activeFormats?.strike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={activeFormats?.bulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={activeFormats?.orderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Toggle>
    </div>
  );
};

export default Toolbar;
