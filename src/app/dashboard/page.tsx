'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, MessageSquare } from 'lucide-react';

// --- DUMMY DATA ---
const dummyDocuments = [
  { doc_id: 'dummy-1', title: '2025 Annual Report', created_at: '2025-08-10T10:00:00Z', metadata: { format: 'pdf', size: 2345000 } },
  { doc_id: 'dummy-2', title: 'Marketing Strategy Q3', created_at: '2025-07-28T14:30:00Z', metadata: { format: 'docx', size: 1200000 } },
  { doc_id: 'dummy-3', title: 'HR Leave Policy', created_at: '2025-07-15T09:15:00Z', metadata: { format: 'pdf', size: 550000 } },
];

interface Document {
  doc_id: string;
  title: string;
  created_at: string;
  metadata: {
    format: string;
    size: number;
    status?: string;
  };
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.get('/docs/list');
      // Fix: Append dummy documents after real documents are fetched
      setDocuments([...response.data.documents, ...dummyDocuments]);
    } catch (err: any) {
      setError("Failed to fetch documents. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docTitle) {
      setUploadError("Please provide both a file and a title.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('docTitle', docTitle);
    formData.append('fileType', file.name.split('.').pop() || '');

    try {
      await apiClient.post('/docs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess("Document accepted for processing!");
      setFile(null);
      setDocTitle('');
      fetchDocuments();
    } catch (err: any) {
      const message = err.response?.data?.error || "An unexpected error occurred.";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <p>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
      <p className="text-gray-500 mb-8">Manage your company's knowledge base and get instant answers.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex items-center space-x-4">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <div>
            <CardTitle>Start Chatting</CardTitle>
            <CardDescription className="mt-1">Get instant answers from your documents.</CardDescription>
          </div>
          <Link href="/chat" className="ml-auto">
            <Button>Go</Button>
          </Link>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>Supported formats: PDF, DOCX, TXT, CSV.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFileUpload}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="docTitle">Document Title</Label>
                  <Input 
                    id="docTitle" 
                    placeholder="e.g., Refund Policy" 
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="document">Select File</Label>
                  <Input 
                    id="document" 
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                {uploadSuccess && <p className="text-green-500 text-sm mt-2">{uploadSuccess}</p>}
                <Button type="submit" disabled={uploading} className="mt-4">
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {documents.length === 0 ? (
                <p className="text-gray-500">No documents uploaded yet.</p>
              ) : (
                documents.map((doc) => (
                  <Card key={doc.doc_id} className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-semibold">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.metadata.format.toUpperCase()} • {(doc.metadata.size / 1024).toFixed(2)} KB • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      {doc.metadata.status && doc.metadata.status !== 'processing' && (
                        <p className="text-xs text-green-500 mt-1">Ready</p>
                      )}
                      {doc.metadata.status === 'processing' && (
                        <p className="text-xs text-yellow-500 mt-1">Processing...</p>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}