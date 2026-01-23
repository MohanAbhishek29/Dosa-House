// scripts/reviews.js

document.addEventListener('DOMContentLoaded', () => {
    const reviewsGrid = document.getElementById('reviews-grid');
    const writeReviewBtn = document.getElementById('write-review-btn');
    const modal = document.getElementById('review-modal');
    const closeModalBtn = document.getElementById('close-review-modal');
    const reviewForm = document.getElementById('review-form');
    const stars = document.querySelectorAll('.star-rating span');
    const ratingInput = document.getElementById('review-rating');

    // 1. Initial State (Seed Data)
    const defaultReviews = [
        { name: "Priya Reddy", role: "Food Blogger", rating: 5, text: "The Ghee Roast is absolutely divine! Reminds me of my trips to Bangalore. Highly recommended." },
        { name: "Rajesh Kumar", role: "Local Guide", rating: 5, text: "Best place for family dinner. The Podi Idli is a must-try. Fast service and authentic taste." },
        { name: "Sneha Gupta", role: "Student", rating: 5, text: "Clean, hygienic, and tasty. Their Sambar is just perfect. Will visit again for sure!" }
    ];

    let reviews = JSON.parse(localStorage.getItem('dosaHouseReviews'));

    if (!reviews || reviews.length === 0) {
        reviews = defaultReviews;
        localStorage.setItem('dosaHouseReviews', JSON.stringify(reviews));
    }

    // 2. Render Function
    function renderReviews() {
        if (!reviewsGrid) return;

        reviewsGrid.innerHTML = reviews.map(review => `
            <div class="review-card" style="padding: 2rem; background: #fff; border-radius: 15px; box-shadow: var(--shadow-clay); border: 1px solid #f0f0f0; text-align: left;">
                <div style="color: #FFD700; font-size: 1.5rem; margin-bottom: 1rem;">${'⭐'.repeat(review.rating)}</div>
                <p style="font-style: italic; color: #555; margin-bottom: 1.5rem;">"${review.text}"</p>
                <div class="reviewer">
                    <h4 style="margin: 0; color: var(--color-charcoal);">${review.name}</h4>
                    <span style="font-size: 0.9rem; color: #999;">${review.role || 'Happy Customer'}</span>
                </div>
            </div>
        `).join('');
    }

    renderReviews();

    // 3. Modal Logic
    if (writeReviewBtn) writeReviewBtn.onclick = () => modal.classList.add('active');
    if (closeModalBtn) closeModalBtn.onclick = () => modal.classList.remove('active');
    if (modal) modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

    // 4. Star Rating Logic
    stars.forEach(star => {
        star.onclick = () => {
            const val = star.dataset.value;
            ratingInput.value = val;
            updateStars(val);
        };
    });

    function updateStars(value) {
        stars.forEach(s => {
            if (s.dataset.value <= value) s.style.color = '#FFD700'; // Gold
            else s.style.color = '#ddd'; // Gray
        });
    }
    updateStars(5); // Default

    // 5. Form Submission
    if (reviewForm) {
        reviewForm.onsubmit = (e) => {
            e.preventDefault();

            const newReview = {
                name: document.getElementById('review-name').value,
                role: "Verified Customer",
                rating: parseInt(ratingInput.value),
                text: document.getElementById('review-text').value
            };

            reviews.unshift(newReview); // Add to top
            localStorage.setItem('dosaHouseReviews', JSON.stringify(reviews));

            renderReviews();
            modal.classList.remove('active');
            reviewForm.reset();
            updateStars(5);
            alert("Thanks for your review! 🥥");
        };
    }
});
