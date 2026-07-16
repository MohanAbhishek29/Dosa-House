# 🍛 Dosa House — Interview Preparation Sheet
### *Interviewer asks → You answer — Full Project Q&A*

---

## 📌 SECTION 1: Project Overview Questions

---

**Q1. Tell me about this project.**

> Dosa House is a full-stack restaurant management system I built and deployed on Firebase. It's not just a frontend website — it has 4 separate role-based dashboards: Customer, Admin, Kitchen, and Delivery. Everything works in real-time using Firebase Firestore. A customer can place an order, the admin accepts it, the kitchen cooks it, the delivery partner delivers it with OTP verification, and the customer rates it — all without a single page refresh anywhere.

---

**Q2. What problem does this project solve?**

> Traditional restaurants manage orders on paper or phone calls — which is slow, error-prone, and hard to track. This system digitizes the entire flow. The admin sees orders instantly, the kitchen gets live tickets, and the customer tracks their order like a Swiggy/Zomato experience — all in real-time.

---

**Q3. How long did it take to build?**

> The core system took around 2-3 weeks. I kept iterating — first built the UI, then integrated Firebase, then added authentication, then the full order lifecycle, then OTP delivery, and finally deployed it to production.

---

**Q4. Did you work alone or in a team?**

> I built this entirely by myself — from UI design, Firebase setup, authentication, real-time data logic, to deployment. All decisions were mine.

---

## 📌 SECTION 2: Firebase Questions

---

**Q5. What is Firebase? Why did you choose it?**

> Firebase is a Backend-as-a-Service (BaaS) platform by Google. I chose it because:
> - **Firestore** gives real-time database with zero backend code
> - **Firebase Auth** handles Google login, email/password securely
> - **Firebase Hosting** deploys in seconds with HTTPS
> - No need to manage servers, APIs, or databases manually
> - Perfect for a full-stack solo project

---

**Q6. What is Firestore? How is it different from a normal SQL database?**

> Firestore is a NoSQL cloud database. Key differences:
> 
> | SQL | Firestore |
> |-----|-----------|
> | Tables with rows | Collections with Documents |
> | JOIN queries | Nested subcollections |
> | Pull-based | Real-time push (`onSnapshot`) |
> | Schema required | Schema-free (flexible JSON) |
>
> In Firestore, I have an `orders` collection where each document = one order with all its data (customer name, items, status, OTP, rating).

---

**Q7. How does real-time work in Firestore?**

> Using `onSnapshot()`. Instead of fetching data once, you attach a listener:
> ```javascript
> db.collection('orders')
>   .where('customerId', '==', uid)
>   .onSnapshot(snapshot => {
>       // This runs AUTOMATICALLY whenever any order changes
>       renderOrders(snapshot.docs);
>   });
> ```
> Firebase maintains a persistent WebSocket connection. When any document changes in Firestore, it pushes the update to all active listeners instantly — no polling, no refresh needed.

---

**Q8. What collections do you have in Firestore?**

> I have two main collections:
> - **`orders`** — every placed order with fields: `orderId`, `customerId`, `customerName`, `items[]`, `status`, `total`, `paymentMethod`, `deliveryOTP`, `rating`, `createdAt`
> - **`users`** — every registered user with fields: `name`, `email`, `role`, `createdAt`

---

**Q9. How do you handle Firestore security?**

> Firebase Security Rules control who can read/write. Additionally, I implemented role-based access in code:
> - **STAFF_ROLES** object in `firebase-config.js` maps specific emails to roles (admin/kitchen/delivery)
> - `requireAuth()` function checks the user's role before rendering any staff page
> - If role doesn't match, user is redirected to their correct dashboard

---

**Q10. What is Firebase Authentication?**

> Firebase Auth is a service that handles user login securely. I use two providers:
> - **Google OAuth** — Customer clicks "Sign in with Google", Firebase handles the token exchange and returns user data
> - **Email/Password** — For staff login and email-based customer accounts
> 
> Firebase returns a unique `uid` for every user which I use to link orders to customers.

---

**Q11. What is authDomain and why does it matter?**

> `authDomain` is the domain Firebase uses to handle OAuth redirects. I set it to `dosa-house-7bd70.firebaseapp.com` — the official Firebase auth endpoint. If you set it to the custom domain (`web.app`), the Google OAuth token exchange fails because Firebase only whitelists `firebaseapp.com` for auth by default. This caused a bug we fixed early on.

---

## 📌 SECTION 3: Authentication & Role System

---

**Q12. How does role-based access work in your project?**

