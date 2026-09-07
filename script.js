// SMALLBATCH B2B MVP LOGIC
const app = {
    categories: ['Oversized T-Shirts', 'Hoodies', 'Polo T-Shirts', 'Activewear', 'Custom Apparel', 'Caps'],
    
    products: [
        {
            id: 'p1',
            title: 'Premium Oversized Drop-Shoulder T-Shirt',
            spec: '240 GSM • 100% French Terry Cotton',
            moq: 50,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
            supplier: 'ABC Textiles',
            location: 'Tiruppur, India',
            rating: 4.8,
            completedOrders: 126,
            pricing: [
                { min: 50, max: 99, price: 249 },
                { min: 100, max: 499, price: 239 },
                { min: 500, max: null, price: 215 }
            ]
        },
        {
            id: 'p2',
            title: 'Heavyweight Winter Hoodie',
            spec: '320 GSM • Fleece Inside',
            moq: 20,
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
            supplier: 'Loom & Thread Mfg',
            location: 'Ludhiana, India',
            rating: 4.9,
            completedOrders: 310,
            pricing: [
                { min: 20, max: 99, price: 599 },
                { min: 100, max: 299, price: 549 },
                { min: 300, max: null, price: 499 }
            ]
        },
        {
            id: 'p3',
            title: 'Performance Activewear Dry-Fit T-Shirt',
            spec: '160 GSM • Spandex Blend',
            moq: 100,
            image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400',
            supplier: 'Velocity Garments',
            location: 'Delhi, India',
            rating: 4.6,
            completedOrders: 89,
            pricing: [
                { min: 100, max: 499, price: 180 },
                { min: 500, max: 999, price: 165 },
                { min: 1000, max: null, price: 150 }
            ]
        },
        {
            id: 'p4',
            title: 'Classic Polo T-Shirt (Blank)',
            spec: '220 GSM • Pique Cotton',
            moq: 50,
            image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=400',
            supplier: 'ABC Textiles',
            location: 'Tiruppur, India',
            rating: 4.8,
            completedOrders: 126,
            pricing: [
                { min: 50, max: 199, price: 280 },
                { min: 200, max: null, price: 260 }
            ]
        }
    ],

    currentProduct: null,
    currentQuantity: 0,

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderCategories();
        this.renderProducts(this.products);
    },

    cacheDOM() {
        this.menuToggle = document.getElementById('menuToggle');
        this.closeMenu = document.getElementById('closeMenu');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.categoryScroller = document.getElementById('categoryScroller');
        this.productGrid = document.getElementById('productGrid');
        
        this.modalOverlay = document.getElementById('productModalOverlay');
        this.closeModalBtn = document.getElementById('closeProductModal');
        this.modalScrollArea = document.getElementById('modalScrollArea');
        this.summaryTotal = document.getElementById('summaryTotal');
        this.toast = document.getElementById('toast');
        this.searchInput = document.getElementById('searchInput');
    },

    bindEvents() {
        this.menuToggle.addEventListener('click', () => this.mobileMenu.classList.add('active'));
        this.closeMenu.addEventListener('click', () => this.mobileMenu.classList.remove('active'));
        
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if(e.target === this.modalOverlay) this.closeModal();
        });

        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    },

    renderCategories() {
        this.categoryScroller.innerHTML = this.categories.map(cat => 
            `<button class="cat-card">${cat}</button>`
        ).join('');
    },

    renderProducts(productsToRender) {
        if(productsToRender.length === 0) {
            this.productGrid.innerHTML = `<div class="w-100 text-center" style="grid-column: 1/-1; padding: 48px;">No products found matching your criteria.</div>`;
            return;
        }

        this.productGrid.innerHTML = productsToRender.map(product => `
            <article class="prod-card" onclick="app.openProductModal('${product.id}')">
                <img src="${product.image}" alt="${product.title}" class="prod-img" loading="lazy">
                <div class="prod-info">
                    <span class="prod-moq">MOQ: ${product.moq} pcs</span>
                    <h3 class="prod-title">${product.title}</h3>
                    <span class="prod-spec">${product.spec}</span>
                    <span class="prod-price">₹${product.pricing[0].price} / pc</span>
                    <span class="prod-supplier">✓ SmallBatch Verified</span>
                </div>
            </article>
        `).join('');
    },

    handleSearch(query) {
        const lowerQuery = query.toLowerCase();
        const filtered = this.products.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) || 
            p.spec.toLowerCase().includes(lowerQuery)
        );
        this.renderProducts(filtered);
    },

    openProductModal(productId) {
        this.currentProduct = this.products.find(p => p.id === productId);
        this.currentQuantity = this.currentProduct.moq;
        
        this.buildModalContent();
        this.updatePricing();
        
        document.body.style.overflow = 'hidden'; 
        this.modalOverlay.classList.add('active');
    },

    closeModal() {
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    buildModalContent() {
        const p = this.currentProduct;
        
        const tiersHTML = p.pricing.map(tier => {
            const maxLabel = tier.max ? `${tier.max}` : '+';
            return `<div class="tier-item" id="tier-${tier.min}">
                <span>${tier.min} - ${maxLabel} pcs</span>
                <span>₹${tier.price}/pc</span>
            </div>`;
        }).join('');

        this.modalScrollArea.innerHTML = `
            <img src="${p.image}" alt="${p.title}" class="modal-img">
            <span class="prod-supplier" style="margin-bottom: 8px;">✓ SmallBatch Verified</span>
            <h2 class="modal-title">${p.title}</h2>
            <p class="prod-spec" style="font-size: 1rem;">${p.spec}</p>
            
            <div class="calc-container">
                <div class="calc-header">
                    <span>Order Quantity</span>
                    <span style="color: var(--text-secondary); font-size: 0.875rem;">MOQ: ${p.moq}</span>
                </div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="app.updateQty(-10)">-</button>
                    <input type="number" class="qty-input" id="qtyInput" value="${this.currentQuantity}" onchange="app.handleManualQty(this.value)">
                    <button class="qty-btn" onclick="app.updateQty(10)">+</button>
                </div>
                <div class="tier-list">
                    ${tiersHTML}
                </div>
            </div>

            <div class="supplier-card">
                <div class="sup-avatar">${p.supplier.charAt(0)}</div>
                <div>
                    <h4 style="font-size: 1rem;">${p.supplier}</h4>
                    <div class="sup-meta">
                        ${p.location} • ${p.rating} ★ (${p.completedOrders} orders)
                    </div>
                </div>
            </div>

            <button class="btn btn-outline w-100" onclick="app.showToast('Sample request added to cart!')">Order a Sample</button>
        `;
    },

    updateQty(change) {
        let newQty = this.currentQuantity + change;
        if (newQty < this.currentProduct.moq) newQty = this.currentProduct.moq;
        this.currentQuantity = newQty;
        document.getElementById('qtyInput').value = this.currentQuantity;
        this.updatePricing();
    },

    handleManualQty(val) {
        let parsed = parseInt(val);
        if (isNaN(parsed) || parsed < this.currentProduct.moq) parsed = this.currentProduct.moq;
        this.currentQuantity = parsed;
        document.getElementById('qtyInput').value = this.currentQuantity;
        this.updatePricing();
    },

    updatePricing() {
        const p = this.currentProduct;
        let currentPrice = p.pricing[0].price;
        let activeTierId = `tier-${p.pricing[0].min}`;

        for (let tier of p.pricing) {
            if (this.currentQuantity >= tier.min) {
                currentPrice = tier.price;
                activeTierId = `tier-${tier.min}`;
            }
        }

        document.querySelectorAll('.tier-item').forEach(el => el.classList.remove('active'));
        const activeTierEl = document.getElementById(activeTierId);
        if(activeTierEl) activeTierEl.classList.add('active');

        const total = this.currentQuantity * currentPrice;
        this.summaryTotal.innerText = '₹' + total.toLocaleString('en-IN');
    },

    showToast(message) {
        this.toast.innerText = message;
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());