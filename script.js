document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // --- PROTOCOLO DE TIERRA QUEMADA (Borrado de memoria antigua) ---
    // =================================================================
    // Borramos explícitamente cualquier rastro de las versiones anteriores
    // del mercado que puedan estar dando problemas.
    const clavesABorrar = [
        "tactical_mercado_v17", "tactical_mercado_v26", "tactical_mercado_v35",
        "tactical_mercado_v36", "tactical_mercado_v37", "tactical_mercado_v39",
        "tactical_mercado_vFinal", "tactical_mercado_vFinal_R2",
        "tactical_mercado_db"
    ];
    clavesABorrar.forEach(key => {
        if(localStorage.getItem(key)) {
           localStorage.removeItem(key);
           console.log("Memoria corrupta eliminada: " + key);
        }
    });
    // =================================================================

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
            footerCookiesInfo: "Nota: Esta plataforma utiliza cookies técnicas de sesión y almacenamiento local (Local Storage) para mantener tu inventario (carrito), procesar las traducciones y recordar tu identificación de Agente de forma encriptada en tu dispositivo. Al continuar navegando, reafirmas la aceptación de estas cookies operativas indispensables. No utilizamos rastreadores publicitarios externos."
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
            footerCookiesInfo: "Note: This platform uses technical session cookies and local storage to maintain your inventory (cart), process translations, and remember your Agent ID encrypted on your device. By continuing to browse, you reaffirm your acceptance of these essential operational cookies. We do not use external advertising trackers."
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

    // --- MERCADO (V_DEFINITIVA - FOTOS DE PRODUCTO CORRECTAS) ---
    const fallbackImage = "https://placehold.co/600x400/111111/7ab317?text=Articulo+Tactico";
    // CLAVE NUEVA PARA FORZAR LA CARGA
    const MERCADO_KEY_DEFINITIVA = "tactical_mercado_DEFINITIVO_V1";

    const productosBase = [
        // FOTO: Motor V8 Real (Enlace estable de Pexels)
        { id: 1, nombre: "Motor V8 Blindado", nombreEn: "Armored V8 Engine", tipo: "Mecánica Pesada", tipoEn: "Heavy Mechanics", precio: 4500, vendedor: "Tactical HQ", 
          imagen: "https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=400", 
          descripcion: "Motor de bloque grande con pistones forjados, cigüeñal reforzado y culatas de alto flujo. Optimizado para resistir impactos y mantener el rendimiento en condiciones extremas. Potencia estimada: 850 HP.", 
          descripcionEn: "Big block engine with forged pistons, reinforced crankshaft, and high-flow cylinder heads. Optimized to withstand impacts and maintain performance in extreme conditions. Estimated power: 850 HP." },
        
        // FOTO: Rueda de tacos (Mantenida, la que te gusta)
        { id: 2, nombre: "Neumáticos Tácticos Off-Road", nombreEn: "Tactical Off-Road Tires", tipo: "Movilidad", tipoEn: "Mobility", precio: 800, vendedor: "Tactical HQ", 
          imagen: "https://images.pexels.com/photos/1592261/pexels-photo-1592261.jpeg?auto=compress&cs=tinysrgb&w=400", 
          descripcion: "Juego de 4 neumáticos de compuesto militar con diseño de banda de rodadura agresivo para barro y roca. Paredes laterales reforzadas con Kevlar de 10 capas. Incluye sistema run-flat interno.", 
          descripcionEn: "Set of 4 military compound tires with aggressive tread design for mud and rock. 10-ply Kevlar reinforced sidewalls. Includes internal run-flat system." },
        
        // FOTO: Kit de suspensión azul/gris (Mantenida, la que te gusta)
        { id: 3, nombre: "Kit de Suspensión Reforzada", nombreEn: "Reinforced Suspension Kit", tipo: "Modificación", tipoEn: "Upgrades", precio: 1200, vendedor: "Tactical HQ", 
          imagen: "https://images.pexels.com/photos/190539/pexels-photo-190539.jpeg?auto=compress&cs=tinysrgb&w=400", 
          descripcion: "Sistema de suspensión de largo recorrido con amortiguadores de nitrógeno presurizado y muelles helicoidales de alta resistencia. Proporciona una elevación de 4 pulgadas y una capacidad de carga superior.", 
          descripcionEn: "Long-travel suspension system with pressurized nitrogen shocks and heavy-duty coil springs. Provides a 4-inch lift and superior load capacity." },
        
        // FOTO: Textura Pintura Mate (Enlace estable de Pexels)
        { id: 4, nombre: "Pintura Absorbe-Radar (Mate)", nombreEn: "Radar-Absorbent Paint (Matte)", tipo: "Estética / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 1500, vendedor: "Tactical HQ", 
          imagen: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400", 
          descripcion: "Recubrimiento cerámico avanzado con propiedades de absorción de ondas de radar y reducción de firma infrarroja. Acabado negro mate ultraplano para minimizar reflejos visuales nocturnos.", 
          descripcionEn: "Advanced ceramic coating with radar wave absorption properties and infrared signature reduction. Ultra-flat matte black finish to minimize nighttime visual reflections." },
        
        // FOTO: Placas de Blindaje (Enlace estable de Wikimedia)
        { id: 5, nombre: "Blindaje Ligero de Puertas", nombreEn: "Light Door Armor", tipo: "Defensa", tipoEn: "Defense", precio: 2100, vendedor: "Tactical HQ", 
          imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Body_armor_plates.jpg/640px-Body_armor_plates.jpg", 
          descripcion: "Paneles de blindaje compuesto de nivel III+ para instalación interna en puertas de vehículos estándar. Detiene calibres de rifle comunes sin añadir un peso excesivo al chasis del coche.", 
          descripcionEn: "Level III+ composite armor panels for internal installation in standard vehicle doors. Stops common rifle calibers without adding excessive weight to the chassis." },
        
        // FOTO: Foco LED primer plano (Enlace estable de Pexels)
        { id: 6, nombre: "Luces LED de Alta Intensidad", nombreEn: "High-Intensity LED Lights", tipo: "Visión", tipoEn: "Vision", precio: 450, vendedor: "Tactical HQ", 
          imagen: "https://images.pexels.com/photos/3802793/pexels-photo-3802793.jpeg?auto=compress&cs=tinysrgb&w=400", 
          descripcion: "Barra de luz LED de grado táctico con una salida combinada de 30,000 lúmenes. Carcasa de aluminio impermeable IP68 y lentes de policarbonato irrompibles. Patrón de haz mixto (inundación/punto).", 
          descripcionEn: "Tactical-grade LED light bar with a combined output of 30,000 lumens. IP68 waterproof aluminum housing and unbreakable polycarbonate lenses. Mixed beam pattern (flood/spot)." }
    ];
    
    // Usamos la clave DEFINITIVA. Si no existe (que no existirá la primera vez), usa la lista correcta.
    let mercadoActual = JSON.parse(localStorage.getItem(MERCADO_KEY_DEFINITIVA));
    if (!mercadoActual) {
         console.log("Inicializando mercado con datos DEFINITIVOS y FOTOS CORRECTAS.");
         mercadoActual = productosBase;
         localStorage.setItem(MERCADO_KEY_DEFINITIVA, JSON.stringify(mercadoActual));
    }
    
    const formatearPrecio = (p) => p.toLocaleString(currentLang === 'es' ? "es-ES" : "en-US") + (currentLang === 'es' ? "€" : "$");

    const renderizarMercado = () => {
        const contenedor = document.getElementById("productos-db");
        if(!contenedor) return; contenedor.innerHTML = "";
        
        const catLabel = translations[currentLang].catLabel;
        const sellerLabel = translations[currentLang].sellerLabel;
        const btnText = translations[currentLang].addBtn;

        mercadoActual.forEach(p => {
            const nombre = currentLang === 'en' && p.nombreEn ? p.nombreEn : p.nombre;
            const tipo = currentLang === 'en' && p.tipoEn ? p.tipoEn : p.tipo;
            const desc = currentLang === 'en' && p.descripcionEn ? p.descripcionEn : (p.descripcion || (currentLang === 'es' ? "Sin descripción detallada." : "No detailed description."));
            
            // Añadido onerror robusto. Si falla la imagen, muestra la de reserva de placehold.co que SIEMPRE funciona.
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
            localStorage.setItem(MERCADO_KEY_DEFINITIVA, JSON.stringify(mercadoActual));
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

    // --- GALERÍA (SE MANTIENE IGUAL QUE ANTES) ---
    const galeriaBase = [
        "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603503352756-32d8471c26da?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1503376763066-2067ee4e9b69?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
    ];
    
    let galeriaActual = JSON.parse(localStorage.getItem("tactical_galeria_vFinal")) || galeriaBase;
    localStorage.setItem("tactical_galeria_vFinal", JSON.stringify(galeriaActual));

    let swiper;
    const renderizarGaleria = () => {
        const wrapper = document.getElementById("gallery-wrapper"); if(!wrapper) return; wrapper.innerHTML = "";
        galeriaActual.forEach(url => {
            wrapper.innerHTML += `<div class="swiper-slide"><img src="${url}" onerror="this.parentElement.style.display='none';"></div>`;
        });
        if(swiper) swiper.destroy(true, true);
        swiper = new Swiper(".mySwiper", { effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", observer: true, observeParents: true, coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false }, pagination: { el: ".swiper-pagination", clickable: true }, navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }, initialSlide: 1, loop: true });
    };
    
    document.getElementById("btn-open-upload-photo")?.addEventListener("click", () => { if(!usuarioActual) { alert("⚠️ Inicia sesión."); popups.login.classList.add("active"); return; } popups.uploadPhoto.classList.add("active"); });
    
    document.getElementById("btn-submit-photo")?.addEventListener("click", () => { 
        const url = document.getElementById("new-photo-url").value; 
        if(url) { 
            galeriaActual.push(url); 
            localStorage.setItem("tactical_galeria_vFinal", JSON.stringify(galeriaActual));
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

    // INICIO
    applyLanguage(currentLang);
    renderizarGaleria();
    actualizarCarritoUI();
});