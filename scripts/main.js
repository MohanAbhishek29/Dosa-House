console.log('Dosa House Website Loaded');

// --- Data ---
const menuItems = [
    // 1. Dosa Samrajyam
    { id: 'd1', title: "Plain Dosa", category: "dosas", price: 50, description: "Classic crispy crepe made from fermented rice and lentil batter.", image: "assets/images/Plain_dosa.jpg", ingredients: ["Rice Batter", "Ghee"] },
    { id: 'd2', title: "Roast Dosa", category: "dosas", price: 60, description: "Extra crispy dosa roasted to golden perfection.", image: "assets/images/Roast_dosa.jpg", ingredients: ["Rice Batter", "Oil/Ghee"] },
    { id: 'd3', title: "Masala Dosa", category: "dosas", price: 80, description: "Golden crepe stuffed with spiced potato masala.", image: "assets/images/Masala_Dosa.jpg", ingredients: ["Potato Masala", "Batter", "Butter"] },
    { id: 'd4', title: "Onion Dosa", category: "dosas", price: 70, description: "Topped with crunchy chopped onions and green chilies.", image: "assets/images/Onion_dosa.jpg", ingredients: ["Onions", "Green Chilies", "Batter"] },
    { id: 'd5', title: "Onion Masala Dosa", category: "dosas", price: 90, description: "Onion dosa with a savory potato filling.", image: "assets/images/Onion_masala_dosa.jpg", ingredients: ["Onions", "Potato Masala"] },
    { id: 'd6', title: "Karam Dosa", category: "dosas", price: 75, description: "Spread with spicy red chutney (Karam).", image: "assets/images/Karam_dosa.jpg", ingredients: ["Red Chutney", "Batter"] },
    { id: 'd7', title: "Ghee Karam Dosa", category: "dosas", price: 95, description: "Spicy Karam dosa roasted with pure ghee.", image: "assets/images/Ghee_karam_dosa.jpg", ingredients: ["Red Chutney", "Pure Ghee"] },
    { id: 'd8', title: "Ghee Roast", category: "dosas", price: 100, description: "Paper-thin dosa roasted generously with homemade ghee.", image: "assets/images/Ghee_roast_dosa.jpg", ingredients: ["Pure Ghee", "Batter"] },
    { id: 'd9', title: "Butter Masala Dosa", category: "dosas", price: 95, description: "Served with a dollop of fresh butter (Benne Dosa style).", image: "assets/images/Butter_masala_dosa.jpg", ingredients: ["Butter", "Potato", "Batter"] },
    { id: 'd10', title: "Mysore Masala Dosa", category: "dosas", price: 90, description: "Spicy red chutney smeared inside with potato filling.", image: "assets/images/Mysore_Masala_dosa.jpg", ingredients: ["Red Garlic Chutney", "Potato", "Butter"] },
    { id: 'd11', title: "Paper Roast (70mm)", category: "dosas", price: 110, description: "Super long, extra crispy thin dosa.", image: "assets/images/Paper_roast.jpg", ingredients: ["Batter", "Ghee"] },
    { id: 'd12', title: "Rava Dosa", category: "dosas", price: 80, description: "Instant semolina crepe with cumin and peppercorns.", image: "assets/images/Rava_dosa.jpg", ingredients: ["Rava", "Cumin", "Peppercorns"] },
    { id: 'd13', title: "Onion Rava Dosa", category: "dosas", price: 90, description: "Rava dosa topped with plenty of onions.", image: "assets/images/Onion_rava_dosa.jpg", ingredients: ["Rava", "Onions"] },
    { id: 'd14', title: "Rava Masala Dosa", category: "dosas", price: 100, description: "Rava dosa with potato masala filling.", image: "assets/images/Rava_masala_dosa.jpg", ingredients: ["Rava", "Potato Masala"] },
    { id: 'd15', title: "Dry Fruit Dosa", category: "dosas", price: 130, description: "Rich dosa stuffed with cashews, raisins, and almonds.", image: "assets/images/Dry_fruit_dosa.jpg", ingredients: ["Cashews", "Raisins", "Almonds"] },
    { id: 'd16', title: "Cheese Dosa", category: "dosas", price: 110, description: "Fusion dosa loaded with melted cheese.", image: "assets/images/Cheese_dosa.jpg", ingredients: ["Mozzarella", "Cheddar", "Batter"] },
    { id: 'd17', title: "Paneer Dosa", category: "dosas", price: 120, description: "Stuffed with spicy paneer burji.", image: "assets/images/Panner_dosa.jpg", ingredients: ["Paneer", "Spices", "Batter"] },
    { id: 'd18', title: "Podi Dosa", category: "dosas", price: 80, description: "Sprinkled with spicy lentil gunpowder (Podi).", image: "assets/images/Podi_dosa.jpg", ingredients: ["Gunpowder Spice", "Ghee"] },
    { id: 'd19', title: "Set Dosa", category: "dosas", price: 70, description: "Stack of 3 soft, spongy thick dosas.", image: "assets/images/Set_dosa.jpg", ingredients: ["Batter", "Vegetable Sagoo"] },
    { id: 'd20', title: "Spring Dosa", category: "dosas", price: 95, description: "Stuffed with crunchy stir-fried vegetables.", image: "assets/images/Spring_Dosa.jpg", ingredients: ["Cabbage", "Carrot", "Spring Onions"] },
    { id: 'd21', title: "Pesarattu", category: "dosas", price: 80, description: "Healthy green gram (moong dal) dosa.", image: "assets/images/Pesarattu.jpg", ingredients: ["Green Gram", "Ginger", "Chilies"] },
    { id: 'd22', title: "Pesarattu Upma", category: "dosas", price: 100, description: "Pesarattu stuffed with savory upma.", image: "assets/images/Pesarattu_Upma.jpg", ingredients: ["Green Gram", "Upma"] },
    { id: 'd23', title: "MLA Pesarattu", category: "dosas", price: 110, description: "Special Pesarattu with Upma and Ghee.", image: "assets/images/MLA_Pesarattu.png", ingredients: ["Green Gram", "Upma", "Cashews"] },
    { id: 'd24', title: "Adai", category: "dosas", price: 85, description: "Thick pancake made from mixed lentils.", image: "assets/images/Adai_dosa.jpg", ingredients: ["Toor Dal", "Chana Dal", "Urad Dal"] },
    { id: 'd25', title: "Green Gram Dosa", category: "dosas", price: 85, description: "Healthy and crispy green gram dosa.", image: "assets/images/Green_Gram_dosa.jpg", ingredients: ["Green Gram", "Spices"] },
    { id: 'd26', title: "Neer Dosa", category: "dosas", price: 85, description: "Soft, thin, lacy rice crepes from Mangalore.", image: "assets/images/Neer_dosa.jpg", ingredients: ["Rice", "Coconut"] },

    // 2. Vada & Idli Zone
    { id: 'v1', title: "Plain Idli", category: "idli_vada", price: 40, description: "Steaming hot fluffy rice cakes.", image: "assets/images/Plain_idli.png", ingredients: ["Rice", "Urad Dal"] },
    { id: 'v2', title: "Ghee Idli", category: "idli_vada", price: 50, description: "Idlis drizzled with aromatic ghee.", image: "assets/images/Ghee_idli.jpg", ingredients: ["Ghee", "Idli Batter"] },
    { id: 'v3', title: "Sambar Idli", category: "idli_vada", price: 60, description: "Mini idlis dipped in a bowl of sambar.", image: "assets/images/Sambar_idli.png", ingredients: ["Sambar", "Idli"] },
    { id: 'v4', title: "Rasam Idli", category: "idli_vada", price: 60, description: "Idlis immersed in spicy pepper rasam.", image: "assets/images/Rasam_idli.jpg", ingredients: ["Rasam", "Idli"] },
    { id: 'v5', title: "Ghee Karampodi Idli", category: "idli_vada", price: 65, description: "Tossed in ghee and spicy gun powder.", image: "assets/images/Ghee_karampodi_idli.png", ingredients: ["Ghee", "Podi", "Idli"] },
    { id: 'v6', title: "Tatte Idli", category: "idli_vada", price: 50, description: "Large plate-sized idli, soft and porous.", image: "assets/images/Tatte_idli.png", ingredients: ["Rice Batter"] },
    { id: 'v7', title: "Button Idli", category: "idli_vada", price: 70, description: "Bowl of 14 mini idlis floating in sambar.", image: "assets/images/Button_idli.jpg", ingredients: ["Mini Idlis", "Sambar"] },
    { id: 'v8', title: "Rava Idli", category: "idli_vada", price: 60, description: "Idli made from semolina, curds and spices.", image: "assets/images/Ravva_idli.jpg", ingredients: ["Rava", "Curd", "Cashew"] },
    { id: 'v9', title: "Medu Vada", category: "idli_vada", price: 50, description: "Classic crispy lentil donuts.", image: "assets/images/Medu_vada.png", ingredients: ["Urad Dal", "Pepper"] },
    { id: 'v10', title: "Sambar Vada", category: "idli_vada", price: 60, description: "Vada soaked in hot sambar.", image: "assets/images/Sambar_vada.jpg", ingredients: ["Sambar", "Vada"] },
    { id: 'v11', title: "Rasam Vada", category: "idli_vada", price: 60, description: "Vada soaked in tangy rasam.", image: "assets/images/Rasam_vada.jpg", ingredients: ["Rasam", "Vada"] },
    { id: 'v12', title: "Perugu Vada", category: "idli_vada", price: 70, description: "Vada soaked in seasoned yogurt (Dahi Vada).", image: "assets/images/Perugu_vada.jpg", ingredients: ["Yogurt", "Mustard Seeds", "Vada"] },
    { id: 'v13', title: "Masala Vada", category: "idli_vada", price: 50, description: "Crunchy chana dal vada with herbs.", image: "assets/images/Masala_vada.jpg", ingredients: ["Chana Dal", "Onions", "Cilantro"] },
    { id: 'v14', title: "Maddur Vada", category: "idli_vada", price: 50, description: "Crispy flat fritter from Maddur region.", image: "assets/images/Maddur_vada.jpg", ingredients: ["Rice Flour", "Onion", "Semolina"] },
    { id: 'v15', title: "Sabudana Vada", category: "idli_vada", price: 50, description: "Crispy sago pearl fritters.", image: "assets/images/sabudana_vada.jpg", ingredients: ["Tapioca Pearls", "Potato", "Peanuts"] },

    // 3. Bonda & Bajji Specials
    { id: 'b1', title: "Mysore Bonda", category: "bonda_bajji", price: 50, description: "Round fluffy fritters made from maida and curd.", image: "assets/images/Mysore_bonda.jpg", ingredients: ["Maida", "Curd", "Coconut"] },
    { id: 'b2', title: "Aloo Bonda", category: "bonda_bajji", price: 50, description: "Spiced potato balls deep fried in batter.", image: "assets/images/Aloo_Bonda.png", ingredients: ["Potato", "Gram Flour"] },
    { id: 'b3', title: "Veg Bonda", category: "bonda_bajji", price: 45, description: "Mixed vegetable stuffed bonda.", image: "assets/images/Veg_Bondas.jpg", ingredients: ["Mixed Veggies", "Batter"] },
    { id: 'b4', title: "Punugulu", category: "bonda_bajji", price: 50, description: "Crispy snack made with dosa batter.", image: "assets/images/Punugulu.jpg", ingredients: ["Idli/Dosa Batter", "Onions"] },
    { id: 'b5', title: "Goli Baje", category: "bonda_bajji", price: 55, description: "Mangalore style sweet and spicy fritters.", image: "assets/images/Goli_bhaje.jpg", ingredients: ["Maida", "Green Chilies", "Curd"] },
    { id: 'b6', title: "Mirchi Bajji", category: "bonda_bajji", price: 40, description: "Whole stuffed green chilies fried in batter.", image: "assets/images/Mirchi_Bajji.jpg", ingredients: ["Green Chili", "Gram Flour"] },
    { id: 'b7', title: "Cut Mirchi", category: "bonda_bajji", price: 50, description: "Double fried cut chili fritters with onions.", image: "assets/images/Cut_Mirchi.jpg", ingredients: ["Chili", "Onions", "Lemon"] },
    { id: 'b8', title: "Aratikaya Bajji", category: "bonda_bajji", price: 45, description: "Raw banana slices dipped in batter and fried.", image: "assets/images/Aratikaya_Bajji.jpg", ingredients: ["Raw Banana", "Gram Flour"] },
    { id: 'b9', title: "Ullipaya Bajji", category: "bonda_bajji", price: 45, description: "Onion rings dipped in batter and fried.", image: "assets/images/Ullipaya_Bajji.png", ingredients: ["Onion Rings", "Gram Flour"] },

    // 4. Upma & Bath Varieties
    { id: 'u1', title: "Rava Upma", category: "upma_bath", price: 50, description: "Savory semolina porridge with veggies and nuts.", image: "assets/images/Rava_Upma.png", ingredients: ["Rava", "Veggies", "Cashews"] },
    { id: 'u2', title: "Semiya Upma", category: "upma_bath", price: 55, description: "Vermicelli noodles cooked with light spices.", image: "assets/images/Semiya_Upma.png", ingredients: ["Vermicelli", "Veggies"] },
    { id: 'u3', title: "Tomato Bath", category: "upma_bath", price: 60, description: "Tangy semolina cooked with tomato masala.", image: "assets/images/Tomato_Bath.jpg", ingredients: ["Tomato", "Rava", "Spices"] },
    { id: 'u4', title: "Khara Bath", category: "upma_bath", price: 60, description: "Spicy Karnataka style upma with vegetables.", image: "assets/images/kharabath.png", ingredients: ["Rava", "Vangi Bath Powder", "Veggies"] },
    { id: 'u5', title: "Kesari Bath", category: "upma_bath", price: 60, description: "Sweet saffron flavored semolina dessert (Sheera).", image: "assets/images/Kesari_Bath.png", ingredients: ["Rava", "Ghee", "Sugar", "Saffron"] },
    { id: 'u6', title: "Chow Chow Bath", category: "upma_bath", price: 90, description: "Combo of spicy Khara Bath and sweet Kesari Bath.", image: "assets/images/Chow_chow_bath.png", ingredients: ["Khara Bath", "Kesari Bath"] },
    { id: 'u7', title: "Godhuma Rava Upma", category: "upma_bath", price: 55, description: "Healthy broken wheat upma.", image: "assets/images/Godhuma_ravva_upma.png", ingredients: ["Broken Wheat", "Veggies"] },
    { id: 'u8', title: "Ven Pongal", category: "upma_bath", price: 70, description: "Peppery rice and lentil porridge cooked in ghee.", image: "assets/images/Ven_pongal.png", ingredients: ["Rice", "Moong Dal", "Pepper", "Ghee"] },
    { id: 'u9', title: "Sweet Pongal", category: "upma_bath", price: 75, description: "Rice and lentils cooked with jaggery and cardamom.", image: "assets/images/Sweet_pongal.png", ingredients: ["Rice", "Jaggery", "Cardamom"] },

    // 5. Rice Specials
    { id: 'r1', title: "Lemon Rice", category: "rice_specials", price: 60, description: "Tangy rice flavored with lemon and turmeric.", image: "assets/images/lemon_rice.png", ingredients: ["Lemon", "Peanuts", "Turmeric"] },
    { id: 'r2', title: "Tamarind Rice", category: "rice_specials", price: 65, description: "Traditional Puliyogare with tamarind paste.", image: "assets/images/Tamarind_rice.jpg", ingredients: ["Tamarind", "Peanuts", "Spices"] },
    { id: 'r3', title: "Curd Rice", category: "rice_specials", price: 50, description: "Cool yogurt rice tempered with mustard seeds.", image: "assets/images/Curd_rice_(daddojanam).png", ingredients: ["Curd", "Mustard", "Pomegranate"] },
    { id: 'r4', title: "Tomato Rice", category: "rice_specials", price: 60, description: "Spicy rice cooked with tomato masala.", image: "assets/images/Tomato_rice.jpg", ingredients: ["Tomato", "Spices", "Rice"] },
    { id: 'r5', title: "Bisi Bele Bath", category: "rice_specials", price: 75, description: "Spicy rice and lentil mash with veggies.", image: "assets/images/Bisi_bele_bath.jpg", ingredients: ["Rice", "Toor Dal", "Veggies", "Spices"] },
    { id: 'r6', title: "Vangi Bath", category: "rice_specials", price: 70, description: "Rice mixed with spiced brinjal (eggplant).", image: "assets/images/Vangi_bath.png", ingredients: ["Brinjal", "Vangi Bath Powder", "Rice"] },
    { id: 'r7', title: "Coconut Rice", category: "rice_specials", price: 65, description: "Rice flavored with fresh grated coconut & cashews.", image: "assets/images/Coconut_rice.png", ingredients: ["Coconut", "Cashews", "Curry Leaves"] },

    // 6. Beverages
    { id: 'dr1', title: "Filter Coffee", category: "beverages", price: 40, description: "Authentic South Indian filter coffee (Kaapi).", image: "assets/images/Filter_coffee.jpg", ingredients: ["Coffee Decoction", "Milk"] },
    { id: 'dr2', title: "Masala Chai", category: "beverages", price: 30, description: "Tea brewed with aromatic spices.", image: "assets/images/Masala chai or Tea.jpg", customClass: "chai-filter", ingredients: ["Ginger", "Cardamom", "Tea"] },
    { id: 'dr3', title: "Badam Milk", category: "beverages", price: 50, description: "Rich almond milk flavored with saffron.", image: "assets/images/Badam_milk.jpg", ingredients: ["Almonds", "Milk", "Saffron"] },
    { id: 'dr4', title: "Rose Milk", category: "beverages", price: 45, description: "Chilled milk with rose syrup.", image: "assets/images/Rose_milk.png", ingredients: ["Rose Syrup", "Milk"] },
    { id: 'dr5', title: "Masala Majjiga", category: "beverages", price: 30, description: "Spiced buttermilk with cilantro and ginger.", image: "assets/images/Masala_Majjiga.jpg", ingredients: ["Buttermilk", "Ginger", "Chilies"] },
    { id: 'dr6', title: "Sweet Lassi", category: "beverages", price: 40, description: "Thick sweet yogurt drink.", image: "assets/images/Sweet_Lassi.png", ingredients: ["Curd", "Sugar"] },
    { id: 'dr7', title: "Ragi Malt", category: "beverages", price: 40, description: "Nutritious finger millet drink.", image: "assets/images/Ragi_Malt.jpg", ingredients: ["Ragi Flour", "Milk/Buttermilk"] },
    { id: 'dr8', title: "Sugandha Water", category: "beverages", price: 20, description: "Sarpagandha root infused refreshing water.", image: "assets/images/Sugunda_Water.jpg", ingredients: ["Herbs", "Water"] }
];

