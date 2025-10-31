import { useState } from 'react';
import Tesseract from 'tesseract.js';

export function OCRTest() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addLog(`📁 File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        addLog(`✅ Image loaded: ${result.substring(0, 50)}...`);
      };
      reader.onerror = () => {
        addLog(`❌ Error reading file: ${reader.error}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!image) {
      alert('Please upload an image first!');
      return;
    }

    setLoading(true);
    setText('');
    setProgress(0);
    setLogs([]);

    try {
      addLog('🔍 Starting OCR extraction...');
      addLog(`📸 Image data length: ${image.length} characters`);
      
      addLog('🔧 Creating Tesseract worker...');
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          addLog(`📊 ${m.status}: ${m.progress ? Math.round(m.progress * 100) + '%' : ''}`);
          if (m.progress) {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      addLog('✅ Worker created successfully!');
      addLog('🔍 Starting text recognition...');
      
      const { data } = await worker.recognize(image);
      
      addLog('✅ OCR extraction complete!');
      addLog(`📝 Extracted ${data.text.length} characters`);
      addLog(`📊 Confidence: ${data.confidence.toFixed(2)}%`);
      addLog(`🔤 Text preview: ${data.text.substring(0, 100)}...`);
      
      setText(data.text);
      
      await worker.terminate();
      addLog('🛑 Worker terminated');
      
      if (!data.text || data.text.trim().length === 0) {
        addLog('⚠️ Warning: No text extracted from image');
        alert('No text could be extracted. Please try a clearer image.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ OCR extraction failed: ${errorMessage}`);
      console.error('Full error:', error);
      alert(`Failed to extract text: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">OCR Test Tool</h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload an image to test Tesseract.js OCR functionality
        </p>

        {/* Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img 
                src={image} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded shadow"
              />
            </div>
          </div>
        )}

        {/* Extract Button */}
        <button
          onClick={handleExtractText}
          disabled={loading || !image}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-6"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Extracting... {progress}%
            </span>
          ) : (
            'Extract Text with OCR'
          )}
        </button>

        {/* Progress Bar */}
        {loading && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">{progress}% complete</p>
          </div>
        )}

        {/* Logs */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Console Logs
          </label>
          <div className="border rounded-lg p-4 bg-gray-900 text-green-400 font-mono text-xs h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Logs will appear here...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        {/* Extracted Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extracted Text
          </label>
          <textarea
            value={text}
            readOnly
            placeholder="Extracted text will appear here..."
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
          />
        </div>

        {/* Statistics */}
        {text && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Characters</p>
              <p className="text-2xl font-bold text-blue-600">{text.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Words</p>
              <p className="text-2xl font-bold text-blue-600">{text.split(/\s+/).filter(w => w).length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Lines</p>
              <p className="text-2xl font-bold text-blue-600">{text.split('\n').filter(l => l.trim()).length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
