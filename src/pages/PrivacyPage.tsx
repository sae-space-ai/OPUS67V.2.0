/**
 * OPUS67 — Privacy Notice
 * 
 * Describes data collection, usage, and user rights.
 * 
 * IMPORTANT — HONEST DISCLOSURE:
 * 
 * This document must accurately describe:
 * - What data is collected
 * - Why it's collected
 * - How it's used
 * - Who it's shared with
 * - User rights
 * 
 * NO misleading claims about GDPR compliance.
 * Only describe actual practices.
 * 
 * CURRENT STATUS:
 * - Template created ✅
 * - Requires legal review ❌
 * - Requires customization for actual practices ❌
 */

import { Link } from 'react-router-dom';
import { OpusLogo } from '../components/OpusLogo';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-block mb-4">
            <OpusLogo variant="compact" size="md" />
          </Link>
          <h1 className="text-3xl font-bold text-ice mb-2">Privacy Notice</h1>
          <p className="text-sm text-steel">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-steel">
          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Overview</h2>
            <p className="text-sm leading-relaxed">
              This Privacy Notice describes how OPUS67 ("we", "us", "our") collects, uses, and protects
              your personal data when you use our AI systems platform.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-amber/5 border border-amber/30">
              <p className="text-xs text-amber">
                <strong>Important:</strong> This is a template privacy notice. It must be reviewed by
                legal counsel and customized to reflect OPUS67's actual data practices before deployment.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Data We Collect</h2>
            <h3 className="text-lg font-medium text-ice mb-2">Account Information</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Name and email address (from OAuth provider)</li>
              <li>Profile image (from OAuth provider)</li>
              <li>Account creation and modification timestamps</li>
            </ul>

            <h3 className="text-lg font-medium text-ice mb-2 mt-4">Usage Data</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>AI requests and interactions</li>
              <li>Tool executions and workflow runs</li>
              <li>Project and agent configurations</li>
              <li>Usage metrics for billing purposes</li>
            </ul>

            <h3 className="text-lg font-medium text-ice mb-2 mt-4">Technical Data</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>IP addresses and device information</li>
              <li>Session identifiers and authentication tokens</li>
              <li>Error logs and performance metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Provide and maintain the OPUS67 platform</li>
              <li>Authenticate your identity and manage your account</li>
              <li>Process AI requests and execute workflows</li>
              <li>Calculate usage-based billing</li>
              <li>Improve platform performance and reliability</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Third-Party Services</h2>
            <p className="text-sm mb-3">
              OPUS67 integrates with the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Authentication:</strong> Google, GitHub (for OAuth login)</li>
              <li><strong>AI Providers:</strong> OpenAI, Anthropic (for AI model access)</li>
              <li><strong>Payment Processing:</strong> Stripe or similar (for billing)</li>
              <li><strong>Hosting:</strong> Vercel (for platform hosting)</li>
            </ul>
            <p className="text-sm mt-3">
              Each provider has their own privacy policy. We encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Data Retention</h2>
            <p className="text-sm">
              We retain your data for as long as your account is active or as needed to provide services.
              Billing records are retained for the period required by applicable tax and accounting laws.
              You may request account deletion at any time (see "Your Rights" below).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Your Rights</h2>
            <p className="text-sm mb-3">
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Delete your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain data processing</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
            </ul>
            <p className="text-sm mt-3">
              To exercise these rights, please contact us at [privacy@opus67.com].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Account Deletion</h2>
            <p className="text-sm">
              You may delete your OPUS67 account at any time via Settings → Delete Account.
              Upon deletion:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>Your account and personal data will be deleted</li>
              <li>Your projects, agents, and workflows will be removed</li>
              <li>Billing records will be retained as required by law</li>
              <li>Audit logs will be anonymized but retained for security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Security</h2>
            <p className="text-sm">
              We implement appropriate technical and organizational measures to protect your data,
              including encryption, access controls, and regular security audits. However, no method
              of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Contact Us</h2>
            <p className="text-sm">
              If you have questions about this Privacy Notice or our data practices, please contact us at:
            </p>
            <p className="text-sm mt-2">
              Email: [privacy@opus67.com]<br />
              Address: [To be provided]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ice mb-3">Changes to This Notice</h2>
            <p className="text-sm">
              We may update this Privacy Notice from time to time. We will notify you of significant
              changes by email or through the platform. Your continued use of OPUS67 after changes
              constitutes acceptance of the updated notice.
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
