"use client";

import { UploadButton } from "@/lib/uploadthing";

export const ImageUploader = () => {
  return (
    <UploadButton
      className="border border-gray-300 rounded-lg p-4 pb-6"
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};
