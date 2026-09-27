/**
 * OPUS67 — Terms of Service
 * 
 * Legal terms for using OPUS67 platform.
 * 
 * IMPORTANT — HONEST DISCLOSURE:
 * 
 * This is a template terms of service.
 * Must be reviewed by legal counsel before deployment.
 * Must accurately reflect actual service offerings.
 */

import { Link } from 'react-router-dom';
import { OpusLogo } from '../components/OpusLogo';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-obsidian p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-block mb-4">
            <OpusLogo variant="compact" size="md" />
          </Link>
          <h1 className="text-3xl font-bold text-ice mb-2">Terms of Service</h1>
          <p className="text-sm text-steel">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-steel">
          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">
              By accessing or using OPUS67 ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, do not use the Service.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-amber/5 border border-amber/30">
              <p className="text-xs text-amber">
                <strong>Important:</strong> This is a template terms of service. It must be reviewed by
                legal counsel and customized before deployment.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Description of Service</h2>
            <p className="text-sm">
              OPUS67 is an AI systems platform that enables users to build, operate, and audit
              AI-powered workflows. The Service includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>AI agent configuration and management</li>
              <li>Tool registration and execution</li>
              <li>Workflow design and orchestration</li>
              <li>Evidence tracking and governance</li>
              <li>Usage-based billing (when configured)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">User Accounts</h2>
            <p className="text-sm mb-3">To use OPUS67, you must:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Be at least 18 years old or have parental consent</li>
              <li>Provide accurate account information</li>
              <li>Maintain the security of your account</li>
              <li>Not share your account credentials</li>
              <li>Notify us of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Acceptable Use</h2>
            <p className="text-sm mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use the Service for illegal purposes</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with the Service's operation</li>
              <li>Use the Service to generate harmful content</li>
              <li>Violate AI usage policies of underlying providers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">AI-Generated Content</h2>
            <p className="text-sm">
              OPUS67 facilitates interaction with AI models. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>Ensuring your use of AI outputs complies with applicable laws</li>
              <li>Verifying AI-generated content before use</li>
              <li>Complying with AI provider terms of service</li>
              <li>Understanding that AI outputs may be inaccurate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Billing and Payment</h2>
            <p className="text-sm">
              When usage-based billing is enabled:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>You will be charged based on your actual usage</li>
              <li>Prices will be clearly displayed before activation</li>
              <li>You may set spending limits to control costs</li>
              <li>Payment is processed through our payment provider</li>
              <li>You may cancel at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Intellectual Property</h2>
            <p className="text-sm">
              You retain ownership of content you create using OPUS67. However, AI-generated content
              may be subject to the terms of the underlying AI providers. The OPUS67 platform itself,
              including its design and code, is owned by OPUS67.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Disclaimer of Warranties</h2>
            <p className="text-sm">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>The Service will be uninterrupted or error-free</li>
              <li>AI outputs will be accurate or reliable</li>
              <li>The Service will meet your requirements</li>
              <li>Any defects will be corrected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Limitation of Liability</h2>
            <p className="text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OPUS67 SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
              LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Termination</h2>
            <p className="text-sm">
              We may terminate or suspend your account at any time for violation of these terms.
              You may delete your account at any time via Settings. Upon termination, your right
              to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Governing Law</h2>
            <p className="text-sm">
              These terms shall be governed by and construed in accordance with the laws of
              [Jurisdiction to be determined], without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Changes to Terms</h2>
            <p className="text-sm">
              We reserve the right to modify these terms at any time. We will notify you of
              significant changes by email or through the platform. Your continued use of the
              Service after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Contact</h2>
            <p className="text-sm">
              For questions about these Terms of Service, please contact us at: [legal@opus67.com]
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-graphite-lighter">
          <div className="flex items-center justify-between text-xs text-steel">
            <Link to="/" className="hover:text-ice transition-colors">
              ← Back to Home
            </Link>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-ice transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-ice transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
