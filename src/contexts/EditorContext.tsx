import { createContext, useContext, useState, type ReactNode } from 'react'

export interface EditorElement {
  id: string
  type: 'text' | 'image' | 'button' | 'container' | 'video' | 'heading'
  content?: string
  src?: string
  style?: {
    width?: string
    height?: string
    backgroundColor?: string
    color?: string
    fontSize?: string
    padding?: string
    margin?: string
    textAlign?: 'left' | 'center' | 'right'
    borderRadius?: string
  }
  children?: EditorElement[]
  x?: number
  y?: number
}

export type { EditorElement as EditorElementType }

interface EditorContextType {
  elements: EditorElement[]
  selectedElement: EditorElement | null
  isPreviewMode: boolean
  addElement: (element: EditorElement) => void
  updateElement: (id: string, updates: Partial<EditorElement>) => void
  deleteElement: (id: string) => void
  selectElement: (element: EditorElement | null) => void
  setPreviewMode: (mode: boolean) => void
  clearCanvas: () => void
  loadElements: (elements: EditorElement[]) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<EditorElement[]>([])
  const [selectedElement, setSelectedElement] = useState<EditorElement | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const addElement = (element: EditorElement) => {
    setElements((prev) => [...prev, element])
    setSelectedElement(element)
  }

  const updateElement = (id: string, updates: Partial<EditorElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    )
    if (selectedElement?.id === id) {
      setSelectedElement((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedElement?.id === id) {
      setSelectedElement(null)
    }
  }

  const selectElement = (element: EditorElement | null) => {
    setSelectedElement(element)
  }

  const setPreviewMode = (mode: boolean) => {
    setIsPreviewMode(mode)
    if (mode) {
      setSelectedElement(null)
    }
  }

  const clearCanvas = () => {
    setElements([])
    setSelectedElement(null)
  }

  const loadElements = (newElements: EditorElement[]) => {
    setElements(newElements)
    setSelectedElement(null)
  }

  return (
    <EditorContext.Provider
      value={{
        elements,
        selectedElement,
        isPreviewMode,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        setPreviewMode,
        clearCanvas,
        loadElements,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}

