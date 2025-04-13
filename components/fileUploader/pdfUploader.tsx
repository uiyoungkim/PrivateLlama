"use client";

import { ChangeEvent, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";

const fileInputStyles = cva(
  "hidden",
  {
    variants: {
      isDragging: {
        true: "bg-gray-200",
        false: "",
      },
    },
  }
);

type FileUploaderProps = {
  accept?: string;
  onFileSelect?: (file: File) => void;
};

export default function FileUploader({
  accept = ".pdf",
  onFileSelect,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("uploadFailed");
      }

      console.log("uploadSuccess");
    } catch (error) {
      console.error("uploadError", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label>
        <input
          type="file"
          accept={accept}
          className={fileInputStyles()}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
        >
          Datei hochladen
        </Button>
      </label>
      {selectedFile && (
        <p className="text-sm text-gray-700 ml-2">
          Selected: {selectedFile.name}
        </p>
      )}
    </div>
  );
}
