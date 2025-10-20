import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using AiTravello, you agree to be bound by these Terms of Service and all applicable
              laws and regulations. If you do not agree with any of these terms, you are prohibited from using or
              accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              AiTravello provides AI-powered travel itinerary planning services. By using our service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You must be at least 18 years old or have parental consent</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You agree not to misuse the service or use it for illegal purposes</li>
              <li>You understand that itineraries are suggestions and not guaranteed arrangements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Generated Content</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service uses artificial intelligence to generate travel itineraries. While we strive for accuracy,
              AI-generated content may contain errors or outdated information. You acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
              <li>Itineraries are suggestions only and should be verified independently</li>
              <li>We do not guarantee the accuracy, completeness, or reliability of AI-generated content</li>
              <li>You are responsible for verifying all travel information, including visa requirements, safety advisories, and booking details</li>
              <li>We are not a travel agency and do not make bookings on your behalf</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with us, you must provide information that is accurate, complete, and current
              at all times. You are responsible for safeguarding the password and for all activities that occur under
              your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The service and its original content, features, and functionality are owned by AiTravello and are
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              Itineraries generated for you may be used for your personal, non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no warranties,
              expressed or implied, regarding:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
              <li>The accuracy or reliability of travel information</li>
              <li>The suitability of suggested destinations or activities</li>
              <li>Uninterrupted or error-free service</li>
              <li>The results that may be obtained from using the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              AiTravello shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
              including but not limited to loss of profits, data, or other intangible losses resulting from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
              <li>Your use or inability to use the service</li>
              <li>Any inaccuracies or errors in AI-generated content</li>
              <li>Travel disruptions, cancellations, or issues</li>
              <li>Unauthorized access to your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service may contain links to third-party websites or services that are not owned or controlled by
              AiTravello. We have no control over and assume no responsibility for the content, privacy policies,
              or practices of any third-party websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the service immediately, without prior notice or
              liability, for any reason, including if you breach these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days&apos; notice prior to any new terms taking effect. Your continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed and construed in accordance with applicable laws, without regard to its
              conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at terms@aitravello.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
