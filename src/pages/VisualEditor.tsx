import { EditorProvider } from '../contexts/EditorContext'
import EditorToolbar from '../components/Editor/EditorToolbar'
import ComponentPalette from '../components/Editor/ComponentPalette'
import EditorCanvas from '../components/Editor/EditorCanvas'
import PropertiesPanel from '../components/Editor/PropertiesPanel'

export default function VisualEditor() {
  return (
    <EditorProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        <EditorToolbar />
        <div className="flex flex-1 overflow-hidden" style={{ marginTop: '64px' }}>
          <ComponentPalette />
          <EditorCanvas />
          <PropertiesPanel />
        </div>
      </div>
    </EditorProvider>
  )
}


