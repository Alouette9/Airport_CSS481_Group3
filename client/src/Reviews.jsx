import React, { useState, useEffect } from "react";
import { ExpandableCard } from './ExpandableCard';

// Form for reviews
// and scroll through reviews 

function Reviews({ data = [], onAddReview }) {
    const [reviews, setReviews] = useState(Array.isArray(data) ? data.slice() : []);
    const [form, setForm] = useState({ carrier_name: '', reviewer_name: '', review_date: '', star_rating: 5, review_description: '' });

    useEffect(() => {
        // keep local reviews in sync if parent data changes
        setReviews(Array.isArray(data) ? data.slice() : []);
    }, [data]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        // basic validation
        if (!form.carrier_name || !form.reviewer_name || !form.review_description) {
            alert('Please fill carrier, your name, and a review description.');
            return;
        }

        const review = {
            carrier_name: form.carrier_name,
            reviewer_name: form.reviewer_name,
            review_date: form.review_date || new Date().toISOString().slice(0,10),
            star_rating: Number(form.star_rating) || 0,
            review_description: form.review_description
        };

        // Update local state so the UI refreshes immediately
        setReviews(prev => [review, ...prev]);

        // If parent supplied a handler, call it so parent can update its JSON/storage
        if (typeof onAddReview === 'function') {
            try {
                onAddReview(review);
            } catch (err) {
                console.warn('onAddReview handler threw', err);
            }
        }

        // clear form
        setForm({ carrier_name: '', reviewer_name: '', review_date: '', star_rating: 5, review_description: '' });
    }

    return (
        <ExpandableCard title={'Airline Reviews'} initialDisplay={true} expandMode={'static'} widthPercent={45} minheightPercent={45} scrollable={true}>
            <div className="review-form" style={{ marginBottom: 12 }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <input name="carrier_name" placeholder="Carrier name" value={form.carrier_name} onChange={handleChange} />
                        <input name="reviewer_name" placeholder="Your name" value={form.reviewer_name} onChange={handleChange} />
                        <input name="review_date" type="date" value={form.review_date} onChange={handleChange} />
                        <select name="star_rating" value={form.star_rating} onChange={handleChange}>
                            <option value={5}>★★★★★</option>
                            <option value={4}>★★★★</option>
                            <option value={3}>★★★</option>
                            <option value={2}>★★</option>
                            <option value={1}>★</option>
                        </select>
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <textarea name="review_description" placeholder="Write your review" value={form.review_description} onChange={handleChange} rows={3} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <button type="submit">Submit Review</button>
                    </div>
                </form>
            </div>

            <div className="review-list">
                {reviews.length === 0 && <div>No reviews yet.</div>}
                {reviews.map((review, index) => (
                    <div key={index} className="review">
                        <h3>{review.carrier_name}</h3>
                        <p><strong>Reviewer:</strong> {review.reviewer_name}</p>
                        <p><strong>Date:</strong> {review.review_date}</p>
                        <p><strong>Rating:</strong> {"★".repeat(Number(review.star_rating) || 0)}</p>
                        <p>{review.review_description}</p>
                        <hr />
                    </div>
                ))}
            </div>
        </ExpandableCard>
    );
}

export default Reviews;
