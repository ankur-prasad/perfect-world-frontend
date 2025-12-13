import { Type, Image, Square, Video, Heading1, MousePointerClick } from 'lucide-react'
import { Button } from '../ui/button'
import { useEditor, type EditorElement } from '../../contexts/EditorContext'

const componentTypes = [
  { type: 'heading' as const, label: 'Heading', icon: Heading1, defaultContent: 'Heading Text' },
  { type: 'text' as const, label: 'Text', icon: Type, defaultContent: 'Add your text here...' },
  { type: 'image' as const, label: 'Image', icon: Image, defaultContent: '' },
  { type: 'button' as const, label: 'Button', icon: MousePointerClick, defaultContent: 'Button' },
  { type: 'video' as const, label: 'Video', icon: Video, defaultContent: '' },
  { type: 'container' as const, label: 'Container', icon: Square, defaultContent: '' },
]

export default function ComponentPalette() {
  const { addElement, isPreviewMode } = useEditor()

  const handleAddComponent = (type: EditorElement['type'], label: string, defaultContent: string) => {
    const newElement: EditorElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: defaultContent,
      style: {
        padding: type === 'button' ? '12px 24px' : type === 'heading' ? '16px' : '8px',
        margin: '8px',
        textAlign: 'left',
        borderRadius: type === 'button' ? '8px' : '0px',
        backgroundColor: type === 'container' ? '#f3f4f6' : 'transparent',
        color: '#000000',
        fontSize: type === 'heading' ? '32px' : '16px',
      },
    }
    addElement(newElement)
  }

  if (isPreviewMode) return null

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Components</h2>
      <div className="space-y-2">
        {componentTypes.map(({ type, label, icon: Icon, defaultContent }) => (
          <Button
            key={type}
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-3"
            onClick={() => handleAddComponent(type, label, defaultContent)}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Instructions</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click a component to add it</li>
          <li>• Click elements to select & edit</li>
          <li>• Use the properties panel to customize</li>
          <li>• Toggle preview to see the result</li>
        </ul>
      </div>
    </div>
  )
}