// --- State ---
let cart = [];
let currentModalItem = null;
let modalQty = 1;

// --- DOM Elements ---
const menuGrid = document.getElementById('menu-grid');
const categoryBtns = document.querySelectorAll('.category-btn');
const searchInput = document.getElementById('menu-search'); // Search Bar ADDED

// Modal Elements
const modalOverlay = document.getElementById('item-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalIngredients = document.getElementById('modal-ingredients');
const modalMinus = document.getElementById('modal-minus');
const modalPlus = document.getElementById('modal-plus');
const modalQtyEl = document.getElementById('modal-qty');
const modalAddBtn = document.getElementById('modal-add-btn');

// Cart Elements
const cartToggle = document.getElementById('cart-toggle');
const cartCountEl = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const billSubtotal = document.getElementById('bill-subtotal');
const billTax = document.getElementById('bill-tax');
const billTotal = document.getElementById('bill-total');
const orderTypeBtns = document.querySelectorAll('.switch-option');

// Receipt Modal Elements (Added)
const receiptModal = document.getElementById('receipt-modal');
const closeReceiptBtn = document.getElementById('close-receipt');
// Receipt Modal Elements (Safe Selection)
const receiptDate = document.getElementById('receipt-date');
const receiptToken = document.getElementById('receipt-token');
const receiptMode = document.getElementById('receipt-mode');
const receiptBody = document.getElementById('receipt-body');
const receiptSubtotal = document.getElementById('receipt-subtotal');
const receiptTax = document.getElementById('receipt-tax');
const receiptTotal = document.getElementById('receipt-total');
const receiptPackingRow = document.getElementById('receipt-packing-row');
const receiptPacking = document.getElementById('receipt-packing');

// --- Functions ---

function getSteamEffect() {
    return `
        <div class="steam-container">
            <div class="steam-particle"></div>
            <div class="steam-particle"></div>
            <div class="steam-particle"></div>
        </div>
    `;
}


function getDishMeta(item) {
    const title = item.title.toLowerCase();
    const cat = item.category;

    let emoji = '😋';
    let tags = ['Veg']; // Base tag

    // --- Emoji Logic ---
    if (title.includes('masala') || title.includes('karam') || title.includes('chilli') || title.includes('spicy') || title.includes('555')) emoji = '🥵'; // Spicy
    else if (title.includes('sweet') || title.includes('mysore pak') || title.includes('payasam') || title.includes('kesari') || title.includes('badam')) emoji = '🤤'; // Sweet
    else if (title.includes('coffee') || title.includes('tea')) emoji = '😵'; // Caffeine
    else if (title.includes('ghee') || title.includes('butter') || title.includes('paneer') || title.includes('cashew')) emoji = '😋'; // Rich
    else if (cat === 'dosas') emoji = '🥞';
    else if (cat === 'idli_vada') {
        if (title.includes('vada')) emoji = '🍩';
        else emoji = '🍥';
    }
    else if (cat === 'rice_specials' || cat === 'upma_bath') emoji = '🍚';
    else if (cat === 'bonda_bajji') emoji = '🥣';
    else if (cat === 'beverages') emoji = '🥤';

    // --- Tags Logic ---
    if (title.includes('ghee') || title.includes('butter') || title.includes('roast') || title.includes('fry')) tags.push('Rich');
    if (title.includes('masala') || title.includes('spicy') || title.includes('karam') || title.includes('podi') || title.includes('mirchi')) tags.push('Spicy');
    if (title.includes('sweet') || title.includes('kesari') || title.includes('payasam') || title.includes('sugar')) tags.push('Sweet');

    // Texture/Category Tags
    if (cat === 'dosas') {
        if (title.includes('roast') || title.includes('paper')) tags.push('Crispy');
        else tags.push('Classic');
    }
    if (title.includes('idli') && !title.includes('fry')) tags.push('Steamed');
    if (title.includes('vada') || title.includes('bonda') || title.includes('bajji')) tags.push('Crispy');
    if (title.includes('rice') || title.includes('bath')) tags.push('Heavy');
    if (title.includes('coffee') || title.includes('tea')) tags.push('Hot');
    if (title.includes('juice') || title.includes('lassi') || title.includes('milk')) tags.push('Chilled');

    // Dedupe and Slice
    tags = [...new Set(tags)].slice(0, 3);

    return { emoji, tags };
}

function renderMenu(items) {
    if (!menuGrid) return;

    // Staggered Animation Delay Logic
    menuGrid.innerHTML = items.map((item, index) => {
        const delay = (index % 10) * 0.1; // Stagger first 10 items
        const meta = getDishMeta(item);

        return `
        <article class="menu-card" data-id="${item.id}" onclick="openModal('${item.id}')" style="animation-delay: ${delay}s">
            ${getSteamEffect()}
            <div class="motion-emoji">${meta.emoji}</div>
            
            <div class="card-image-container">
                <img src="${item.image}" alt="${item.title}" class="card-image ${item.customClass || ''}">
                
                <!-- Reveal Overlay -->
                <div class="card-overlay">
                    <div class="overlay-title">Taste Profile</div>
                    <div class="overlay-tags">
                        ${meta.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${item.title}</h3>
                    <span class="card-price">₹${item.price}</span>
                </div>
                <p class="card-description">${item.description}</p>
                <div class="card-footer">
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart('${item.id}', 1)">
                        +
                    </button>
                </div>
            </div>
        </article>
    `}).join('');
}

// --- Modal Logic ---

function openModal(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    currentModalItem = item;
    modalQty = 1;
    modalQtyEl.textContent = modalQty;

    modalImg.src = item.image;
    modalImg.className = `modal-img ${item.customClass || ''}`; // Apply custom filter if needed
    modalTitle.textContent = item.title;
    modalPrice.textContent = `₹${item.price}`;
    modalDesc.textContent = item.description;

    // Ingredients
    modalIngredients.innerHTML = item.ingredients.map(ing =>
        `<span class="ingredient-tag">${ing}</span>`
    ).join('');

    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

// --- Cart Logic ---

function addToCart(itemId, qty) {
    const existing = cart.find(i => i.itemId === itemId);
    const item = menuItems.find(i => i.id === itemId);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ itemId, quantity: qty });
    }

    updateCartUI();
    if (modalOverlay.classList.contains('active')) {
        closeModal();
    }

    // Animate cart toggle
    cartToggle.style.transform = 'scale(1.2)';
    setTimeout(() => cartToggle.style.transform = 'scale(1)', 200);
}

