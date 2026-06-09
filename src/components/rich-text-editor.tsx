"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import LinkExtension from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo, Underline as UnderlineIcon, Strikethrough, Code as CodeIcon, Link, Unlink, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const t = useTranslations('richTextEditor');
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      Strike,
      Code,
      CodeBlock,
      HorizontalRule,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#1a5632] underline" },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-4 py-3 min-h-[200px] text-sm",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt(t('linkPrompt'));
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btn = (active: boolean, onClick: () => void, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded transition-colors ${active ? "bg-[#1a5632] text-white" : "text-gray-500 hover:bg-gray-100"}`}
      title={label}
    >
      {icon}
    </button>
  );

  return (
    <div className="border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#1a5632]">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b bg-gray-50 flex-wrap">
        {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), t('bold'), <Bold className="w-4 h-4" />)}
        {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), t('italic'), <Italic className="w-4 h-4" />)}
        {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), t('underline'), <UnderlineIcon className="w-4 h-4" />)}
        {btn(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), t('strikethrough'), <Strikethrough className="w-4 h-4" />)}
        {btn(editor.isActive("code"), () => editor.chain().focus().toggleCode().run(), t('code'), <CodeIcon className="w-4 h-4" />)}
        {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), t('heading'), <Heading2 className="w-4 h-4" />)}
        {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), t('bulletList'), <List className="w-4 h-4" />)}
        {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), t('numberedList'), <ListOrdered className="w-4 h-4" />)}
        {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), t('blockquote'), <Quote className="w-4 h-4" />)}
        {btn(editor.isActive("link"), () => addLink(), t('link'), <Link className="w-4 h-4" />)}
        {editor.isActive("link") && btn(false, () => editor.chain().focus().unsetLink().run(), t('removeLink'), <Unlink className="w-4 h-4" />)}
        {btn(false, () => editor.chain().focus().setHorizontalRule().run(), t('horizontalRule'), <Minus className="w-4 h-4" />)}
        <span className="w-px h-5 bg-gray-300 mx-1" />
        {btn(false, () => editor.chain().focus().undo().run(), t('undo'), <Undo className="w-4 h-4" />)}
        {btn(false, () => editor.chain().focus().redo().run(), t('redo'), <Redo className="w-4 h-4" />)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
