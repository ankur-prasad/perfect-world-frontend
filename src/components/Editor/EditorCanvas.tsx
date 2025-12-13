import { useEditor, type EditorElement } from '../../contexts/EditorContext'
import { cn } from '../../lib/utils'

function RenderElement({ element }: { element: EditorElement }) {
  const { selectElement, selectedElement, deleteElement, isPreviewMode } = useEditor()
  const isSelected = selectedElement?.id === element.id

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.stopPropagation()
      selectElement(element)
    }
  }

  const handleDelete = (e: React.KeyboardEvent) => {
    if (!isPreviewMode && e.key === 'Delete' && isSelected) {
      deleteElement(element.id)
    }
  }

  const baseStyle: React.CSSProperties = {
    ...element.style,
    position: 'relative',
    outline: isSelected && !isPreviewMode ? '2px solid #3b82f6' : 'none',
    outlineOffset: '2px',
    cursor: isPreviewMode ? 'default' : 'pointer',
  }

  switch (element.type) {
    case 'heading':
      return (
        <h1
          style={baseStyle}
          onClick={handleClick}
          onKeyDown={handleDelete}
          tabIndex={0}
          className={cn(
            'font-bold',
            !isPreviewMode && 'hover:opacity-80 transition-opacity'
          )}
        >
          {element.content || 'Heading'}
        </h1>
      )

    case 'text':
      return (
        <p
          style={baseStyle}
          onClick={handleClick}
          onKeyDown={handleDelete}
          tabIndex={0}
          className={cn(!isPreviewMode && 'hover:opacity-80 transition-opacity')}
        >
          {element.content || 'Text content'}
        </p>
      )

    case 'button':
      return (
        <button
          style={baseStyle}
          onClick={handleClick}
          onKeyDown={handleDelete}
          tabIndex={0}
          className={cn(
            'font-medium transition-all',
            !isPreviewMode && 'hover:opacity-80'
          )}
        >
          {element.content || 'Button'}
        </button>
      )

    case 'image':
      return (
        <div
          style={baseStyle}
          onClick={handleClick}
          onKeyDown={handleDelete}
          tabIndex={0}
          className={cn(
            'bg-gray-200 flex items-center justify-center',
            !isPreviewMode && 'hover:opacity-80 transition-opacity'
          )}
        >
          {element.src ? (
            <img
              src={element.src}
              alt={element.content || 'Image'}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm">Click to add image</span>
          )}
        </div>
      )

    case 'video':
      return (
        <div
          style={baseStyle}
          onClick={handleClick}
          onKeyDown={handleDelete}
          tabIndex={0}
          className={cn(
            'bg-gray-200 flex items-center justify-center',
            !isPreviewMode && 'hover:opacity-80 transition-opacity'
          )}
        >
          {element.src ? (
            <video
              src={element.src}
              controls
              className="max-w-full max-h-full"
            />
          ) : (
            <span className="text-gray-400 text-sm">Click to add video</span>
          )}
        </div>
      )

    case 'container':
      return (
        <div
          style={baseStyle}
          onClick={handleClick}
          onKeyDown={handleDelete}
          tabIndex={0}
          className={cn(
            'min-h-[100px]',
            !isPreviewMode && 'hover:opacity-80 transition-opacity'
          )}
        >
          {element.children?.map((child) => (
            <RenderElement key={child.id} element={child} />
          ))}
          {(!element.children || element.children.length === 0) && (
            <span className="text-gray-400 text-sm">Container</span>
          )}
        </div>
      )

    default:
      return null
  }
}

export default function EditorCanvas() {
  const { elements, selectElement, isPreviewMode } = useEditor()

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPreviewMode) {
      selectElement(null)
    }
  }

  return (
    <div
      className="flex-1 overflow-auto bg-gray-50 p-8"
      onClick={handleCanvasClick}
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <div className="max-w-4xl mx-auto bg-white min-h-full shadow-lg p-8">
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Empty Canvas</p>
              <p className="text-sm">Add components from the left panel to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {elements.map((element) => (
              <RenderElement key={element.id} element={element} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

