// --- FORMATEO DE MEMORIA ---
const usuariosGuardados = localStorage.getItem("tactical_users");
const idiomaGuardado = localStorage.getItem("tactical_lang");
localStorage.clear();
if (usuariosGuardados) localStorage.setItem("tactical_users", usuariosGuardados);
if (idiomaGuardado) localStorage.setItem("tactical_lang", idiomaGuardado);

document.addEventListener("DOMContentLoaded", () => {
    
    let verTodosMercado = false; 
    let descuentoActual = 0; // Guardará 0.10, 0.15, etc... según el código

    // --- ACCIÓN DEL LOGO AL INICIO ---
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
        config: document.getElementById("config-popup"),
        benefits: document.getElementById("account-benefits-popup"),
        privacyPolicy: document.getElementById("privacy-policy-popup")
    };
    const mainContent = document.getElementById("main-content");
    const authForms = {
        login: document.getElementById("login-form-container"),
        register: document.getElementById("register-form-container")
    };
    const nav = {
        loginBtn: document.getElementById("btn-nav-login"),
        userDropdown: document.getElementById("user-controls"),
        userTrigger: document.getElementById("btn-user-menu-trigger"),
        userContent: document.getElementById("user-dropdown-content")
    };

    let usuariosRegistrados = JSON.parse(localStorage.getItem("tactical_users")) || [];
    let usuarioActual = null;

    // --- SISTEMA DE TRADUCCIÓN ---
    let currentLang = localStorage.getItem("tactical_lang") || "es";
    const translations = {
        es: {
            navHome: "Inicio", navMarket: "Compra/Venta", navRepair: "Taller", navGallery: "Galería", loginBtn: "Iniciar Sesión", registerBtn: "Registrar Cuenta", logoutBtn: "Cerrar Sesión", profileBtn: "Mi Perfil", configBtn: "Configuración", privacyMenuBtn: "Condiciones de Privacidad", heroTitle: "Precisión absoluta. Rendimiento táctico.", heroText: "Tu vehículo no es solo un transporte; es tu mejor herramienta.", 
            heroBtn: "Solicitar cita previa", marketTitle: "1. Compra/Venta", uploadItemBtn: "+ Subir Artículo", repairTitle: "2. Unidad de Reparación / Modificación", sendBtn: "Enviar Solicitud", galleryTitle: "Operaciones (Galería)", uploadPhotoBtn: "+ Añadir Foto", cookiesTitle: "Aviso Táctico (Cookies)", cookiesText: "Utilizamos cookies para mejorar la precisión de nuestros servicios. ¿Aceptas?", cookiesAccept: "Afirmativo, aceptar", loginTitle: "Acceso Restringido", noAccount: "¿No tienes cuenta?", registerHere: "Regístrate aquí", registerTitle: "Nuevo Recluta", hasAccount: "¿Ya tienes cuenta?", profileTitle: "Editar Perfil", profileDesc: "Actualiza tus credenciales.", saveChanges: "Guardar Cambios", configTitle: "Configuración", configDesc: "Selecciona el idioma.", applyBtn: "Aplicar", closeBtn: "Cerrar", cancelBtn: "Cancelar", uploadItemTitle: "Añadir al Mercado", publishBtn: "Publicar", uploadPhotoTitle: "Añadir Foto", addBtn: "Añadir", cartTitle: "Carrito", checkoutBtn: "Confirmar Transacción", continueBtn: "Seguir Comprando", privacyTitle: "Protocolos de Privacidad y Términos", selectService: "-- Selecciona el Servicio --", optRepair: "Reparación Técnica", optMod: "Modificación y Mejoras", payMethod: "Método de Pago:", newEmailLabel: "Nuevo Email:", newPassLabel: "Nueva Contraseña (Opcional):", currentPassLabel: "* Contraseña ACTUAL (Requerida):", sellerLabel: "Vendedor", catLabel: "Categoría", emptyCart: "Tu carrito está vacío.", userHolder: "Usuario", passHolder: "Contraseña", emailHolder: "Email (Obligatorio)", itemNameHolder: "Nombre", itemCatHolder: "Categoría", itemPriceHolder: "Precio (€)", itemImgHolder: "URL Imagen", itemDescHolder: "Descripción del artículo...", cardNum: "Número Tarjeta", vehicleHolder: "Vehículo (Marca y Modelo)", descHolder: "Describe el daño o las modificaciones requeridas...", benefitsTitle: "Ventajas de Unirte", benefit1: "Vender tus propios artículos en el Mercado.", benefit2: "Comprar equipamiento exclusivo.", benefit3: "Subir fotos a la Galería.", benefit4: "Acceso a descuentos exclusivos.", continueRegisterBtn: "Continuar al Registro", policyTitle: "Política de Privacidad y Cookies", footerPrivacy: "Protocolos de Privacidad y Términos", footerCookiesTitle: "Uso de Cookies Activo", footerCookiesInfo: "Nota: Usamos cookies indispensables.", seeMoreBtn: "Ver todos los artículos", seeLessBtn: "Ver menos", chatTitle: "Soporte Táctico", chatWelcome: "Agente en línea. ¿En qué puedo ayudarte hoy?", chatInput: "Escribe tu mensaje...",
            // TRADUCCIONES DESCUENTOS Y CARRITO
            discountsMenu: "Mis Descuentos", discountsSubtitle: "Aumenta tu rango realizando compras.", discountPlaceholder: "Código de descuento", applyCodeBtn: "Aplicar", noDiscounts: "Aún no tienes descuentos. ¡Realiza compras en el Mercado para subir de nivel y desbloquear códigos tácticos!",
            bronze: "10% de descuento en la tienda.", silver: "15% de descuento en la tienda.", gold: "20% de descuento en la tienda.", elite: "25% de descuento absoluto."
        },
        en: {
            navHome: "Home", navMarket: "Buy/Sell", navRepair: "Workshop", navGallery: "Gallery", loginBtn: "Login", registerBtn: "Register", logoutBtn: "Logout", profileBtn: "My Profile", configBtn: "Settings", heroTitle: "Absolute precision. Tactical performance.", heroText: "Your vehicle is a tool. We prepare it for any mission.", 
            heroBtn: "Request appointment", marketTitle: "1. Buy/Sell", uploadItemBtn: "+ Upload Item", repairTitle: "2. Repair / Modification Unit", sendBtn: "Send Request", galleryTitle: "Operations (Gallery)", uploadPhotoBtn: "+ Add Photo", cookiesTitle: "Tactical Notice (Cookies)", cookiesText: "We use cookies to improve our services accuracy. Accept?", cookiesAccept: "Affirmative, accept", loginTitle: "Restricted Access", noAccount: "No account?", registerHere: "Register here", registerTitle: "New Recruit", hasAccount: "Already have an account?", profileTitle: "Edit Profile", profileDesc: "Update your credentials.", saveChanges: "Save Changes", configTitle: "Settings", configDesc: "Select interface language.", applyBtn: "Apply", closeBtn: "Close", cancelBtn: "Cancel", uploadItemTitle: "Add to Market", publishBtn: "Publish", uploadPhotoTitle: "Add Photo", addBtn: "Add", cartTitle: "Cart", checkoutBtn: "Confirm Checkout", continueBtn: "Continue Shopping", privacyTitle: "Privacy Protocols & Terms", selectService: "-- Select Service --", optRepair: "Technical Repair", optMod: "Modification & Upgrades", payMethod: "Payment Method:", newEmailLabel: "New Email:", newPassLabel: "New Password (Optional):", currentPassLabel: "* CURRENT Password (Required):", sellerLabel: "Seller", catLabel: "Category", emptyCart: "Your cart is empty.", userHolder: "Username", passHolder: "Password", emailHolder: "Email (Required)", itemNameHolder: "Name", itemCatHolder: "Category", itemPriceHolder: "Price", itemImgHolder: "Image URL", itemDescHolder: "Item description...", cardNum: "Card Number", vehicleHolder: "Vehicle (Brand & Model)", descHolder: "Describe the damage...", benefitsTitle: "Join Advantages", benefit1: "Sell your own items.", benefit2: "Buy exclusive equipment.", benefit3: "Upload photos.", benefit4: "Access to exclusive discounts.", continueRegisterBtn: "Continue to Registration", policyTitle: "Privacy Policy & Cookies", footerPrivacy: "Privacy Protocols & Terms", footerCookiesTitle: "Active Cookie Usage", footerCookiesInfo: "Note: We use essential cookies.", seeMoreBtn: "See all items", seeLessBtn: "See less", chatTitle: "Tactical Support", chatWelcome: "Agent online. How can I help you today?", chatInput: "Type your message...",
            // TRADUCCIONES DESCUENTOS Y CARRITO
            discountsMenu: "My Discounts", discountsSubtitle: "Level up by making purchases.", discountPlaceholder: "Discount code", applyCodeBtn: "Apply", noDiscounts: "No discounts yet. Make purchases in the Market to level up and unlock tactical codes!",
            bronze: "10% store discount.", silver: "15% store discount.", gold: "20% store discount.", elite: "25% absolute discount."
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
    };

    const closeAllPopups = () => Object.values(popups).forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".btn-close-popup").forEach(btn => btn.addEventListener("click", closeAllPopups));

    document.getElementById("btn-accept-cookies")?.addEventListener("click", () => {
        popups.cookie.classList.remove("active");
        mainContent.style.display = "block";
        if(typeof swiper !== 'undefined') swiper.update();
    });

    nav.loginBtn?.addEventListener("click", () => popups.login.classList.add("active"));
    document.getElementById("link-footer-privacy")?.addEventListener("click", (e) => { e.preventDefault(); popups.privacyPolicy.classList.add("active"); });
    nav.userTrigger?.addEventListener("click", (e) => { e.stopPropagation(); nav.userContent.classList.toggle("show"); });
    
    window.addEventListener("click", (e) => {
        if (!e.target.matches('#btn-user-menu-trigger') && nav.userContent) nav.userContent.classList.remove('show');
    });

    document.getElementById("btn-menu-profile")?.addEventListener("click", (e) => {
        e.preventDefault(); popups.editProfile.classList.add("active");
        document.getElementById("edit-email").value = usuarioActual.email;
    });

    // --- POPUP DESCUENTOS Y NIVELES ---
    document.getElementById("btn-menu-discounts")?.addEventListener("click", (e) => {
        e.preventDefault(); 
        popups.discounts.classList.add("active");
        
        const descContainer = document.getElementById("user-discounts-container");
        const compras = usuarioActual.compras || 0;
        const lang = currentLang;
        
        if (compras === 0) {
            descContainer.innerHTML = translations[lang].noDiscounts;
        } else if (compras >= 1 && compras <= 2) {
            descContainer.innerHTML = `<span style="color:#cd7f32; font-size:1.1rem; font-weight:bold;">★ Rango Bronce:</span> ${translations[lang].bronze} <br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">BRONCE10</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/3 para ascender a Plata</small>`;
        } else if (compras >= 3 && compras <= 5) {
            descContainer.innerHTML = `<span style="color:#c0c0c0; font-size:1.1rem; font-weight:bold;">★★ Rango Plata:</span> ${translations[lang].silver} <br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">PLATA15</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/6 para ascender a Oro</small>`;
        } else if (compras >= 6 && compras <= 9) {
            descContainer.innerHTML = `<span style="color:#ffd700; font-size:1.1rem; font-weight:bold;">★★★ Rango Oro:</span> ${translations[lang].gold} <br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">ORO20</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/10 para ascender a Élite</small>`;
        } else {
            descContainer.innerHTML = `<span style="color:#e5e4e2; font-size:1.1rem; font-weight:bold; text-shadow: 0 0 5px #fff;">🏆 Rango Élite:</span> ${translations[lang].elite} <br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">ELITE25</strong><br><br><small style="color:#666;">Agente legendario. Compras totales: ${compras}</small>`;
        }
    });

    document.getElementById("btn-menu-config")?.addEventListener("click", (e) => { e.preventDefault(); popups.config.classList.add("active"); });
    document.getElementById("btn-menu-logout")?.addEventListener("click", (e) => { e.preventDefault(); logout(); });

    const saveUsers = () => localStorage.setItem("tactical_users", JSON.stringify(usuariosRegistrados));

    document.getElementById("link-to-register-start").addEventListener("click", (e) => { e.preventDefault(); popups.login.classList.remove("active"); popups.benefits.classList.add("active"); });
    document.getElementById("btn-continue-register").addEventListener("click", () => { popups.benefits.classList.remove("active"); authForms.login.style.display = "none"; authForms.register.style.display = "block"; popups.login.classList.add("active"); });
    document.getElementById("link-to-login").addEventListener("click", (e) => { e.preventDefault(); authForms.register.style.display = "none"; authForms.login.style.display = "block"; });

    document.getElementById("btn-register")?.addEventListener("click", () => {
        const userVal = document.getElementById("reg-username").value.trim();
        const emailVal = document.getElementById("reg-email").value.trim();
        const passVal = document.getElementById("reg-password").value.trim();
        
        if(emailVal === "" || !emailVal.includes("@")) { alert("❌ Email inválido."); return; }
        if(userVal === "" || passVal === "") { alert("❌ Usuario y contraseña obligatorios."); return; }
        if(usuariosRegistrados.find(u => u.user === userVal)) { alert("⚠️ Usuario en uso."); return; }

        usuariosRegistrados.push({ user: userVal, pass: passVal, email: emailVal, compras: 0 });
        saveUsers();
        alert("✅ Cuenta creada.");
        authForms.register.style.display = "none"; authForms.login.style.display = "block";
    });

    document.getElementById("btn-login")?.addEventListener("click", () => {
        const userVal = document.getElementById("username").value.trim();
        const passVal = document.getElementById("password").value.trim();
        const userFound = usuariosRegistrados.find(u => u.user === userVal);

        if(!userFound) { alert("❌ Cuenta no encontrada."); }
        else if(userFound.pass !== passVal) { alert("❌ Contraseña incorrecta."); }
        else {
            usuarioActual = userFound;
            closeAllPopups();
            nav.loginBtn.style.display = "none";
            nav.userDropdown.style.display = "block";
            nav.userTrigger.textContent = usuarioActual.user;
        }
    });

    const logout = () => { usuarioActual = null; nav.userDropdown.style.display = "none"; nav.loginBtn.style.display = "block"; alert("Sesión cerrada."); };

    document.getElementById("btn-save-profile")?.addEventListener("click", () => {
        const newEmail = document.getElementById("edit-email").value.trim();
        const newPass = document.getElementById("edit-new-pass").value.trim();
        const currentPassCheck = document.getElementById("edit-current-pass").value.trim();

        if(currentPassCheck !== usuarioActual.pass) { alert("❌ Contraseña actual incorrecta."); return; }
        if(newEmail === "" || !newEmail.includes("@")) { alert("❌ Email inválido."); return; }
        
        usuarioActual.email = newEmail;
        if(newPass !== "") usuarioActual.pass = newPass;
        
        const index = usuariosRegistrados.findIndex(u => u.user === usuarioActual.user);
        usuariosRegistrados[index] = usuarioActual;
        saveUsers();
        
        alert("✅ Perfil actualizado.");
        popups.editProfile.classList.remove("active");
        document.getElementById("edit-current-pass").value = "";
        document.getElementById("edit-new-pass").value = "";
    });

    document.getElementById("btn-save-config")?.addEventListener("click", () => {
        currentLang = document.getElementById("language-selector").value;
        localStorage.setItem("tactical_lang", currentLang);
        applyLanguage(currentLang);
        popups.config.classList.remove("active");
    });

    // --- MERCADO ---
    const fallbackImage = "https://placehold.co/600x400/111111/7ab317?text=Articulo+Tactico";

    const productosBase = [
        { id: 1, nombre: "Motor V8 Blindado", nombreEn: "Armored V8 Engine", tipo: "Mecánica Pesada", tipoEn: "Heavy Mechanics", precio: 4500, vendedor: "Tactical HQ", imagen: "https://media.istockphoto.com/id/528918828/es/foto/motor-de-automoci%C3%B3n-3d-ilustraci%C3%B3n.jpg?s=612x612&w=0&k=20&c=o5ejIooVV10-5hFTbCv1l1IETRzSaHqupWhT-LRPbGc=", descripcion: "Motor de bloque grande con pistones forjados, cigüeñal reforzado y culatas de alto flujo.", descripcionEn: "Big block engine with forged pistons, reinforced crankshaft." },
        { id: 2, nombre: "Neumáticos Tácticos Off-Road", nombreEn: "Tactical Off-Road Tires", tipo: "Movilidad", tipoEn: "Mobility", precio: 800, vendedor: "Tactical HQ", imagen: "https://img.freepik.com/psd-gratis/neumaticos-agresivos-todo-terreno-caucho-duradero-todo-terreno_191095-90385.jpg?semt=ais_user_personalization&w=740&q=80", descripcion: "Juego de 4 neumáticos de compuesto militar con diseño de banda de rodadura agresivo.", descripcionEn: "Set of 4 military compound tires with aggressive tread design." },
        { id: 3, nombre: "Kit de Suspensión Reforzada", nombreEn: "Reinforced Suspension Kit", tipo: "Modificación", tipoEn: "Upgrades", precio: 1200, vendedor: "Tactical HQ", imagen: "https://www.tot4x4.com/2269-large_default/kit-de-suspension-reforzada-30mm-efs-diesel.jpg", descripcion: "Sistema de suspensión de largo recorrido con amortiguadores de nitrógeno presurizado.", descripcionEn: "Long-travel suspension system with pressurized nitrogen shocks." },
        { id: 4, nombre: "Pintura Absorbe-Radar (Mate)", nombreEn: "Radar-Absorbent Paint (Matte)", tipo: "Estética / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 1500, vendedor: "Tactical HQ", imagen: "https://montopinturas.com/public/Image/2023/7/502230.png", descripcion: "Recubrimiento cerámico avanzado con propiedades de absorción de ondas de radar.", descripcionEn: "Advanced ceramic coating with radar wave absorption properties." },
        { id: 5, nombre: "Blindaje Ligero de Puertas", nombreEn: "Light Door Armor", tipo: "Defensa", tipoEn: "Defense", precio: 2100, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1592853625601-bb9d23da12fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Paneles de blindaje compuesto de nivel III+ para instalación interna en puertas.", descripcionEn: "Level III+ composite armor panels for internal installation in doors." },
        { id: 6, nombre: "Luces LED de Alta Intensidad", nombreEn: "High-Intensity LED Lights", tipo: "Visión", tipoEn: "Vision", precio: 450, vendedor: "Tactical HQ", imagen: "https://asxstore.com/cdn/shop/files/pop-up.png?v=1685366963&width=1080", descripcion: "Barra de luz LED de grado táctico con una salida combinada de 30,000 lúmenes.", descripcionEn: "Tactical-grade LED light bar with a combined output of 30,000 lumens." },
        { id: 7, nombre: "Kit de Frenos Cerámicos", nombreEn: "Ceramic Brake Kit", tipo: "Mecánica Pesada", tipoEn: "Heavy Mechanics", precio: 1800, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1486262715619-67081010dd13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Discos de freno carbono-cerámicos perforados y ventilados. Resisten temperaturas extremas.", descripcionEn: "Carbon-ceramic drilled and vented brake discs. Withstand extreme temps." },
        { id: 8, nombre: "Asientos Tácticos Recaro", nombreEn: "Tactical Recaro Seats", tipo: "Estética / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 950, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Asientos deportivos tipo baquet con arneses de 5 puntos. Tejido ignífugo.", descripcionEn: "Bucket-style sports seats with 5-point harnesses. Fire-retardant fabric." },
        { id: 9, nombre: "Cristales Antibalas Nivel 4", nombreEn: "Level 4 Bulletproof Glass", tipo: "Defensa", tipoEn: "Defense", precio: 3200, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Juego de cristales de policarbonato laminado ultragrueso. Detienen calibres pesados.", descripcionEn: "Ultra-thick laminated polycarbonate glass set. Stops heavy calibers." }
    ];
    
    let mercadoActual = JSON.parse(localStorage.getItem("tactical_mercado_100")) || productosBase;
    if (!localStorage.getItem("tactical_mercado_100")) localStorage.setItem("tactical_mercado_100", JSON.stringify(productosBase));
    
    const formatearPrecio = (p) => p.toLocaleString(currentLang === 'es' ? "es-ES" : "en-US") + (currentLang === 'es' ? "€" : "$");

    const renderizarMercado = () => {
        const contenedor = document.getElementById("productos-db");
        if(!contenedor) return; contenedor.innerHTML = "";
        
        const catLabel = translations[currentLang].catLabel;
        const sellerLabel = translations[currentLang].sellerLabel;
        const btnText = translations[currentLang].addBtn;

        const itemsAMostrar = verTodosMercado ? mercadoActual : mercadoActual.slice(0, 8);

        itemsAMostrar.forEach(p => {
            const nombre = currentLang === 'en' && p.nombreEn ? p.nombreEn : p.nombre;
            const tipo = currentLang === 'en' && p.tipoEn ? p.tipoEn : p.tipo;
            const desc = currentLang === 'en' && p.descripcionEn ? p.descripcionEn : (p.descripcion || (currentLang === 'es' ? "Sin descripción detallada." : "No detailed description."));
            
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
        if(!usuarioActual) { alert("⚠️ Inicia sesión para publicar."); popups.login.classList.add("active"); return; }
        popups.uploadItem.classList.add("active");
    });
    
    document.getElementById("btn-submit-item")?.addEventListener("click", () => {
        const nombre = document.getElementById("new-item-name").value; 
        const precio = parseFloat(document.getElementById("new-item-price").value); 
        const imagen = document.getElementById("new-item-img").value;
        if(nombre && precio && imagen) {
            mercadoActual.push({ id: Date.now(), nombre: nombre, tipo: document.getElementById("new-item-type").value, precio: precio, vendedor: usuarioActual.user, imagen: imagen, descripcion: document.getElementById("new-item-desc").value });
            localStorage.setItem("tactical_mercado_100", JSON.stringify(mercadoActual));
            renderizarMercado(); popups.uploadItem.classList.remove("active");
        } else { alert("Faltan campos obligatorios."); }
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
            descuentoActual = 0; // Resetea el descuento si se vacía
        } else {
            document.getElementById("payment-section").style.display = "block";
            document.getElementById("discount-section").style.display = "flex";
            btnCheckout.style.display = "block";
            carrito.forEach(item => { 
                totalP += (item.precio * item.cantidad); totalI += item.cantidad;
                cont.innerHTML += `<div class="cart-item"><div class="cart-item-info"><h4>${currentLang === 'en' && item.nombreEn ? item.nombreEn : item.nombre}</h4><p>${formatearPrecio(item.precio)}</p></div><div class="cart-controls"><button class="btn-qty btn-restar" data-id="${item.id}">-</button><span>${item.cantidad}</span><button class="btn-qty btn-sumar" data-id="${item.id}">+</button></div></div>`; 
            });
        }

        // Lógica Visual del Descuento
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
    
    // APLICAR CÓDIGO
    document.getElementById("btn-apply-discount")?.addEventListener("click", () => {
        const code = document.getElementById("discount-code").value.trim().toUpperCase();
        if(code === "BRONCE10") descuentoActual = 0.10;
        else if(code === "PLATA15") descuentoActual = 0.15;
        else if(code === "ORO20") descuentoActual = 0.20;
        else if(code === "ELITE25") descuentoActual = 0.25;
        else {
            alert(currentLang === 'es' ? "❌ Código inválido o caducado." : "❌ Invalid or expired code.");
            descuentoActual = 0;
        }
        
        if(descuentoActual > 0) {
            alert((currentLang === 'es' ? "✅ Descuento aplicado: " : "✅ Discount applied: ") + (descuentoActual*100) + "%");
        }
        actualizarCarritoUI();
    });

    const modCan = (id, c) => { const pc = carrito.find(i => i.id === id); if(pc) { pc.cantidad += c; if(pc.cantidad <= 0) carrito = carrito.filter(i => i.id !== id); } actualizarCarritoUI(); };
    
    const añadirAlCarrito = (id) => {
        if(!usuarioActual) { alert("⚠️ Inicia sesión."); popups.login.classList.add("active"); return; }
        const pdb = mercadoActual.find(p => p.id === id); if(pdb.vendedor === usuarioActual.user) { alert("No puedes comprar tu propio ítem."); return; }
        const pc = carrito.find(i => i.id === id); if(pc) pc.cantidad +=1; else carrito.push({...pdb, cantidad:1}); actualizarCarritoUI();
    };
    
    document.getElementById("btn-open-cart")?.addEventListener("click", () => popups.cart.classList.add("active"));

    // Mostrar ocultar opciones de pago
    document.getElementById("payment-method")?.addEventListener("change", (e) => { 
        document.getElementById("card-details").style.display = "none";
        document.getElementById("paypal-details").style.display = "none";
        document.getElementById("cripto-details").style.display = "none";

        if(e.target.value === "tarjeta") document.getElementById("card-details").style.display = "block";
        else if(e.target.value === "paypal") document.getElementById("paypal-details").style.display = "block";
        else if(e.target.value === "cripto") document.getElementById("cripto-details").style.display = "block";
    });

    // Validar y pagar
    document.getElementById("btn-checkout")?.addEventListener("click", () => {
        if(carrito.length > 0) {
            // Validaciones Obligatorias
            const method = document.getElementById("payment-method").value;
            if(method === "tarjeta") {
                const cNum = document.getElementById("card-num").value.trim();
                const cDate = document.getElementById("card-date").value.trim();
                const cCvc = document.getElementById("card-cvc").value.trim();
                if(cNum.length < 16 || cDate.length < 5 || cCvc.length < 3) {
                    alert(currentLang === 'es' ? "❌ Faltan datos obligatorios de la Tarjeta." : "❌ Missing required Card data.");
                    return;
                }
            } else if(method === "paypal") {
                const pEmail = document.getElementById("paypal-email").value.trim();
                if(pEmail === "" || !pEmail.includes("@")) {
                    alert(currentLang === 'es' ? "❌ Introduce un email válido de PayPal." : "❌ Enter a valid PayPal email.");
                    return;
                }
            } else if(method === "cripto") {
                const wAddr = document.getElementById("cripto-wallet").value.trim();
                if(wAddr.length < 10) {
                    alert(currentLang === 'es' ? "❌ Introduce la dirección de tu Wallet." : "❌ Enter your Wallet address.");
                    return;
                }
            }

            // --- ACTUALIZA COMPRAS ---
            usuarioActual.compras = (usuarioActual.compras || 0) + 1;
            const index = usuariosRegistrados.findIndex(u => u.user === usuarioActual.user);
            usuariosRegistrados[index] = usuarioActual;
            saveUsers();
            
            alert(currentLang === 'es' ? `✅ Transacción aprobada, ${usuarioActual.user}. Revisa 'Mis Descuentos' en tu perfil.` : `✅ Transaction approved, ${usuarioActual.user}. Check 'My Discounts'.`);
            
            // Limpieza POST-PAGO
            carrito = []; descuentoActual = 0; 
            document.getElementById("discount-code").value = "";
            actualizarCarritoUI(); popups.cart.classList.remove("active");
        }
    });

    // --- GALERÍA ---
    const galeriaBase = ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1503376763066-2067ee4e9b69?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800"];
    let galeriaActual = JSON.parse(localStorage.getItem("tactical_galeria_100")) || galeriaBase;
    if (!localStorage.getItem("tactical_galeria_100")) localStorage.setItem("tactical_galeria_100", JSON.stringify(galeriaActual));

    let swiper;
    const renderizarGaleria = () => {
        const wrapper = document.getElementById("gallery-wrapper"); if(!wrapper) return; wrapper.innerHTML = "";
        galeriaActual.forEach(url => { wrapper.innerHTML += `<div class="swiper-slide"><img src="${url}" onerror="this.src='${fallbackImage}';"></div>`; });
        if(swiper) swiper.destroy(true, true);
        swiper = new Swiper(".mySwiper", { effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", loop: true });
    };
    
    document.getElementById("btn-open-upload-photo")?.addEventListener("click", () => { if(!usuarioActual) { alert("⚠️ Inicia sesión."); popups.login.classList.add("active"); return; } popups.uploadPhoto.classList.add("active"); });
    document.getElementById("btn-submit-photo")?.addEventListener("click", () => { 
        const url = document.getElementById("new-photo-url").value; 
        if(url) { galeriaActual.push(url); localStorage.setItem("tactical_galeria_100", JSON.stringify(galeriaActual)); renderizarGaleria(); popups.uploadPhoto.classList.remove("active"); }
    });

    // --- TALLER ---
    document.getElementById("form-servicio")?.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        if(!usuarioActual) { alert("⚠️ Inicia sesión."); popups.login.classList.add("active"); }
        else { alert(`Solicitud enviada, ${usuarioActual.user}.`); e.target.reset(); }
    });

    // ====================================================================
    // --- LÓGICA DEL CHATBOT SUPER PERSONALIZADO ---
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
            // Saludo inicial personalizado al abrir el chat
            if(chatWindow.style.display === 'flex' && chatMessages.children.length === 1) {
                const welcomeMsg = document.getElementById("chat-welcome");
                const agentName = usuarioActual ? usuarioActual.user : (currentLang === 'es' ? "Agente" : "Agent");
                welcomeMsg.textContent = currentLang === 'es' ? `Agente en línea. ¡Bienvenido, ${agentName}! ¿En qué te ayudo hoy?` : `Online. Welcome, ${agentName}! How can I help you?`;
            }
        });
        
        closeChat.addEventListener('click', () => chatWindow.style.display = 'none');

        const addMessage = (text, sender) => {
            const msg = document.createElement('div');
            msg.className = sender === 'user' ? 'msg-user' : 'msg-bot';
            msg.textContent = text;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        const botReply = (text) => {
            const isEnglish = currentLang === 'en';
            const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
            let reply = "";
            let name = usuarioActual ? usuarioActual.user : (isEnglish ? "Agent" : "Agente");

            if (isEnglish) {
                if (cleanText.includes("thank")) {
                    reply = `Thanks to you for visiting Tactical Reparations, ${name}! Let me know if you need anything else.`;
                } else if (cleanText.includes("login") || cleanText.includes("sign in")) {
                    reply = "To log in, click the 'Login' button in the top navigation bar.";
                } else if (cleanText.includes("register") || cleanText.includes("benefit") || cleanText.includes("discount")) {
                    reply = `Registering gives you great benefits, ${name}. You get exclusive discount codes based on your purchases! Check 'My Discounts' in your menu.`;
                } else if(cleanText.includes("price") || cleanText.includes("buy")) {
                    reply = "You can purchase items directly from our Buy/Sell section. Add them to your cart, don't forget your discount code!";
                } else if (cleanText.includes("hello") || cleanText.includes("hi")) {
                    reply = `Hello, ${name}! How can the Tactical Team assist you today?`;
                } else {
                    reply = `I am your virtual assistant, ${name}. I can help with purchases, discounts, or workshop requests.`;
                }
            } else {
                if (cleanText.includes("gracia") || cleanText.includes("mersi")) {
                    reply = `¡Gracias a ti por confiar en Tactical Reparations, ${name}! Si necesitas más equipo o reparaciones, aquí me tienes.`;
                } else if (cleanText.includes("iniciar sesion") || cleanText.includes("entrar")) {
                    reply = "Para iniciar sesión, haz clic en el botón verde 'Iniciar Sesión' que está arriba a la derecha en el menú principal.";
                } else if (cleanText.includes("registrar") || cleanText.includes("ventaja") || cleanText.includes("descuento")) {
                    reply = `Al registrarte y comprar, vas subiendo de nivel (Bronce, Plata, Oro, Élite), ${name}. ¡Obtienes códigos de descuento desde el 10% hasta el 25%! Míralo en tu menú 'Mis Descuentos'.`;
                } else if(cleanText.includes("precio") || cleanText.includes("comprar") || cleanText.includes("cuesta")) {
                    reply = "Puedes adquirir o vender artículos en la sección de Compra/Venta. Añade al carrito lo que necesites, ¡y recuerda usar tu código de socio antes de pagar!";
                } else if (cleanText.includes("reparar") || cleanText.includes("taller")) {
                    reply = `Para reparaciones, ${name}, por favor envía una solicitud en la sección 'Taller'. Un mecánico especializado lo revisará.`;
                } else if(cleanText.includes("hola") || cleanText.includes("buenas")) {
                    reply = `¡Hola de nuevo, ${name}! ¿En qué te puede ayudar la central táctica hoy?`;
                } else {
                    reply = `Soy la IA del sistema, ${name}. Puedo guiarte por la tienda, explicarte el sistema de rangos y descuentos, o ayudarte con el taller.`;
                }
            }
            setTimeout(() => addMessage(reply, 'bot'), 1000);
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