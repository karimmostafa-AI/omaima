"use client"

import React from 'react';

interface ReviewsClientProps {
  reviews: any[];
}

const ReviewsClient: React.FC<ReviewsClientProps> = ({ reviews }) => {
  return (
    <div>
      <h1>Reviews</h1>
      {/* Render your reviews here */}
      <pre>{JSON.stringify(reviews, null, 2)}</pre>
    </div>
  );
};

export default ReviewsClient;
