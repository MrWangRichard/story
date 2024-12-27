import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

export const extensions = [
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
]; 