import { Eye, EyeOff, Trash2, Download, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import { useEditor } from '../../contexts/EditorContext'

export default function EditorToolbar() {
  const { isPreviewMode, setPreviewMode, clearCanvas, elements, loadElements } = useEditor()

  const handleSave = () => {
    const data = JSON.stringify(elements, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `editor-content-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoad = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const content = JSON.parse(event.target?.result as string)
            loadElements(content)
          } catch (error) {
            alert('Failed to load file. Please check the format.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">Visual Editor</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoad}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Load
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-2"
            disabled={elements.length === 0}
          >
            <Download className="w-4 h-4" />
            Save
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2"
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={clearCanvas}
            className="flex items-center gap-2"
            disabled={elements.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}


