'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Command, getSuggestionItems, renderItems } from './slash-command';
import Placeholder from '@tiptap/extension-placeholder';
import { Toolbar } from './toolbar';
import '@/styles/editor.css';
import { PublishSettings } from './publish-settings';
import { useRef, useState, useEffect } from 'react';
import { BottomToolbar } from './bottom-toolbar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { marked } from 'marked';
import { generateJSON } from '@tiptap/html';
import { extensions } from './extensions';

interface EditorProps {
  onCoverChange?: (coverUrl: string) => void;
  coverUrl?: string;
  onPreview?: (content: { title: string; content: string; coverUrl?: string }) => void;
  onPublish?: (content: { title: string; content: string; coverUrl?: string }) => void;
  title: string;
}

export function Editor({ onCoverChange, coverUrl, onPreview, onPublish, title }: EditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [editTime, setEditTime] = useState('0分钟');
  const [showMarkdownDialog, setShowMarkdownDialog] = useState(false);
  const [clipboardText, setClipboardText] = useState('');
  const startTimeRef = useRef(Date.now());
  const settingsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const minutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
      if (minutes < 60) {
        setEditTime(`${minutes}分钟`);
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        setEditTime(`${hours}小时${remainingMinutes}分钟`);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const isMarkdown = (text: string) => {
    const markdownPatterns = [
      /^#+ .*$/m,
      /\*\*.*?\*\*/,
      /\*.*?\*/,
      /__.*?__/,
      /~~.*?~~/,
      /^\s*[-*+] /m,
      /^\s*\d+\. /m,
      /```[\s\S]*?```/,
      /`.*?`/,
      /\[.*?\]\(.*?\)/,
      /!\[.*?\]\(.*?\)/,
      /^\s*>/m,
      /\|.*\|.*\|/,
      /^-{3,}$/m,
      /^\s*- \[ \]/m,
      /\$\$[\s\S]*?\$\$/,
      /\$.*?\$/,
      /==.*?==/,
      /\^.*?\^/,
      /~.*?~/,
      /{.*?}/,
      /<!--[\s\S]*?-->/,
      /^\s*:\w+:/m,
    ];

    return markdownPatterns.some(pattern => pattern.test(text));
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-md bg-gray-100 p-4',
          },
        },
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Command.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
      Placeholder.configure({
        placeholder: '输入 / 打开命令菜单...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[700px]',
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (text && isMarkdown(text)) {
          event.preventDefault();
          setClipboardText(text);
          setShowMarkdownDialog(true);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.length);
    },
  });

  const scrollToSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreview = () => {
    if (editor && onPreview) {
      onPreview({
        title,
        content: editor.getHTML(),
        coverUrl,
      });
    }
  };

  const handlePublish = async () => {
    if (editor && onPublish) {
      await onPublish({
        title,
        content: editor.getHTML(),
        coverUrl,
      });
    }
  };

  const formatMarkdown = () => {
    if (editor) {
      try {
        // 使用 marked 将 Markdown 转换为 HTML
        const html = marked(clipboardText, {
          mangle: false,
          headerIds: false,
        });
        
        // 直接使用 editor.commands.insertContent 插入 HTML
        editor.commands.insertContent(html, {
          parseOptions: {
            preserveWhitespace: false,
          },
        });
        
        setShowMarkdownDialog(false);
      } catch (error) {
        console.error('Markdown formatting error:', error);
        editor.commands.insertContent(clipboardText);
        setShowMarkdownDialog(false);
      }
    }
  };

  return (
    <div className="relative w-full max-w-screen-lg border rounded-lg bg-background">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <PublishSettings 
        ref={settingsRef}
        onCoverChange={onCoverChange || (() => {})}
        coverUrl={coverUrl}
      />
      <div className="h-16" />
      <BottomToolbar
        wordCount={wordCount}
        editTime={editTime}
        onPreview={handlePreview}
        onPublish={handlePublish}
        scrollToSettings={scrollToSettings}
        scrollToTop={scrollToTop}
      />

      <Dialog open={showMarkdownDialog} onOpenChange={setShowMarkdownDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>检测到 Markdown 格式</DialogTitle>
            <DialogDescription>
              检测到粘贴的内容包含 Markdown 格式，是否需要格式化显示？
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (editor) {
                    editor.commands.insertContent(clipboardText);
                  }
                }}
              >
                保持原文本
              </Button>
            </DialogClose>
            <Button onClick={formatMarkdown}>
              格式化显示
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 