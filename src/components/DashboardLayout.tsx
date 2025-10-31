import { useState, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, BellIcon, UserCircleIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DashboardLayoutProps {
  children: ReactNode;
  icon: string;
  title: string;
  subtitle: string;
  showAIChat?: boolean;
}

export function DashboardLayout({ children, icon, title, subtitle, showAIChat = true }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAIChatModal, setShowAIChatModal] = useState(false);
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
                    text: `You are a helpful healthcare AI assistant for PillMatrix. Answer ${user?.role === 'patient' ? 'medication' : 'healthcare professional'} questions briefly (2-3 sentences). Always advise consulting appropriate professionals for serious concerns.\n\nQuestion: ${userQuestion}`,
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

    const responses: { [key: string]: string } = {
      metformin: 'Metformin is a common medication for managing type 2 diabetes. It helps control blood sugar levels by reducing glucose production in the liver. Take it as prescribed, usually with meals to minimize stomach upset.',
      lisinopril: 'Lisinopril is an ACE inhibitor used to treat high blood pressure and heart failure. It works by relaxing blood vessels to improve blood flow. Take it exactly as prescribed, usually once daily.',
      aspirin: 'Aspirin is commonly used for pain relief, fever reduction, and blood thinning. It works by reducing inflammation and preventing blood clots. Take with food or water to prevent stomach upset.',
      ibuprofen: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used for pain and inflammation. It works by reducing prostaglandins that cause pain and swelling. Take with food to minimize stomach irritation.',
      'side effect': 'Side effects vary by medication and individual. Common ones are usually mild and temporary. Serious side effects require immediate medical attention. Always read your medication leaflet.',
      'dose|dosage': 'Never change your medication dosage without consulting your doctor. Your dosage is prescribed based on your specific health condition, age, and other medications.',
      'interaction|interact': 'Drug interactions can be serious. PillMatrix checks for interactions between your medications. Always inform your doctor about all medications, supplements, and herbal products you take.',
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerInput.includes(keyword)) {
        return response;
      }
    }

    return 'That\'s a great question! For detailed medical advice about your specific situation, I recommend consulting with your healthcare provider. They can provide personalized guidance based on your medical history.';
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      const geminiResponse = await callGeminiAPI(currentInput);
      let finalResponse = geminiResponse;

      if (!geminiResponse) {
        console.log('Using local AI response');
        finalResponse = generateLocalAIResponse(currentInput);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalResponse,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const fallbackResponse = generateLocalAIResponse(currentInput);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle authentication loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              PillMatrix
            </Link>
            <div className="flex items-center gap-6">
              <button className="relative text-gray-600 hover:text-primary">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
              </button>
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
              >
                <UserCircleIcon className="w-8 h-8 text-primary" />
                <div className="text-sm text-left">
                  <p className="font-semibold text-gray-900">{user.name || 'User'}</p>
                  <p className="text-gray-600 capitalize">{user.role || 'Unknown'}</p>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-blue-700 rounded-lg transition"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

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
              className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Dashboard Content */}
        {children}

        {/* AI Chat Button */}
        {showAIChat && (
          <button
            onClick={() => setShowAIChatModal(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
          >
            <span className="hidden group-hover:inline-block font-semibold">Ask AI Assistant</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </main>

      {/* AI Chat Modal */}
      {showAIChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-end md:justify-center z-50 p-4">
          <div className="bg-white rounded-t-xl md:rounded-xl shadow-2xl w-full md:max-w-md h-screen md:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-xl md:rounded-t-xl">
              <div>
                <h3 className="text-lg font-bold">PillMatrix AI Assistant</h3>
                <p className="text-xs text-blue-100">Ask about healthcare topics</p>
              </div>
              <button
                onClick={() => setShowAIChatModal(false)}
                className="text-white hover:text-gray-200 flex-shrink-0"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
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

            {/* Chat Input */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white rounded-b-xl md:rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about medications, procedures..."
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
