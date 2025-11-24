import React from "react";
import { ExpandableCard } from './ExpandableCard';

function Reviews({ data }) {
    return (
        <ExpandableCard title={'Airline Reviews'} initialDisplay={true} expandMode={'static'} widthPercent={45} minheightPercent={40}
        scrollable = {true}>
            {data.map((review, index) => (
                <div key={index} className="review">
                    <h3>{review.carrier_name}</h3>
                    <p><strong>Reviewer:</strong> {review.reviewer_name}</p>
                    <p><strong>Date:</strong> {review.review_date}</p>
                    <p><strong>Rating:</strong> {"★".repeat(review.star_rating)}</p>
                    <p>{review.review_description}</p>
                    <hr />
                </div>
            ))}
        </ExpandableCard>
    );
}

export default Reviews;
