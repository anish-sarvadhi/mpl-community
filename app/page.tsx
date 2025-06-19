'use client';

import SocialMediaPage from "@/components/social-media-page";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <SocialMediaPage />
    </ProtectedRoute>
  );
}