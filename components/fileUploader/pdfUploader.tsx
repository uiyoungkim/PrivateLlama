"use client";

import { ChangeEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { cva } from "class-variance-authority";

const fileInputStyles = cva(
  "border border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100",
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
    <div className="flex flex-col items-center gap-4">
      <label className={fileInputStyles()}>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
        Upload here
      </label>
      {selectedFile && (
        <p className="text-sm text-gray-700">
          SelectedFile: {selectedFile.name}
        </p>
      )}
    </div>
  );
}
