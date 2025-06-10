import { notFound } from "next/navigation"
import BlogDetail from "@/components/blog-detail"
import blogs from "@/data/blogs.json"

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = blogs.find((blog) => blog.id === params.id)

  if (!blog) {
    notFound()
  }

  return <BlogDetail blog={blog} />
}
