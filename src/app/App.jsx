import AppFooter from '../components/layout/AppFooter'
import AppHeader from '../components/layout/AppHeader'
import ReportUploadPanel from '../features/report-upload/components/ReportUploadPanel'

function App() {
  return (
    <main className="app-shell" id="top">
      <AppHeader />
      <ReportUploadPanel />
      <AppFooter />
    </main>
  )
}

export default App