> Every user has a `role` field in Firestore (`customer`, `admin`, `kitchen`, `delivery`). When a page loads, `requireAuth(allowedRoles)` is called:
> ```javascript
> async function requireAuth(allowedRoles) {
>     const user = await getCurrentUser(); // gets user + role from Firestore
>     if (!user) { 
>         window.location.replace('login.html'); // not logged in
>         return null; 
>     }
>     if (!allowedRoles.includes(user.role)) {
>         // Wrong role — redirect to their correct dashboard
>         const redirectMap = { admin: 'admin.html', kitchen: 'kitchen.html', ... };
>         window.location.replace(redirectMap[user.role]);
>         return null;
>     }
>     return user; // authorized ✅
> }
> ```

---

**Q13. What if someone manually types `admin.html` in the browser?**

> The page immediately calls `requireAuth(['admin'])`. Firebase Auth checks if the current user is logged in and fetches their role from Firestore. If they're not admin, they're redirected. A customer can never access the admin dashboard — even by directly typing the URL.

---

**Q14. How do you handle public pages vs protected pages?**

> I use two different functions:
> - **`requireAuth()`** — forces login, used on admin/kitchen/delivery/account pages
> - **`setupNavAuth()`** — checks login silently, used on public pages (home, menu, booking, about). If logged in → shows profile. If guest → shows Login button. No redirect.

---

**Q15. How does Google login work in your code?**

> ```javascript
> const provider = new firebase.auth.GoogleAuthProvider();
> await auth.signInWithPopup(provider);
> ```
> Firebase opens a Google popup, handles OAuth flow, gets the user's Google account details, creates/updates Firebase Auth user, and returns the user object. I then check if they already have a Firestore user document — if not, I create one with role: 'customer'.

---

## 📌 SECTION 4: Order Flow & OTP Logic

---

**Q16. Walk me through the complete order flow technically.**

> 1. Customer fills cart → clicks Checkout → `getCurrentUser()` called — if null, `requireLogin()` modal shown
> 2. If logged in, `generateReceipt()` runs → shows checkout modal (address + payment)
> 3. On "Place Order" → order document created in Firestore with status: `pending`, `deliveryOTP: null`
> 4. Admin's `onSnapshot` fires → new card appears with sound alert → Admin clicks Accept → status: `accepted`
> 5. Kitchen's `onSnapshot` fires → ticket appears → Kitchen marks Ready → status: `packaging`
> 6. Admin sees packaging tab → clicks "Send to Delivery" → status: `sent_to_delivery` + **OTP generated here**
> 7. Delivery dashboard shows order → Delivery accepts → status: `out_for_delivery`
> 8. Customer's `onSnapshot` fires → OTP box appears on their orders page
> 9. Delivery partner asks customer for OTP → enters it → system compares → if match: status: `delivered`
> 10. Customer sees rating stars → rates experience → `rating` field saved to Firestore

---

**Q17. How is the OTP generated? Is it secure?**

> ```javascript
> const otp = Math.floor(1000 + Math.random() * 9000).toString();
> ```
> This generates a 4-digit number between 1000-9999. It's generated **once** by the Admin when sending to delivery, saved in Firestore, and never regenerated. The delivery person enters it, and we compare:
> ```javascript
> if (inputOTP !== correctOTP) { 
>     showToast('❌ Wrong OTP!'); 
>     return; 
> }
> ```
> It's not cryptographically secure (production apps use SMS OTP), but for this project it ensures the delivery partner physically met the customer.

---

**Q18. Why does the Admin generate the OTP, not the Delivery partner?**

> Earlier the delivery partner was generating it, but that caused a bug — admin showed customers one OTP from Firestore, then delivery partner overwrote it with a new one. Customer and delivery had different OTPs → verification always failed. Fix: Admin generates it once at `sent_to_delivery` stage. Delivery partner only reads it, never writes it.

---

**Q19. How does the UPI payment work?**

