import { SignUp } from '@clerk/nextjs'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <BookOpen className="w-10 h-10 text-[#6E56CF]" />
            <span className="text-3xl font-bold gradient-text">Synapse</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Start building your knowledge workspace</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'synapse-button-primary w-full',
              card: 'synapse-card',
              headerTitle: 'text-2xl font-bold',
              headerSubtitle: 'text-gray-500 dark:text-gray-400',
              socialButtonsBlockButton: 'synapse-button-secondary w-full',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}