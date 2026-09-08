import { Type } from 'lucide-react'

function ReportTitleEditor({ value, onChange }) {
  return (
    <section
      className="report-title-editor"
      aria-labelledby="report-title-editor-heading"
    >
      <span className="report-title-editor__icon" aria-hidden="true">
        <Type size={22} strokeWidth={2.2} />
      </span>

      <div className="report-title-editor__copy">
        <h3 id="report-title-editor-heading">Report title</h3>
        <p>Shown live in the blue label on the first report page.</p>
      </div>

      <label className="report-title-editor__field">
        <span>Title text</span>
        <input
          type="text"
          value={value}
          dir="rtl"
          lang="fa"
          placeholder="تعلیق در بازار"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </section>
  )
}

export default ReportTitleEditor
