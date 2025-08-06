"use client";

import { API_URL } from "@/app/constants/constants";
import BlogDetail from "@/components/blog-detail";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogDetailPage() {
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams(); // ✅ useParams instead of props
  const blogId = Array.isArray(params.id) ? params.id[0] : params.id; // ✅ safely extract

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      const start = performance.now(); // ✅ Start measuring time

      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/content/${blogId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const blogData = response.data?.data;

        if (!blogData) {
          router.push("/not-found");
        } else {
          setBlog(blogData);
        }

        const end = performance.now(); // ✅ End measuring time
        setLoadTime(Math.round(end - start));
      } catch (error) {
        console.error("Failed to fetch blog detail", error);
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, router]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!blog) return null;

  return (
    <div>
      {loadTime !== null && (
        <div className="text-sm text-muted-foreground text-right px-6 mt-2">
          Data loaded in <span className="font-semibold">{loadTime} ms</span>
        </div>
      )}
      <BlogDetail blog={blog} />
    </div>
  );
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
