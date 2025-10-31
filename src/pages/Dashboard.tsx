import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import type { UserDashboard, ChatMessage } from '@/types/dashboard';
import type { UserRole } from '@/types/auth';

const dashboardContent: Record<UserRole, UserDashboard> = {
  patient: {
    title: 'My Medications',
    icon: '💊',
    sections: [
      {
        title: 'Active Prescriptions',
        items: [
          { name: 'Metformin 500mg', frequency: 'Twice daily', nextDue: '2 hours' },
          { name: 'Lisinopril 10mg', frequency: 'Once daily', nextDue: '8 hours' },
        ],
      },
      {
        title: 'Upcoming Refills',
        items: [
          { name: 'Vitamin D3', daysLeft: '5 days' },
          { name: 'Aspirin 81mg', daysLeft: '12 days' },
        ],
      },
    ],
  },
  doctor: {
    title: 'Patient Management',
    icon: '👨‍⚕️',
    sections: [
      {
        title: 'Recent Patients',
        items: [
          { name: 'John Smith', lastVisit: 'Today', status: 'Active' },
          { name: 'Sarah Johnson', lastVisit: 'Yesterday', status: 'Active' },
          { name: 'Mike Davis', lastVisit: '3 days ago', status: 'Follow-up needed' },
        ],
      },
      {
        title: 'Pending Prescriptions',
        items: [
          { name: '2 prescriptions', status: 'Awaiting signature' },
        ],
      },
    ],
  },
  pharmacist: {
    title: 'Pharmacy Dashboard',
    icon: '💊',
    sections: [
      {
        title: 'Pending Prescriptions',
        items: [
          { name: '5 new prescriptions', status: 'Ready to verify' },
          { name: '3 prescriptions', status: 'Awaiting patient pickup' },
        ],
      },
      {
        title: 'Inventory Alerts',
        items: [
          { name: 'Amoxicillin 500mg', status: 'Low stock' },
          { name: 'Ibuprofen 200mg', status: 'Reorder needed' },
        ],
      },
    ],
  },
  lab: {
    title: 'Lab Reports',
    icon: '🔬',
    sections: [
      {
        title: 'Pending Tests',
        items: [
          { name: '8 samples', status: 'Processing' },
          { name: '3 samples', status: 'Ready for upload' },
        ],
      },
      {
        title: 'Recent Uploads',
        items: [
          { name: 'Blood Work - John Smith', uploadedAt: '2 hours ago' },
          { name: 'Urinalysis - Sarah Johnson', uploadedAt: '4 hours ago' },
        ],
      },
    ],
  },
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your PillMatrix AI Assistant. I can help you with questions about your medications, dosages, side effects, and general health information. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/how-it-works');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/how-it-works');
    }
  };

  const callGeminiAPI = async (userQuestion: string): Promise<string> => {
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAvACCKNKw1PA2Eya9zjFXLKAP7AO6yx5Y',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are a helpful healthcare AI assistant for PillMatrix. Answer medication questions briefly (2-3 sentences). Always advise consulting a doctor for serious concerns.\n\nQuestion: ${userQuestion}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 150,
            },
          }),
        }
      );

      if (!response.ok) {
        console.error('Gemini API Error:', response.status);
        return '';
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return '';
    }
  };

  const generateLocalAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Medication-specific responses
    const responses: { [key: string]: string } = {
      metformin: 'Metformin is a common medication for managing type 2 diabetes. It helps control blood sugar levels by reducing glucose production in the liver. Take it as prescribed, usually with meals to minimize stomach upset. Common side effects include mild nausea or diarrhea. Always consult your doctor before making any changes.',
      lisinopril: 'Lisinopril is an ACE inhibitor used to treat high blood pressure and heart failure. It works by relaxing blood vessels to improve blood flow. Take it exactly as prescribed, usually once daily. Common side effects include dry cough and dizziness. Never stop taking it without consulting your doctor.',
      aspirin: 'Aspirin is commonly used for pain relief, fever reduction, and blood thinning. It works by reducing inflammation and preventing blood clots. Take with food or water to prevent stomach upset. Do not exceed recommended doses. Consult your doctor if you have bleeding concerns.',
      ibuprofen: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used for pain and inflammation. It works by reducing prostaglandins that cause pain and swelling. Take with food to minimize stomach irritation. Do not use long-term without medical supervision. Consult your doctor if you have kidney or heart issues.',
      'side effect': 'Side effects vary by medication and individual. Common ones are usually mild and temporary. Serious side effects require immediate medical attention. Always read your medication leaflet and report any unusual symptoms to your doctor.',
      'dose|dosage': 'Never change your medication dosage without consulting your doctor. Your dosage is prescribed based on your specific health condition, age, and other medications. If you have concerns about your current dose, contact your healthcare provider immediately.',
      'reminder|when to take': 'You can set medication reminders in the PillMatrix app. Most medications work best when taken at the same time each day. Check your prescription details for the recommended timing. Enable notifications to get smart reminders.',
      'side effects': 'Side effects vary by medication and individual. Common ones are usually mild and temporary. Serious side effects require immediate medical attention. Always read your medication leaflet and report any unusual symptoms to your doctor.',
      'allergy|allergic': 'If you experience an allergic reaction (rash, swelling, difficulty breathing), seek immediate medical attention. Always inform your healthcare providers about your allergies. The PillMatrix app helps track your allergies to prevent dangerous interactions.',
      'interaction|interact': 'Drug interactions can be serious. PillMatrix checks for interactions between your medications. Always inform your doctor about all medications, supplements, and herbal products you take. Never start new medications without consulting your doctor.',
      'pregnancy|pregnant': 'Many medications are not safe during pregnancy. If you are pregnant or planning to become pregnant, consult your doctor before taking any medication. Your doctor can recommend safe alternatives.',
      'breastfeed|nursing': 'Some medications pass into breast milk and may affect your baby. If you are breastfeeding, consult your doctor before taking any medication. Your doctor can recommend safe alternatives.',
    };

    // Check for matching keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerInput.includes(keyword)) {
        return response;
      }
    }

    // Default response
    return 'That\'s a great question about your health! For detailed medical advice about your specific medications or health conditions, I recommend consulting with your doctor or pharmacist. They can provide personalized guidance based on your medical history. In the meantime, you can check your medication leaflet for more information.';
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      // Try Gemini API first
      const geminiResponse = await callGeminiAPI(currentInput);
      
      let finalResponse = geminiResponse;
      
      // If Gemini fails, use local AI
      if (!geminiResponse) {
        console.log('Using local AI response');
        finalResponse = generateLocalAIResponse(currentInput);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: finalResponse,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      // Fallback to local AI
      const fallbackResponse = generateLocalAIResponse(currentInput);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const content = dashboardContent[user.role as UserRole] || dashboardContent.patient;

  return (
    <div className="min-h-screen bg-background pt-8">
      {/* Main Content - Direct start without header */}
      <main className="container mx-auto px-6">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="text-5xl mb-4">{content.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-lg text-gray-600">
            {user.role === 'patient' && 'Manage your medications and health records'}
            {user.role === 'doctor' && 'Manage your patients and prescriptions'}
            {user.role === 'pharmacist' && 'Process prescriptions and manage inventory'}
            {user.role === 'lab' && 'Upload and manage lab reports'}
          </p>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item, itemIdx: number) => (
                  <div
                  key={itemIdx}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-gray-100 transition"
                  >
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                    {item.frequency ||
                      item.lastVisit ||
                      item.status ||
                      item.daysLeft ||
                      item.nextDue ||
                      item.uploadedAt}
                    </p>
                  </div>
                  {item.status && (
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status.includes('Active') || item.status.includes('Ready')
                      ? 'bg-green-100 text-green-700'
                      : item.status.includes('Low') || item.status.includes('Follow-up')
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}
                    >
                    {item.status}
                    </span>
                  )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {user.role === 'patient' && (
              <>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  View All Prescriptions
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Track Adherence
                </button>
                <button 
                  onClick={() => setShowAIChat(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Ask AI Assistant
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Contact Doctor
                </button>
              </>
            )}
            {user.role === 'doctor' && (
              <>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Issue Prescription
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  View Patient Records
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Check Lab Results
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Scan QR Code
                </button>
              </>
            )}
            {user.role === 'pharmacist' && (
              <>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Process Prescriptions
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Check Inventory
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Find Alternatives
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Scan QR Code
                </button>
              </>
            )}
            {user.role === 'lab' && (
              <>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Upload Report
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  View Samples
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Access Patient
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition">
                  Scan QR Code
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* QR Code Section */}
            <div className="mb-8 p-6 bg-background rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-4">Your Patient QR Code</p>
              <div className="bg-white p-4 rounded-lg border-2 border-primary inline-block">
                <div className="w-40 h-40 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center text-white text-center">
                  <div>
                    <div className="text-2xl mb-2">📱</div>
                    <p className="text-xs font-semibold">QR Code</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">Share this QR code with healthcare providers</p>
            </div>

            {/* Patient ID Section */}
            <div className="mb-8 p-6 bg-background rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Patient ID Code</p>
              <div className="bg-white p-4 rounded-lg border border-gray-300 font-mono text-center">
                <p className="text-lg font-bold text-primary break-all">
                  PM-{user.email?.split('@')[0].toUpperCase()}-{Date.now().toString(36).substr(-6).toUpperCase()}
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-2">Use this code for quick identification</p>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-semibold text-gray-900">{user.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold text-gray-900 capitalize">{user.role || 'Unknown'}</p>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition mb-4"
            >
              Close
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gray-100 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAIChat && user.role === 'patient' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-end md:justify-center z-50 p-4">
          <div className="bg-white rounded-t-xl md:rounded-xl shadow-2xl w-full md:max-w-md h-screen md:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-xl md:rounded-t-xl">
              <div>
                <h3 className="text-lg font-bold">PillMatrix AI Assistant</h3>
                <p className="text-xs text-blue-100">Ask about your medications</p>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="text-white hover:text-gray-200 flex-shrink-0"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input - Fixed at Bottom */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white rounded-b-xl md:rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your medications..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 flex-shrink-0"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
