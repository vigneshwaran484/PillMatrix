import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

type UserRole = 'doctors' | 'patients' | 'pharmacists' | 'labs';

const roleContent = {
  doctors: {
    title: 'For Doctors',
    icon: '👨‍⚕️',
    steps: [
      {
        title: 'Scan & Access',
        description: 'Scan patient\'s QR code for instant access to their unified health record, including recent lab reports.',
      },
      {
        title: 'Digitize Prescriptions',
        description: 'Use our AI-powered OCR to instantly digitize a handwritten prescription by taking a photo.',
      },
      {
        title: 'AI Verification',
        description: 'Our AI cross-references for allergies and drug interactions before you even sign.',
      },
      {
        title: 'Issue Securely',
        description: 'Securely issue the digital prescription to the patient and pharmacy in seconds.',
      },
    ],
  },
  patients: {
    title: 'For Patients',
    icon: '👤',
    steps: [
      {
        title: 'Receive Prescriptions',
        description: 'Receive and manage all your prescriptions in one simple, intuitive app.',
      },
      {
        title: 'Smart Reminders',
        description: 'Get intelligent reminders for doses, refills, and medication expiry dates.',
      },
      {
        title: 'Track Adherence',
        description: 'Track your adherence and share progress with your doctor for better outcomes.',
      },
      {
        title: 'AI Assistant',
        description: 'Use our built-in AI assistant to ask general questions about your medication.',
      },
    ],
  },
  pharmacists: {
    title: 'For Pharmacists',
    icon: '💊',
    steps: [
      {
        title: 'Digital Prescriptions',
        description: 'Scan patient\'s QR code to view their pending prescriptions. No more paper.',
      },
      {
        title: 'Smart Alternatives',
        description: 'If a drug is out of stock, suggest an alternative with AI analysis.',
      },
      {
        title: 'Bio-Equivalence Analysis',
        description: 'Our Gemini-powered AI analyzes bio-equivalence and provides a safety score.',
      },
      {
        title: 'Secure Dispensing',
        description: 'Securely dispense medication and manage your digital inventory.',
      },
    ],
  },
  labs: {
    title: 'For Lab Technicians',
    icon: '🔬',
    steps: [
      {
        title: 'Secure Access',
        description: 'Securely access a patient\'s file via their unique ID or QR code.',
      },
      {
        title: 'Upload Reports',
        description: 'Upload lab reports (PDFs, images) directly to the patient\'s unified record.',
      },
      {
        title: 'Instant Notification',
        description: 'The prescribing doctor is instantly notified, closing the diagnostic loop.',
      },
      {
        title: 'Complete Records',
        description: 'All stakeholders have access to complete, verified lab data in real-time.',
      },
    ],
  },
};

export function HowItWorks() {
  const [activeRole, setActiveRole] = useState<UserRole>('doctors');
  const content = roleContent[activeRole];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How PillMatrix Works</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            A step-by-step journey tailored to each user role in the healthcare ecosystem.
          </p>
        </div>
      </section>

      {/* Role Tabs */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(Object.keys(roleContent) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeRole === role
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-primary'
                }`}
              >
                {roleContent[role].icon} {roleContent[role].title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{content.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Key Benefits for All Users
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Reduced Medication Errors',
                description: 'AI-powered verification catches potential issues before they become problems.',
              },
              {
                title: 'Improved Patient Outcomes',
                description: 'Better adherence and monitoring lead to more effective treatments.',
              },
              {
                title: 'Time Savings',
                description: 'Eliminate manual paperwork and streamline workflows across all roles.',
              },
              {
                title: 'Enhanced Security',
                description: 'HIPAA-compliant with end-to-end encryption for all patient data.',
              },
              {
                title: 'Real-Time Communication',
                description: 'Instant notifications keep all stakeholders informed and coordinated.',
              },
              {
                title: 'Data-Driven Insights',
                description: 'Analytics help identify trends and optimize medication management.',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircleIcon className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join your role-specific community and start improving healthcare outcomes today.
          </p>
          <button className="btn-primary bg-accent hover:bg-orange-500">
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
}
