// src/components/GithubBase64Uploader.tsx
import React, { useState } from "react";

const GithubBase64Uploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [commitMessage, setCommitMessage] = useState("Add new file");
  const [fileName, setFileName] = useState<string>("sample.pdf");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  // Chunked ArrayBuffer → Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // 32KB
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i += chunkSize) {
      const slice = bytes.subarray(i, i + chunkSize);
      // use apply to avoid a giant spread
      binary += String.fromCharCode.apply(
        null,
        // TypeScript hack: apply wants any[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Array.prototype.slice.call(slice) as any
      );
    }
    return window.btoa(binary);
  };

  // Read env vars at build time
  const OWNER = import.meta.env.VITE_OWNER as string;
  const REPO = import.meta.env.VITE_GITHUB_REPO as string;
  const TOKEN = import.meta.env.VITE_TOKEN as string;

  // Helper to read file → Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const b64 = arrayBufferToBase64(buffer);
        resolve(b64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setResult("❗ Please select a file first.");
      return;
    }
    if (!OWNER || !REPO || !TOKEN) {
      setResult("❗ Missing VITE_OWNER, VITE_GITHUB_REPO or VITE_TOKEN.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const content = await toBase64(file);

      const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${fileName}`;

      const body = JSON.stringify({
        message: commitMessage,
        committer: {
          name: "Monalisa Octocat",
          email: "octocat@github.com",
        },
        content,
      });

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `GitHub API returned ${res.status}`);
      }

      const data = await res.json();
      console.log(data);
      setResult(`✅ Uploaded! Commit`);
      setFile(null);
      (document.getElementById("fileInput") as HTMLInputElement).value = "";
    } catch (err) {
      console.error(err);
      setResult(`❌ ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="max-w-md mx-auto p-4 border rounded"
    >
      <h2 className="text-lg font-medium mb-4">Upload File to GitHub</h2>

      <label className="block mb-2">
        <span className="block font-semibold">Choose file</span>
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold">Commit message</span>
        <input
          type="text"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </label>

      <label>
        <span>File Name:</span>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading…" : "Upload to GitHub"}
      </button>

      {result && <p className="mt-4 text-sm whitespace-pre-wrap">{result}</p>}
    </form>
  );
};

export default GithubBase64Uploader;
