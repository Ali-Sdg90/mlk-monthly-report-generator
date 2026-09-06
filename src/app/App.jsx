import AppFooter from '../components/layout/AppFooter'
import AppHeader from '../components/layout/AppHeader'
import ReportWorkflow from '../features/report-workflow/components/ReportWorkflow'

function App() {
  return (
    <main className="app-shell" id="top">
      <AppHeader />
      <ReportWorkflow />
      <AppFooter />
    </main>
  )
}

export default App
