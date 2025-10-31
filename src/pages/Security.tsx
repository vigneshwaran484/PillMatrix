import { ShieldCheckIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export function Security() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Security & Compliance</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Your data security is our highest priority. PillMatrix is built with enterprise-grade security and full regulatory compliance.
          </p>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Security Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: LockClosedIcon,
                title: 'End-to-End Encryption',
                description: 'All patient data is encrypted in transit and at rest using industry-standard AES-256 encryption.',
                details: [
                  'TLS 1.3 for data in transit',
                  'AES-256 for data at rest',
                  'Encrypted database backups',
                  'Secure key management',
                ],
              },
              {
                icon: ShieldCheckIcon,
                title: 'HIPAA Compliance',
                description: 'Full compliance with HIPAA regulations and healthcare data protection standards.',
                details: [
                  'Business Associate Agreements',
                  'Audit logs and monitoring',
                  'Access controls and authentication',
                  'Data breach notification procedures',
                ],
              },
              {
                icon: CheckCircleIcon,
                title: 'Regular Audits',
                description: 'Third-party security audits and penetration testing ensure continuous protection.',
                details: [
                  'Annual SOC 2 Type II audits',
                  'Quarterly penetration testing',
                  'Vulnerability assessments',
                  'Compliance certifications',
                ],
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-8 shadow-sm">
                  <Icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 mb-6">{pillar.description}</p>
                  <ul className="space-y-2">
                    {pillar.details.map((detail, detailIdx) => (
                      <li key={detailIdx} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Data Privacy & Protection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Data, Your Control</h3>
              <ul className="space-y-4">
                {[
                  'Patients control who can access their medical records',
                  'Granular permission settings for healthcare providers',
                  'Complete audit trail of all data access',
                  'Right to data deletion and portability',
                  'Transparent privacy policies',
                  'No third-party data sharing without consent',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Government ID Verification</h3>
              <p className="text-gray-600 mb-6">
                For healthcare professionals (doctors, pharmacists, lab technicians), we implement simulated government ID verification to ensure:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Identity Verification:</strong> Confirms the professional's identity and credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Network Integrity:</strong> Ensures only qualified professionals access the system</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Accountability:</strong> Creates a verified record of all system users</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Regulatory Compliance:</strong> Meets healthcare industry standards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Compliance & Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act' },
              { name: 'SOC 2 Type II', description: 'Service Organization Control compliance' },
              { name: 'GDPR', description: 'General Data Protection Regulation' },
              { name: 'CCPA', description: 'California Consumer Privacy Act' },
              { name: 'ISO 27001', description: 'Information Security Management' },
              { name: 'FDA 21 CFR Part 11', description: 'Electronic Records Compliance' },
              { name: 'HITRUST', description: 'Healthcare Information and Management Systems Society' },
              { name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
            ].map((cert, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <p className="font-bold text-primary mb-2">{cert.name}</p>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Security */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Infrastructure Security
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Cloud Infrastructure',
                items: [
                  'AWS with HIPAA compliance',
                  'Multi-region redundancy',
                  '99.99% uptime SLA',
                  'Automatic failover',
                  'DDoS protection',
                ],
              },
              {
                title: 'Access Control',
                items: [
                  'Multi-factor authentication',
                  'Role-based access control',
                  'IP whitelisting',
                  'Session management',
                  'Automatic logout',
                ],
              },
              {
                title: 'Monitoring & Detection',
                items: [
                  '24/7 security monitoring',
                  'Intrusion detection systems',
                  'Real-time threat analysis',
                  'Automated incident response',
                  'Security information and event management',
                ],
              },
              {
                title: 'Disaster Recovery',
                items: [
                  'Automated daily backups',
                  'Geo-redundant storage',
                  'Recovery time objective: 1 hour',
                  'Recovery point objective: 15 minutes',
                  'Regular disaster recovery drills',
                ],
              },
            ].map((section, idx) => (
              <div key={idx} className="bg-background rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Incident Response */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Security Incident Response
          </h2>

          <div className="bg-white rounded-xl p-8 md:p-12">
            <p className="text-lg text-gray-600 mb-8">
              We maintain a comprehensive incident response plan to address any security concerns:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Detection', desc: 'Automated systems detect anomalies 24/7' },
                { step: '2', title: 'Response', desc: 'Immediate containment and investigation' },
                { step: '3', title: 'Notification', desc: 'Affected parties notified within 24 hours' },
                { step: '4', title: 'Resolution', desc: 'Full remediation and prevention measures' },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Security You Can Trust</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Learn more about our security practices and request our security documentation.
          </p>
          <button className="btn-primary bg-accent hover:bg-orange-500">
            Request Security Documentation
          </button>
        </div>
      </section>
    </div>
  );
}
