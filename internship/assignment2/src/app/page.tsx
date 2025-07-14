"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  interface SummaryResult {
    fullText: string;
    summary: string;
    urduSummary: string;
    saveStatus: {
      mongodb: string;
      supabase: string;
    };
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
  const cleanMarkdown = (text: string) => {
    return text
      .replace(/^(?:Sure|Certainly|Here|Of Course|.*?):?\s*/i, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^\s*#\s*/gm, "")
      .replace(/^\s*\*\s/gm, "- ")
      .trim();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="flex flex-col items-center text-center mb-8 max-w-7xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>📝</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
            My AI Blog Summarizer
          </span>
          <span>📝</span>
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">
            Gemini + Supabase + MongoDB
          </span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* URL Input */}
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
              "Summarize"
            )}
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center mt-4 text-gray-600">
            <Loader2 className="animate-spin h-6 w-6" />
            <span className="ml-2">Summarizing blog, please wait...</span>
          </div>
        )}

        {result && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">Extracted Blog Text</h2>
                </div>
                <div className="h-64 p-3 bg-background rounded-lg overflow-y-auto text-sm whitespace-pre-line">
                  {result.fullText}
                </div>

                <div>
                  <h3 className="font-medium mb-3">Database Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">
                          Supabase: {result.saveStatus.supabase}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">
                          MongoDB: {result.saveStatus.mongodb}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">AI Summary Output</h2>

                <div>
                  <h3 className="font-medium mb-2">Summary (English)</h3>
                  <div className="text-sm whitespace-pre-line">
                    {cleanMarkdown(result.summary)}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <h3 className="font-medium mb-2">Summary (Urdu)</h3>
                  <div
                    className="text-sm whitespace-pre-line"
                    style={{
                      direction: "rtl",
                      fontFamily: "'Noto Nastaliq Urdu', serif",
                    }}
                  >
                    {cleanMarkdown(result.urduSummary)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-muted text-sm">
        <p>📝 My AI Blog Summarizer 📝</p>
        <p>All Rights Reserved</p>
        <p>Created by Sheikh Abdullah Arshad</p>
      </footer>
    </div>
  );
}