> I use the UPI deep link format:
> ```
> upi://pay?pa=dosahouse@upi&pn=Dosa+House&am=250&cu=INR&tn=ORD-1234
> ```
> Then generate a QR code using a free API:
> ```javascript
> const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`;
> ```
> Customer scans it and pays. Since there's no payment gateway, the Admin manually clicks "Confirm UPI Payment Received" on their dashboard.

---

## 📌 SECTION 5: Frontend & JavaScript

---

**Q20. You didn't use React or any framework. Why?**

> Intentionally. I wanted to prove I understand the fundamentals — DOM manipulation, event listeners, async/await, modular code — without framework abstractions. Firebase also works beautifully with Vanilla JS. The project shows that you don't need React for a complex, real-time application.

---

**Q21. How does your cart work?**

> Cart is an in-memory JavaScript array:
> ```javascript
> let cart = []; // [{ itemId: 'dosa-1', quantity: 2 }, ...]
> ```
> - `addToCart(itemId, qty)` — adds or increments item
> - `updateCartItemQty(itemId, delta)` — +1 or -1, removes if qty hits 0
> - `updateCartUI()` — re-renders the cart sidebar from the array
> - Total calculated by reducing: `cart.reduce((sum, item) => sum + price * qty, 0)`

---

**Q22. How does real-time order tracking progress bar work on customer side?**

> I have an array of status steps:
> ```javascript
> const STATUS_STEPS = ['pending','accepted','preparing','packaging','sent_to_delivery','out_for_delivery','delivered'];
> ```
> For each order, I find `indexOf(order.status)` → that's the current step index. Steps before it get class `done` (orange filled), current step gets `active` (pulsing border), future steps stay grey. Since `onSnapshot` re-renders on every status change, the bar updates live.

---

**Q23. How does the login gate (requireLogin modal) work?**

> When a guest tries to checkout or book a table:
> ```javascript
> const user = await getCurrentUser();
> if (!user) {
>     requireLogin('Please sign in to place your order!');
>     return;
> }
> ```
> `requireLogin()` dynamically creates a modal div, appends it to body, with Cancel + "Sign In →" buttons. No page redirect — user can cancel and keep browsing. Clicking Sign In goes to `login.html`.

---

**Q24. How does the table booking work?**

> The booking form collects: name, phone, date, time, party size, table selection. On submit:
> 1. If user not logged in → login gate modal shown
> 2. If logged in → data saved to Firestore `bookings` collection
> 3. Admin can see bookings separately
> The interactive table map shows available/booked tables rendered from a JS config array with zones (window, center, quiet corner) and shapes (round 2-seater, rect 4-seater, etc.)

---

## 📌 SECTION 6: PWA Questions

---

**Q25. What is a PWA?**

> Progressive Web App — a website that behaves like a native mobile app. Key features:
> - **Installable** — user can add to home screen
> - **Works offline** — service worker caches assets
> - **Fast** — cached resources load instantly on repeat visits
> - **Responsive** — works on any screen size

---

**Q26. How did you implement PWA in this project?**

> Two things needed:
> 1. **`manifest.json`** — tells the browser app name, icon, theme color, start URL
> 2. **`sw.js` (Service Worker)** — a JS file that runs in background, intercepts network requests, caches files
> ```javascript
> // sw.js — cache key assets on install
> self.addEventListener('install', event => {
>     event.waitUntil(
>         caches.open('dosa-house-v1').then(cache => cache.addAll(['/','index.html','styles/main.css']))
>     );
> });
> ```
> Then in `ui.js`, I listen for `beforeinstallprompt` event and show the 📱 INSTALL button.

---

## 📌 SECTION 7: System Design & Architecture

---

**Q27. How would you scale this for 10,000 users?**

> - Firebase Firestore scales automatically — it's Google's infrastructure
> - Add Firestore indexes for complex queries (currently avoided to stay in free tier)
> - Use Firebase Cloud Functions for server-side logic (OTP via SMS, payment webhook)
> - Add Razorpay for real payment processing
> - Use Firebase Cloud Messaging for push notifications instead of polling

---

**Q28. What are the security vulnerabilities in your current project?**

> Honest answer:
> 1. **Firestore rules** — currently open (test mode). Production needs proper rules:
>    `allow write: if request.auth.uid == resource.data.customerId`
> 2. **UPI self-reporting** — customer can click "I've Paid" without paying. Fixed by adding Admin verification button.
> 3. **OTP is numeric** — brute-forceable in theory. Production should use Firebase Phone Auth.
> 4. **No rate limiting** — someone could spam order placements

---

**Q29. What would you add next?**

> - **Razorpay payment gateway** — automatic payment confirmation
> - **Firebase Cloud Messaging** — push notifications to customer's phone
> - **Phone OTP login** — Firebase Phone Auth (needs Blaze plan)
> - **Firebase Security Rules** — proper production rules
> - **Admin analytics** — revenue charts, popular items, peak hours
> - **Coupon codes** — discount system

---

**Q30. How is your build process set up?**

> I have a custom `scripts/build.js` Node.js script. It copies all source files from the root into a `dist/` folder. Firebase Hosting serves from `dist/`. This keeps source code separate from deployed code. Run: `node scripts/build.js` then `firebase deploy --only hosting`.

---

## 📌 SECTION 8: HR / Behavioral Questions

---

**Q31. What was the hardest part of building this?**

> Authentication. Firebase Auth + Firestore user roles + Google OAuth + redirect flows — all of these together caused a lot of bugs. The authDomain misconfiguration caused Google login to fail silently. I replaced FirebaseUI (which was hiding errors) with direct `signInWithPopup()` calls so I could see and handle errors properly.

---

**Q32. What did you learn from this project?**

> - How real-time databases work with WebSocket listeners
> - Role-based access control implementation
> - Firebase Authentication OAuth flow
> - PWA service workers and caching
> - Debugging production issues (CORS, auth redirects, Firestore rules)
> - Full deployment pipeline from code to live URL

---

**Q33. Why should we hire you based on this project?**

> This project proves I can take an idea from zero to production — solo. I didn't just build a UI; I built a real system with authentication, a database, real-time features, role management, deployment, and version control. I debugged production issues, refactored bad code (like the duplicate OTP bug), and kept improving. That's exactly what a developer does at a real company.

---

## 📌 SECTION 9: Quick Fire Questions (Short Answers)

| Question | Answer |
|----------|--------|
| What language did you use? | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| What database? | Firebase Firestore (NoSQL) |
| How many pages? | 10 HTML pages (4 public + 6 role-specific) |
| How many Firestore collections? | 2 — `orders` and `users` |
| Is it responsive? | Yes — mobile-first, tested on phone |
| Is it deployed? | Yes — live at dosa-house-7bd70.web.app |
| Can I see the code? | Yes — github.com/MohanAbhishek29/Dosa-House |
| Did you use any framework? | No — pure Vanilla JS intentionally |
| What is onSnapshot? | Firestore real-time listener — auto-updates UI on data change |
| What is a Service Worker? | Background script that caches files for offline/fast PWA |
| What is RBAC? | Role-Based Access Control — different users see different pages |
| How is OTP generated? | `Math.floor(1000 + Math.random() * 9000)` — 4 digit number |
| Where is OTP stored? | In the order document in Firestore as `deliveryOTP` field |
| What is authDomain? | Firebase endpoint for handling OAuth redirects |
| How many roles? | 4 — customer, admin, kitchen, delivery |

---

## 📌 SECTION 10: Advanced Bugs & System Fixes (Deep Dive)

---

**Q34. How did you handle offline order placement bugs?**

> **Bug:** When a customer's internet dropped slightly during checkout, the `createdAt` timestamp was cached locally as `null` until the server restored connection. Our admin dashboard used a strict `.orderBy('createdAt')` Firestore query, which completely **dropped and hid** any documents with `null` timestamps. So the customer saw the order on their phone, but the admin didn't!
> **Fix:** I refactored the admin dashboard to fetch raw orders without the strict Firestore `orderBy` rule, and instead implemented **client-side sorting** in JavaScript. Now, even if the connection fluctuates and the timestamp is delayed, the admin dashboard never drops an order.

**Q35. How did you handle branching workflow states for different order types?**

> **Bug:** I created a Dine-In order feature, which bypassed delivery. Instead of being marked as `"delivered"` when finished, Dine-In orders were marked as `"served"`. However, my Admin Dashboard analytics and UI tabs were strictly filtering for `status === 'delivered'` to mark an order as fully completed. This caused `"served"` dine-in orders to become "ghost orders" — they bumped up the "Active Orders" count because they weren't cancelled/delivered, but they disappeared from the UI because no tab specifically queried for the `"served"` status!
> **Fix:** I refactored the admin logic to group both `"delivered"` and `"served"` statuses under a unified `"completed"` tab and included both in the Daily Revenue Analytics. It was a great lesson in how branching database states (Takeaway vs Dine-In) can easily create hidden UI bugs if not carefully synchronized with your query filters.

**Q36. How did you handle Staff Assignment dynamically?**

> Instead of hardcoding delivery boy names or kitchen staff, I built a dynamic Staff Management Panel in the Admin dashboard. The admin fetches all registered `users` from Firestore, filters them by `role === 'kitchen'` or `role === 'delivery'`, and dynamically populates the assignment dropdowns. This ensures orders are tied directly to real user IDs, allowing us to track exactly how many deliveries a specific driver completed and calculate their earnings.

**Q37. Have you implemented any global state controls?**

> Yes, I built an **Emergency Close** toggle. If the restaurant is overwhelmed with orders, the admin clicks a single "Close Restaurant" button. This updates a global `store_status` document in Firestore. Every customer's app listens to this document via `onSnapshot` and instantly disables their checkout buttons, turning the UI red and showing "Currently Not Accepting Orders." It works instantly across all connected devices.

**Q38. What UI design principles did you use?**

> I used a modern **Glassmorphism** aesthetic. Instead of flat, boring colors, I utilized semi-transparent backgrounds with `backdrop-filter: blur(10px)`, vibrant accent gradients (like `#F57F17` for buttons), and smooth CSS transitions. I also standardized the top navigation bar across all pages (including orders and mobile views) so the app feels incredibly consistent and premium, rather than pieced together.

---

> 💡 **Tip:** In interviews, always say *"Let me show you"* and open the live site or GitHub. Seeing a real deployed project is 10x more impressive than just talking about it! 🚀
