// DATA MENU KANTIN & TEFA SMKN 6 PEKANBARU
const menuData = [
    {
        id: 1,
        name: "Ayam Geprek Sambal Ijo",
        category: "makanan",
        price: 13000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80",
        badge: "Favorit Siswa",
        desc: "Ayam krispi digeprek dengan sambal cabai ijo khas racikan siswa Boga SMKN 6."
    },
    {
        id: 2,
        name: "Es Teh Solo Segar",
        category: "minuman",
        price: 4000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80",
        badge: "Segar",
        desc: "Seduhan teh wangi manis melati dingin segar untuk menghilangkan haus."
    },
    {
        id: 3,
        name: "Roti Cokelat Lumer TEFA",
        category: "camilan",
        price: 6000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
        badge: "Produksi Boga",
        desc: "Roti empuk lembut buatan unit Teaching Factory Boga SMKN 6 Pekanbaru."
    },
    {
        id: 4,
        name: "Nasi Goreng Spesial Boga",
        category: "makanan",
        price: 12000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=80",
        badge: "Lengkap",
        desc: "Nasi goreng gurih dengan topping telur, suwiran ayam, dan kerupuk."
    },
    {
        id: 5,
        name: "Es Matcha Latte",
        category: "minuman",
        price: 8000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80",
        badge: "Kekinian",
        desc: "Minuman matcha susu creamy buatan siswa jurusan boga."
    },
    {
        id: 6,
        name: "Donat Gula Halus (Isi 3)",
        category: "camilan",
        price: 5000,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80",
        badge: "Hemat",
        desc: "Donat kentang lembut ditaburi gula halus manis pas."
    }
];

