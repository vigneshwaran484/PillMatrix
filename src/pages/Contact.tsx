import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const styles = {
  sectionPadding: 'py-16 md:py-24',
  input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition',
  button: 'w-full px-6 py-3 text-lg font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 disabled:opacity-50',
};

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Here you would typically send the form data to a backend service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Contact our team to learn more about PillMatrix.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: EnvelopeIcon,
                title: 'Email',
                content: 'hello@pillmatrix.com',
                subtext: 'We respond within 24 hours',
              },
              {
                icon: PhoneIcon,
                title: 'Phone',
                content: '+1 (555) 123-4567',
                subtext: 'Mon-Fri, 9 AM - 6 PM EST',
              },
              {
                icon: MapPinIcon,
                title: 'Address',
                content: 'San Francisco, CA',
                subtext: 'Healthcare Innovation Hub',
              },
            ].map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                  <p className="text-lg font-semibold text-primary mb-2">{contact.content}</p>
                  <p className="text-sm text-gray-600">{contact.subtext}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className={styles.sectionPadding}>
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Send us a Message
            </h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Message Sent!</h3>
                <p className="text-green-700">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                      Company / Institution
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Your Hospital or Clinic"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell us about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.button}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'How long does implementation take?',
                answer: 'Typical implementation takes 4-8 weeks depending on your institution size and existing systems. We provide a detailed timeline during the initial consultation.',
              },
              {
                question: 'Is PillMatrix HIPAA compliant?',
                answer: 'Yes, PillMatrix is fully HIPAA compliant with SOC 2 Type II certification. We maintain strict data security and privacy standards.',
              },
              {
                question: 'Can PillMatrix integrate with our existing EHR?',
                answer: 'Yes, we support integration with most major EHR systems including Epic, Cerner, and others. Our team will work with you to ensure seamless integration.',
              },
              {
                question: 'What kind of support do you provide?',
                answer: 'We offer 24/7 technical support, staff training, and dedicated account management for enterprise clients. Standard support includes email and phone support during business hours.',
              },
              {
                question: 'How much does PillMatrix cost?',
                answer: 'Pricing is customized based on your institution size and needs. We offer flexible plans starting from basic to enterprise. Contact our sales team for a personalized quote.',
              },
              {
                question: 'Is there a free trial available?',
                answer: 'Yes, we offer a 30-day free trial for new users. No credit card required. You can explore all features and see how PillMatrix works for your use case.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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
            Join thousands of healthcare professionals using PillMatrix to improve patient safety and outcomes.
          </p>
          <button className="btn-primary bg-accent hover:bg-orange-500">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
