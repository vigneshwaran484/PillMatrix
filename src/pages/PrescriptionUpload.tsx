import React, { useState } from "react";
import Tesseract from "tesseract.js";

const PrescriptionUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!image) return alert("Please upload an image first!");
    setLoading(true);
    setText("");

    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });
      setText(result.data.text);
    } catch (error) {
      alert("Failed to extract text. Try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Prescription Digitalizer</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="border p-2 rounded mb-4"
      />

      {image && (
        <div className="my-4">
          <img src={image} alt="Uploaded" className="mx-auto max-h-64 rounded shadow" />
        </div>
      )}

      <button
        onClick={handleExtractText}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Extracting..." : "Convert to Text"}
      </button>

      <div className="mt-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Extracted text will appear here..."
          className="w-full h-40 border rounded p-2"
        />
      </div>

      {text && (
        <button
          onClick={() => alert("Prescription confirmed!")}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700 transition"
        >
          Confirm Prescription
        </button>
      )}
    </div>
  );
};

export default PrescriptionUpload;
