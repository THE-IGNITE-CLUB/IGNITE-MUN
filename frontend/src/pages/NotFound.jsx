import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'

export default function NotFound() {
  return (
    <PageWrapper className="bg-background text-on-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="max-w-md">
          <span className="material-symbols-outlined text-8xl text-secondary mb-4">explore_off</span>
          <h1 className="text-display-md font-headline-md font-bold text-primary mb-2">404</h1>
          <h2 className="text-title-lg font-headline-sm text-on-surface mb-4">Resolution Not Found</h2>
          <p className="text-body-md text-on-surface-variant mb-8">
            The diplomatic corridor you are looking for does not exist or has been relocated to another committee session.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded font-label-lg text-label-lg hover:bg-secondary transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-xl">home</span>
            Return to Plenary Hall
          </Link>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  )
}
