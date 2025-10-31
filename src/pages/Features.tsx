import { SparklesIcon, ShieldCheckIcon, BoltIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';

interface Feature {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  details: string[];
}

interface TechStack {
  title: string;
  description: string;
}

// Add these CSS classes to your global CSS or tailwind.config.js
const styles = {
  sectionPadding: 'py-16 md:py-24',
  btnPrimary: 'px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 bg-white text-primary hover:bg-opacity-90 cursor-pointer',
} as const;

export function Features() {
  const navigate = useNavigate();
  
  const handleDemoRequest = () => {
    navigate('/contact');
  };

  const features: Feature[] = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered OCR',
      description: 'Instantly digitize handwritten prescriptions with 99.9% accuracy using advanced machine learning.',
      details: [
        'Recognizes multiple handwriting styles',
        'Extracts dosage, frequency, and duration',
        'Flags illegible or ambiguous entries',
      ],
    },
    {
      icon: ShieldCheckIcon,
      title: 'Smart Drug Interaction Checking',
      description: 'Real-time verification of allergies, contraindications, and drug interactions.',
      details: [
        'Cross-references patient medical history',
        'Identifies potential adverse reactions',
        'Suggests safe alternatives automatically',
      ],
    },
    {
      icon: BoltIcon,
      title: 'Instant Digital Prescriptions',
      description: 'Issue prescriptions in seconds with cryptographic signing and verification.',
      details: [
        'Legally binding digital signatures',
        'Instant delivery to pharmacies',
        'Complete audit trail for compliance',
      ],
    },
    {
      icon: CubeTransparentIcon,
      title: 'Unified Health Records',
      description: 'Single source of truth for all patient medication and health information.',
      details: [
        'Real-time synchronization',
        'Accessible to authorized stakeholders',
        'Complete medication history',
      ],
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Patient Assistant',
      description: 'Intelligent chatbot answers medication questions and provides adherence support.',
      details: [
        'Natural language understanding',
        'Evidence-based responses',
        'Escalation to healthcare providers',
      ],
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bio-Equivalence Analysis',
      description: 'Gemini-powered AI analyzes drug alternatives with safety scoring.',
      details: [
        'Compares therapeutic equivalence',
        'Provides safety and efficacy scores',
        'Pharmacist-approved recommendations',
      ],
    },
    {
      icon: BoltIcon,
      title: 'Smart Medication Reminders',
      description: 'Intelligent reminders adapt to patient behavior and preferences.',
      details: [
        'Customizable notification timing',
        'Multi-channel delivery (SMS, app, email)',
        'Adherence tracking and analytics',
      ],
    },
    {
      icon: CubeTransparentIcon,
      title: 'QR Code Patient Access',
      description: 'Instant access to patient records with secure QR code scanning.',
      details: [
        'One-tap patient identification',
        'Secure authentication',
        'HIPAA-compliant access logs',
      ],
    },
  ];

  const techStack: TechStack[] = [
    {
      title: 'Machine Learning & AI',
      description: 'Advanced algorithms for OCR, drug interaction analysis, and patient behavior prediction.',
    },
    {
      title: 'Cloud Infrastructure',
      description: 'Scalable, secure cloud architecture ensuring 99.99% uptime and data redundancy.',
    },
    {
      title: 'Blockchain Security',
      description: 'Cryptographic verification and immutable audit trails for compliance and trust.',
    },
  ];

  const integrations: string[] = [
    'EHR Systems',
    'Pharmacy Software',
    'Lab Systems',
    'Patient Apps',
    'Insurance Platforms',
    'Hospital Networks',
    'Mobile Devices',
    'Cloud Services'
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Cutting-edge technology designed to eliminate medication errors and improve patient outcomes.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`${styles.sectionPadding} bg-background`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary bg-opacity-10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIdx) => (
                          <li key={detailIdx} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className={`${styles.sectionPadding} bg-white`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Built on Modern Technology
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techStack.map((tech, idx) => (
              <div key={idx} className="bg-background rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tech.title}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className={`${styles.sectionPadding} bg-background`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Seamless Integration
          </h2>

          <div className="bg-white rounded-xl p-8 md:p-12">
            <p className="text-lg text-gray-600 mb-8 text-center">
              PillMatrix integrates with existing healthcare systems and workflows.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {integrations.map((integration, idx) => (
                <div key={idx} className="text-center p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                  <p className="font-semibold text-gray-900">{integration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.sectionPadding} bg-gradient-to-r from-primary to-blue-600 text-white`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Difference</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            See how PillMatrix can transform your healthcare practice with a personalized demo.
          </p>
          <button 
            className={styles.btnPrimary}
            onClick={handleDemoRequest}
            aria-label="Request a Demo"
          >
            Request a Demo
          </button>
        </div>
      </section>
    </div>
  );
}
