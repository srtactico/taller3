// --- FORMATEO TOTAL DE MEMORIA ---
// Esto elimina toda la basura rota que he generado, manteniendo solo tus usuarios.
const usuariosGuardados = localStorage.getItem("tactical_users");
const idiomaGuardado = localStorage.getItem("tactical_lang");
localStorage.clear();
if (usuariosGuardados) localStorage.setItem("tactical_users", usuariosGuardados);
if (idiomaGuardado) localStorage.setItem("tactical_lang", idiomaGuardado);
// ---------------------------------

document.addEventListener("DOMContentLoaded", () => {
    
    // --- REFERENCIAS DOM ---
    const popups = {
        cookie: document.getElementById("cookie-popup"),
        login: document.getElementById("login-popup"),
        cart: document.getElementById("cart-popup"),
        uploadItem: document.getElementById("upload-item-popup"),
        uploadPhoto: document.getElementById("upload-photo-popup"),
        editProfile: document.getElementById("edit-profile-popup"),
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
            heroBtn: "Solicitar cita previa", 
            marketTitle: "1. Compra/Venta", 
            uploadItemBtn: "+ Subir Artículo", repairTitle: "2. Unidad de Reparación / Modificación", sendBtn: "Enviar Solicitud", galleryTitle: "Operaciones (Galería)", uploadPhotoBtn: "+ Añadir Foto", cookiesTitle: "Aviso Táctico (Cookies)", cookiesText: "Utilizamos cookies para mejorar la precisión de nuestros servicios. ¿Aceptas?", cookiesAccept: "Afirmativo, aceptar", loginTitle: "Acceso Restringido", noAccount: "¿No tienes cuenta?", registerHere: "Regístrate aquí", registerTitle: "Nuevo Recluta", hasAccount: "¿Ya tienes cuenta?", profileTitle: "Editar Perfil", profileDesc: "Actualiza tus credenciales.", saveChanges: "Guardar Cambios", configTitle: "Configuración", configDesc: "Selecciona el idioma.", applyBtn: "Aplicar", closeBtn: "Cerrar", cancelBtn: "Cancelar", uploadItemTitle: "Añadir al Mercado", publishBtn: "Publicar", uploadPhotoTitle: "Añadir Foto", addBtn: "Añadir", cartTitle: "Carrito", checkoutBtn: "Confirmar Transacción", continueBtn: "Seguir Comprando", privacyTitle: "Protocolos de Privacidad y Términos",
            selectService: "-- Selecciona el Servicio --", optRepair: "Reparación Técnica", optMod: "Modificación y Mejoras", payMethod: "Método de Pago:", newEmailLabel: "Nuevo Email:", newPassLabel: "Nueva Contraseña (Opcional):", currentPassLabel: "* Contraseña ACTUAL (Requerida):", sellerLabel: "Vendedor", catLabel: "Categoría", emptyCart: "Tu carrito está vacío.",
            userHolder: "Usuario", passHolder: "Contraseña", emailHolder: "Email (Obligatorio)", itemNameHolder: "Nombre", itemCatHolder: "Categoría", itemPriceHolder: "Precio (€)", itemImgHolder: "URL Imagen", itemDescHolder: "Descripción del artículo...", cardNum: "Número Tarjeta", vehicleHolder: "Vehículo (Marca y Modelo)", descHolder: "Describe el daño o las modificaciones requeridas...",
            benefitsTitle: "Ventajas de Unirte",
            benefit1: "Vender tus propios artículos en el Mercado.",
            benefit2: "Comprar equipamiento exclusivo.",
            benefit3: "Subir fotos de tus modificaciones a la Galería.",
            benefit4: "Acceso a descuentos exclusivos para miembros.",
            continueRegisterBtn: "Continuar al Registro",
            policyTitle: "Política de Privacidad y Cookies",
            footerPrivacy: "Protocolos de Privacidad y Términos",
            footerCookiesTitle: "Uso de Cookies Activo",
            footerCookiesInfo: "Nota: Esta plataforma utiliza cookies técnicas de sesión y almacenamiento local (Local Storage) para mantener tu inventario (carrito), procesar las traducciones y recordar tu identificación de Agente de forma encriptada en tu dispositivo. Al continuar navegando, reafirmas la aceptación de estas cookies operativas indispensables. No utilizamos rastreadores publicitarios externos.",
            // NUEVOS TEXTOS
            seeMoreBtn: "Ver todos los artículos", seeLessBtn: "Ver menos", chatTitle: "Soporte Táctico", chatWelcome: "Agente en línea. ¿En qué puedo ayudarte hoy?", chatInput: "Escribe tu mensaje..."
        },
        en: {
            navHome: "Home", navMarket: "Buy/Sell", navRepair: "Workshop", navGallery: "Gallery", loginBtn: "Login", registerBtn: "Register", logoutBtn: "Logout", profileBtn: "My Profile", configBtn: "Settings", heroTitle: "Absolute precision. Tactical performance.", heroText: "Your vehicle is a tool. We prepare it for any mission.", 
            heroBtn: "Request appointment", 
            marketTitle: "1. Buy/Sell", 
            uploadItemBtn: "+ Upload Item", repairTitle: "2. Repair / Modification Unit", sendBtn: "Send Request", galleryTitle: "Operations (Gallery)", uploadPhotoBtn: "+ Add Photo", cookiesTitle: "Tactical Notice (Cookies)", cookiesText: "We use cookies to improve our services accuracy. Accept?", cookiesAccept: "Affirmative, accept", loginTitle: "Restricted Access", noAccount: "No account?", registerHere: "Register here", registerTitle: "New Recruit", hasAccount: "Already have an account?", profileTitle: "Edit Profile", profileDesc: "Update your credentials.", saveChanges: "Save Changes", configTitle: "Settings", configDesc: "Select interface language.", applyBtn: "Apply", closeBtn: "Close", cancelBtn: "Cancel", uploadItemTitle: "Add to Market", publishBtn: "Publish", uploadPhotoTitle: "Add Photo", addBtn: "Add", cartTitle: "Cart", checkoutBtn: "Confirm Checkout", continueBtn: "Continue Shopping", privacyTitle: "Privacy Protocols & Terms",
            selectService: "-- Select Service --", optRepair: "Technical Repair", optMod: "Modification & Upgrades", payMethod: "Payment Method:", newEmailLabel: "New Email:", newPassLabel: "New Password (Optional):", currentPassLabel: "* CURRENT Password (Required):", sellerLabel: "Seller", catLabel: "Category", emptyCart: "Your cart is empty.",
            userHolder: "Username", passHolder: "Password", emailHolder: "Email (Required)", itemNameHolder: "Name", itemCatHolder: "Category", itemPriceHolder: "Price", itemImgHolder: "Image URL", itemDescHolder: "Item description...", cardNum: "Card Number", vehicleHolder: "Vehicle (Brand & Model)", descHolder: "Describe the damage or required modifications...",
            benefitsTitle: "Join Advantages",
            benefit1: "Sell your own items in the Market.",
            benefit2: "Buy exclusive equipment.",
            benefit3: "Upload photos of your mods to the Gallery.",
            benefit4: "Access to exclusive member discounts.",
            continueRegisterBtn: "Continue to Registration",
            policyTitle: "Privacy Policy & Cookies",
            footerPrivacy: "Privacy Protocols & Terms",
            footerCookiesTitle: "Active Cookie Usage",
            footerCookiesInfo: "Note: This platform uses technical session cookies and local storage to maintain your inventory (cart), process translations, and remember your Agent ID encrypted on your device. By continuing to browse, you reaffirm your acceptance of these essential operational cookies. We do not use external advertising trackers.",
            // NEW TEXTS
            seeMoreBtn: "See all items", seeLessBtn: "See less", chatTitle: "Tactical Support", chatWelcome: "Agent online. How can I help you today?", chatInput: "Type your message..."
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

    // --- GESTIÓN DE POPUPS Y COOKIES ---
    const closeAllPopups = () => Object.values(popups).forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".btn-close-popup").forEach(btn => btn.addEventListener("click", closeAllPopups));

    document.getElementById("btn-accept-cookies")?.addEventListener("click", () => {
        popups.cookie.classList.remove("active");
        mainContent.style.display = "block";
        if(typeof swiper !== 'undefined') swiper.update();
    });

    nav.loginBtn?.addEventListener("click", () => popups.login.classList.add("active"));
    
    document.getElementById("link-footer-privacy")?.addEventListener("click", (e) => {
        e.preventDefault();
        popups.privacyPolicy.classList.add("active");
    });

    nav.userTrigger?.addEventListener("click", (e) => {
        e.stopPropagation(); nav.userContent.classList.toggle("show");
    });
    window.addEventListener("click", (e) => {
        if (!e.target.matches('#btn-user-menu-trigger') && nav.userContent) nav.userContent.classList.remove('show');
    });

    document.getElementById("btn-menu-profile")?.addEventListener("click", (e) => {
        e.preventDefault(); popups.editProfile.classList.add("active");
        document.getElementById("edit-email").value = usuarioActual.email;
    });
    document.getElementById("btn-menu-config")?.addEventListener("click", (e) => { e.preventDefault(); popups.config.classList.add("active"); });
    document.getElementById("btn-menu-logout")?.addEventListener("click", (e) => { e.preventDefault(); logout(); });

    // --- AUTENTICACIÓN ---
    const saveUsers = () => localStorage.setItem("tactical_users", JSON.stringify(usuariosRegistrados));

    document.getElementById("link-to-register-start").addEventListener("click", (e) => { 
        e.preventDefault(); 
        popups.login.classList.remove("active");
        popups.benefits.classList.add("active");
    });

    document.getElementById("btn-continue-register").addEventListener("click", () => {
        popups.benefits.classList.remove("active");
        authForms.login.style.display = "none"; 
        authForms.register.style.display = "block";
        popups.login.classList.add("active");
    });

    document.getElementById("link-to-login").addEventListener("click", (e) => { e.preventDefault(); authForms.register.style.display = "none"; authForms.login.style.display = "block"; });

    document.getElementById("btn-register")?.addEventListener("click", () => {
        const userVal = document.getElementById("reg-username").value.trim();
        const emailVal = document.getElementById("reg-email").value.trim();
        const passVal = document.getElementById("reg-password").value.trim();
        
        if(emailVal === "" || !emailVal.includes("@")) { alert("❌ Email inválido."); return; }
        if(userVal === "" || passVal === "") { alert("❌ Usuario y contraseña obligatorios."); return; }
        if(usuariosRegistrados.find(u => u.user === userVal)) { alert("⚠️ Usuario en uso."); return; }

        usuariosRegistrados.push({ user: userVal, pass: passVal, email: emailVal });
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

    const logout = () => {
        usuarioActual = null;
        nav.userDropdown.style.display = "none";
        nav.loginBtn.style.display = "block";
        alert("Sesión cerrada.");
    };

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

    // --- MERCADO (LAS 6 FOTOS ORIGINALES + 3 NUEVAS) ---
    const fallbackImage = "https://placehold.co/600x400/111111/7ab317?text=Articulo+Tactico";

    const productosBase = [
        { id: 1, nombre: "Motor V8 Blindado", nombreEn: "Armored V8 Engine", tipo: "Mecánica Pesada", tipoEn: "Heavy Mechanics", precio: 4500, vendedor: "Tactical HQ", 
          imagen: "https://media.istockphoto.com/id/528918828/es/foto/motor-de-automoción-3d-ilustración.jpg?s=612x612&w=0&k=20&c=o5ejIooVV10-5hFTbCv1l1IETRzSaHqupWhT-LRPbGc=", 
          descripcion: "Motor de bloque grande con pistones forjados, cigüeñal reforzado y culatas de alto flujo. Optimizado para resistir impactos y mantener el rendimiento en condiciones extremas.", 
          descripcionEn: "Big block engine with forged pistons, reinforced crankshaft, and high-flow cylinder heads. Optimized to withstand impacts and maintain performance." },
        
        { id: 2, nombre: "Neumáticos Tácticos Off-Road", nombreEn: "Tactical Off-Road Tires", tipo: "Movilidad", tipoEn: "Mobility", precio: 800, vendedor: "Tactical HQ", 
          imagen: "https://img.freepik.com/psd-gratis/neumaticos-agresivos-todo-terreno-caucho-duradero-todo-terreno_191095-90385.jpg?semt=ais_user_personalization&w=740&q=80", 
          descripcion: "Juego de 4 neumáticos de compuesto militar con diseño de banda de rodadura agresivo para barro y roca. Paredes laterales reforzadas con Kevlar de 10 capas.", 
          descripcionEn: "Set of 4 military compound tires with aggressive tread design for mud and rock. 10-ply Kevlar reinforced sidewalls. Includes internal run-flat system." },
        
        { id: 3, nombre: "Kit de Suspensión Reforzada", nombreEn: "Reinforced Suspension Kit", tipo: "Modificación", tipoEn: "Upgrades", precio: 1200, vendedor: "Tactical HQ", 
          imagen: "https://www.tot4x4.com/2269-large_default/kit-de-suspension-reforzada-30mm-efs-diesel.jpg", 
          descripcion: "Sistema de suspensión de largo recorrido con amortiguadores de nitrógeno presurizado y muelles helicoidales de alta resistencia. Proporciona elevación de 4 pulgadas.", 
          descripcionEn: "Long-travel suspension system with pressurized nitrogen shocks and heavy-duty coil springs. Provides a 4-inch lift and superior load capacity." },
        
        { id: 4, nombre: "Pintura Absorbe-Radar (Mate)", nombreEn: "Radar-Absorbent Paint (Matte)", tipo: "Estética / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 1500, vendedor: "Tactical HQ", 
          imagen: "https://montopinturas.com/public/Image/2023/7/502230.png", 
          descripcion: "Recubrimiento cerámico avanzado con propiedades de absorción de ondas de radar y reducción de firma infrarroja. Acabado negro mate ultraplano.", 
          descripcionEn: "Advanced ceramic coating with radar wave absorption properties and infrared signature reduction. Ultra-flat matte black finish." },
        
        { id: 5, nombre: "Blindaje Ligero de Puertas", nombreEn: "Light Door Armor", tipo: "Defensa", tipoEn: "Defense", precio: 2100, vendedor: "Tactical HQ", 
          imagen: "https://images.unsplash.com/photo-1592853625601-bb9d23da12fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", 
          descripcion: "Paneles de blindaje compuesto de nivel III+ para instalación interna en puertas de vehículos estándar. Detiene calibres de rifle comunes.", 
          descripcionEn: "Level III+ composite armor panels for internal installation in standard vehicle doors. Stops common rifle calibers without adding excessive weight." },
        
        { id: 6, nombre: "Luces LED de Alta Intensidad", nombreEn: "High-Intensity LED Lights", tipo: "Visión", tipoEn: "Vision", precio: 450, vendedor: "Tactical HQ", 
          imagen: "https://asxstore.com/cdn/shop/files/pop-up.png?v=1685366963&width=1080", 
          descripcion: "Barra de luz LED de grado táctico con una salida combinada de 30,000 lúmenes. Carcasa de aluminio impermeable IP68 y lentes irrompibles.", 
          descripcionEn: "Tactical-grade LED light bar with a combined output of 30,000 lumens. IP68 waterproof aluminum housing and unbreakable polycarbonate lenses." },

        // LOS 3 ARTÍCULOS NUEVOS
        { id: 7, nombre: "Kit de Frenos Cerámicos", nombreEn: "Ceramic Brake Kit", tipo: "Mecánica Pesada", tipoEn: "Heavy Mechanics", precio: 1800, vendedor: "Tactical HQ", 
          imagen: "https://images.unsplash.com/photo-1486262715619-67081010dd13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", 
          descripcion: "Discos de freno carbono-cerámicos perforados y ventilados. Resisten temperaturas extremas sin perder eficacia de frenado.", 
          descripcionEn: "Carbon-ceramic drilled and vented brake discs. Withstand extreme temperatures without fading." },
        
        { id: 8, nombre: "Asientos Tácticos Recaro", nombreEn: "Tactical Recaro Seats", tipo: "Estética / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 950, vendedor: "Tactical HQ", 
          imagen: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", 
          descripcion: "Asientos deportivos tipo baquet con arneses de 5 puntos. Tejido ignífugo y refuerzos lumbares para mantener la postura a alta velocidad.", 
          descripcionEn: "Bucket-style sports seats with 5-point harnesses. Fire-retardant fabric and lumbar supports to maintain posture." },
        
        { id: 9, nombre: "Cristales Antibalas Nivel 4", nombreEn: "Level 4 Bulletproof Glass", tipo: "Defensa", tipoEn: "Defense", precio: 3200, vendedor: "Tactical HQ", 
          imagen: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", 
          descripcion: "Juego de cristales de policarbonato laminado ultragrueso. Capaces de detener impactos directos de calibres pesados.", 
          descripcionEn: "Ultra-thick laminated polycarbonate glass set. Capable of stopping direct impacts from heavy calibers." }
    ];
    
    let mercadoActual = JSON.parse(localStorage.getItem("tactical_mercado_100")) || productosBase;
    if (!localStorage.getItem("tactical_mercado_100")) {
         localStorage.setItem("tactical_mercado_100", JSON.stringify(productosBase));
    }
    
    const formatearPrecio = (p) => p.toLocaleString(currentLang === 'es' ? "es-ES" : "en-US") + (currentLang === 'es' ? "€" : "$");

    const renderizarMercado = () => {
        const contenedor = document.getElementById("productos-db");
        if(!contenedor) return; contenedor.innerHTML = "";
        
        const catLabel = translations[currentLang].catLabel;
        const sellerLabel = translations[currentLang].sellerLabel;
        const btnText = translations[currentLang].addBtn;

        // LÓGICA DE VER TODOS / VER MENOS
        // Miramos si la URL de la página termina en "?view=all"
        const urlParams = new URLSearchParams(window.location.search);
        const verTodos = urlParams.get('view') === 'all';
        
        // Si no es verTodos, cortamos la lista para mostrar solo los 8 primeros
        const itemsAMostrar = verTodos ? mercadoActual : mercadoActual.slice(0, 8);

        itemsAMostrar.forEach(p => {
            const nombre = currentLang === 'en' && p.nombreEn ? p.nombreEn : p.nombre;
            const tipo = currentLang === 'en' && p.tipoEn ? p.tipoEn : p.tipo;
            const desc = currentLang === 'en' && p.descripcionEn ? p.descripcionEn : (p.descripcion || (currentLang === 'es' ? "Sin descripción detallada." : "No detailed description."));
            
            contenedor.innerHTML += `
            <div class="card">
                <div class="img-container">
                    <img src="${p.imagen}" alt="${nombre}" onerror="this.onerror=null;this.src='${fallbackImage}';">
                </div>
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

        // AÑADIMOS EL BOTÓN "VER MÁS" o "VER MENOS" AL FINAL DE LA CUADRÍCULA
        if (!verTodos && mercadoActual.length > 8) {
            contenedor.innerHTML += `
            <div style="grid-column: 1 / -1; margin-top: 30px; text-align: center;">
                <a href="?view=all#mercado" class="btn-primary" style="display:inline-block; width:auto; text-decoration:none; padding:15px 30px;" data-i18n="seeMoreBtn">${translations[currentLang].seeMoreBtn}</a>
            </div>`;
        } else if (verTodos && mercadoActual.length > 8) {
            contenedor.innerHTML += `
            <div style="grid-column: 1 / -1; margin-top: 30px; text-align: center;">
                <a href="?#mercado" class="btn-secondary" style="display:inline-block; width:auto; text-decoration:none; padding:15px 30px;" data-i18n="seeLessBtn">${translations[currentLang].seeLessBtn}</a>
            </div>`;
        }

        document.querySelectorAll('.btn-add-cart').forEach(btn => btn.addEventListener('click', (e) => añadirAlCarrito(parseInt(e.target.dataset.id))));
    };

    document.getElementById("btn-open-upload-item")?.addEventListener("click", () => {
        if(!usuarioActual) { alert("⚠️ Inicia sesión para publicar."); popups.login.classList.add("active"); return; }
        popups.uploadItem.classList.add("active");
    });
    
    document.getElementById("btn-submit-item")?.addEventListener("click", () => {
        const nombre = document.getElementById("new-item-name").value; 
        const tipo = document.getElementById("new-item-type").value; 
        const precio = parseFloat(document.getElementById("new-item-price").value); 
        const imagen = document.getElementById("new-item-img").value;
        const descripcion = document.getElementById("new-item-desc").value; 
        
        if(nombre && precio && imagen) {
            mercadoActual.push({ 
                id: Date.now(), nombre: nombre, tipo: tipo, precio: precio, 
                vendedor: usuarioActual.user, imagen: imagen, descripcion: descripcion 
            });
            localStorage.setItem("tactical_mercado_100", JSON.stringify(mercadoActual));
            renderizarMercado(); popups.uploadItem.classList.remove("active");
            
            document.getElementById("new-item-name").value = "";
            document.getElementById("new-item-type").value = "";
            document.getElementById("new-item-price").value = "";
            document.getElementById("new-item-img").value = "";
            document.getElementById("new-item-desc").value = "";
        } else {
            alert("Faltan campos obligatorios (Nombre, Precio o Imagen).");
        }
    });

    // --- CARRITO ---
    let carrito = [];
    const actualizarCarritoUI = () => {
        const cont = document.getElementById("cart-items-container");
        const paymentSection = document.getElementById("payment-section");
        const btnCheckout = document.getElementById("btn-checkout");
        
        cont.innerHTML = ""; let totalP = 0; let totalI = 0;
        
        if(carrito.length === 0) {
            cont.innerHTML = `<p style="color:var(--text-muted);text-align:center;">${translations[currentLang].emptyCart}</p>`;
            paymentSection.style.display = "none";
            btnCheckout.style.display = "none";
        } else {
            paymentSection.style.display = "block";
            btnCheckout.style.display = "block";
            carrito.forEach(item => { 
                totalP += (item.precio * item.cantidad); totalI += item.cantidad;
                const nombre = currentLang === 'en' && item.nombreEn ? item.nombreEn : item.nombre;
                cont.innerHTML += `<div class="cart-item"><div class="cart-item-info"><h4>${nombre}</h4><p>${formatearPrecio(item.precio)}</p></div><div class="cart-controls"><button class="btn-qty btn-restar" data-id="${item.id}">-</button><span>${item.cantidad}</span><button class="btn-qty btn-sumar" data-id="${item.id}">+</button></div></div>`; 
            });
        }
        document.getElementById("cart-total-price").textContent = formatearPrecio(totalP);
        document.getElementById("cart-count").textContent = totalI;
        document.querySelectorAll('.btn-sumar').forEach(btn => btn.addEventListener('click', (e) => modCan(parseInt(e.target.dataset.id), 1)));
        document.querySelectorAll('.btn-restar').forEach(btn => btn.addEventListener('click', (e) => modCan(parseInt(e.target.dataset.id), -1)));
    };
    
    const modCan = (id, c) => { const pc = carrito.find(i => i.id === id); if(pc) { pc.cantidad += c; if(pc.cantidad <= 0) carrito = carrito.filter(i => i.id !== id); } actualizarCarritoUI(); };
    
    const añadirAlCarrito = (id) => {
        if(!usuarioActual) { alert("⚠️ Inicia sesión."); popups.login.classList.add("active"); return; }
        const pdb = mercadoActual.find(p => p.id === id); if(pdb.vendedor === usuarioActual.user) { alert("No puedes comprar tu propio ítem."); return; }
        const pc = carrito.find(i => i.id === id); if(pc) pc.cantidad +=1; else carrito.push({...pdb, cantidad:1}); actualizarCarritoUI();
    };
    
    document.getElementById("btn-open-cart")?.addEventListener("click", () => popups.cart.classList.add("active"));

    document.getElementById("payment-method")?.addEventListener("change", (e) => {
        document.getElementById("card-details").style.display = e.target.value === "tarjeta" ? "block" : "none";
    });

    document.getElementById("btn-checkout")?.addEventListener("click", () => {
        if(carrito.length > 0) {
            alert(`✅ Transacción aprobada para ${usuarioActual.user}.`);
            carrito = []; actualizarCarritoUI(); popups.cart.classList.remove("active");
        }
    });

    // --- GALERÍA (LAS 5 FOTOS EXACTAS DEL PRIMER DÍA) ---
    const galeriaBase = [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800",
        "https://images.unsplash.com/photo-1503376763066-2067ee4e9b69?auto=format&fit=crop&w=800",
        "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800"
    ];
    
    let galeriaActual = JSON.parse(localStorage.getItem("tactical_galeria_100")) || galeriaBase;
    if (!localStorage.getItem("tactical_galeria_100")) {
        localStorage.setItem("tactical_galeria_100", JSON.stringify(galeriaActual));
    }

    let swiper;
    const renderizarGaleria = () => {
        const wrapper = document.getElementById("gallery-wrapper"); if(!wrapper) return; wrapper.innerHTML = "";
        galeriaActual.forEach(url => {
            wrapper.innerHTML += `<div class="swiper-slide"><img src="${url}" onerror="this.src='${fallbackImage}';"></div>`;
        });
        if(swiper) swiper.destroy(true, true);
        swiper = new Swiper(".mySwiper", { effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", observer: true, observeParents: true, coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false }, pagination: { el: ".swiper-pagination", clickable: true }, navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }, initialSlide: 1, loop: true });
    };
    
    document.getElementById("btn-open-upload-photo")?.addEventListener("click", () => { if(!usuarioActual) { alert("⚠️ Inicia sesión."); popups.login.classList.add("active"); return; } popups.uploadPhoto.classList.add("active"); });
    
    document.getElementById("btn-submit-photo")?.addEventListener("click", () => { 
        const url = document.getElementById("new-photo-url").value; 
        if(url) { 
            galeriaActual.push(url); 
            localStorage.setItem("tactical_galeria_100", JSON.stringify(galeriaActual));
            renderizarGaleria(); 
            popups.uploadPhoto.classList.remove("active"); 
        }
    });

    // --- FORMULARIO TALLER ---
    document.getElementById("form-servicio")?.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        const tipoServicio = document.getElementById("tipo-servicio").value;
        if(!usuarioActual) { 
            alert("⚠️ Inicia sesión."); popups.login.classList.add("active"); 
        } else if(!tipoServicio) {
            alert("Por favor, selecciona un tipo de servicio (Reparación o Modificación).");
        } else { 
            alert(`Solicitud de ${tipoServicio} enviada. Te responderemos lo antes posible, ${usuarioActual.user}.`); 
            e.target.reset(); 
        }
    });

    // ====================================================================
    // --- LÓGICA DEL CHATBOT ---
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
        });
        closeChat.addEventListener('click', () => chatWindow.style.display = 'none');

        const addMessage = (text, sender) => {
            const msg = document.createElement('div');
            msg.className = sender === 'user' ? 'msg-user' : 'msg-bot';
            msg.textContent = text;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll hacia abajo
        }

        const botReply = (text) => {
            const isEnglish = currentLang === 'en';
            const lowerText = text.toLowerCase();
            let reply = "";

            // Lógica de respuestas (Detecta palabras clave)
            if (isEnglish) {
                if(lowerText.includes("price") || lowerText.includes("buy") || lowerText.includes("cost")) {
                    reply = "You can purchase items directly from our Buy/Sell section by adding them to your cart. We accept Card, PayPal, and Crypto.";
                } else if(lowerText.includes("hello") || lowerText.includes("hi")) {
                    reply = "Hello! How can the Tactical Team assist you today?";
                } else if (lowerText.includes("repair") || lowerText.includes("workshop") || lowerText.includes("fix")) {
                    reply = "For repairs or modifications, please submit a request through the Workshop form on our main page.";
                } else {
                    reply = "Received. An agent will review your message shortly. For immediate technical support, please refer to the Workshop section.";
                }
            } else {
                if(lowerText.includes("precio") || lowerText.includes("comprar") || lowerText.includes("vender") || lowerText.includes("cuesta")) {
                    reply = "Puedes adquirir o vender artículos directamente desde nuestra sección de Compra/Venta usando el carrito. Aceptamos Tarjeta, PayPal y Cripto.";
                } else if(lowerText.includes("hola") || lowerText.includes("buenas")) {
                    reply = "¡Hola! ¿En qué puede ayudarte el equipo Táctico hoy?";
                } else if (lowerText.includes("reparar") || lowerText.includes("taller") || lowerText.includes("arreglo")) {
                    reply = "Para reparaciones o modificaciones, por favor envía una solicitud a través del formulario de la sección Taller.";
                } else {
                    reply = "Recibido. Un agente revisará tu mensaje en breve. Para soporte técnico inmediato, dirígete a la sección del Taller.";
                }
            }
            
            // Simula que el bot está "escribiendo" y responde tras 1 segundo
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
        chatInput.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter') sendMessage(); 
        });
    }

    // INICIO
    applyLanguage(currentLang);
    renderizarGaleria();
    actualizarCarritoUI();
});