import { CheckCircleIcon, ChartBarIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/outline';

export function ForInstitutions() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Solutions for Healthcare Institutions</h1>
              <p className="text-xl text-blue-100 mb-8">
                Transform your hospital or clinic with PillMatrix's comprehensive medication management platform.
              </p>
              <button className="btn-primary bg-accent hover:bg-orange-500">
                Schedule Enterprise Demo
              </button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-full max-w-md h-96 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏥</div>
                  <p className="text-blue-100">Enterprise Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Institutions Choose PillMatrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: ChartBarIcon,
                title: 'Reduce Medication Errors by 95%',
                description: 'AI-powered verification catches errors before they reach patients, significantly reducing adverse events and liability.',
              },
              {
                icon: CheckCircleIcon,
                title: 'Improve Patient Safety',
                description: 'Real-time drug interaction checking and unified records ensure every prescription is verified and safe.',
              },
              {
                icon: UserGroupIcon,
                title: 'Streamline Workflows',
                description: 'Eliminate paper-based processes and reduce administrative burden across doctors, pharmacists, and staff.',
              },
              {
                icon: CogIcon,
                title: 'Increase Operational Efficiency',
                description: 'Automate prescription processing, reduce dispensing time, and optimize inventory management.',
              },
              {
                icon: CheckCircleIcon,
                title: 'Ensure Regulatory Compliance',
                description: 'HIPAA-compliant, with complete audit trails and documentation for regulatory requirements.',
              },
              {
                icon: ChartBarIcon,
                title: 'Data-Driven Insights',
                description: 'Comprehensive analytics on medication adherence, error patterns, and institutional performance.',
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <Icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Seamless Implementation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Assessment', desc: 'We evaluate your current systems and workflows.' },
              { step: '2', title: 'Integration', desc: 'Seamless integration with your existing EHR and pharmacy systems.' },
              { step: '3', title: 'Training', desc: 'Comprehensive training for all staff members.' },
              { step: '4', title: 'Support', desc: '24/7 dedicated support to ensure success.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-background rounded-xl p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Proven Return on Investment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                metric: '95%',
                label: 'Reduction in Medication Errors',
              },
              {
                metric: '40%',
                label: 'Improvement in Patient Adherence',
              },
              {
                metric: '60%',
                label: 'Time Savings in Prescription Processing',
              },
            ].map((roi, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-3">{roi.metric}</p>
                <p className="text-gray-600 font-semibold">{roi.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-secondary to-teal-400 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Average Implementation ROI: 300% in Year 1</h3>
            <p className="text-lg">
              Institutions typically see full cost recovery within 6-9 months through reduced errors, improved efficiency, and better patient outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Success Stories
          </h2>

          <div className="bg-background rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Metro General Hospital</h3>
                <p className="text-gray-600 mb-6">
                  A 500-bed teaching hospital implemented PillMatrix across all departments.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Reduced medication errors</strong> from 2.4% to 0.1%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Saved 200+ hours</strong> of administrative work monthly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Improved patient satisfaction</strong> by 35%</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-lg italic text-gray-700 mb-4">
                  "PillMatrix has been transformative for our institution. We've seen dramatic improvements in patient safety and staff efficiency. It's become an essential part of our operations."
                </p>
                <p className="font-bold text-gray-900">Dr. Michael Thompson</p>
                <p className="text-sm text-gray-600">Chief Medical Officer, Metro General Hospital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Flexible Pricing Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Custom',
                users: 'Up to 50 users',
                features: ['Basic prescription management', 'Drug interaction checking', 'Patient app access', 'Email support'],
              },
              {
                name: 'Professional',
                price: 'Custom',
                users: 'Up to 500 users',
                features: ['All Starter features', 'Advanced analytics', 'Custom integrations', 'Priority support', 'Staff training'],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                users: 'Unlimited users',
                features: ['All Professional features', 'Dedicated account manager', 'Custom development', '24/7 phone support', 'SLA guarantee'],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-8 ${
                  plan.highlighted
                    ? 'bg-primary text-white shadow-lg transform scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.users}
                </p>
                <p className={`text-3xl font-bold mb-6 ${plan.highlighted ? 'text-white' : 'text-primary'}`}>
                  {plan.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center gap-2">
                      <CheckCircleIcon className={`w-5 h-5 ${plan.highlighted ? 'text-blue-200' : 'text-secondary'}`} />
                      <span className={plan.highlighted ? 'text-blue-50' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-accent text-white hover:bg-orange-500'
                      : 'bg-primary text-white hover:bg-blue-700'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Institution?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule a personalized demo with our enterprise team to see how PillMatrix can benefit your organization.
          </p>
          <button className="btn-primary bg-accent hover:bg-orange-500">
            Schedule Enterprise Demo
          </button>
        </div>
      </section>
    </div>
  );
}
