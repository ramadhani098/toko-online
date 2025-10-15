// File: script.js (Gabungan Lengkap)

document.addEventListener('DOMContentLoaded', () => {
    // --- State & Konfigurasi Global ---
    let products = [];
    let cart = [];
    const API_URL = 'https://fakestoreapi.com/products';
    const IDR_RATE = 15000; 
    const WHATSAPP_NUMBER = '6285784269994'; 

    // --- Elemen DOM ---
    const productGrid = document.getElementById('product-grid');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const noResultsMessage = document.getElementById('no-results-message');
    const cartCount = document.getElementById('cart-count');
    const toastContainer = document.getElementById('toast-container');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const categoryFilter = document.getElementById('category-filter'); 

    // Elemen Modal Detail
    const modal = document.getElementById('productModal');
    const modalContent = modal.querySelector('.modal-content');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalImage = document.getElementById('modal-image');
    const modalCategory = document.getElementById('modal-category');
    const modalProductName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');

    // Elemen Cart Sidebar
    const openCartBtn = document.getElementById('openCartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    const totalItemsCheckout = document.getElementById('total-items-checkout');
    const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
    const emptyMessage = document.getElementById('empty-cart-message'); // Pesan keranjang kosong

    // Elemen Form Pengiriman
    const shippingForm = document.getElementById('shipping-form');
    const namaPenerimaInput = document.getElementById('nama-penerima');
    const nomorHpInput = document.getElementById('nomor-hp');
    const alamatLengkapInput = document.getElementById('alamat-lengkap');
    
    // Elemen Form Footer
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmailInput = document.getElementById('newsletter-email');
    const contactForm = document.getElementById('contact-form');
    const contactNameInput = document.getElementById('contact-name');
    const contactEmailInput = document.getElementById('contact-email');
    const contactMessageInput = document.getElementById('contact-message'); // textarea di footer

    // --- Functions ---

    /** Konversi Harga USD ke IDR */
    function formatPrice(priceUSD) {
        // Konversi ke IDR dan format rupiah
        return `Rp ${Math.round(priceUSD * IDR_RATE).toLocaleString('id-ID')}`;
    }

    /** Menampilkan Notifikasi Toast */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        let colorClass = '';
        let icon = '';

        if (type === 'success') {
            colorClass = 'bg-primary-dark text-white'; 
            icon = '<i class="fas fa-check-circle mr-2"></i>';
        } else if (type === 'error') {
            colorClass = 'bg-red-600 text-white';
            icon = '<i class="fas fa-exclamation-triangle mr-2"></i>';
        } else {
            colorClass = 'bg-accent text-white'; 
            icon = '<i class="fas fa-info-circle mr-2"></i>';
        }
        
        toast.className = `toast-notification ${colorClass} px-5 py-3 rounded-xl shadow-xl flex items-center mb-2 font-medium transition-all duration-300 transform opacity-0 translate-y-2`;
        toast.innerHTML = icon + message;
        toastContainer.appendChild(toast);

        // Animasi masuk
        setTimeout(() => {
            toast.classList.remove('opacity-0', 'translate-y-2');
        }, 10);
        
        // Animasi keluar
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3500); 
    }

    /** Mengambil produk dari Fake Store API */
    async function fetchProducts() {
        loader.style.display = 'block';
        productGrid.innerHTML = '';
        errorMessage.classList.add('hidden');
        noResultsMessage.classList.add('hidden'); 
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            populateCategories(products);
            filterAndDisplayProducts();
        } catch (error) {
            console.error("Gagal mengambil produk:", error);
            errorMessage.classList.remove('hidden');
        } finally {
            loader.style.display = 'none';
        }
    }

    /** Mengisi dropdown kategori */
    function populateCategories(products) {
        const categories = [...new Set(products.map(p => p.category))];
        categoryFilter.innerHTML = '<option value="all">Semua Produk</option>'; 
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }

    /** Menerapkan semua filter (Search dan Category) */
    function filterAndDisplayProducts() {
        const searchQuery = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        
        let filteredProducts = products;

        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            filteredProducts = filteredProducts.filter(product => {
                const title = product.title.toLowerCase();
                const description = product.description.toLowerCase();
                return title.includes(searchQuery) || description.includes(searchQuery);
            });
        }
        
        clearSearchBtn.classList.toggle('hidden', !searchQuery);
        displayProducts(filteredProducts);
    }
    
    /** Menampilkan produk di dalam grid */
    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = ''; 
        noResultsMessage.classList.add('hidden');

        if (productsToDisplay.length === 0) {
            noResultsMessage.classList.remove('hidden');
            return;
        }

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            // ... (HTML card logic sama seperti sebelumnya)
            const rating = product.rating ? product.rating.rate : (Math.random() * (5 - 3) + 3).toFixed(1);
            const isExclusive = product.price > 100;

            let badgeHtml = '';
            if (isExclusive) {
                badgeHtml = `
                    <div class="absolute top-4 left-0 bg-accent text-white px-3 py-1 text-xs font-bold uppercase rounded-r-lg shadow-lg rotate-[-1deg] transform transition-transform duration-300 hover:scale-110">
                        <i class="fas fa-crown mr-1"></i> EKSKLUSIF
                    </div>
                `;
            }

            productCard.className = 'product-card bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl transition duration-300 transform hover:-translate-y-1';
            productCard.dataset.productId = product.id;
            
            productCard.innerHTML = `
                ${badgeHtml}
                <div class="p-6 bg-gray-100 h-64 flex items-center justify-center">
                    <img src="${product.image}" alt="${product.title}" class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105">
                </div>
                <div class="p-5 border-t border-gray-100 flex flex-col flex-grow">
                    <span class="text-xs font-semibold text-gray-500 capitalize">${product.category}</span>
                    <h3 class="text-xl font-extrabold text-gray-800 mt-2 mb-3 flex-grow leading-tight">${product.title.substring(0, 50)}${product.title.length > 50 ? '...' : ''}</h3>
                    <div class="flex items-center text-sm text-yellow-500 mb-4">
                        <i class="fas fa-star mr-1"></i>
                        <span class="font-bold">${rating}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-2xl font-extrabold text-accent">${formatPrice(product.price)}</p>
                        <button class="add-to-cart-btn bg-primary text-white hover:bg-primary-dark rounded-xl w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-md shadow-primary/30 transform hover:scale-110" data-product-id="${product.id}">
                            <i class="fas fa-plus text-xl pointer-events-none"></i>
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    // FUNGSI MODAL
    function showProductDetail(productId) {
        const product = products.find(p => p.id == productId);
        if (!product) return;
        // ... (Logika pengisian modal)
        modalImage.src = product.image;
        modalCategory.textContent = product.category;
        modalProductName.textContent = product.title;
        modalPrice.textContent = formatPrice(product.price);
        modalDescription.textContent = product.description;
        modalAddToCartBtn.dataset.productId = product.id; 
        
        modal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.add('scale-100', 'opacity-100'); // Animasi masuk
            modalContent.classList.remove('scale-95', 'opacity-0');
        }, 10); 
        document.body.style.overflow = 'hidden'; 
    }

    function hideModal() {
        modalContent.classList.add('scale-95', 'opacity-0'); // Animasi keluar
        modalContent.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 400); 
        document.body.style.overflow = 'auto';
    }

    // FUNGSI CART
    function openCart() {
        renderCartItems(); 
        cartSidebar.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden'; 
    }

    function closeCart() {
        cartSidebar.style.transform = 'translateX(100%)';
        document.body.style.overflow = 'auto';
    }
    
    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            const existingItem = cart.find(item => item.id == productId);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id: product.id, qty: 1 });
            }
            updateCartCounter();
            renderCartItems();
            showToast(`"${product.title.substring(0, 25)}..." +1 ditambahkan!`, 'success');
        }
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id != productId);
        updateCartCounter();
        renderCartItems();
        showToast('Item berhasil dihapus dari keranjang.', 'info');
    }

    function updateQuantity(productId, newQty) {
        if (newQty < 1) {
            removeFromCart(productId);
            return;
        }
        const item = cart.find(i => i.id == productId);
        if (item) {
            item.qty = newQty;
            renderCartItems();
        }
        updateCartCounter();
    }

    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalItems;
        // Animasi wiggle saat diupdate
        cartCount.classList.remove('animate-wiggle-once');
        void cartCount.offsetWidth; 
        cartCount.classList.add('animate-wiggle-once');
    }
    
    /** Merender item yang ada di keranjang ke Cart Sidebar (Tampilan Premium) */
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            emptyMessage.classList.remove('hidden');
            cartTotal.textContent = formatPrice(0);
            totalItemsCheckout.textContent = 0;
            whatsappCheckoutBtn.disabled = true;
            whatsappCheckoutBtn.classList.add('opacity-50', 'cursor-not-allowed', 'shadow-none');
            return;
        }

        emptyMessage.classList.add('hidden');
        whatsappCheckoutBtn.disabled = false;
        whatsappCheckoutBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'shadow-none');


        cart.forEach(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (product) {
                const priceIDR = Math.round(product.price * IDR_RATE);
                const itemTotal = priceIDR * cartItem.qty;
                total += itemTotal;
                totalItems += cartItem.qty;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300';
                cartItemElement.innerHTML = `
                    <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg p-1 border border-gray-200 flex items-center justify-center shadow-inner">
                        <img src="${product.image}" alt="${product.title}" class="max-w-full max-h-full object-contain rounded-md">
                    </div>
                    
                    <div class="flex-grow">
                        <h4 class="text-md font-extrabold text-gray-800 mb-1 leading-snug">${product.title.substring(0, 45)}${product.title.length > 45 ? '...' : ''}</h4>
                        <p class="text-xs font-semibold text-gray-500 capitalize">${product.category}</p>
                        
                        <div class="mt-2 flex items-center justify-between">
                            <p class="text-lg font-extrabold text-primary-dark">${formatPrice(product.price)}</p>
                            
                            <div class="flex items-center space-x-2">
                                <input type="number" min="1" value="${cartItem.qty}" data-product-id="${product.id}"
                                    class="qty-input w-16 text-center border-2 border-accent/50 rounded-lg p-1 font-bold text-gray-700 focus:ring-primary focus:border-primary transition shadow-inner">
                                <button class="remove-from-cart-btn text-red-500 hover:text-red-700 transition font-semibold text-sm p-1 rounded-full hover:bg-red-50" data-product-id="${product.id}" title="Hapus Item">
                                    <i class="fas fa-trash-can text-lg pointer-events-none"></i>
                                </button>
                            </div>
                        </div>

                        <div class="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                            <span class="text-sm font-semibold text-gray-500">Subtotal:</span>
                            <span class="text-xl font-extrabold text-accent">${formatPrice(itemTotal / IDR_RATE)}</span>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            }
        });
        
        cartTotal.textContent = formatPrice(total / IDR_RATE); 
        totalItemsCheckout.textContent = totalItems;
    }

    /** Menghasilkan pesan teks format untuk WhatsApp DENGAN DATA FORM */
    function generateWhatsAppMessage(shippingData) {
        if (cart.length === 0) return '';

        let total = 0;
        let itemCounter = 1;
        
        // Bagian Detail Pengiriman
        let message = `🛍️ *ORDER EKSKLUSIF - TokoPremium* 💎\n\n`;
        message += `*=============================*\n`;
        message += `*DETAIL PENGIRIMAN*\n`;
        message += `Nama: ${shippingData.name}\n`;
        message += `No. HP: ${shippingData.phone}\n`;
        message += `Alamat: ${shippingData.address}\n`;
        message += `*=============================*\n\n`;

        message += `Saya tertarik untuk membeli item berikut:\n\n`;

        // Bagian Item Pesanan
        cart.forEach(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (product) {
                const priceIDR = Math.round(product.price * IDR_RATE);
                const subtotal = priceIDR * cartItem.qty;
                total += subtotal;

                message += `*${itemCounter}. ${product.title.substring(0, 50)}...*\n`;
                message += `   - Qty: ${cartItem.qty}\n`;
                message += `   - Harga Satuan: ${formatPrice(product.price)}\n`;
                message += `   - Subtotal: ${formatPrice(subtotal / IDR_RATE)}\n`;
                message += `------------------------------------\n`;
                itemCounter++;
            }
        });

        message += `\n*TOTAL PESANAN: ${formatPrice(total / IDR_RATE)}*\n\n`;
        message += `Mohon bantu proses pesanan saya. Terima kasih banyak! ✨`;

        return encodeURIComponent(message);
    }

    /** Membuka tautan WhatsApp setelah memverifikasi form */
    function initiateWhatsAppCheckout() {
        if (cart.length === 0) {
            showToast('Keranjang Anda kosong. Tambahkan produk dulu!', 'info');
            return;
        }

        // 1. Verifikasi Formulir Pengiriman
        if (!namaPenerimaInput.value || !nomorHpInput.value || !alamatLengkapInput.value) {
            showToast('⚠️ Harap lengkapi semua Detail Pengiriman!', 'error');
            // Menandai input yang kosong
            if (!namaPenerimaInput.value) namaPenerimaInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
            if (!nomorHpInput.value) nomorHpInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
            if (!alamatLengkapInput.value) alamatLengkapInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
            return;
        }

        // Hapus penanda error jika form sudah terisi
        const errorClasses = ['border-red-500', 'ring-2', 'ring-red-500'];
        namaPenerimaInput.classList.remove(...errorClasses);
        nomorHpInput.classList.remove(...errorClasses);
        alamatLengkapInput.classList.remove(...errorClasses);


        // 2. Kumpulkan data pengiriman
        const shippingData = {
            name: namaPenerimaInput.value,
            phone: nomorHpInput.value,
            address: alamatLengkapInput.value,
        };

        // 3. Generate pesan dan buka WhatsApp
        const message = generateWhatsAppMessage(shippingData);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        closeCart();
        
        // 4. Reset form pengiriman setelah checkout
        shippingForm.reset();
        showToast('Tautan WhatsApp berhasil dibuka! Pesan sudah terisi otomatis.', 'success');
    }

    // --- Event Listeners ---

    // 1. Event listeners Filter dan Search
    searchInput.addEventListener('input', filterAndDisplayProducts);
    categoryFilter.addEventListener('change', filterAndDisplayProducts);
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterAndDisplayProducts(); 
    });

    // 2. Event listeners Product Grid (Add to Cart via button, Show Detail via card click)
    productGrid.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const productId = addToCartBtn.dataset.productId;
            addToCart(productId);
            return; 
        }

        const card = e.target.closest('.product-card');
        if (card) {
            const productId = card.dataset.productId;
            showProductDetail(productId);
        }
    });

    // 3. Event listeners Modal Detail
    modalAddToCartBtn.addEventListener('click', () => {
         const productId = modalAddToCartBtn.dataset.productId;
         addToCart(productId);
         hideModal();
    });

    closeModalBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });
    
    // 4. Event listeners Cart Sidebar
    openCartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    whatsappCheckoutBtn.addEventListener('click', initiateWhatsAppCheckout);

    // Update Quantity and Remove Item
    cartItemsContainer.addEventListener('change', (e) => {
        const qtyInput = e.target.closest('.qty-input');
        if (qtyInput) {
            const productId = qtyInput.dataset.productId;
            const newQty = parseInt(qtyInput.value);
            updateQuantity(productId, newQty);
        }
    });
    cartItemsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-from-cart-btn');
        if (removeBtn) {
            const productId = removeBtn.dataset.productId;
            removeFromCart(productId);
        }
    });

    // 5. Event listeners Form Pengiriman
    shippingForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            // Menghapus kelas error saat input berubah
            input.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
        });
    });

    // 6. Event listener Form Kontak (Footer)
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const nameValue = contactNameInput.value.trim();
        const emailValue = contactEmailInput.value.trim();
        const messageValue = contactMessageInput.value.trim(); 
        
        if (!nameValue || !emailValue || !messageValue || !emailValue.includes('@')) {
            showToast('⚠️ Harap isi Nama, Email, dan Pesan dengan benar.', 'error');
            if (!nameValue) contactNameInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
            if (!emailValue) contactEmailInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
            if (!messageValue) contactMessageInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
            return;
        }

        showToast(`Pesan dari ${nameValue} berhasil terkirim! Kami akan segera menghubungi Anda. 👍`, 'success');
        
        contactForm.reset();
        contactNameInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
        contactEmailInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
        contactMessageInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
    });
    
    // 7. Event listener Form Newsletter (Footer)
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const emailValue = newsletterEmailInput.value.trim();

        if (!emailValue || !emailValue.includes('@') || !emailValue.includes('.')) {
            showToast('⚠️ Masukkan alamat email yang valid!', 'error');
            newsletterEmailInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
            return;
        }

        showToast(`Terima kasih! Email ${emailValue} terdaftar untuk berita premium. 📧`, 'success');
        
        newsletterForm.reset();
        newsletterEmailInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
    });

    // 8. Event listener untuk menghapus penanda error pada newsletter input
    newsletterEmailInput.addEventListener('input', () => {
        newsletterEmailInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
    });

    // --- Pemuatan Awal ---
    fetchProducts();
    updateCartCounter();
});
