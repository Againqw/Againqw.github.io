import { Markdown } from '../components/Markdown'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  rows?: number
}

/** 左编辑右预览，预览用的是前台同一套 Markdown 组件 */
export function MarkdownEditor({ value, onChange, error, rows = 16 }: MarkdownEditorProps) {
  return (
    <div className="field">
      <div className="field__label">
        正文 <b>*</b>
        <span className="field__hint" style={{ marginLeft: 8 }}>
          支持 Markdown：## 标题、代码块、表格、列表
        </span>
      </div>
      <div className="editor-grid">
        <div>
          <div className="editor-head">MARKDOWN</div>
          <textarea
            className={`textarea textarea--code ${error ? 'is-error' : ''}`}
            rows={rows}
            value={value}
            spellCheck={false}
            placeholder={'## 小节标题\n\n正文段落…\n\n```java\npublic class Demo {}\n```'}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <div>
          <div className="editor-head">PREVIEW</div>
          <div className="editor-preview">
            {value.trim() ? <Markdown content={value} /> : <div className="empty">左侧输入内容后在这里预览</div>}
          </div>
        </div>
      </div>
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
