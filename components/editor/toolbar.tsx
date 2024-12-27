import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Image,
  Bold,
  Italic,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const tools = [
    {
      icon: <Heading1 className="w-5 h-5" />,
      title: '一级标题',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="w-5 h-5" />,
      title: '二级标题',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="w-5 h-5" />,
      title: '三级标题',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    { type: 'divider' },
    {
      icon: <Bold className="w-5 h-5" />,
      title: '加粗',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: <Italic className="w-5 h-5" />,
      title: '斜体',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    { type: 'divider' },
    {
      icon: <List className="w-5 h-5" />,
      title: '无序列表',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="w-5 h-5" />,
      title: '有序列表',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    { type: 'divider' },
    {
      icon: <Table className="w-5 h-5" />,
      title: '插入表格',
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: '插入图片',
      action: () => {
        const url = window.prompt('输入图片URL');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    },
  ];

  return (
    <div className="border-b">
      <div className="flex flex-wrap gap-2 p-2">
        {tools.map((tool, index) => {
          if (tool.type === 'divider') {
            return <div key={index} className="w-px h-6 bg-border" />;
          }
          return (
            <button
              key={index}
              onClick={tool.action}
              className={cn(
                'p-2 rounded-lg hover:bg-accent transition-colors',
                tool.isActive?.() && 'bg-accent text-accent-foreground'
              )}
              title={tool.title}
            >
              {tool.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
} 