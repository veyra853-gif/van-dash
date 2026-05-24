"use client";

import { useState } from "react";

const Upload = ({ onFilesUpload }) => {
  const [media, setMedia] = useState([]); // Array of uploaded file URLs
  const [loading, setLoading] = useState(false);

  const handleFilesChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const totalSelected = files.length;
    const totalAlreadyUploaded = media.length;
    const maxAllowed = 12;

    if (totalAlreadyUploaded >= maxAllowed) {
      alert("You can only upload a maximum of 12 files.");
      return;
    }

    const remainingSlots = maxAllowed - totalAlreadyUploaded;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setLoading(true);
    const uploadedMedia = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const isVideo = file.type.startsWith("video/");
      const uploadUrl = isVideo
        ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/video/upload`
        : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload`;

      formData.append("resource_type", isVideo ? "video" : "image");
      if (isVideo) {
        formData.append("format", ""); // Attempt to override preset's default format (like webp)
      }

      try {
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Upload failed for ${file.name}:`, errorData.error?.message || res.statusText);
          alert(`Upload failed for ${file.name}: ${errorData.error?.message || res.statusText}`);
          continue;
        }

        const data = await res.json();
        uploadedMedia.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert(`Error uploading ${file.name}: ${error.message}`);
      }
    }

    setMedia((prevMedia) => [...prevMedia, ...uploadedMedia]);
    if (onFilesUpload) onFilesUpload(uploadedMedia);
    setLoading(false);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-bold">Upload Images</label>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFilesChange}
        className="border p-2 w-full"
      />
      {loading && <p>Uploading...</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {media.map((fileUrl, index) =>
          fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video key={index} controls className="w-24 h-auto">
              <source src={fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              key={index}
              src={fileUrl}
              alt={`Uploaded ${index}`}
              className="w-24 h-auto object-cover"
            />
          )
        )}
      </div>
    </div>
  );
};

export default Upload;
