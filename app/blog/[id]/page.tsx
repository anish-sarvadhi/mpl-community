"use client";

import { API_URL } from "@/app/constants/constants";
import BlogDetail from "@/components/blog-detail";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/content/${params.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const blogData = response.data?.data;

        if (!blogData) {
          router.push("/not-found"); // redirect to 404
        } else {
          setBlog(blogData);
        }
      } catch (error) {
        console.error("Failed to fetch blog detail", error);
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id, router]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!blog) return null;

  return <BlogDetail blog={blog} />;
}

// import { notFound } from "next/navigation"
// import BlogDetail from "@/components/blog-detail"
// import blogs from "@/data/blogs.json"

// export default function BlogDetailPage({ params }: { params: { id: string } }) {
//   const blog = blogs.find((blog) => blog.id === params.id)

//   if (!blog) {
//     notFound()
//   }

//   return <BlogDetail blog={blog} />
// }
