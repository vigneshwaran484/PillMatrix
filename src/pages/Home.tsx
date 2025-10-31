import { Link } from 'react-router-dom';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-blue-600 text-white py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                From Scribbled Notes to Smart, Safe Prescriptions.
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                PillMatrix is the AI-powered network connecting doctors, labs, pharmacists, and patients to eliminate medication errors and create a seamless loop of care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="btn-primary bg-accent hover:bg-orange-500">
                  Sign Up for Free
                </Link>
                <button className="btn-secondary bg-white text-primary hover:bg-gray-100">
                  Request a Demo
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-full max-w-md h-96 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center floating">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-blue-100">Smart Prescription Interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Disconnected System Puts Lives at Risk.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Healthcare fragmentation leads to preventable errors. PillMatrix bridges the gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Illegible Prescriptions</h3>
              <p className="text-gray-600">
                Millions of prescriptions are misinterpreted due to poor handwriting, leading to medication errors.
              </p>
              <p className="text-2xl font-bold text-primary mt-4">2.4M+</p>
              <p className="text-sm text-gray-500">errors annually</p>
            </div>

            {/* Problem 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Medication Errors</h3>
              <p className="text-gray-600">
                Fatal drug interactions and dosage mistakes are preventable with proper verification systems.
              </p>
              <p className="text-2xl font-bold text-primary mt-4">125K+</p>
              <p className="text-sm text-gray-500">deaths annually</p>
            </div>

            {/* Problem 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Poor Adherence</h3>
              <p className="text-gray-600">
                50% of treatments for chronic diseases fail because patients don't take medication as prescribed.
              </p>
              <p className="text-2xl font-bold text-primary mt-4">50%</p>
              <p className="text-sm text-gray-500">treatment failure rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Introducing PillMatrix: Your Unified Circle of Care.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete ecosystem connecting all stakeholders in the medication journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            {/* Doctor */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Doctor</h3>
              <p className="text-sm text-gray-600">Issue verified prescriptions instantly</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <div className="text-3xl text-primary">→</div>
            </div>

            {/* Pharmacy */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💊</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Pharmacy</h3>
              <p className="text-sm text-gray-600">Dispense with confidence</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <div className="text-3xl text-primary">→</div>
            </div>

            {/* Patient */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Patient</h3>
              <p className="text-sm text-gray-600">Manage medications safely</p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-secondary to-teal-400 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">How PillMatrix Solves These Problems</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Digital Prescriptions:</strong> Eliminate handwriting errors with AI-powered OCR and digital verification.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Smart Verification:</strong> AI cross-references allergies, drug interactions, and dosages before dispensing.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Patient Engagement:</strong> Intelligent reminders and tracking improve medication adherence by up to 40%.</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Unified Records:</strong> All stakeholders access the same verified information in real-time.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Summary */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Simple Journey for Everyone.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Diagnose', desc: 'Labs upload results, doctors view them instantly.' },
              { step: '2', title: 'Prescribe', desc: 'Doctors issue AI-vetted digital prescriptions in seconds.' },
              { step: '3', title: 'Dispense', desc: 'Pharmacists validate prescriptions and find safe alternatives.' },
              { step: '4', title: 'Adhere', desc: 'Patients manage medication with smart reminders.' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <div className="text-2xl text-primary">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/how-it-works" className="text-primary font-semibold hover:underline">
              Learn more about how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "PillMatrix has reduced prescription errors in our clinic by 95%. It's a game-changer for patient safety.",
                author: 'Dr. Sarah Johnson',
                role: 'Chief Medical Officer',
                avatar: '👨‍⚕️',
              },
              {
                quote: "The AI-powered drug interaction checking has prevented multiple adverse events. Highly recommended.",
                author: 'James Chen',
                role: 'Lead Pharmacist',
                avatar: '💊',
              },
              {
                quote: "Managing my medications has never been easier. The reminders and tracking keep me on schedule.",
                author: 'Maria Rodriguez',
                role: 'Patient',
                avatar: '👩',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-background rounded-xl p-8">
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals using PillMatrix to eliminate medication errors and improve patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary bg-accent hover:bg-orange-500">
              Sign Up for Free
            </Link>
            <button className="btn-secondary bg-white text-primary hover:bg-gray-100">
              Request a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