// App State
let cart = JSON.parse(localStorage.getItem('smk6_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('smk6_wishlist')) || [];
let currentCategory = 'all';
let activeDiscount = 0;
let selectedProductForDetail = null;

// Ganti dengan nomor WhatsApp pengelola Kantin / TEFA SMKN 6 Pekanbaru
const WHATSAPP_NUMBER = "6287862227946";
const OPEN_HOUR = 7;   // Buka jam 07:30
const CLOSE_HOUR = 16; // Tutup jam 16:00

document.addEventListener('DOMContentLoaded', () => {
    renderMenu(menuData);
    updateCartUI();
    loadSavedCustomerData();
    checkStoreStatus();
});

// Cek Jam Operasional Kantin Sekolah
function checkStoreStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const storeStatusEl = document.getElementById('storeStatus');
    const statusText = document.getElementById('statusText');

    if (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR) {
        storeStatusEl.className = 'store-status open';
        statusText.innerText = 'Kantin Buka';
    } else {
        storeStatusEl.className = 'store-status closed';
        statusText.innerText = 'Tutup (Buka 07:30 WIB)';
    }
}

function renderMenu(items) {
    const container = document.getElementById('menuContainer');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">Menu tidak ditemukan...</p>`;
        return;
    }

    items.forEach((item) => {
        const isLiked = wishlist.includes(item.id) ? 'liked' : '';
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-wrapper" onclick="openDetailModal(${item.id})">
                <span class="badge">${item.badge}</span>
                <button class="wishlist-btn ${isLiked}" onclick="event.stopPropagation(); toggleWishlist(${item.id}, this)">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="card-details">
                <div class="rating"><i class="fa-solid fa-star"></i> ${item.rating}</div>
                <h3 onclick="openDetailModal(${item.id})">${item.name}</h3>
                <p class="desc">${item.desc}</p>
                <div class="card-footer">
                    <div class="price">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <button class="btn-add" onclick="openDetailModal(${item.id})">
                        <i class="fa-solid fa-plus"></i> Pesan
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(category, element) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    applyFilters();
}

function filterMenu() { applyFilters(); }

function applyFilters() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const sortValue = document.getElementById('sortMenu').value;

    let filtered = menuData.filter(item => {
        const matchesCategory = (currentCategory === 'all') || (item.category === currentCategory);
        const matchesSearch = item.name.toLowerCase().includes(searchText) || item.desc.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    renderMenu(filtered);
}

function toggleWishlist(id, btn) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        btn.classList.remove('liked');
        showToast('Dihapus dari menu favorit');
    } else {
        wishlist.push(id);
        btn.classList.add('liked');
        showToast('Ditambahkan ke menu favorit!');
    }
    localStorage.setItem('smk6_wishlist', JSON.stringify(wishlist));
}

// MODAL DETAIL PRODUK
function openDetailModal(id) {
    selectedProductForDetail = menuData.find(m => m.id === id);
    if (!selectedProductForDetail) return;

    document.getElementById('modalTitle').innerText = selectedProductForDetail.name;
    document.getElementById('modalImage').src = selectedProductForDetail.image;
    document.getElementById('modalDesc').innerText = selectedProductForDetail.desc;
    document.getElementById('modalPrice').innerText = `Rp ${selectedProductForDetail.price.toLocaleString('id-ID')}`;

    const isDrink = selectedProductForDetail.category === 'minuman';
    document.getElementById('spicyGroup').style.display = isDrink ? 'none' : 'block';
    document.getElementById('toppingGroup').style.display = isDrink ? 'none' : 'block';

    document.getElementById('spicyLevel').value = 'Sedang';
    document.getElementById('topEgg').checked = false;
    document.getElementById('topCheese').checked = false;

    document.getElementById('btnAddToCartCustom').onclick = () => addToCartFromModal();
    document.getElementById('productDetailModal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('productDetailModal').classList.remove('active');
}

function addToCartFromModal() {
    if (!selectedProductForDetail) return;

    let extraPrice = 0;
    let customNotes = [];

    const isDrink = selectedProductForDetail.category === 'minuman';
    if (!isDrink) {
        const spicy = document.getElementById('spicyLevel').value;
        if (spicy === 'Pedas Banget') extraPrice += 1000;
        customNotes.push(`Pedas: ${spicy}`);

        if (document.getElementById('topEgg').checked) {
            extraPrice += 2000;
            customNotes.push('Extra Telur');
        }
        if (document.getElementById('topCheese').checked) {
            extraPrice += 1000;
            customNotes.push('Extra Sambal');
        }
    }

    const finalPrice = selectedProductForDetail.price + extraPrice;
    const itemTitle = selectedProductForDetail.name + (customNotes.length > 0 ? ` (${customNotes.join(', ')})` : '');

    const existingIndex = cart.findIndex(c => c.title === itemTitle);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({
            id: selectedProductForDetail.id,
            title: itemTitle,
            price: finalPrice,
            qty: 1
        });
    }

    saveCart();
    updateCartUI();
    closeDetailModal();
    showToast(`${selectedProductForDetail.name} masuk keranjang!`);
}

// KELOLA KERANJANG
function saveCart() { localStorage.setItem('smk6_cart', JSON.stringify(cart)); }

function toggleCart() {
    document.getElementById('cartModal').classList.toggle('active');
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalQty;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p style="text-align:center; color:#888; margin-top:40px;">Keranjang belanjaanmu kosong.</p>`;
        cartTotal.innerText = 'Rp 0';
        document.getElementById('discountRow').style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <span>Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</span>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(itemEl);
    });

    const totalAfterDiscount = Math.max(0, subtotal - activeDiscount);
    cartTotal.innerText = `Rp ${totalAfterDiscount.toLocaleString('id-ID')}`;

    if (activeDiscount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountTotal').innerText = `-Rp ${activeDiscount.toLocaleString('id-ID')}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function clearCart() {
    if (confirm('Kosongkan keranjang pesanan?')) {
        cart = [];
        activeDiscount = 0;
        saveCart();
        updateCartUI();
    }
}

function applyVoucher() {
    const code = document.getElementById('voucherCode').value.trim().toUpperCase();
    const msg = document.getElementById('voucherMessage');

    if (code === 'SMKHEBAT') {
        activeDiscount = 5000;
        msg.className = 'voucher-msg success';
        msg.innerText = 'Voucher Siswa Aktif! Potongan Rp 5.000';
    } else if (code === '') {
        msg.className = 'voucher-msg error';
        msg.innerText = 'Masukkan kode promo terlebih dahulu!';
    } else {
        msg.className = 'voucher-msg error';
        msg.innerText = 'Kode promo tidak berlaku!';
    }
    updateCartUI();
}

// CHECKOUT & WHATSAPP
function openOrderModal() {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong!');
        return;
    }
    document.getElementById('cartModal').classList.remove('active');
    document.getElementById('orderModal').classList.add('active');
    updateSummaryOrder();
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

function toggleQrisOption() {
    const payment = document.getElementById('paymentMethod').value;
    const qrisContainer = document.getElementById('qrisContainer');
    if (payment.includes('QRIS')) {
        qrisContainer.style.display = 'block';
    } else {
        qrisContainer.style.display = 'none';
    }
}

function updateSummaryOrder() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const ongkir = parseInt(document.getElementById('deliveryArea').value) || 0;
    const finalTotal = Math.max(0, subtotal + ongkir - activeDiscount);

    document.getElementById('summarySubtotal').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('summaryOngkir').innerText = `Rp ${ongkir.toLocaleString('id-ID')}`;

    if (activeDiscount > 0) {
        document.getElementById('summaryDiskonRow').style.display = 'flex';
        document.getElementById('summaryDiskon').innerText = `-Rp ${activeDiscount.toLocaleString('id-ID')}`;
    } else {
        document.getElementById('summaryDiskonRow').style.display = 'none';
    }

    document.getElementById('summaryFinalTotal').innerText = `Rp ${finalTotal.toLocaleString('id-ID')}`;
}

function loadSavedCustomerData() {
    const savedData = JSON.parse(localStorage.getItem('smk6_cust_info'));
    if (savedData) {
        if (savedData.name) document.getElementById('custName').value = savedData.name;
        if (savedData.address) document.getElementById('custAddress').value = savedData.address;
    }
}

function checkoutWA() {
    const name = document.getElementById('custName').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const notes = document.getElementById('custNotes').value.trim();
    const ongkir = parseInt(document.getElementById('deliveryArea').value) || 0;

    if (!name || !address) {
        alert('Mohon isi Nama/Kelas dan Lokasi Pengantaran Anda!');
        return;
    }

    localStorage.setItem('smk6_cust_info', JSON.stringify({ name, address }));

    let subtotal = 0;
    let textMenu = '';
    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.qty;
        subtotal += itemSubtotal;
        textMenu += `${index + 1}. *${item.title}* x${item.qty} = Rp ${itemSubtotal.toLocaleString('id-ID')}\n`;
    });

    const finalTotal = Math.max(0, subtotal + ongkir - activeDiscount);

    let message = `*PESANAN KULINER SMKN 6 PEKANBARU*\n`;
    message += `-------------------------------------------\n`;
    message += `*Pemesan:* ${name}\n`;
    message += `*Lokasi di Sekolah:* ${address}\n`;
    message += `*Pembayaran:* ${payment}\n`;
    if (notes) message += `*Catatan:* ${notes}\n`;
    message += `-------------------------------------------\n`;
    message += `*Rincian Pesanan:*\n${textMenu}`;
    message += `-------------------------------------------\n`;
    message += `• Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n`;
    message += `• Layanan Antar: Rp ${ongkir.toLocaleString('id-ID')}\n`;
    if (activeDiscount > 0) message += `• Diskon: -Rp ${activeDiscount.toLocaleString('id-ID')}\n`;
    message += `*TOTAL BAYAR: Rp ${finalTotal.toLocaleString('id-ID')}*\n`;
    message += `-------------------------------------------\n`;
    message += `Mohon diproses ya TEFA / Kantin SMKN 6, terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    // Reset Keranjang
    cart = [];
    activeDiscount = 0;
    saveCart();
    updateCartUI();
    closeOrderModal();
    showToast('Pesanan berhasil terkirim ke WhatsApp Kantin SMKN 6!');
}

function toggleFAQ(element) {
    element.parentElement.classList.toggle('active');
}

function showToast(text) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastMsg').innerText = text;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}