// --- FORMATEO DE MEMORIA SEGURO ---
const usuariosGuardados = localStorage.getItem("tactical_users");
const idiomaGuardado = localStorage.getItem("tactical_lang");
const cookiesAceptadas = localStorage.getItem("tactical_cookies_accepted");
const sesionActual = localStorage.getItem("tactical_current_user");

localStorage.clear();

if (usuariosGuardados) localStorage.setItem("tactical_users", usuariosGuardados);
if (idiomaGuardado) localStorage.setItem("tactical_lang", idiomaGuardado);
if (cookiesAceptadas) localStorage.setItem("tactical_cookies_accepted", cookiesAceptadas);
if (sesionActual) localStorage.setItem("tactical_current_user", sesionActual);

document.addEventListener("DOMContentLoaded", () => {
    
    let verTodosMercado = false; 
    let descuentoActual = 0; 
    let codigoAplicado = "";
    let currentLang = localStorage.getItem("tactical_lang") || "es";

    // --- INYECCIÓN DINÁMICA DEL POPUP DE ALERTAS PERSONALIZADO ---
    if (!document.getElementById("custom-alert-box")) {
        const alertHTML = `
        <div id="custom-alert-box" class="overlay" style="z-index: 99999;">
            <div class="popup-box" style="max-width: 420px; padding: 30px; border-top: 4px solid var(--primary-color);">
                <h3 id="custom-alert-title" style="color: var(--primary-color); margin-bottom: 15px; font-size: 1.4rem;">Aviso del Sistema</h3>
                <p id="custom-alert-msg" style="color: #fff; margin-bottom: 25px; font-size: 1rem; line-height: 1.5;"></p>
                <button id="custom-alert-btn" class="btn-primary" style="width: 100%;">ENTENDIDO</button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', alertHTML);
    }

    const showAlert = (msg, callback) => {
        const box = document.getElementById("custom-alert-box");
        document.getElementById("custom-alert-title").textContent = currentLang === 'en' ? "System Notice" : "Soporte Tactico";
        document.getElementById("custom-alert-msg").innerHTML = msg; 
        document.getElementById("custom-alert-btn").textContent = currentLang === 'en' ? "UNDERSTOOD" : "ENTENDIDO";

        box.classList.add("active");

        const btn = document.getElementById("custom-alert-btn");
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener("click", () => {
            box.classList.remove("active");
            if(callback) callback();
        });
    };

    // --- ACCION DEL LOGO AL INICIO ---
    document.querySelectorAll('.clickable-logo').forEach(logo => {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    const popups = {
        cookie: document.getElementById("cookie-popup"),
        login: document.getElementById("login-popup"),
        cart: document.getElementById("cart-popup"),
        uploadItem: document.getElementById("upload-item-popup"),
        uploadPhoto: document.getElementById("upload-photo-popup"),
        editProfile: document.getElementById("edit-profile-popup"),
        discounts: document.getElementById("discounts-popup"),
        history: document.getElementById("history-popup"),
        config: document.getElementById("config-popup"),
        benefits: document.getElementById("account-benefits-popup"),
        privacyPolicy: document.getElementById("privacy-policy-popup")
    };
    const mainContent = document.getElementById("main-content");
    const authForms = {
        login: document.getElementById("login-form-container"),
        register: document.getElementById("register-form-container"),
        forgot: document.getElementById("forgot-form-container")
    };
    const nav = {
        loginBtn: document.getElementById("btn-nav-login"),
        userDropdown: document.getElementById("user-controls"),
        userTrigger: document.getElementById("btn-user-menu-trigger"),
        userContent: document.getElementById("user-dropdown-content"),
        navMenu: document.getElementById("nav-menu")
    };

    let usuariosRegistrados = JSON.parse(localStorage.getItem("tactical_users")) || [];
    let usuarioActual = JSON.parse(localStorage.getItem("tactical_current_user")) || null;
    
    if (usuarioActual) {
        nav.loginBtn.style.display = "none";
        nav.userDropdown.style.display = "block";
        nav.userTrigger.textContent = usuarioActual.user;
    }

    const translations = {
        es: {
            navHome: "Inicio", navMarket: "Compra/Venta", navRepair: "Taller", navGallery: "Galeria", loginBtn: "Iniciar Sesion", registerBtn: "Registrar Cuenta", logoutBtn: "Cerrar Sesion", profileBtn: "Mi Perfil", configBtn: "Configuracion", privacyMenuBtn: "Condiciones de Privacidad", heroTitle: "Precision absoluta. Rendimiento tactico.", heroText: "Tu vehiculo no es solo un transporte; es tu mejor herramienta.", 
            heroBtn: "Solicitar cita previa", marketTitle: "1. Compra/Venta", uploadItemBtn: "+ Subir Articulo", repairTitle: "2. Unidad de Reparacion / Modificacion", sendBtn: "Enviar Solicitud", galleryTitle: "Operaciones (Galeria)", uploadPhotoBtn: "+ Añadir Foto", cookiesTitle: "Aviso Tactico (Cookies)", cookiesText: "Utilizamos cookies para mejorar la precision de nuestros servicios. ¿Aceptas?", cookiesAccept: "Afirmativo, aceptar", loginTitle: "Acceso Restringido", noAccount: "¿No tienes cuenta?", registerHere: "Registrate aqui", registerTitle: "Nuevo Recluta", hasAccount: "¿Ya tienes cuenta?", profileTitle: "Editar Perfil", profileDesc: "Actualiza tus credenciales.", saveChanges: "Guardar Cambios", configTitle: "Configuracion", configDesc: "Selecciona el idioma.", applyBtn: "Aplicar", closeBtn: "Cerrar", cancelBtn: "Cancelar", uploadItemTitle: "Añadir al Mercado", publishBtn: "Publicar", uploadPhotoTitle: "Añadir Foto", addBtn: "Añadir", cartTitle: "Carrito", checkoutBtn: "Confirmar Transaccion", continueBtn: "Seguir Comprando", privacyTitle: "Politica de Privacidad, Cookies y Aviso Legal", selectService: "-- Selecciona el Servicio --", optRepair: "Reparacion Tecnica", optMod: "Modificacion y Mejoras", payMethod: "Metodo de Pago:", newEmailLabel: "Nuevo Email:", newPassLabel: "Nueva Contraseña (Opcional):", currentPassLabel: "* Contraseña ACTUAL (Requerida):", sellerLabel: "Vendedor", catLabel: "Categoria", emptyCart: "El carrito esta vacio.", userHolder: "Usuario", passHolder: "Contraseña", emailHolder: "Email (Obligatorio)", itemNameHolder: "Nombre", itemCatHolder: "Categoria", itemPriceHolder: "Precio", itemImgHolder: "URL Imagen", itemDescHolder: "Descripcion del articulo...", cardNum: "Numero Tarjeta (12 digitos)", vehicleHolder: "Vehiculo (Marca y Modelo)", descHolder: "Describe el daño o las modificaciones requeridas...", benefitsTitle: "Ventajas de Unirte", benefit1: "Vender tus propios articulos en el Mercado.", benefit2: "Comprar equipamiento exclusivo.", benefit3: "Subir fotos a la Galeria.", benefit4: "Acceso a descuentos exclusivos.", benefit5: "Bono exclusivo del 20% de bienvenida en tu primera compra.", continueRegisterBtn: "Continuar al Registro", footerPrivacy: "Protocolos de Privacidad y Terminos", footerCookiesTitle: "Uso de Cookies Activo", footerCookiesInfo: "Nota: Usamos cookies indispensables.", seeMoreBtn: "Ver todos los articulos", seeLessBtn: "Ver menos", chatTitle: "Soporte Tactico", chatWelcome: "Agente en linea. ¿En que puedo ayudarte hoy?", chatInput: "Escribe tu mensaje...", chatSendBtn: "ENVIAR",
            discountsMenu: "Mis Descuentos", discountsSubtitle: "Aumenta tu rango realizando compras.", discountPlaceholder: "Codigo de descuento", applyCodeBtn: "Aplicar", noDiscounts: "Aun no tienes descuentos. ¡Realiza compras en el Mercado para subir de nivel y desbloquear codigos tacticos!",
            welcomeDiscount: "20% de descuento en tu primer pedido.", bronze: "10% de descuento en la tienda.", silver: "15% de descuento en la tienda.", gold: "20% de descuento en la tienda.", elite: "25% de descuento absoluto.", historyMenu: "Historial",
            forgotPass: "¿Has olvidado tu contraseña?", forgotTitle: "Recuperar Contraseña", resetBtn: "Cambiar Contraseña", backLogin: "Volver a Iniciar Sesion", forgotUserHolder: "Usuario", forgotEmailHolder: "Email de registro", forgotNewPassHolder: "Nueva Contraseña",
            payOptCard: "Tarjeta de Credito/Debito", payOptPayPal: "PayPal", payOptCrypto: "Criptomonedas", paypalHolder: "Email de PayPal asociado", cryptoHolder: "Direccion de tu Wallet (BTC/ETH)", cartTotalLabel: "Total:",
            historyDesc: "Tus operaciones en Tactical Reparations.", historyMyPurchases: "Mis Compras", historyMySales: "Mis Ventas (Mercado)", alertTitle: "Aviso del Sistema", alertBtn: "ENTENDIDO", footerContact: "Contacto:",
            policyLegalTitle: "1. Aviso Legal", policyLegalText: "Tactical Reparations es una plataforma virtual dedicada a la prestacion de servicios automotrices avanzados. Todos los derechos reservados.", policyDataTitle: "2. Uso de Datos (Privacidad)", policyDataText: "Recopilamos la informacion estrictamente necesaria para gestionar tu cuenta de Agente, procesar tus pedidos y ofrecer soporte tecnico. Tus credenciales se procesan de forma segura. No vendemos informacion a terceros.", policyCookiesTitle: "3. Politica de Cookies", policyCookiesText: "Utilizamos cookies tecnicas y de sesion (Local Storage) indispensables para mantener tu inventario en el carrito, aplicar descuentos, conservar tu historial y recordar tu idioma. No usamos rastreadores publicitarios externos.", copyrightText: "© 2026 Tactical Reparations. Todos los derechos reservados."
        },
        en: {
            navHome: "Home", navMarket: "Buy/Sell", navRepair: "Workshop", navGallery: "Gallery", loginBtn: "Login", registerBtn: "Register", logoutBtn: "Logout", profileBtn: "My Profile", configBtn: "Settings", heroTitle: "Absolute precision. Tactical performance.", heroText: "Your vehicle is a tool. We prepare it for any mission.", 
            heroBtn: "Request appointment", marketTitle: "1. Buy/Sell", uploadItemBtn: "+ Upload Item", repairTitle: "2. Repair / Modification Unit", sendBtn: "Send Request", galleryTitle: "Operations (Gallery)", uploadPhotoBtn: "+ Add Photo", cookiesTitle: "Tactical Notice (Cookies)", cookiesText: "We use cookies to improve our services accuracy. Accept?", cookiesAccept: "Affirmative, accept", loginTitle: "Restricted Access", noAccount: "No account?", registerHere: "Register here", registerTitle: "New Recruit", hasAccount: "Already have an account?", profileTitle: "Edit Profile", profileDesc: "Update your credentials.", saveChanges: "Save Changes", configTitle: "Settings", configDesc: "Select interface language.", applyBtn: "Apply", closeBtn: "Close", cancelBtn: "Cancel", uploadItemTitle: "Add to Market", publishBtn: "Publish", uploadPhotoTitle: "Add Photo", addBtn: "Add", cartTitle: "Cart", checkoutBtn: "Confirm Checkout", continueBtn: "Continue Shopping", privacyTitle: "Privacy Policy, Cookies & Legal Notice", selectService: "-- Select Service --", optRepair: "Technical Repair", optMod: "Modification & Upgrades", payMethod: "Payment Method:", newEmailLabel: "New Email:", newPassLabel: "New Password (Optional):", currentPassLabel: "* CURRENT Password (Required):", sellerLabel: "Seller", catLabel: "Category", emptyCart: "The cart is empty.", userHolder: "Username", passHolder: "Password", emailHolder: "Email (Required)", itemNameHolder: "Name", itemCatHolder: "Category", itemPriceHolder: "Price", itemImgHolder: "Image URL", itemDescHolder: "Item description...", cardNum: "Card Number (12 digits)", vehicleHolder: "Vehicle (Brand & Model)", descHolder: "Describe the damage...", benefitsTitle: "Join Advantages", benefit1: "Sell your own items.", benefit2: "Buy exclusive equipment.", benefit3: "Upload photos.", benefit4: "Access to exclusive discounts.", benefit5: "Exclusive 20% welcome bonus on your first purchase.", continueRegisterBtn: "Continue to Registration", footerPrivacy: "Privacy Protocols & Terms", footerCookiesTitle: "Active Cookie Usage", footerCookiesInfo: "Note: We use essential cookies.", seeMoreBtn: "See all items", seeLessBtn: "See less", chatTitle: "Tactical Support", chatWelcome: "Agent online. How can I help you today?", chatInput: "Type your message...", chatSendBtn: "SEND",
            discountsMenu: "My Discounts", discountsSubtitle: "Level up by making purchases.", discountPlaceholder: "Discount code", applyCodeBtn: "Apply", noDiscounts: "No discounts yet.",
            welcomeDiscount: "20% discount on your first order.", bronze: "10% store discount.", silver: "15% store discount.", gold: "20% store discount.", elite: "25% absolute discount.", historyMenu: "Order History",
            forgotPass: "Forgot your password?", forgotTitle: "Recover Password", resetBtn: "Reset Password", backLogin: "Back to Login", forgotUserHolder: "Username", forgotEmailHolder: "Registration Email", forgotNewPassHolder: "New Password",
            payOptCard: "Credit/Debit Card", payOptPayPal: "PayPal", payOptCrypto: "Cryptocurrency", paypalHolder: "Linked PayPal Email", cryptoHolder: "Wallet Address (BTC/ETH)", cartTotalLabel: "Total:",
            historyDesc: "Your operations at Tactical Reparations.", historyMyPurchases: "My Purchases", historyMySales: "My Sales (Market)", alertTitle: "System Notice", alertBtn: "UNDERSTOOD", footerContact: "Contact:",
            policyLegalTitle: "1. Legal Notice", policyLegalText: "Tactical Reparations is a virtual platform dedicated to providing advanced automotive services. All rights reserved.", policyDataTitle: "2. Data Usage (Privacy)", policyDataText: "We collect strictly necessary information to manage your Agent account, process your orders, and provide technical support. Your credentials are processed securely. We do not sell information to third parties.", policyCookiesTitle: "3. Cookies Policy", policyCookiesText: "We use essential technical and session cookies (Local Storage) to maintain your cart inventory, apply discounts, keep your history, and remember your language. We do not use external advertising trackers.", copyrightText: "© 2026 Tactical Reparations. All rights reserved."
        }
    };

    const applyLanguage = (lang) => {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if(translations[lang][key]) el.textContent = translations[lang][key];
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if(translations[lang][key]) el.placeholder = translations[lang][key];
        });
        document.getElementById("language-selector").value = lang;
        if(mercadoActual) renderizarMercado();
        actualizarCarritoUI(); 
    };

    const closeAllPopups = () => {
        Object.values(popups).forEach(p => p.classList.remove("active"));
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    };
    document.querySelectorAll(".btn-close-popup").forEach(btn => btn.addEventListener("click", closeAllPopups));

    // --- MENÚ RESPONSIVE MÓVIL ---
    const mobileBtn = document.getElementById("mobile-menu-btn");
    if(mobileBtn && nav.navMenu) {
        mobileBtn.addEventListener("click", () => {
            nav.navMenu.classList.toggle("mobile-active");
        });
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
        });
    });

    if (localStorage.getItem("tactical_cookies_accepted") === "true") {
        popups.cookie.classList.remove("active");
        mainContent.style.display = "block";
    }

    document.getElementById("btn-accept-cookies")?.addEventListener("click", () => {
        localStorage.setItem("tactical_cookies_accepted", "true");
        popups.cookie.classList.remove("active");
        mainContent.style.display = "block";
        if(typeof swiper !== 'undefined') swiper.update();
    });

    nav.loginBtn?.addEventListener("click", () => {
        popups.login.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });
    document.getElementById("link-footer-privacy")?.addEventListener("click", (e) => { e.preventDefault(); popups.privacyPolicy.classList.add("active"); });
    
    nav.userTrigger?.addEventListener("click", (e) => { 
        e.stopPropagation(); 
        nav.userContent.classList.toggle("show"); 
    });
    
    window.addEventListener("click", (e) => {
        if (!e.target.matches('#btn-user-menu-trigger') && nav.userContent) nav.userContent.classList.remove('show');
    });

    document.getElementById("btn-menu-profile")?.addEventListener("click", (e) => {
        e.preventDefault(); popups.editProfile.classList.add("active");
        document.getElementById("edit-email").value = usuarioActual.email;
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });

    // --- POPUP DESCUENTOS BILINGÜE ---
    document.getElementById("btn-menu-discounts")?.addEventListener("click", (e) => {
        e.preventDefault(); 
        popups.discounts.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
        
        const descContainer = document.getElementById("user-discounts-container");
        const compras = usuarioActual.compras || 0;
        const lang = currentLang;
        
        if (compras === 0) {
            descContainer.innerHTML = `<span style="color:#00ffcc; font-size:1.1rem; font-weight:bold;">${lang==='es'?'Rango Novato':'Rookie Rank'}:</span> ${translations[lang].welcomeDiscount} <br><br><span style="color:var(--text-main);">${lang==='es'?'Codigo valido':'Valid Code'}:</span> <strong style="color:var(--primary-color);">WELCOME20</strong><br><br><small style="color:#666;">${lang==='es'?'Haz tu primera compra para desbloquear los niveles de socio.':'Make your first purchase to unlock membership tiers.'}</small>`;
        } else if (compras >= 1 && compras <= 2) {
            descContainer.innerHTML = `<span style="color:#cd7f32; font-size:1.1rem; font-weight:bold;">${lang==='es'?'Rango Bronce':'Bronze Rank'}:</span> ${translations[lang].bronze} <br><br><span style="color:var(--text-main);">${lang==='es'?'Codigo valido':'Valid Code'}:</span> <strong style="color:var(--primary-color);">BRONCE10</strong><br><br><small style="color:#666;">${lang==='es'?`Compras realizadas: ${compras}/3 para ascender a Plata`:`Purchases: ${compras}/3 to reach Silver Rank`}</small>`;
        } else if (compras >= 3 && compras <= 5) {
            descContainer.innerHTML = `<span style="color:#c0c0c0; font-size:1.1rem; font-weight:bold;">${lang==='es'?'Rango Plata':'Silver Rank'}:</span> ${translations[lang].silver} <br><br><span style="color:var(--text-main);">${lang==='es'?'Codigo valido':'Valid Code'}:</span> <strong style="color:var(--primary-color);">PLATA15</strong><br><br><small style="color:#666;">${lang==='es'?`Compras realizadas: ${compras}/6 para ascender a Oro`:`Purchases: ${compras}/6 to reach Gold Rank`}</small>`;
        } else if (compras >= 6 && compras <= 9) {
            descContainer.innerHTML = `<span style="color:#ffd700; font-size:1.1rem; font-weight:bold;">${lang==='es'?'Rango Oro':'Gold Rank'}:</span> ${translations[lang].gold} <br><br><span style="color:var(--text-main);">${lang==='es'?'Codigo valido':'Valid Code'}:</span> <strong style="color:var(--primary-color);">ORO20</strong><br><br><small style="color:#666;">${lang==='es'?`Compras realizadas: ${compras}/10 para ascender a Elite`:`Purchases: ${compras}/10 to reach Elite Rank`}</small>`;
        } else {
            descContainer.innerHTML = `<span style="color:#e5e4e2; font-size:1.1rem; font-weight:bold; text-shadow: 0 0 5px #fff;">${lang==='es'?'Rango Elite':'Elite Rank'}:</span> ${translations[lang].elite} <br><br><span style="color:var(--text-main);">${lang==='es'?'Codigo valido':'Valid Code'}:</span> <strong style="color:var(--primary-color);">ELITE25</strong><br><br><small style="color:#666;">${lang==='es'?`Agente legendario. Compras totales: ${compras}`:`Legendary Agent. Total purchases: ${compras}`}</small>`;
        }
    });

    // --- POPUP HISTORIAL BILINGÜE ---
    document.getElementById("btn-menu-history")?.addEventListener("click", (e) => {
        e.preventDefault();
        popups.history.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
        
        const boxCompras = document.getElementById("history-purchases");
        const boxVentas = document.getElementById("history-sales");
        const lang = currentLang;
        
        if (!usuarioActual.historialCompras || usuarioActual.historialCompras.length === 0) {
            boxCompras.innerHTML = `<p style='color:var(--text-muted);'>${lang==='es'?'No has realizado compras aun.':'You have not made any purchases yet.'}</p>`;
        } else {
            boxCompras.innerHTML = usuarioActual.historialCompras.map(compra => 
                `<div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">
                    <strong style="color:var(--primary-color);">${lang==='es'?'ID Pedido:':'Order ID:'} ${compra.pedido}</strong> <span style="color:#aaa;">(${compra.fecha})</span><br>
                    <span style="color:#aaa;">${lang==='es'?'Articulos:':'Items:'}</span> <span style="color:#fff;">${compra.items}</span><br>
                    <span style="color:#aaa;">${lang==='es'?'Total Pagado:':'Total Paid:'}</span> <span style="color:#fff;">${compra.total}</span>
                </div>`
            ).reverse().join("");
        }

        const misVentas = mercadoActual.filter(p => p.vendedor === usuarioActual.user);
        if (misVentas.length === 0) {
            boxVentas.innerHTML = `<p style='color:var(--text-muted);'>${lang==='es'?'No has publicado articulos en el mercado.':'You have not published any items in the market.'}</p>`;
        } else {
            boxVentas.innerHTML = misVentas.map(venta => {
                const nombreItem = lang === 'en' && venta.nombreEn ? venta.nombreEn : venta.nombre;
                return `<div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">
                    <strong style="color:#fff;">${nombreItem}</strong><br>
                    <span style="color:#aaa;">${lang==='es'?'Precio:':'Price:'}</span> <span style="color:var(--primary-color); font-weight:bold;">${formatearPrecio(venta.precio)}</span>
                </div>`
            }).reverse().join("");
        }
    });

    document.getElementById("btn-menu-config")?.addEventListener("click", (e) => { 
        e.preventDefault(); 
        popups.config.classList.add("active"); 
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });
    
    document.getElementById("btn-menu-logout")?.addEventListener("click", (e) => { 
        e.preventDefault(); 
        logout(); 
    });

    const saveUsers = () => localStorage.setItem("tactical_users", JSON.stringify(usuariosRegistrados));

    // --- LOGICA DE NAVEGACION DE LOGIN/REGISTRO/RECUPERAR ---
    document.getElementById("link-to-register-start")?.addEventListener("click", (e) => { 
        e.preventDefault(); 
        popups.login.classList.remove("active"); 
        popups.benefits.classList.add("active"); 
    });
    
    document.getElementById("btn-continue-register")?.addEventListener("click", () => { 
        popups.benefits.classList.remove("active"); 
        authForms.login.style.display = "none"; 
        authForms.forgot.style.display = "none";
        authForms.register.style.display = "block"; 
        popups.login.classList.add("active"); 
    });
    
    document.getElementById("link-to-login")?.addEventListener("click", (e) => { 
        e.preventDefault(); 
        authForms.register.style.display = "none"; 
        authForms.forgot.style.display = "none";
        authForms.login.style.display = "block"; 
    });

    document.getElementById("link-forgot-pass")?.addEventListener("click", (e) => {
        e.preventDefault();
        authForms.login.style.display = "none";
        authForms.register.style.display = "none";
        authForms.forgot.style.display = "block";
    });

    document.getElementById("link-back-login")?.addEventListener("click", (e) => {
        e.preventDefault();
        authForms.forgot.style.display = "none";
        authForms.register.style.display = "none";
        authForms.login.style.display = "block";
    });

    document.getElementById("btn-reset-pass")?.addEventListener("click", () => {
        const user = document.getElementById("forgot-username").value.trim();
        const email = document.getElementById("forgot-email").value.trim();
        const newPass = document.getElementById("forgot-new-pass").value.trim();
        
        if(!user || !email || !newPass) { 
            showAlert(currentLang === 'es' ? "Completa todos los campos obligatorios." : "Please fill in all fields."); 
            return; 
        }
        
        let foundUser = usuariosRegistrados.find(u => u.user === user && u.email === email);
        if(foundUser) {
            foundUser.pass = newPass;
            saveUsers();
            showAlert(currentLang === 'es' ? "Contraseña actualizada con exito." : "Password updated successfully.", () => {
                authForms.forgot.style.display = "none";
                authForms.login.style.display = "block";
                document.getElementById("forgot-username").value = "";
                document.getElementById("forgot-email").value = "";
                document.getElementById("forgot-new-pass").value = "";
            });
        } else {
            showAlert(currentLang === 'es' ? "Usuario o email incorrectos. No coinciden los datos de registro." : "Incorrect username or email. Registration data does not match.");
        }
    });

    document.getElementById("btn-register")?.addEventListener("click", () => {
        const userVal = document.getElementById("reg-username").value.trim();
        const emailVal = document.getElementById("reg-email").value.trim();
        const passVal = document.getElementById("reg-password").value.trim();
        
        if(emailVal === "" || !emailVal.includes("@")) { showAlert(currentLang === 'es' ? "Email invalido." : "Invalid email."); return; }
        if(userVal === "" || passVal === "") { showAlert(currentLang === 'es' ? "Usuario y contraseña obligatorios." : "Username and password required."); return; }
        if(usuariosRegistrados.find(u => u.user === userVal)) { showAlert(currentLang === 'es' ? "Ese usuario ya existe." : "Username already exists."); return; }

        usuariosRegistrados.push({ user: userVal, pass: passVal, email: emailVal, compras: 0, ultimoUsoCupon: null, ultimoCuponUsado: "", historialCompras: [] });
        saveUsers();
        showAlert(currentLang === 'es' ? "Cuenta creada con exito. Ahora puedes iniciar sesion." : "Account created successfully. You can now log in.", () => {
            authForms.register.style.display = "none"; 
            authForms.login.style.display = "block";
        });
    });

    document.getElementById("btn-login")?.addEventListener("click", () => {
        const userVal = document.getElementById("username").value.trim();
        const passVal = document.getElementById("password").value.trim();
        const userFound = usuariosRegistrados.find(u => u.user === userVal);

        if(!userFound || userFound.pass !== passVal) { 
            showAlert(currentLang === 'es' ? "Usuario o contraseña incorrectos." : "Incorrect username or password."); 
        } else {
            usuarioActual = userFound;
            if(!usuarioActual.historialCompras) usuarioActual.historialCompras = [];
            localStorage.setItem("tactical_current_user", JSON.stringify(usuarioActual)); 
            closeAllPopups();
            nav.loginBtn.style.display = "none";
            nav.userDropdown.style.display = "block";
            nav.userTrigger.textContent = usuarioActual.user;
        }
    });

    const logout = () => { 
        usuarioActual = null; 
        localStorage.removeItem("tactical_current_user"); 
        nav.userDropdown.style.display = "none"; 
        nav.loginBtn.style.display = "block"; 
        showAlert(currentLang === 'es' ? "Sesion cerrada correctamente." : "Logged out successfully."); 
    };

    document.getElementById("btn-save-profile")?.addEventListener("click", () => {
        const newEmail = document.getElementById("edit-email").value.trim();
        const newPass = document.getElementById("edit-new-pass").value.trim();
        const currentPassCheck = document.getElementById("edit-current-pass").value.trim();

        if(currentPassCheck !== usuarioActual.pass) { showAlert(currentLang === 'es' ? "Contraseña actual incorrecta." : "Current password incorrect."); return; }
        if(newEmail === "" || !newEmail.includes("@")) { showAlert(currentLang === 'es' ? "Email invalido." : "Invalid email."); return; }
        
        usuarioActual.email = newEmail;
        if(newPass !== "") usuarioActual.pass = newPass;
        
        const index = usuariosRegistrados.findIndex(u => u.user === usuarioActual.user);
        usuariosRegistrados[index] = usuarioActual;
        saveUsers();
        localStorage.setItem("tactical_current_user", JSON.stringify(usuarioActual)); 
        
        showAlert(currentLang === 'es' ? "Perfil actualizado correctamente." : "Profile updated successfully.", () => {
            popups.editProfile.classList.remove("active");
            document.getElementById("edit-current-pass").value = "";
            document.getElementById("edit-new-pass").value = "";
        });
    });

    document.getElementById("btn-save-config")?.addEventListener("click", () => {
        currentLang = document.getElementById("language-selector").value;
        localStorage.setItem("tactical_lang", currentLang);
        applyLanguage(currentLang);
        popups.config.classList.remove("active");
    });

    // --- MERCADO (CON DESCRIPCIONES EN INGLÉS) ---
    const fallbackImage = "https://placehold.co/600x400/111111/7ab317?text=Articulo+Tactico";

    const productosBase = [
        { id: 1, nombre: "Motor V8 Blindado", nombreEn: "Armored V8 Engine", tipo: "Mecanica Pesada", tipoEn: "Heavy Mechanics", precio: 4500, vendedor: "Tactical HQ", imagen: "https://media.istockphoto.com/id/528918828/es/foto/motor-de-automoci%C3%B3n-3d-ilustraci%C3%B3n.jpg?s=612x612&w=0&k=20&c=o5ejIooVV10-5hFTbCv1l1IETRzSaHqupWhT-LRPbGc=", descripcion: "Motor de bloque grande optimizado para resistir impactos y mantener el rendimiento en condiciones extremas.", descripcionEn: "Big block engine optimized to withstand impacts and maintain performance under extreme conditions." },
        { id: 2, nombre: "Neumaticos Tacticos Off-Road", nombreEn: "Tactical Off-Road Tires", tipo: "Movilidad", tipoEn: "Mobility", precio: 800, vendedor: "Tactical HQ", imagen: "https://www.muchoneumatico.com/blog/wp-content/uploads/2020/01/Neum%C3%A1ticos-4x4-extremos-MT-MS.jpg", descripcion: "Juego de 4 neumaticos de compuesto militar con diseño de banda de rodadura agresivo para barro y roca.", descripcionEn: "Set of 4 military compound tires with aggressive tread design for mud and rock." },
        { id: 3, nombre: "Kit de Suspension Reforzada", nombreEn: "Reinforced Suspension Kit", tipo: "Modificacion", tipoEn: "Upgrades", precio: 1200, vendedor: "Tactical HQ", imagen: "https://www.tot4x4.com/2269-large_default/kit-de-suspension-reforzada-30mm-efs-diesel.jpg", descripcion: "Sistema de suspension de largo recorrido con amortiguadores de nitrogeno presurizado.", descripcionEn: "Long-travel suspension system with pressurized nitrogen shocks." },
        { id: 4, nombre: "Pintura Absorbe-Radar (Mate)", nombreEn: "Radar-Absorbent Paint (Matte)", tipo: "Estetica / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 1500, vendedor: "Tactical HQ", imagen: "https://montopinturas.com/public/Image/2023/7/502230.png", descripcion: "Recubrimiento ceramico avanzado con propiedades de absorcion de ondas de radar.", descripcionEn: "Advanced ceramic coating with radar wave absorption properties." },
        { id: 5, nombre: "Blindaje Ligero de Puertas", nombreEn: "Light Door Armor", tipo: "Defensa", tipoEn: "Defense", precio: 2100, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1592853625601-bb9d23da12fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Paneles de blindaje compuesto de nivel III+ para instalacion interna en puertas de vehiculos.", descripcionEn: "Level III+ composite armor panels for internal installation in vehicle doors." },
        { id: 6, nombre: "Luces LED de Alta Intensidad", nombreEn: "High-Intensity LED Lights", tipo: "Vision", tipoEn: "Vision", precio: 450, vendedor: "Tactical HQ", imagen: "https://asxstore.com/cdn/shop/files/pop-up.png?v=1685366963&width=1080", descripcion: "Barra de luz LED de grado tactico con una salida combinada de 30,000 lumenes.", descripcionEn: "Tactical-grade LED light bar with a combined output of 30,000 lumens." },
        { id: 7, nombre: "Kit de Frenos Ceramicos", nombreEn: "Ceramic Brake Kit", tipo: "Mecanica Pesada", tipoEn: "Heavy Mechanics", precio: 1800, vendedor: "Tactical HQ", imagen: "https://www.gt2i.es/175814-medium_default/vwr-kit-freno-stage-3-para-bastidor-mqb-mqb-evo-discos-380mm-carbono-ceramica-pinza-6-pistones.jpg", descripcion: "Discos de freno carbono-ceramicos perforados y ventilados. Resisten temperaturas extremas.", descripcionEn: "Carbon-ceramic drilled and vented brake discs. Withstand extreme temperatures." },
        { id: 8, nombre: "Asientos Tacticos Recaro", nombreEn: "Tactical Recaro Seats", tipo: "Estetica / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 950, vendedor: "Tactical HQ", imagen: "https://www.recarospain.com/wp-content/uploads/2018/06/recaro_sportster_cs_kule_schw_di_silber.jpg", descripcion: "Asientos deportivos tipo baquet con arneses de 5 puntos. Tejido ignifugo.", descripcionEn: "Bucket-style sports seats with 5-point harnesses. Fire-retardant fabric." },
        { id: 9, nombre: "Cristales Antibalas Nivel 4", nombreEn: "Level 4 Bulletproof Glass", tipo: "Defensa", tipoEn: "Defense", precio: 3200, vendedor: "Tactical HQ", imagen: "https://s.alicdn.com/@sc04/kf/He66a4cd8b98b47358fa1093334495a72D/High-Quality-Bulletproof-Auto-Glass-Shield-Bullet-Resistance-Glass-Windshield-for-Car-Windows.jpg_300x300.jpg", descripcion: "Juego de cristales de policarbonato laminado ultragrueso. Capaces de detener impactos de calibres pesados.", descripcionEn: "Ultra-thick laminated polycarbonate glass set. Capable of stopping heavy calibers." }
    ];
    
    let mercadoActual = JSON.parse(localStorage.getItem("tactical_mercado_100")) || productosBase;
    if (!localStorage.getItem("tactical_mercado_100")) localStorage.setItem("tactical_mercado_100", JSON.stringify(productosBase));
    
    const formatearPrecio = (p) => p.toLocaleString(currentLang === 'es' ? "es-ES" : "en-US") + (currentLang === 'es' ? "€" : "$");

    const renderizarMercado = () => {
        const contenedor = document.getElementById("productos-db");
        if(!contenedor) return; contenedor.innerHTML = "";
        
        const catLabel = currentLang === 'es' ? "Categoria" : "Category";
        const sellerLabel = currentLang === 'es' ? "Vendedor" : "Seller";
        const btnText = currentLang === 'es' ? "Añadir" : "Add";

        const itemsAMostrar = verTodosMercado ? mercadoActual : mercadoActual.slice(0, 8);

        itemsAMostrar.forEach(p => {
            const nombre = currentLang === 'en' && p.nombreEn ? p.nombreEn : p.nombre;
            const desc = currentLang === 'en' && p.descripcionEn ? p.descripcionEn : p.descripcion;
            const tipo = currentLang === 'en' && p.tipoEn ? p.tipoEn : p.tipo;
            
            contenedor.innerHTML += `
            <div class="card">
                <div class="img-container"><img src="${p.imagen}" alt="${nombre}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>
                <h3 style="margin-top:5px;">${nombre}</h3>
                <p style="color:#888;font-size:0.9rem;">${catLabel}: ${tipo}</p>
                <div class="card-details-hidden">
                    <p style="font-size:0.8rem; margin-bottom:10px; color:#aaa;">${sellerLabel}: <span style="color:var(--primary-color);">${p.vendedor}</span></p>
                    <p style="font-size:0.95rem; color:#fff; margin-bottom:15px; line-height:1.4; text-align: left;">${desc}</p>
                    <p class="price" style="font-size: 1.8rem; font-weight: bold; margin-bottom: 15px; color: white;">${formatearPrecio(p.precio)}</p>
                    <button class="btn-primary btn-add-cart" data-id="${p.id}" style="width:100%; padding:12px;">${btnText}</button>
                </div>
            </div>`;
        });

        if (mercadoActual.length > 8) {
            contenedor.innerHTML += `
            <div style="grid-column: 1 / -1; margin-top: 30px; text-align: center;">
                <button id="btn-toggle-market" class="${verTodosMercado ? 'btn-secondary' : 'btn-primary'}" style="display:inline-block; width:auto; padding:15px 30px; font-size:1rem;">
                    ${verTodosMercado ? translations[currentLang].seeLessBtn : translations[currentLang].seeMoreBtn}
                </button>
            </div>`;
        }

        document.querySelectorAll('.btn-add-cart').forEach(btn => btn.addEventListener('click', (e) => añadirAlCarrito(parseInt(e.target.dataset.id))));
        
        const toggleBtn = document.getElementById("btn-toggle-market");
        if(toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                verTodosMercado = !verTodosMercado;
                renderizarMercado();
            });
        }
    };

    document.getElementById("btn-open-upload-item")?.addEventListener("click", () => {
        if(!usuarioActual) { showAlert(currentLang === 'es' ? "Inicia sesion para publicar." : "Log in to publish."); popups.login.classList.add("active"); return; }
        popups.uploadItem.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });
    
    document.getElementById("btn-submit-item")?.addEventListener("click", () => {
        const nombre = document.getElementById("new-item-name").value; 
        const precio = parseFloat(document.getElementById("new-item-price").value); 
        const imagen = document.getElementById("new-item-img").value;
        if(nombre && precio && imagen) {
            mercadoActual.push({ id: Date.now(), nombre: nombre, tipo: document.getElementById("new-item-type").value, precio: precio, vendedor: usuarioActual.user, imagen: imagen, descripcion: document.getElementById("new-item-desc").value });
            localStorage.setItem("tactical_mercado_100", JSON.stringify(mercadoActual));
            renderizarMercado(); popups.uploadItem.classList.remove("active");
        } else { showAlert(currentLang === 'es' ? "Faltan campos obligatorios." : "Missing required fields."); }
    });

    // --- CARRITO Y PAGOS ---
    let carrito = [];
    const actualizarCarritoUI = () => {
        const cont = document.getElementById("cart-items-container");
        const btnCheckout = document.getElementById("btn-checkout");
        const priceElement = document.getElementById("cart-total-price");
        const discElement = document.getElementById("cart-discounted-price");
        
        cont.innerHTML = ""; let totalP = 0; let totalI = 0;
        
        if(carrito.length === 0) {
            cont.innerHTML = `<p style="color:var(--text-muted);text-align:center;">${translations[currentLang].emptyCart}</p>`;
            document.getElementById("payment-section").style.display = "none";
            document.getElementById("discount-section").style.display = "none";
            btnCheckout.style.display = "none";
            descuentoActual = 0;
            codigoAplicado = "";
        } else {
            document.getElementById("payment-section").style.display = "block";
            document.getElementById("discount-section").style.display = "flex";
            btnCheckout.style.display = "block";
            carrito.forEach(item => { 
                totalP += (item.precio * item.cantidad); totalI += item.cantidad;
                const nom = currentLang === 'en' && item.nombreEn ? item.nombreEn : item.nombre;
                cont.innerHTML += `<div class="cart-item"><div class="cart-item-info"><h4>${nom}</h4><p>${formatearPrecio(item.precio)}</p></div><div class="cart-controls"><button class="btn-qty btn-restar" data-id="${item.id}">-</button><span>${item.cantidad}</span><button class="btn-qty btn-sumar" data-id="${item.id}">+</button></div></div>`; 
            });
        }

        let totalFinal = totalP - (totalP * descuentoActual);
        
        if(descuentoActual > 0) {
            priceElement.style.textDecoration = "line-through";
            priceElement.style.color = "var(--text-muted)";
            priceElement.textContent = formatearPrecio(totalP);
            discElement.style.display = "inline";
            discElement.textContent = formatearPrecio(totalFinal);
        } else {
            priceElement.style.textDecoration = "none";
            priceElement.style.color = "var(--primary-color)";
            priceElement.textContent = formatearPrecio(totalP);
            discElement.style.display = "none";
        }

        document.getElementById("cart-count").textContent = totalI;
        document.querySelectorAll('.btn-sumar').forEach(btn => btn.addEventListener('click', (e) => modCan(parseInt(e.target.dataset.id), 1)));
        document.querySelectorAll('.btn-restar').forEach(btn => btn.addEventListener('click', (e) => modCan(parseInt(e.target.dataset.id), -1)));
    };
    
    document.getElementById("btn-apply-discount")?.addEventListener("click", () => {
        if(!usuarioActual) {
            showAlert(currentLang === 'es' ? "Debes iniciar sesion para usar descuentos." : "You must log in to use discounts.");
            return;
        }

        const code = document.getElementById("discount-code").value.trim().toUpperCase();
        const compras = usuarioActual.compras || 0;
        let validCodeForUser = "";
        let expDiscount = 0;

        if (compras === 0 && code === "WELCOME20") { validCodeForUser = "WELCOME20"; expDiscount = 0.20; }
        else if (compras >= 1 && compras <= 2) { validCodeForUser = "BRONCE10"; expDiscount = 0.10; }
        else if (compras >= 3 && compras <= 5) { validCodeForUser = "PLATA15"; expDiscount = 0.15; }
        else if (compras >= 6 && compras <= 9) { validCodeForUser = "ORO20"; expDiscount = 0.20; }
        else if (compras >= 10) { validCodeForUser = "ELITE25"; expDiscount = 0.25; }

        if (code !== validCodeForUser) {
            showAlert(currentLang === 'es' ? "Codigo invalido o no corresponde a tu nivel actual." : "Invalid code or doesn't match your current rank.");
            descuentoActual = 0;
            codigoAplicado = "";
            actualizarCarritoUI();
            return;
        }

        if (usuarioActual.ultimoUsoCupon && usuarioActual.ultimoCuponUsado === code) {
            const diasPasados = (Date.now() - usuarioActual.ultimoUsoCupon) / (1000 * 60 * 60 * 24);
            if (diasPasados < 14) {
                const diasRestantes = Math.ceil(14 - diasPasados);
                showAlert(currentLang === 'es' ? `Aun no puedes usar de nuevo este cupon. Faltan ${diasRestantes} dias.` : `You cannot reuse this coupon yet. ${diasRestantes} days remaining.`);
                descuentoActual = 0;
                codigoAplicado = "";
                actualizarCarritoUI();
                return;
            }
        }

        descuentoActual = expDiscount;
        codigoAplicado = code;
        showAlert(currentLang === 'es' ? `Descuento tactico aplicado: ${descuentoActual*100}%` : `Tactical discount applied: ${descuentoActual*100}%`);
        actualizarCarritoUI();
    });

    const modCan = (id, c) => { const pc = carrito.find(i => i.id === id); if(pc) { pc.cantidad += c; if(pc.cantidad <= 0) carrito = carrito.filter(i => i.id !== id); } actualizarCarritoUI(); };
    
    const añadirAlCarrito = (id) => {
        if(!usuarioActual) { showAlert(currentLang === 'es' ? "Inicia sesion primero." : "Log in first."); popups.login.classList.add("active"); return; }
        const pdb = mercadoActual.find(p => p.id === id); if(pdb.vendedor === usuarioActual.user) { showAlert(currentLang === 'es' ? "No puedes comprar tu propio item." : "You can't buy your own item."); return; }
        const pc = carrito.find(i => i.id === id); if(pc) pc.cantidad +=1; else carrito.push({...pdb, cantidad:1}); actualizarCarritoUI();
    };
    
    document.getElementById("btn-open-cart")?.addEventListener("click", () => {
        popups.cart.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });

    // EVENTOS DE FORMATO DE PAGO ESTRICTOS
    const cardNumInput = document.getElementById("card-num");
    if(cardNumInput) {
        cardNumInput.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, ''); 
            if (v.length > 12) v = v.substring(0, 12); 
            e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        });
    }

    const cardDateInput = document.getElementById("card-date");
    if(cardDateInput) {
        cardDateInput.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 4) v = v.substring(0, 4); 
            if (v.length >= 2) {
                let m = parseInt(v.substring(0,2));
                if (m === 0) m = 1; 
                if (m > 12) m = 12; 
                let mStr = m.toString().padStart(2, '0');
                e.target.value = mStr + '/' + v.substring(2);
            } else {
                e.target.value = v;
            }
        });
    }

    const cardCvcInput = document.getElementById("card-cvc");
    if(cardCvcInput) {
        cardCvcInput.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 3) v = v.substring(0, 3); 
            e.target.value = v;
        });
    }

    document.getElementById("payment-method")?.addEventListener("change", (e) => { 
        document.getElementById("card-details").style.display = "none";
        document.getElementById("paypal-details").style.display = "none";
        document.getElementById("cripto-details").style.display = "none";

        if(e.target.value === "tarjeta") document.getElementById("card-details").style.display = "block";
        else if(e.target.value === "paypal") document.getElementById("paypal-details").style.display = "block";
        else if(e.target.value === "cripto") document.getElementById("cripto-details").style.display = "block";
    });

    document.getElementById("btn-checkout")?.addEventListener("click", () => {
        if(carrito.length > 0) {
            
            const method = document.getElementById("payment-method").value;
            if(method === "tarjeta") {
                const cNum = document.getElementById("card-num").value.replace(/\s/g, ''); 
                const cDate = document.getElementById("card-date").value.trim();
                const cCvc = document.getElementById("card-cvc").value.trim();
                if(cNum.length < 12 || cDate.length < 5 || cCvc.length < 3) {
                    showAlert(currentLang === 'es' ? "Faltan datos obligatorios de la Tarjeta (12 digitos, Fecha MM/AA, 3 digitos CVC)." : "Missing exact Card data (12 digits, Date MM/YY, 3-digit CVC)."); return;
                }
            } else if(method === "paypal") {
                const pEmail = document.getElementById("paypal-email").value.trim();
                if(pEmail === "" || !pEmail.includes("@")) {
                    showAlert(currentLang === 'es' ? "Introduce un email valido de PayPal." : "Enter a valid PayPal email."); return;
                }
            } else if(method === "cripto") {
                const wAddr = document.getElementById("cripto-wallet").value.trim();
                if(wAddr.length < 10) {
                    showAlert(currentLang === 'es' ? "Introduce una direccion valida de tu Wallet." : "Enter a valid Wallet address."); return;
                }
            }

            let totalP = 0;
            carrito.forEach(item => totalP += (item.precio * item.cantidad));
            let totalFinal = totalP - (totalP * descuentoActual);
            
            const orderId = "TR-" + Math.floor(100000 + Math.random() * 900000);
            const dateStr = new Date().toLocaleDateString();

            if (!usuarioActual.historialCompras) usuarioActual.historialCompras = [];
            usuarioActual.historialCompras.push({
                pedido: orderId,
                fecha: dateStr,
                total: formatearPrecio(totalFinal),
                items: carrito.map(i => (currentLang === 'en' && i.nombreEn ? i.nombreEn : i.nombre) + " (x" + i.cantidad + ")").join(", ")
            });

            if (descuentoActual > 0 && codigoAplicado !== "") {
                usuarioActual.ultimoUsoCupon = Date.now();
                usuarioActual.ultimoCuponUsado = codigoAplicado;
            }

            usuarioActual.compras = (usuarioActual.compras || 0) + 1;
            const index = usuariosRegistrados.findIndex(u => u.user === usuarioActual.user);
            usuariosRegistrados[index] = usuarioActual;
            saveUsers();
            localStorage.setItem("tactical_current_user", JSON.stringify(usuarioActual));
            
            const successMsg = currentLang === 'es' 
                ? `Transaccion aprobada, ${usuarioActual.user}.<br><br><span style="color:var(--primary-color);">TU NUMERO DE PEDIDO ES: <strong>${orderId}</strong></span><br><br>Por favor, guardalo para cualquier reclamacion. Tus articulos llegaran pronto.` 
                : `Transaction approved, ${usuarioActual.user}.<br><br><span style="color:var(--primary-color);">YOUR ORDER ID IS: <strong>${orderId}</strong></span><br><br>Please keep it for any claims. Your items will arrive soon.`;
            
            showAlert(successMsg, () => {
                carrito = []; descuentoActual = 0; codigoAplicado = ""; document.getElementById("discount-code").value = "";
                actualizarCarritoUI(); popups.cart.classList.remove("active");
            });
        }
    });

    // --- GALERÍA ARREGLADA ---
    const galeriaBase = ["https://espirituracer.com/archivos/2017/11/Ringbrothers-Ford-Mustang-Mach-1-Patriarc-15.webp","https://i.ytimg.com/vi/uIIaNGFAy6o/sddefault.jpg","https://www.schairerklassiker.de/wp-content/gallery/mb-220-seb-coupe-w111/MB_220SEbC_Fahrerseite.jpg","https://i.pinimg.com/736x/a1/44/1b/a1441b9424550332aa4c96c7b1d2b9b9.jpg","https://d1gl66oyi6i593.cloudfront.net/wp-content/uploads/2022/10/subasta-replica-DeLorean-DMC-12-7.jpg","https://hips.hearstapps.com/hmg-prod/images/porsche-911-gt3-r-101-1659114035.jpg?crop=1xw:0.920416250624064xh;center,top&resize=1200:*"];
    let galeriaActual = JSON.parse(localStorage.getItem("tactical_galeria_100")) || galeriaBase;
    
    let swiper;
    const renderizarGaleria = () => {
        const wrapper = document.getElementById("gallery-wrapper"); if(!wrapper) return; 
        wrapper.innerHTML = "";
        galeriaActual.forEach(url => { wrapper.innerHTML += `<div class="swiper-slide"><img src="${url}" onerror="this.src='${fallbackImage}';"></div>`; });
        
        if(swiper) { swiper.destroy(true, true); }
        setTimeout(() => {
            swiper = new Swiper(".mySwiper", { effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", loop: galeriaActual.length > 3 });
        }, 50);
    };

    document.getElementById("btn-open-upload-photo")?.addEventListener("click", () => { 
        if(!usuarioActual) { showAlert(currentLang === 'es' ? "Inicia sesion para publicar." : "Log in to publish."); popups.login.classList.add("active"); return; } 
        popups.uploadPhoto.classList.add("active"); 
    });

    document.getElementById("btn-submit-photo")?.addEventListener("click", () => { 
        const urlInput = document.getElementById("new-photo-url");
        const url = urlInput.value.trim(); 
        if(url) { 
            galeriaActual.push(url); 
            localStorage.setItem("tactical_galeria_100", JSON.stringify(galeriaActual)); 
            renderizarGaleria(); 
            popups.uploadPhoto.classList.remove("active"); 
            urlInput.value = ""; 
            showAlert(currentLang === 'es' ? "Foto añadida a la galeria con exito." : "Photo successfully added to the gallery.");
        } else { showAlert(currentLang === 'es' ? "Por favor, introduce una URL valida." : "Please enter a valid URL."); }
    });

    // --- TALLER ---
    document.getElementById("form-servicio")?.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        if(!usuarioActual) { showAlert(currentLang === 'es' ? "Inicia sesion para solicitar una cita." : "Log in to request an appointment."); popups.login.classList.add("active"); }
        else { 
            showAlert(currentLang === 'es' ? `Solicitud enviada, ${usuarioActual.user}. Un mecanico se pondra en contacto contigo.` : `Request sent, ${usuarioActual.user}. A mechanic will contact you.`); 
            e.target.reset(); 
        }
    });

    // ====================================================================
    // --- LÓGICA DEL CHATBOT ESTRICTO (DEPENDE DEL IDIOMA DE LA WEB) ---
    // ====================================================================
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle && chatWindow) {
        
        chatToggle.addEventListener('click', () => { 
            chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
            if(chatWindow.style.display === 'flex' && chatMessages.children.length === 1) {
                const welcomeMsg = document.getElementById("chat-welcome");
                const agentName = usuarioActual ? usuarioActual.user : (currentLang === 'es' ? "Agente" : "Agent");
                welcomeMsg.textContent = currentLang === 'es' ? `Bienvenido al sistema, ${agentName}. ¿En que te ayudo hoy?` : `Welcome to the system, ${agentName}. How can I help you today?`;
            }
        });
        
        closeChat.addEventListener('click', () => chatWindow.style.display = 'none');

        const addMessage = (text, sender, isHTML = false) => {
            const msg = document.createElement('div');
            msg.className = sender === 'user' ? 'msg-user' : 'msg-bot';
            if(isHTML) { msg.innerHTML = text; } else { msg.textContent = text; }
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        const botReply = (text) => {
            const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
            let reply = "";
            let isHTML = false;
            let name = usuarioActual ? usuarioActual.user : (currentLang === 'es' ? "Agente" : "Agent");

            const check = (keywords) => keywords.some(word => cleanText.includes(word));
            
            // SI LA WEB ESTÁ EN INGLÉS, CONTESTA EN INGLÉS (ESTRICTO)
            if (currentLang === 'en') {
                if (check(["thank", "thx", "appreciate"])) {
                    reply = `You're welcome, ${name}! Tactical Reparations is here for you. Anything else?`;
                
                } else if (check(["history", "past order", "previous order", "my order"])) {
                    reply = `To check your purchase and sales history, ${name}, click on your name at the top right corner and select 'Order History'. You will see all your past transactions and order codes there.`;
                
                } else if (check(["claim", "return", "refund", "problem", "issue", "complain", "broken", "reclamation", "wrong"])) {
                    reply = `I'm sorry you are experiencing an issue, ${name}. Please fill out our form at the <a href="reclamaciones.html" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Official Support Center</a>. Don't forget to include your Order ID!`;
                    isHTML = true;
                
                } else if (check(["repair", "fix", "workshop", "modify", "mechanic"])) {
                    reply = `For repairs or modifications, ${name}, please submit a request using the 'Workshop' form on our main page. A mechanic will contact you shortly.`;
                
                } else if (check(["gallery", "upload photo", "add photo", "picture"])) {
                    reply = `To upload a photo of your vehicle, ${name}, make sure you are logged in, scroll down to the 'Gallery' section, and click the '+ Add Photo' button.`;
                
                } else if (check(["discount", "coupon", "code", "promo", "level", "rank"])) {
                    reply = `You earn discounts by leveling up through purchases, ${name}. Click your name at the top right and select 'My Discounts' to see your rank and active codes. Note: Codes have a 14-day cooldown!`;
                
                } else if (check(["buy", "purchase", "pay", "cart", "cost", "price", "shop"])) {
                    reply = `To buy items, browse our 'Buy/Sell' section, add products to your cart, and click the Cart button at the top right to checkout. Make sure your card is exactly 12 digits!`;
                
                } else if (check(["sell", "add item", "post item"])) {
                    reply = `To sell your own items, ${name}, log in and go to the 'Buy/Sell' market, then click the '+ Upload Item' button.`;
                
                } else if (check(["pass", "forgot", "recover"])) {
                    reply = `If you forgot your password, ${name}, click the 'Login' button at the top right, and then click 'Forgot your password?'. Enter your username and registration email to reset it.`;
                
                } else if (check(["log out", "logout", "sign out"])) {
                    reply = `To log out, click your name at the top right of the screen and select 'Logout' in red.`;
                
                } else if (check(["sign up", "register", "create account", "join"])) {
                    reply = `To create an account, click the 'Login' button at the top right, then click 'Register here'. Registration allows you to buy, sell, and earn discounts!`;
                
                } else if (check(["log in", "login", "sign in", "enter"])) {
                    reply = `To log in, ${name}, click the 'Login' button in the top right navigation bar.`;
                
                } else if (check(["product", "info", "item", "engine", "motor", "tire", "suspension", "paint", "armor", "light", "brake", "seat", "glass", "catalog"])) {
                    reply = `We offer top-tier tactical gear: Armored V8 Engines, Off-Road Tires, Reinforced Suspensions, Radar-Absorbent Paint, Door Armor, LED Lights, Ceramic Brakes, Recaro Seats, and Bulletproof Glass. Check the 'Buy/Sell' section!`;
                
                } else if (check(["how to use", "how this works", "what is this", "guide"])) {
                    reply = `This is Tactical Reparations, ${name}. You can Buy/Sell tactical vehicle parts, request Workshop repairs, upload photos to the Gallery, and earn Discounts by leveling up your account!`;
                
                } else if (check(["hello", "hi", "hey", "greetings"])) {
                    reply = `Hello, ${name}! I can help you with your order history, uploading photos, buying/selling, or password recovery. What do you need?`;
                
                } else {
                    reply = `I am your virtual assistant, ${name}. I can guide you on how to check your history, buy, sell, upload photos, or manage claims. Could you rephrase your question?`;
                }

            } else {
                // SI LA WEB ESTÁ EN ESPAÑOL, CONTESTA EN ESPAÑOL (ESTRICTO)
                if (check(["gracia", "mersi", "agradezco"])) {
                    reply = `¡Gracias a ti por confiar en Tactical Reparations, ${name}! ¿Puedo ayudarte con algo mas?`;
                
                } else if (check(["historial", "pedidos", "compras hechas", "he comprado", "pasado", "mis compras", "mis ventas"])) {
                    reply = `Para ver tu historial de compras y ventas, ${name}, haz clic en tu nombre arriba a la derecha y selecciona "Historial". Alli veras tus tickets y codigos de pedido.`;
                
                } else if (check(["reclam", "recalam", "devolu", "queja", "sugeren", "problema", "roto", "mal", "incidencia"])) {
                    reply = `Siento mucho tu problema, ${name}. Por favor rellena el formulario en nuestro <a href="reclamaciones.html" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Centro de Soporte Oficial</a>. Necesitaras el codigo de pedido que esta en tu Historial.`;
                    isHTML = true; 
                
                } else if (check(["reparar", "taller", "cita", "arreglo", "modificar", "mecanico"])) {
                    reply = `Para modificar o reparar tu vehiculo, ${name}, utiliza el formulario de la seccion 'Taller' indicando tu modelo. Te responderemos al instante.`;
                
                } else if (check(["galeria", "subir foto", "añadir foto", "imagen", "poner foto"])) {
                    reply = `Para subir una foto, ${name}, inicia sesion primero. Luego baja a la seccion 'Galeria' y pulsa el boton gris '+ Añadir Foto'.`;
                
                } else if (check(["cupon", "codigo", "descuento", "promocion", "nivel", "rango"])) {
                    reply = `Al comprar subes de nivel y ganas descuentos. Abre tu perfil arriba a la derecha y haz clic en "Mis Descuentos" para ver tu codigo. Recuerda que solo se pueden usar 1 vez cada 14 dias habiles.`;
                
                } else if (check(["comprar", "carrito", "pagar", "precio", "cuesta", "adquirir", "tienda"])) {
                    reply = `Para comprar, ${name}, busca el articulo en el mercado y pulsa 'Añadir'. Luego ve al 'Carrito' arriba a la derecha para pagar. La tarjeta debe tener 12 digitos por motivos de seguridad del sistema.`;
                
                } else if (check(["vender", "subir articulo", "añadir articulo", "publicar"])) {
                    reply = `Para poner a la venta una pieza, ${name}, inicia sesion, ve a 'Compra/Venta' y pulsa el boton '+ Subir Articulo'.`;
                
                } else if (check(["cerrar", "salir", "desconectar", "apagar", "sesion"])) {
                    if (check(["iniciar", "entrar", "acceder", "loguear"])) {
                        reply = `Para iniciar sesion, ${name}, haz clic en el boton verde de "Iniciar Sesion" situado en la barra superior derecha.`;
                    } else {
                        reply = `Para cerrar tu sesion, ${name}, haz clic en el boton de arriba a la derecha que dice tu nombre y pulsa en "Cerrar Sesion" (en rojo).`;
                    }
                
                } else if (check(["olvida", "perdi", "recuperar", "contra"])) {
                    reply = `Para recuperar tu contraseña, ${name}, ve al boton de Iniciar Sesion y pincha en "¿Has olvidado tu contraseña?". Introduce tu usuario y correo de registro exactos para cambiarla.`;
                
                } else if (check(["registrar", "crear cuenta", "hacer cuenta", "ventaja", "beneficio"])) {
                    reply = `Registrarte te permite subir de nivel, conseguir codigos de descuento de hasta el 25%, vender piezas, ver tu historial y usar la Galeria. Haz clic en "Iniciar Sesion" y luego en "Registrate aqui".`;
                
                } else if (check(["iniciar", "entrar", "acceder", "loguear"])) {
                    reply = `Para iniciar sesion, ${name}, haz clic en el boton verde de "Iniciar Sesion" situado en la barra superior derecha.`;
                
                } else if (check(["producto", "info", "articulo", "motor", "neumatico", "rueda", "suspension", "pintura", "blindaje", "luce", "freno", "asiento", "cristal", "catalogo"])) {
                    reply = `Ofrecemos equipo tactico de elite: Motores V8 Blindados, Neumaticos Off-Road, Suspension Reforzada, Pintura Absorbe-Radar, Blindaje, Luces LED, Frenos Ceramicos, Asientos Recaro y Cristales Antibalas. ¡Visita 'Compra/Venta'!`;
                
                } else if (check(["como se usa", "como funciona", "que es esto", "guia"])) {
                    reply = `Esto es Tactical Reparations, ${name}. Aqui puedes Comprar/Vender piezas tacticas, pedir cita en el Taller, subir fotos a la Galeria y ganar Descuentos subiendo de nivel con tus compras.`;
                
                } else if(check(["hola", "buenas", "ey", "saludo", "que tal"])) {
                    reply = `¡Hola, ${name}! Preguntame como ver tu historial, subir una foto, usar codigos de descuento, recuperar contraseñas o hacer devoluciones.`;
                
                } else {
                    reply = `Soy la IA de soporte, ${name}. Entiendo preguntas sobre como ver tu historial, subir fotos a la galeria, aplicar cupones, el taller o reclamaciones. ¿Me lo dices de otra manera?`;
                }
            }
            
            setTimeout(() => addMessage(reply, 'bot', isHTML), 800);
        }

        const sendMessage = () => {
            const text = chatInput.value.trim();
            if(!text) return;
            addMessage(text, 'user');
            chatInput.value = '';
            botReply(text);
        };

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
    }

    applyLanguage(currentLang);
    renderizarGaleria();
    actualizarCarritoUI();
});