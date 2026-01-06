<template>
  <div class="border rounded-lg overflow-hidden">
    
    <div v-if="editor" class="flex gap-1 p-2 border-b bg-base-200">
      <button 
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-primary text-primary-content': editor.isActive('bold') }"
        class="btn btn-xs btn-ghost"
        title="Bold"
      >
        <Icon name="lucide:bold" class="w-4 h-4" />
      </button>
      <button 
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-primary text-primary-content': editor.isActive('italic') }"
        class="btn btn-xs btn-ghost"
        title="Italic"
      >
        <Icon name="lucide:italic" class="w-4 h-4" />
      </button>
      <button 
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-primary text-primary-content': editor.isActive('heading', { level: 2 }) }"
        class="btn btn-xs btn-ghost"
        title="Heading"
      >
        <Icon name="lucide:heading-2" class="w-4 h-4" />
      </button>
      <button 
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-primary text-primary-content': editor.isActive('bulletList') }"
        class="btn btn-xs btn-ghost"
        title="Bullet List"
      >
        <Icon name="lucide:list" class="w-4 h-4" />
      </button>
      <button 
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-primary text-primary-content': editor.isActive('orderedList') }"
        class="btn btn-xs btn-ghost"
        title="Numbered List"
      >
        <Icon name="lucide:list-ordered" class="w-4 h-4" />
      </button>
      <div class="divider divider-horizontal"></div>
      <button 
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="btn btn-xs btn-ghost"
        title="Undo"
      >
        <Icon name="lucide:undo" class="w-4 h-4" />
      </button>
      <button 
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="btn btn-xs btn-ghost"
        title="Redo"
      >
        <Icon name="lucide:redo" class="w-4 h-4" />
      </button>
    </div>

    <EditorContent :editor="editor" class="prose max-w-none p-4 min-h-[200px] focus:outline-none" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    })
  ],
  content: props.modelValue || '',
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'focus:outline-none'
    }
  }
})

watch(() => props.modelValue, (value) => {
  if (editor.value && value !== editor.value.getHTML()) {
    editor.value.commands.setContent(value || '')
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
:deep(.ProseMirror) {
  outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>