import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { useEditor, type EditorElement } from '../../contexts/EditorContext'

export default function PropertiesPanel() {
  const { selectedElement, updateElement, deleteElement, selectElement, isPreviewMode } = useEditor()

  if (isPreviewMode || !selectedElement) return null

  const handleStyleChange = (key: string, value: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        style: {
          ...selectedElement.style,
          [key]: value,
        },
      })
    }
  }

  const handleContentChange = (value: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { content: value })
    }
  }

  const handleSrcChange = (value: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { src: value })
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => selectElement(null)}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {selectedElement && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {selectedElement.type}
            </div>
          </div>

          {(selectedElement.type === 'text' ||
            selectedElement.type === 'heading' ||
            selectedElement.type === 'button') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={selectedElement.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          )}

          {(selectedElement.type === 'image' || selectedElement.type === 'video') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source URL
              </label>
              <input
                type="text"
                value={selectedElement.src || ''}
                onChange={(e) => handleSrcChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width
            </label>
            <input
              type="text"
              value={selectedElement.style?.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="auto, 100%, 200px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="text"
              value={selectedElement.style?.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="auto, 100px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.style?.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.style?.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.style?.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.style?.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="text"
              value={selectedElement.style?.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              placeholder="16px, 1.5rem"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding
            </label>
            <input
              type="text"
              value={selectedElement.style?.padding || ''}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              placeholder="8px, 16px 24px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin
            </label>
            <input
              type="text"
              value={selectedElement.style?.margin || ''}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              placeholder="8px, 16px 24px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Align
            </label>
            <select
              value={selectedElement.style?.textAlign || 'left'}
              onChange={(e) =>
                handleStyleChange('textAlign', e.target.value as 'left' | 'center' | 'right')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <input
              type="text"
              value={selectedElement.style?.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              placeholder="8px, 50%"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteElement(selectedElement.id)}
              className="w-full"
            >
              Delete Element
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

