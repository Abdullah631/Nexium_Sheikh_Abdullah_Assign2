"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Lucide icon for spinner (optional)

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  interface SummaryResult {
    fullText: string;
    summary: string;
    urduSummary: string;
  }

  const [result, setResult] = useState<SummaryResult | null>(null);

const handleSummarise = async () => {
  if (!url.trim()) {
    alert("No URL provided. Please enter a blog URL to summarize.");
    return;
  }

  setLoading(true);
  setResult(null);

  try {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
    } else {
      setResult(data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while summarizing.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Centered Heading */}
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
        Blog Summarizer
      </h1>

      {/* URL Input + Button */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 justify-center">
        <Input
          placeholder="Enter blog URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full sm:w-96"
        />
        <Button onClick={handleSummarise} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Summarizing...
            </>
          ) : (
            "Summarise"
          )}
        </Button>
      </div>

      {/* Spinner below button (optional extra visibility) */}
      {loading && (
        <div className="flex justify-center mt-4 text-gray-600">
          <Loader2 className="animate-spin h-6 w-6" />
          <span className="ml-2">Summarizing blog, please wait...</span>
        </div>
      )}

      {/* Summary Results */}
      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-4 rounded-xl shadow-md border">
            <h2 className="text-lg font-semibold mb-2 text-black">Extracted Text</h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">{result.fullText}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md border">
            <h2 className="text-lg font-semibold mb-2 text-black">Summary (EN)</h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">{result.summary}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md border">
            <h2 className="text-lg font-semibold mb-2 text-black">Summary (Urdu)</h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">{result.urduSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
