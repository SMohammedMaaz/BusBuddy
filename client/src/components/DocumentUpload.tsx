import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCheck, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  driverId: string;
  vehicleNumber: string;
}

interface DocumentInfo {
  id: string;
  name: string;
  type: 'puc' | 'fitness' | 'dl' | 'rc';
  label: string;
  validityDate?: string;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
}

export function DocumentUpload({ driverId, vehicleNumber }: DocumentUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const documents: DocumentInfo[] = [
    { id: 'puc', name: "PUC Certificate", type: 'puc', label: "Pollution Under Control", validityDate: "2026-03-15", status: "valid" },
    { id: 'fitness', name: "Fitness Certificate", type: 'fitness', label: "Vehicle Fitness", validityDate: "2025-11-20", status: "expiring" },
    { id: 'dl', name: "Driving License", type: 'dl', label: "Driver's License", validityDate: "2027-05-10", status: "valid" },
    { id: 'rc', name: "RC Certificate", type: 'rc', label: "Registration Certificate", validityDate: "2026-08-30", status: "valid" }
  ];

  const uploadMutation = useMutation({
    mutationFn: async ({ file, docType }: { file: File; docType: string }) => {
      // For now, we'll simulate the upload by sending metadata only
      // In production, you'd convert file to base64 or upload to cloud storage first
      const response = await apiRequest("POST", "/api/documents/upload", {
        docType,
        driverId,
        vehicleNumber,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Upload Successful",
        description: `${variables.docType.toUpperCase()} certificate uploaded successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setUploadingDoc(null);
    },
    onError: (error: Error, variables) => {
      toast({
        title: "Upload Failed",
        description: error.message || `Failed to upload ${variables.docType.toUpperCase()} certificate`,
        variant: "destructive",
      });
      setUploadingDoc(null);
    },
  });

  const handleFileSelect = (docType: string) => {
    const input = fileInputRefs.current[docType];
    if (input) {
      input.click();
    }
  };

  const handleFileChange = async (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingDoc(docType);
    uploadMutation.mutate({ file, docType });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expiring':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileCheck className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">✓ Valid</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">⚠ Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">✗ Expired</Badge>;
      default:
        return <Badge variant="outline">Not Uploaded</Badge>;
    }
  };

  return (
    <Card className="glass-card-light border-primary/10 p-6">
      <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
        <FileCheck className="w-6 h-6 text-primary" />
        Document Management
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="glass-card-light border-primary/10 p-4 hover-elevate">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(doc.status)}
                <h4 className="font-bold text-sm text-foreground">{doc.name}</h4>
              </div>
              {getStatusBadge(doc.status)}
            </div>
            
            {doc.validityDate && (
              <p className="text-xs text-muted-foreground mb-3">
                Valid until: {doc.validityDate}
              </p>
            )}
            
            <input
              ref={(el) => fileInputRefs.current[doc.type] = el}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(doc.type, e)}
              className="hidden"
              data-testid={`input-file-${doc.type}`}
            />
            
            <Button
              size="sm"
              variant="outline"
              className="w-full border-primary/20"
              onClick={() => handleFileSelect(doc.type)}
              disabled={uploadingDoc === doc.type}
              data-testid={`button-upload-${doc.type}`}
            >
              {uploadingDoc === doc.type ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
}
