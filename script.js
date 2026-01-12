document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let cart = JSON.parse(localStorage.getItem('vijaya_cart')) || [];

    // --- Selectors ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelectorAll('.cart-count');
    const cartTotal = document.getElementById('cart-total');
    const mobileMenuOpen = document.getElementById('mobile-menu-open');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    // Account Modals
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const modalCloses = document.querySelectorAll('.modal-close');
    const switchToSignup = document.getElementById('goto-signup');
    const switchToLogin = document.getElementById('goto-login');

    // Page Switching (SPA Logic)
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    const mainSections = ['home', 'services', 'doctors', 'tests', 'packages', 'appointment', 'prescription', 'about', 'contact'];
    const healthCheckupsPage = document.getElementById('health-checkups-page');
    const mainContent = document.getElementById('main-content');
    const healthBtn = document.querySelector('a[href="#packages"]');
    const viewAllHealthCheckups = document.getElementById('view-all-packages');
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentSuccess = document.getElementById('appointment-success');
    const homeCollectionCheckbox = document.getElementById('home-collection');
    const addressField = document.getElementById('address-field');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const uploadBtn = document.getElementById('upload-btn');
    const prescriptionSuccess = document.getElementById('prescription-success');
    const toast = document.getElementById('toast');
    const authGuard = document.getElementById('auth-guard');
    const userProfileContainer = document.getElementById('user-profile-container');

    // --- Core Functions (Moved to top for reference) ---
    const showToast = (message, type = 'success') => {
        if (!toast) return;
        toast.textContent = message;
        toast.style.background = type === 'success' ? 'var(--primary-color)' : 'var(--error-color)';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const handleFiles = (files) => {
        if (files.length > 0) {
            const fileName = files[0].name;
            if (filePreview) {
                filePreview.innerHTML = `
                    <div style="margin-top: 15px; color: var(--primary-color); font-weight: 600;">
                        <i class="fas fa-file-alt"></i> ${fileName}
                    </div>
                `;
            }
        }
    };

    // --- Phase 10: Auth & Session Management ---
    const checkAuth = () => {
        const isLoggedIn = sessionStorage.getItem('vijaya_isLoggedIn') === 'true';
        if (isLoggedIn) {
            if (authGuard) authGuard.classList.remove('active');
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (userProfileContainer) userProfileContainer.style.display = 'block';
        } else {
            if (authGuard) authGuard.classList.add('active');
            if (userProfileContainer) userProfileContainer.style.display = 'none';
        }
    };

    const simulateLogin = (method = 'Google') => {
        showToast(`Connecting to ${method}...`, 'success');

        setTimeout(() => {
            if (method === 'Google') {
                showToast('Selecting Account: akshay.vijaya@gmail.com', 'success');
            } else {
                showToast('Authenticating...', 'success');
            }

            setTimeout(() => {
                sessionStorage.setItem('vijaya_isLoggedIn', 'true');
                checkAuth();
                showToast('Successfully Logged In!', 'success');
                if (loginModal) loginModal.classList.remove('active');
                if (signupModal) signupModal.classList.remove('active');
            }, 1000);
        }, 800);
    };

    // Trigger Initial Auth Check
    checkAuth();

    // Guard Handlers
    document.getElementById('guard-google-login')?.addEventListener('click', () => simulateLogin('Google'));
    document.getElementById('guard-email-login')?.addEventListener('click', () => {
        authGuard.classList.remove('active');
        loginModal.classList.add('active');
    });
    document.getElementById('guard-signup')?.addEventListener('click', (e) => {
        e.preventDefault();
        authGuard.classList.remove('active');
        signupModal.classList.add('active');
    });

    // Profile Dropdown Toggle
    const profileToggle = document.getElementById('profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');

    profileToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
        profileToggle.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileToggle?.contains(e.target) && !profileDropdown?.contains(e.target)) {
            profileDropdown?.classList.remove('show');
            profileToggle?.classList.remove('active');
        }
    });

    // Logout functionality
    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Do you want to logout?')) {
            sessionStorage.removeItem('vijaya_isLoggedIn');
            sessionStorage.removeItem('vijaya_userName');
            sessionStorage.removeItem('vijaya_userEmail');
            checkAuth();
            showToast('Logged out successfully');
            profileDropdown?.classList.remove('show');
        }
    });

    // Update user profile details after login
    function updateUserProfile(name, email) {
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const avatars = document.querySelectorAll('.profile-avatar, .profile-avatar-large');

        if (profileName) profileName.textContent = name;
        if (profileEmail) profileEmail.textContent = email;

        // Update avatar with user's initials
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0055a4&color=fff`;
        avatars.forEach(avatar => {
            avatar.src = avatarUrl;
        });

        // Store in session
        sessionStorage.setItem('vijaya_userName', name);
        sessionStorage.setItem('vijaya_userEmail', email);
    }

    // Load saved profile on page load
    const savedName = sessionStorage.getItem('vijaya_userName');
    const savedEmail = sessionStorage.getItem('vijaya_userEmail');
    if (savedName && savedEmail) {
        updateUserProfile(savedName, savedEmail);
    }


    // Update existing Google Login buttons
    document.querySelectorAll('.google-login-btn').forEach(btn => {
        if (btn.id !== 'guard-google-login') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                simulateLogin('Google');
            });
        }
    });
    const showPage = (pageId) => {
        const pages = {
            'home': mainContent,
            'health-checkups': healthCheckupsPage,
            'home-collection': document.getElementById('home-collection-page'),
            'about-us': document.getElementById('about-us-page'),
            'centre-tests': document.getElementById('centre-tests-page')
        };

        Object.values(pages).forEach(p => { if (p) p.style.display = 'none'; });

        if (pages[pageId]) {
            pages[pageId].style.display = 'block';
            window.scrollTo(0, 0);

            // Highlight active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(pageId)) link.classList.add('active');
            });
        }
    };

    document.querySelectorAll('.about-nav-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('about-us');
        });
    });

    document.querySelectorAll('.health-nav-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('health-checkups');
        });
    });

    document.querySelectorAll('.home-nav-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('home');
        });
    });

    document.querySelectorAll('.hc-nav-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('home-collection');
        });
    });

    document.querySelectorAll('.centre-nav-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('centre-tests');
        });
    });

    // --- Phase 4 Catalog Logic ---
    const testGrid = document.getElementById('main-test-grid');
    const testCards = document.querySelectorAll('.test-card-simple');
    const alphaBtns = document.querySelectorAll('.alpha-btn');
    const diseaseItems = document.querySelectorAll('.disease-item');
    const searchInput = document.getElementById('test-search');

    const filterTests = (shouldScroll = false) => {
        const activeLetter = document.querySelector('.alpha-btn.active').dataset.letter.toLowerCase();
        const activeCat = document.querySelector('.disease-item.active').dataset.cat.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCount = 0;

        testCards.forEach(card => {
            const cardLetter = (card.dataset.letter || "").toLowerCase();
            const cardCat = (card.dataset.cat || "").toLowerCase();
            const cardName = card.querySelector('.test-name').textContent.toLowerCase();

            const matchLetter = activeLetter === 'all' || cardLetter === activeLetter;
            const matchCat = activeCat === 'all' || cardCat === activeCat;
            const matchSearch = cardName.includes(searchTerm);

            if (matchLetter && matchCat && matchSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Handle empty state
        let noResultsMsg = document.getElementById('no-tests-found');
        if (visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'no-tests-found';
                noResultsMsg.className = 'text-center py-40';
                noResultsMsg.style.gridColumn = '1 / -1';
                noResultsMsg.innerHTML = `<i class="fas fa-search fa-3x mb-20" style="opacity: 0.2;"></i><h3>No tests found</h3><p>Try clearing filters or searching for something else.</p>`;
                testGrid.appendChild(noResultsMsg);
            } else {
                noResultsMsg.style.display = 'block';
            }
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }

        if (shouldScroll) {
            const catalogSection = document.getElementById('tests');
            if (catalogSection) {
                window.scrollTo({
                    top: catalogSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    };

    if (alphaBtns) {
        alphaBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                alphaBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterTests(true); // Smooth scroll to grid
            });
        });
    }

    if (diseaseItems) {
        diseaseItems.forEach(item => {
            item.addEventListener('click', () => {
                const cat = item.dataset.cat;
                diseaseItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Sync top categories bar if applicable
                const topCat = document.querySelector(`.category-item[data-cat="${cat}"]`);
                if (topCat) {
                    document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                    topCat.classList.add('active');
                }

                filterTests(true); // Scroll to catalog
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTests);
    }

    // --- Hero Search Functionality ---
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchBtn = document.getElementById('hero-search-btn');

    const handleHeroSearch = () => {
        const query = heroSearchInput.value.trim();
        if (query) {
            // Switch to catalog page/section
            const testsSection = document.getElementById('tests');
            if (testsSection) {
                testsSection.scrollIntoView({ behavior: 'smooth' });
                // Apply search to catalog input
                searchInput.value = query;
                filterTests();
                showToast(`Searching for "${query}" in catalog...`);
            }
        } else {
            showToast('Please enter a test name to search', 'error');
        }
    };

    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', handleHeroSearch);
    }

    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleHeroSearch();
        });
    }

    // --- Categories Bar Filtering ---
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const cat = item.dataset.cat;

            // Sync with Disease Filter Scroll (Middle section)
            const diseaseItem = document.querySelector(`.disease-item[data-cat="${cat}"]`);
            if (diseaseItem) {
                diseaseItems.forEach(i => i.classList.remove('active'));
                diseaseItem.classList.add('active');
            } else {
                // If it's a category not in the disease scroller (like neuro/pediatric), reset disease scroller to 'all'
                diseaseItems.forEach(i => i.classList.remove('active'));
                const allDisease = document.querySelector('.disease-item[data-cat="all"]');
                if (allDisease) allDisease.classList.add('active');
            }

            filterTests(true); // Smooth scroll to catalog
            showToast(`Filtering for ${item.querySelector('span').textContent}...`);
        });
    });

    // --- Centre Test Filter Simulation ---
    document.querySelectorAll('[data-centre]').forEach(item => {
        if (item.classList.contains('organ-item')) {
            item.addEventListener('click', () => {
                document.querySelectorAll('#centre-tests-page .organ-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const centreCat = item.dataset.centre;
                const centreGrid = document.getElementById('centre-dynamic-grid');
                if (!centreGrid) return;

                showToast(`Filtering specialized tests for ${centreCat === 'all' ? 'all categories' : centreCat}...`);

                centreGrid.querySelectorAll('.premium-test-card').forEach(card => {
                    if (centreCat === 'all' || card.dataset.centre === centreCat) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    });

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- Account Modals ---
    const openModal = (modal) => {
        modal.classList.add('active');
        body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        body.style.overflow = 'auto';
    };

    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
    if (signupBtn) signupBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(signupModal); });
    modalCloses.forEach(btn => btn.addEventListener('click', closeModal));

    if (switchToSignup) switchToSignup.addEventListener('click', (e) => { e.preventDefault(); closeModal(); openModal(signupModal); });
    if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); closeModal(); openModal(loginModal); });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Login successful! Welcome back.');
        closeModal();
        loginBtn.textContent = 'Account';
        signupBtn.style.display = 'none';
    });

    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Account created successfully!');
        closeModal();
    });

    // --- Theme Toggle ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.replace('light-theme', 'dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
            showToast('Dark mode enabled');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
            showToast('Light mode enabled');
        }
    });

    // --- Cart Functionality ---
    const updateCartUI = () => {
        cartCount.forEach(el => el.textContent = cart.reduce((acc, item) => acc + item.quantity, 0));

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-basket"></i><p>Your cart is empty</p></div>';
            cartTotal.textContent = '₹0';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.quantity}</p>
                    </div>
                    <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
                </div>
            `).join('');

            const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
        }
        localStorage.setItem('vijaya_cart', JSON.stringify(cart));
    };

    const addToCart = (id, name, price) => {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price: parseInt(price), quantity: 1 });
        }
        updateCartUI();
        showToast(`${name} added to cart`);
    };

    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
        showToast('Item removed from cart');
    };

    // Event Delegation for "Add to Cart" and Global Buttons
    document.addEventListener('click', (e) => {
        // Add to Cart
        if (e.target.classList.contains('add-to-cart')) {
            const btn = e.target;
            addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
        }

        // Remove from Cart
        if (e.target.classList.contains('remove-item')) {
            removeFromCart(e.target.dataset.id);
        }

        // Global Button Feedback (for unhandled buttons)
        const commonButtons = ['btn-primary', 'btn-outline', 'btn-secondary', 'view-all', 'learn-more', 'btn-text'];
        const isCommonBtn = commonButtons.some(cls => e.target.classList.contains(cls));

        // Prevent toast if it's already handled (like appointment submit or cart add)
        const isHandled = e.target.closest('form') || e.target.classList.contains('add-to-cart') || e.target.id === 'upload-btn' || e.target.closest('.nav-links');

        if (isCommonBtn && !isHandled) {
            e.preventDefault();
            showToast('Feature coming soon to our portal!');
        }

        // Side Quick Actions (WhatsApp simulation)
        const quickAction = e.target.closest('.quick-action-item');
        if (quickAction && quickAction.getAttribute('href') === '#contact') {
            e.preventDefault();
            showToast('Redirecting to WhatsApp support...');
            setTimeout(() => {
                window.open('https://wa.me/914023456789', '_blank');
            }, 1000);
        }
    });

    cartToggle.addEventListener('click', () => cartSidebar.classList.add('open'));
    cartClose.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // --- Checkout Logic ---
    document.querySelector('.btn-checkout').addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Add items to cart first!', 'error');
            return;
        }
        showToast('Processing checkout...');
        setTimeout(() => {
            showToast('Order placed successfully!');
            cart = [];
            updateCartUI();
            cartSidebar.classList.remove('open');
        }, 2000);
    });

    // --- Mobile Menu ---
    mobileMenuOpen.addEventListener('click', () => mobileMenu.classList.add('open'));
    mobileMenuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });

    // --- Appointment Form Phase 11 ---
    const dateSlots = document.querySelectorAll('.slot-chip');
    const appointmentDateInput = document.getElementById('appointment-date');
    const visitToggle = document.getElementById('visit-type-toggle');
    const toggleOptions = document.querySelectorAll('.toggle-option');

    dateSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            dateSlots.forEach(s => s.classList.remove('active'));
            slot.classList.add('active');

            if (slot.dataset.date === 'custom') {
                appointmentDateInput.style.display = 'block';
                appointmentDateInput.focus();
            } else {
                appointmentDateInput.style.display = 'none';
                // Set native date for form submission (Today or Tomorrow)
                const targetDate = new Date();
                if (slot.dataset.date === 'tomorrow') targetDate.setDate(targetDate.getDate() + 1);
                appointmentDateInput.value = targetDate.toISOString().split('T')[0];
            }
        });
    });

    visitToggle?.addEventListener('click', () => {
        const currentVisit = visitToggle.getAttribute('data-visit') || 'center';
        const nextVisit = currentVisit === 'center' ? 'home' : 'center';

        visitToggle.setAttribute('data-visit', nextVisit);
        toggleOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.visit === nextVisit);
        });

        if (addressField) {
            addressField.style.display = nextVisit === 'home' ? 'block' : 'none';
        }
    });

    // Remove legacy checkbox listener

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Disable and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

        // Simulate API call
        setTimeout(() => {
            appointmentForm.style.display = 'none';
            appointmentSuccess.style.display = 'block';
            showToast('Appointment Request Sent!');

            // Re-enable for visual consistency if they navigate back
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 500);
        }, 1500);
    });

    // --- Prescription Upload Handlers ---
    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--primary-color)'; });
        dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border-color)'; });
        dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--border-color)'; handleFiles(e.dataTransfer.files); });
    }
    if (fileInput) fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            if (!fileInput.files.length) return showToast('Please select a file first', 'error');
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Uploading...';
            setTimeout(() => {
                document.querySelector('.upload-area').style.display = 'none';
                filePreview.style.display = 'none';
                uploadBtn.style.display = 'none';
                prescriptionSuccess.style.display = 'block';
                showToast('Prescription Uploaded Successfully!');
            }, 1500);
        });
    }

    // --- Report Download Logic (Re-wiring for the new button) ---
    document.addEventListener('click', (e) => {
        if (e.target.id === 'download-appointment-report' || e.target.closest('#download-appointment-report')) {
            showToast('Generating your appointment report PDF...');
            setTimeout(() => showToast('Report downloaded successfully!'), 1500);
        }
    });

    // --- Initialization ---
    updateCartUI();

    // --- Scroll to Top Functionality ---
    const scrollTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Global Smooth Scroll Overhaul ---
    document.querySelectorAll('a[href^="#"], .home-nav-trigger, .about-nav-trigger, .health-nav-trigger, .centre-nav-trigger').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Performance Optimization ---

    // --- Scroll Reveal Logic ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    // Add 'reveal' class to elements and observe
    document.querySelectorAll('section, .test-card-simple, .stat-box, .value-card, .team-card, .service-big-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

/* --------------------------------------------------------------------------
   COMPLETE AUTHENTICATION SYSTEM (Signup -> OTP -> Login -> Profile)
   -------------------------------------------------------------------------- */

// Global state for pending user registration
let pendingRegistration = null;

// OTP Handling Elements
const otpModal = document.getElementById('otp-modal');
const otpForm = document.getElementById('otp-form');
const otpInputs = document.querySelectorAll('.otp-input');
const otpEmailDisplay = document.getElementById('otp-email-display');
const otpCloseBtn = document.getElementById('otp-close');

// 1. Function to Update Header User Profile
function updateUserProfile(name, email) {
    // Update Dropdown Content
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    if (profileName) profileName.textContent = name;
    if (profileEmail) profileEmail.textContent = email;

    // Update Header Button Text (e.g. "Akshaya's Account")
    const userAccountName = document.getElementById('user-account-name');
    if (userAccountName) {
        const firstName = name.split(' ')[0];
        userAccountName.textContent = `${firstName}'s Account`;
    }

    // Update Avatars
    const avatars = document.querySelectorAll('.profile-avatar, .profile-avatar-large');
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0055a4&color=fff`;
    avatars.forEach(avatar => {
        avatar.src = avatarUrl;
    });

    // Save to Session Storage
    sessionStorage.setItem('vijaya_userName', name);
    sessionStorage.setItem('vijaya_userEmail', email);
    sessionStorage.setItem('vijaya_isLoggedIn', 'true');
}

// 2. Override Signup Form Submission to Show OTP
const signupFormEl = document.getElementById('signup-form');
if (signupFormEl) {
    signupFormEl.addEventListener('submit', (e) => {
        e.preventDefault();

        // Capture user input
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const phoneInput = document.getElementById('signup-phone');

        const name = nameInput ? nameInput.value : 'User';
        const email = emailInput ? emailInput.value : 'user@example.com';

        // Store temporarily
        pendingRegistration = { name, email };

        // Show toast
        if (typeof showToast === 'function') {
            showToast(`Sending OTP to ${email}...`);
        }

        setTimeout(() => {
            // Hide Signup Modal
            document.getElementById('signup-modal')?.classList.remove('active');

            // Show OTP Modal
            if (otpModal) {
                otpModal.classList.add('active');
                if (otpEmailDisplay) otpEmailDisplay.textContent = email;
                // Focus first input
                if (otpInputs.length > 0) otpInputs[0].focus();
            }
        }, 1000);
    });
}

// 3. OTP Input Logic (Auto-focus & Navigation)
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        // Move to next input if current is filled
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        // Move to previous on backspace if empty
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });

    // Prevent non-numeric input
    input.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
});

// 4. Handle OTP Verification Submission
if (otpForm) {
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect OTP
        let otpValue = '';
        otpInputs.forEach(input => otpValue += input.value);

        if (otpValue.length < 6) {
            if (typeof showToast === 'function') showToast('Please enter the full 6-digit code.', 'error');
            return;
        }

        if (typeof showToast === 'function') showToast('Verifying...');

        setTimeout(() => {
            // SUCCESS: OTP is considered valid for this demo
            if (pendingRegistration) {
                // Log the user in
                updateUserProfile(pendingRegistration.name, pendingRegistration.email);

                // Update UI state
                if (typeof checkAuth === 'function') checkAuth();

                // Close modals
                otpModal.classList.remove('active');

                if (typeof showToast === 'function') showToast(`Welcome, ${pendingRegistration.name}! Registration Complete.`);

                // Clear pending data
                pendingRegistration = null;
                otpInputs.forEach(input => input.value = '');
            }
        }, 1000);
    });
}

// 5. Close OTP Modal Handler
if (otpCloseBtn) {
    otpCloseBtn.addEventListener('click', () => {
        otpModal.classList.remove('active');
    });
}

// 6. Resend OTP Handler
const resendOtpBtn = document.getElementById('resend-otp');
if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof showToast === 'function') showToast('New OTP sent to your email.');
        // Clear inputs and focus first
        otpInputs.forEach(input => input.value = '');
        otpInputs[0].focus();
    });
}

// Ensure Login Form also uses the new profile update logic
const loginFormEl = document.getElementById('login-form');
if (loginFormEl) {
    // We'll just add a listener that overwrites the session data with whatever is entered
    loginFormEl.addEventListener('submit', (e) => {
        const emailInput = document.getElementById('login-email');
        const email = emailInput ? emailInput.value : '';
        const savedName = sessionStorage.getItem('vijaya_userName') || "Akshaya"; // Default for demo if not found

        setTimeout(() => {
            updateUserProfile(savedName, email);
        }, 1100); // Run slightly after the main login logic
    });
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
});

/* --------------------------------------------------------------------------
   PAYMENT SYSTEM (Dummy Checkout)
   -------------------------------------------------------------------------- */

const paymentModal = document.getElementById('payment-modal');
const paymentClose = document.getElementById('payment-close');
const paymentTabs = document.querySelectorAll('.payment-tab');
const paymentFormCard = document.getElementById('payment-form-card');
const paymentFormUPI = document.getElementById('payment-form-upi');
const paymentSuccess = document.getElementById('payment-success');
const paymentAmount = document.getElementById('payment-amount');

// Open Payment Modal instead of direct toast
const checkoutBtn = document.querySelector('.btn-checkout');
if (checkoutBtn) {
    // Remove old listeners by cloning
    const newBtn = checkoutBtn.cloneNode(true);
    checkoutBtn.parentNode.replaceChild(newBtn, checkoutBtn);

    newBtn.addEventListener('click', () => {
        // Read from LocalStorage to constitute the cart
        const currentCart = JSON.parse(localStorage.getItem('vijaya_cart')) || [];

        if (currentCart.length === 0) {
            if (typeof showToast === 'function') showToast('Your cart is empty!', 'error');
            return;
        }

        const total = currentCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        if (paymentAmount) paymentAmount.textContent = '' + total.toLocaleString('en-IN');

        // Close sidebar
        document.getElementById('cart-sidebar')?.classList.remove('open');

        // Open Modal
        if (paymentModal) {
            paymentModal.classList.add('active');
            // Reset state
            if (paymentFormCard) paymentFormCard.style.display = 'block';
            if (paymentFormUPI) paymentFormUPI.style.display = 'none';
            if (paymentSuccess) paymentSuccess.style.display = 'none';

            const summary = document.querySelector('.payment-summary');
            if (summary) summary.style.display = 'block';

            const methods = document.querySelector('.payment-methods');
            if (methods) methods.style.display = 'flex';
        }
    });
}

// Close Payment Modal
if (paymentClose) {
    paymentClose.addEventListener('click', () => {
        paymentModal.classList.remove('active');
    });
}

// Switch Payment Methods
paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // UI Updates
        paymentTabs.forEach(t => {
            t.classList.remove('active');
            t.style.background = 'white';
            t.style.color = '#333';
            t.style.borderColor = '#ccc';
        });
        tab.classList.add('active');
        tab.style.background = 'var(--primary-color)';
        tab.style.color = 'white';
        tab.style.borderColor = 'var(--primary-color)';

        // Form Switching
        if (tab.dataset.method === 'card') {
            if (paymentFormCard) paymentFormCard.style.display = 'block';
            if (paymentFormUPI) paymentFormUPI.style.display = 'none';
        } else {
            if (paymentFormCard) paymentFormCard.style.display = 'none';
            if (paymentFormUPI) paymentFormUPI.style.display = 'block';
        }
    });
});

// Process Payment (Dummy)
const processPayment = (e) => {
    e.preventDefault();

    // Simulate Processing
    const btn = e.target.querySelector('button');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
    }

    setTimeout(() => {
        // Success State
        if (paymentFormCard) paymentFormCard.style.display = 'none';
        if (paymentFormUPI) paymentFormUPI.style.display = 'none';

        const summary = document.querySelector('.payment-summary');
        if (summary) summary.style.display = 'none';

        const methods = document.querySelector('.payment-methods');
        if (methods) methods.style.display = 'none';

        if (paymentSuccess) {
            paymentSuccess.style.display = 'block';
            const orderIdEl = document.getElementById('order-id');
            if (orderIdEl) orderIdEl.textContent = Math.floor(100000 + Math.random() * 900000);
        }

        // Clear Cart
        localStorage.removeItem('vijaya_cart');

        setTimeout(() => {
            paymentModal.classList.remove('active');
            if (typeof showToast === 'function') showToast('Order Placed Successfully!');
            window.location.reload();
        }, 2000);

    }, 2000);
};

if (paymentFormCard) paymentFormCard.addEventListener('submit', processPayment);
if (paymentFormUPI) paymentFormUPI.addEventListener('submit', processPayment);

/* FORCE SCROLL RESTORE FIX */
document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', () => {
        document.body.style.overflow = 'auto';
        document.body.classList.remove('modal-open');
    });
});
// Ensure scroll is enabled on load
document.body.style.overflow = 'auto';

/* --------------------------------------------------------------------------
   LOGIN FLOW UPDATE: Switch to OTP (Overrides previous logic)
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // We re-select inside DOMContentLoaded to be sure elements adhere to the DOM
    const existingLoginForm = document.getElementById('login-form');
    if (existingLoginForm) {
        // Clone to strip old listeners (Direct Login)
        const newLoginForm = existingLoginForm.cloneNode(true);
        existingLoginForm.parentNode.replaceChild(newLoginForm, existingLoginForm);

        // Attach NEW Listener (OTP Flow)
        newLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('login-email');
            const email = emailInput ? emailInput.value : 'user@example.com';

            // Try to use a better name simulation
            let savedName = sessionStorage.getItem('vijaya_userName');
            if (!savedName || savedName === 'User') {
                const namePart = email.split('@')[0];
                savedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            }

            // Store pending login data
            pendingRegistration = { name: savedName, email: email };

            // Show Toast
            if (typeof showToast === 'function') showToast('Sending OTP to ' + email + '...');

            setTimeout(() => {
                // Hide Login Modal
                document.getElementById('login-modal')?.classList.remove('active');

                // Show OTP Modal
                const otpModalEl = document.getElementById('otp-modal');
                if (otpModalEl) {
                    otpModalEl.classList.add('active');
                    const display = document.getElementById('otp-email-display');
                    if (display) display.textContent = email;

                    // Focus first input
                    const inputs = document.querySelectorAll('.otp-input');
                    if (inputs.length > 0) inputs[0].focus();
                }
            }, 1000);
        });
    }
});

/* DEMO NAME ENHANCEMENT */
// This ensures that if you type 'akshaya' in email during login, it nicely capitalizes it.
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', () => {
            const emailVal = document.getElementById('login-email')?.value || '';
            if (emailVal.toLowerCase().includes('akshaya')) {
                sessionStorage.setItem('vijaya_userName', 'Akshaya');
            }
        });
    }
});

/* MY PROFILE MODAL LOGIC */
document.addEventListener('DOMContentLoaded', () => {
    // Open Profile Modal from Dropdown
    const myProfileLinks = document.querySelectorAll('.profile-menu-item');
    // Assuming the first one is 'My Profile' based on icon class
    myProfileLinks.forEach(link => {
        if (link.innerHTML.includes('My Profile')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = document.getElementById('profile-details-modal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                }
            });
        }
    });

    // Close Profile Modal
    document.getElementById('profile-details-close')?.addEventListener('click', () => {
        document.getElementById('profile-details-modal')?.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
    });
});

// --- REPLACED WITH MASTER AUTH SYSTEM ---
// The previous messy hooks have been removed.

/* --------------------------------------------------------------------------
   MASTER AUTHENTICATION SYSTEM (Unified & Robust)
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Master Auth System Initializing...");

    // --- ELEMENTS ---
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const userProfileContainer = document.getElementById('user-profile-container');
    const userAccountName = document.getElementById('user-account-name'); // The span inside header button

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const otpForm = document.getElementById('otp-form');

    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const otpModal = document.getElementById('otp-modal');

    // --- STATE ---
    window.authTempUser = null;

    // --- HELPER: UPDATE UI & WELCOME ---
    window.updateAuthUI = function (name, email, isFreshLogin = false) {
        console.log("Auth Update:", name, email, isFreshLogin);

        // PERSIST
        localStorage.setItem('vijaya_userName', name);
        localStorage.setItem('vijaya_userEmail', email);
        localStorage.setItem('vijaya_isLoggedIn', 'true');

        // HEADER
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userProfileContainer) userProfileContainer.style.display = 'block';

        if (userAccountName) userAccountName.textContent = name + "'s Account";

        // DROPDOWNS & MODALS
        const paramMap = {
            'profile-name': name,
            'profile-email': email,
            'profile-modal-name': name,
            'profile-modal-email': email
        };
        for (const [id, val] of Object.entries(paramMap)) {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        }

        // AVATARS
        const avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=0055a4&color=fff';
        document.querySelectorAll('.profile-avatar, .profile-avatar-large').forEach(img => img.src = avatarUrl);

        // WELCOME OVERLAY
        if (isFreshLogin) {
            const overlay = document.getElementById('welcome-overlay');
            const wName = document.getElementById('welcome-name');
            if (overlay && wName) {
                wName.textContent = name;
                overlay.style.display = 'flex';
                setTimeout(() => overlay.style.opacity = '1', 10);
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.style.display = 'none', 500);
                }, 2500);
            }
        }
    };

    // --- 1. SIGNUP LOGIC ---
    if (signupForm) {
        const newSignup = signupForm.cloneNode(true);
        signupForm.parentNode.replaceChild(newSignup, signupForm);

        newSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            window.authTempUser = { name, email };

            // Switch Modals
            signupModal.classList.remove('active');
            otpModal.classList.add('active');

            // Setup OTP UI
            const dim = document.getElementById('otp-email-display');
            if (dim) dim.textContent = email;
            document.querySelector('.otp-input')?.focus();
        });
    }

    // --- 2. LOGIN LOGIC ---
    if (loginForm) {
        const newLogin = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newLogin, loginForm);

        newLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;

            // Name Inference
            let name = 'User';
            if (email.toLowerCase().includes('akshaya')) name = 'Akshaya';
            else {
                const part = email.split('@')[0];
                name = part.charAt(0).toUpperCase() + part.slice(1);
            }

            window.authTempUser = { name, email };

            loginModal.classList.remove('active');
            otpModal.classList.add('active');

            const dim = document.getElementById('otp-email-display');
            if (dim) dim.textContent = email;
            document.querySelector('.otp-input')?.focus();
        });
    }

    // --- 3. OTP LOGIC ---
    if (otpForm) {
        const newOtp = otpForm.cloneNode(true);
        otpForm.parentNode.replaceChild(newOtp, otpForm);

        // Auto-Focus Logic
        const inputs = newOtp.querySelectorAll('.otp-input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) inputs[index - 1].focus();
            });
        });

        newOtp.addEventListener('submit', (e) => {
            e.preventDefault();
            // Verify
            if (window.authTempUser) {
                window.updateAuthUI(window.authTempUser.name, window.authTempUser.email, true); // Fresh Login = True

                // Cleanup
                otpModal.classList.remove('active');
                document.body.classList.remove('modal-open');
                document.body.style.overflow = 'auto'; // Fix Scrolling
                inputs.forEach(i => i.value = ''); // Clear OTP
            }
        });
    }

    // --- 4. INIT ON LOAD ---
    const isLoggedIn = localStorage.getItem('vijaya_isLoggedIn');
    if (isLoggedIn === 'true') {
        const n = localStorage.getItem('vijaya_userName');
        const e = localStorage.getItem('vijaya_userEmail');
        window.updateAuthUI(n, e, false); // Not fresh, no overlay
    }

    // --- 5. MY PROFILE MODAL HOOK ---
    // Re-attach listener for Profile Modal opening
    const myProfileHook = () => {
        document.querySelectorAll('.profile-menu-item').forEach(link => {
            if (link.innerHTML.includes('My Profile')) {
                // Clone to avoid duplicates? No need, just ensure logic works
                link.onclick = (e) => {
                    e.preventDefault();
                    const m = document.getElementById('profile-details-modal');
                    if (m) {
                        m.classList.add('active');
                        document.body.classList.add('modal-open');
                        // Force update modal data just in case
                        const n = localStorage.getItem('vijaya_userName');
                        const em = localStorage.getItem('vijaya_userEmail');
                        if (n) window.updateAuthUI(n, em, false);
                    }
                };
            }
        });

        document.getElementById('profile-details-close')?.addEventListener('click', () => {
            document.getElementById('profile-details-modal')?.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = 'auto';
        });
    };
    myProfileHook();
});
