'use client';

import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import {
  Check,
  ChevronRight,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Text,
  TextQuote,
  Code,
  Table,
  Image,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface CommandProps {
  editor: Editor;
  range: any;
}

const Command = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: any;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: '文本',
      description: '普通文本',
      icon: <Text className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .run();
      },
    },
    {
      title: '一级标题',
      description: '大标题',
      icon: <Heading1 className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run();
      },
    },
    {
      title: '二级标题',
      description: '中标题',
      icon: <Heading2 className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run();
      },
    },
    {
      title: '三级标题',
      description: '小标题',
      icon: <Heading3 className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 3 })
          .run();
      },
    },
    {
      title: '无序列表',
      description: '创建无序列表',
      icon: <List className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: '有序列表',
      description: '创建有序列表',
      icon: <ListOrdered className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: '引用',
      description: '添加引用文本',
      icon: <TextQuote className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: '代码块',
      description: '添加代码块',
      icon: <Code className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: '表格',
      description: '插入表格',
      icon: <Table className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
    {
      title: '图片',
      description: '插入图片',
      icon: <Image className="w-4 h-4" />,
      command: ({ editor, range }: CommandProps) => {
        const url = window.prompt('输入图片URL');
        if (url) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setImage({ src: url })
            .run();
        }
      },
    },
  ].filter((item) => {
    if (typeof query === 'string' && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
};

const CommandList = ({ items, command, editor, range }: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    const onKeyDown = (e: KeyboardEvent) => {
      if (!navigationKeys.includes(e.key)) {
        return;
      }

      e.preventDefault();

      if (e.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        return true;
      }
      if (e.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % items.length);
        return true;
      }
      if (e.key === 'Enter') {
        const selectedItem = items[selectedIndex];
        command(selectedItem);
        return true;
      }
      return false;
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items, selectedIndex, command]);

  useLayoutEffect(() => {
    const commandList = commandListRef.current;
    if (commandList) {
      const selectedItem = commandList.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <div
      ref={commandListRef}
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-border bg-popover shadow-md"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            key={index}
            onClick={() => command(item)}
            className={cn(
              'flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm hover:bg-accent',
              selectedIndex === index ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      popup = tippy(document.body, {
        getReferenceClientRect: () => props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);
      popup?.[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide();
        return true;
      }
      return false;
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

export { Command, getSuggestionItems, renderItems }; 