function updateCartItemQty(itemId, delta) {
    const itemIndex = cart.findIndex(i => i.itemId === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
    < div class="cart-empty-state" >
        <p>Your plate is empty! <br> Add some delicious tiffins.</p>
            </div > `;
    } else {
        cartItemsEl.innerHTML = cart.map(cartItem => {
            const product = menuItems.find(i => i.id === cartItem.itemId);
            return `
    < div class="cart-item" >
        <img src="${product.image}" class="cart-item-img ${product.customClass || ''}" alt="${product.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${product.title}</div>
                <div class="cart-item-price">₹${product.price * cartItem.quantity}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn-sm" onclick="updateCartItemQty('${product.id}', -1)">-</button>
                    <span>${cartItem.quantity}</span>
                    <button class="qty-btn-sm" onclick="updateCartItemQty('${product.id}', 1)">+</button>
                </div>
            </div>
        </div>
`;
        }).join('');
    }

    calculateBill();
}

// --- Checkout Logic ---

const PACKING_COST_PER_ITEM = 5;
let isTakeaway = false;

function calculateBill() {
    let subtotal = 0;
    let totalQty = 0;

    cart.forEach(cartItem => {
        const product = menuItems.find(i => i.id === cartItem.itemId);
        if (product) {
            subtotal += product.price * cartItem.quantity;
            totalQty += cartItem.quantity;
        }
    });

    const tax = Math.round(subtotal * 0.05); // 5% GST

    // Packing Logic
    let packingCharge = 0;
    // Sidebar Elements (DOM might be null on other pages)
    const sidebarPackingRow = document.getElementById('packing-row');
    const sidebarPackingEl = document.getElementById('bill-packing');

    if (isTakeaway) {
        packingCharge = totalQty * PACKING_COST_PER_ITEM;
        if (sidebarPackingRow) sidebarPackingRow.style.display = 'flex';
        if (sidebarPackingEl) sidebarPackingEl.textContent = `₹${packingCharge} `;
    } else {
        if (sidebarPackingRow) sidebarPackingRow.style.display = 'none';
        packingCharge = 0;
    }

    const total = subtotal + tax + packingCharge;

    const billSubtotal = document.getElementById('bill-subtotal');
    const billTax = document.getElementById('bill-tax');
    const billTotal = document.getElementById('bill-total');

    if (billSubtotal) billSubtotal.textContent = `₹${subtotal} `;
    if (billTax) billTax.textContent = `₹${tax} `;
    if (billTotal) billTotal.textContent = `₹${total} `;

    return { subtotal, tax, packingCharge, total };
}

function generateReceipt() {
    const { subtotal, tax, packingCharge, total } = calculateBill();

    // 1. Generate Robust Token
    // Format: #ORD-MMDD-XXXX (MonthDay-Random)
    const now = new Date();
    const dateStr = (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000); // Always 4 digits
    const orderId = `#ORD - ${dateStr} -${randomPart} `;

    // Header Info
    receiptDate.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    receiptToken.textContent = orderId;
    receiptMode.textContent = isTakeaway ? 'Takeaway' : 'Dine-in';

    // Items
    receiptBody.innerHTML = cart.map(cartItem => {
        const product = menuItems.find(i => i.id === cartItem.itemId);
        return `
    < div class="receipt-item" >
                <span>${product.title} x${cartItem.quantity}</span>
                <span>₹${product.price * cartItem.quantity}</span>
            </div >
    `;
    }).join('');

    // Summary
    receiptSubtotal.textContent = `₹${subtotal} `;
    receiptTax.textContent = `₹${tax} `;
    receiptTotal.textContent = `₹${total} `;

    if (isTakeaway) {
        receiptPackingRow.style.display = 'flex';
        receiptPacking.textContent = `₹${packingCharge} `;
    } else {
        receiptPackingRow.style.display = 'none';
    }

    // 2. Save Order to LocalStorage
    const newOrder = {
        id: orderId,
        date: now.toISOString(),
        items: cart.map(c => {
            const p = menuItems.find(i => i.id === c.itemId);
            return { title: p.title, qty: c.quantity, price: p.price };
        }),
        total: total,
        status: 'Pending', // Initial status
        mode: isTakeaway ? 'Takeaway' : 'Dine-in'
    };

    const existingOrders = JSON.parse(localStorage.getItem('dosaHouseOrders') || '[]');
    existingOrders.unshift(newOrder); // Add to top
    localStorage.setItem('dosaHouseOrders', JSON.stringify(existingOrders));

    // Show Modal
    receiptModal.classList.add('active');
}

// Receipt Closing
if (closeReceiptBtn) {
    closeReceiptBtn.onclick = () => {
        receiptModal.classList.remove('active');
        cart = [];
        updateCartUI();
        cartSidebar.classList.remove('active');
    };
}

// --- Event Listeners (Unified & Safe) ---

// Initialize
renderMenu(menuItems);

// 1. Filtering & Search
// Helper to reset category active state
function resetCategoryActive() {
    categoryBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
}

// Search Logic
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        // Reset category visuals if searching
        if (term.length > 0) resetCategoryActive();

        const filtered = menuItems.filter(item =>
            item.title.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term)
        );
        renderMenu(filtered);
    });
}

