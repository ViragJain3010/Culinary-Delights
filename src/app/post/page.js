"use client";

import { useState } from "react";
import { NextDrupal } from "next-drupal";
import { Protected } from "@/components/Protected";
const token = localStorage.getItem("access_token");

const drupal = new NextDrupal("https://recipes.ddev.site/", {
  auth: {
    access_token: token,
    token_type: "Bearer",
  },
});

export default function PostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  // Upload binary image directly to /media/image
  // async function uploadMediaImage(file, token) {
  //   const res = await fetch("https://recipes.ddev.site/jsonapi/media/image/field_media_image", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/octet-stream",
  //       "Content-Disposition": `file; filename="${file.name}"`,
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: file,
  //   });

  //   if (!res.ok) {
  //     throw new Error("Image upload failed");
  //   }

  //   const data = await res.json();
  //   return data.data.id; // Return the media entity ID
  // }

  async function uploadImageAndCreateMedia(file, token) {
    // 1. Upload the file
    const fileResource = await drupal.createFileResource("file--file", {
      data: {
        attributes: {
          type: "media--image",
          field: "field_media_image",
          filename: "filename.jpg",
          file: file,
        },
      },
      withAuth: {
        access_token: token,
        token_type: "Bearer",
      },
    });

    console.log("🚀 ~ uploadImageAndCreateMedia ~ fileResource:", fileResource);

    // 2. Create the media entity
    const media = await drupal.createResource("media--image", {
      data: {
        attributes: {
          name: "Name for the media",
        },
        relationships: {
          field_media_image: {
            data: {
              type: "file--file",
              id: fileResource.id,
            },
          },
        },
      },
      withAuth: {
        access_token: token,
        token_type: "Bearer",
      },
    });
    console.log("🚀 ~ uploadImageAndCreateMedia ~ media:", media);

    return media;
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("access_token");

  //   if (!token) {
  //     setStatus("❌ No access token found. Please log in.");
  //     return;
  //   }

  //   try {
  //     let mediaId = null;

  //     if (file) {
  //       mediaId = await uploadMediaImage(file, token);
  //       console.log("🚀 ~ handleSubmit ~ mediaId:", mediaId)
  //     }

  //     const response = await fetch("https://recipes.ddev.site/jsonapi/node/article", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/vnd.api+json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         data: {
  //           type: "node--article",
  //           attributes: {
  //             title,
  //             body: {
  //               value: body,
  //               format: "plain_text",
  //             },
  //           },
  //           relationships: mediaId
  //             ? {
  //                 field_image: {
  //                   data: {
  //                     type: "file--file",
  //                     id: mediaId,
  //                   },
  //                 },
  //               }
  //             : {},
  //         },
  //       }),
  //     });

  //     const articleData = await response.json();
  //     setStatus(`✅ Article created with ID: ${articleData.data.id}`);
  //   } catch (error) {
  //     console.error("Error creating article:", error);
  //     setStatus("❌ Failed to create article");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("❌ No access token found. Please log in.");
      return;
    }

    try {
      let media = null;

      if (file) {
        media = await uploadImageAndCreateMedia(file, token);
      }

      const article = await drupal.createResource("node--article", {
        data: {
          attributes: {
            title,
            body: {
              value: body,
              format: "plain_text",
            },
          },
          //   relationships: media
          //     ? {
          //         field_media_image: {
          //           data: {
          //             type: "media--image",
          //             id: media.id,
          //           },
          //         },
          //       }
          //     : {},
        },
        withAuth: {
          access_token: token,
          token_type: "Bearer",
        },
      });

      setStatus(`✅ Article created with ID: ${article.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
      setStatus("❌ Failed to create article");
    }
  };

  return (
    <Protected>
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Article</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded"
            rows="5"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

          {status && <p className="mt-4">{status}</p>}
        </form>
      </div>
    </Protected>
  );
}
