"use client"

import React from 'react'

export default function ReviewsClient({ reviews }: { reviews: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <p>This component is a work in progress. {reviews.length} reviews found.</p>
    </div>
  )
}