// Category Logic
categoryBtns.forEach(btn => {
    btn.onclick = () => {
        // Clear search if category clicked
        if (searchInput) searchInput.value = '';

        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        if (category === 'all') {
            renderMenu(menuItems);
        } else {
            const filtered = menuItems.filter(item => item.category === category);
            renderMenu(filtered);
        }
    };
});

// 2. Modal Events
if (modalCloseBtn) modalCloseBtn.onclick = closeModal;
if (modalOverlay) modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
};

if (modalMinus) modalMinus.onclick = () => {
    if (modalQty > 1) {
        modalQty--;
        modalQtyEl.textContent = modalQty;
    }
};

if (modalPlus) modalPlus.onclick = () => {
    modalQty++;
    modalQtyEl.textContent = modalQty;
};

if (modalAddBtn) modalAddBtn.onclick = () => {
    if (currentModalItem) {
        addToCart(currentModalItem.id, modalQty);
    }
};

// 3. Cart Events
if (cartToggle) cartToggle.onclick = () => {
    cartSidebar.classList.add('active');
};

if (closeCartBtn) closeCartBtn.onclick = () => {
    cartSidebar.classList.remove('active');
};

// 4. Order Type Toggle
orderTypeBtns.forEach(btn => {
    btn.onclick = () => {
        orderTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update State
        isTakeaway = btn.dataset.type === 'takeaway';
        calculateBill(); // Recalculate immediately
    };
});

// 5. Checkout Button Logic
const checkoutBtn = document.querySelector('.btn-checkout');
if (checkoutBtn) {
    checkoutBtn.onclick = () => {
        if (cart.length === 0) {
            alert("Your plate is empty! Add some delicious items first. 🍛");
            return;
        }

        generateReceipt();
    };
}



