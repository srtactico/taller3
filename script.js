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
        userContent: document.getElementById("user-dropdown-content")
    };

    let usuariosRegistrados = JSON.parse(localStorage.getItem("tactical_users")) || [];
    let usuarioActual = JSON.parse(localStorage.getItem("tactical_current_user")) || null;
    
    if (usuarioActual) {
        nav.loginBtn.style.display = "none";
        nav.userDropdown.style.display = "block";
        nav.userTrigger.textContent = usuarioActual.user;
    }

    let currentLang = localStorage.getItem("tactical_lang") || "es";
    const translations = {
        es: {
            navHome: "Inicio", navMarket: "Compra/Venta", navRepair: "Taller", navGallery: "Galeria", loginBtn: "Iniciar Sesion", registerBtn: "Registrar Cuenta", logoutBtn: "Cerrar Sesion", profileBtn: "Mi Perfil", configBtn: "Configuracion", privacyMenuBtn: "Condiciones de Privacidad", heroTitle: "Precision absoluta. Rendimiento tactico.", heroText: "Tu vehiculo no es solo un transporte; es tu mejor herramienta.", 
            heroBtn: "Solicitar cita previa", marketTitle: "1. Compra/Venta", uploadItemBtn: "+ Subir Articulo", repairTitle: "2. Unidad de Reparacion / Modificacion", sendBtn: "Enviar Solicitud", galleryTitle: "Operaciones (Galeria)", uploadPhotoBtn: "+ Añadir Foto", cookiesTitle: "Aviso Tactico (Cookies)", cookiesText: "Utilizamos cookies para mejorar la precision de nuestros servicios. ¿Aceptas?", cookiesAccept: "Afirmativo, aceptar", loginTitle: "Acceso Restringido", noAccount: "¿No tienes cuenta?", registerHere: "Registrate aqui", registerTitle: "Nuevo Recluta", hasAccount: "¿Ya tienes cuenta?", profileTitle: "Editar Perfil", profileDesc: "Actualiza tus credenciales.", saveChanges: "Guardar Cambios", configTitle: "Configuracion", configDesc: "Selecciona el idioma.", applyBtn: "Aplicar", closeBtn: "Cerrar", cancelBtn: "Cancelar", uploadItemTitle: "Añadir al Mercado", publishBtn: "Publicar", uploadPhotoTitle: "Añadir Foto", addBtn: "Añadir", cartTitle: "Carrito", checkoutBtn: "Confirmar Transaccion", continueBtn: "Seguir Comprando", privacyTitle: "Protocolos de Privacidad y Terminos", selectService: "-- Selecciona el Servicio --", optRepair: "Reparacion Tecnica", optMod: "Modificacion y Mejoras", payMethod: "Metodo de Pago:", newEmailLabel: "Nuevo Email:", newPassLabel: "Nueva Contraseña (Opcional):", currentPassLabel: "* Contraseña ACTUAL (Requerida):", sellerLabel: "Vendedor", catLabel: "Categoria", emptyCart: "Tu carrito esta vacio.", userHolder: "Usuario", passHolder: "Contraseña", emailHolder: "Email (Obligatorio)", itemNameHolder: "Nombre", itemCatHolder: "Categoria", itemPriceHolder: "Precio", itemImgHolder: "URL Imagen", itemDescHolder: "Descripcion del articulo...", cardNum: "Numero Tarjeta (12 digitos)", vehicleHolder: "Vehiculo (Marca y Modelo)", descHolder: "Describe el daño o las modificaciones requeridas...", benefitsTitle: "Ventajas de Unirte", benefit1: "Vender tus propios articulos en el Mercado.", benefit2: "Comprar equipamiento exclusivo.", benefit3: "Subir fotos a la Galeria.", benefit4: "Acceso a descuentos exclusivos.", continueRegisterBtn: "Continuar al Registro", policyTitle: "Politica de Privacidad y Cookies", footerPrivacy: "Protocolos de Privacidad y Terminos", footerCookiesTitle: "Uso de Cookies Activo", footerCookiesInfo: "Nota: Usamos cookies indispensables.", seeMoreBtn: "Ver todos los articulos", seeLessBtn: "Ver menos", chatTitle: "Soporte Tactico", chatWelcome: "Agente en linea. ¿En que puedo ayudarte hoy?", chatInput: "Escribe tu mensaje...",
            discountsMenu: "Mis Descuentos", discountsSubtitle: "Aumenta tu rango realizando compras.", discountPlaceholder: "Codigo de descuento", applyCodeBtn: "Aplicar", noDiscounts: "Aun no tienes descuentos. ¡Realiza compras en el Mercado para subir de nivel y desbloquear codigos tacticos!",
            bronze: "10% de descuento en la tienda.", silver: "15% de descuento en la tienda.", gold: "20% de descuento en la tienda.", elite: "25% de descuento absoluto.", historyMenu: "Historial",
            // RECUPERAR CONTRASEÑA
            forgotPass: "¿Has olvidado tu contraseña?", forgotTitle: "Recuperar Contraseña", resetBtn: "Cambiar Contraseña", backLogin: "Volver a Iniciar Sesion", forgotUserHolder: "Usuario", forgotEmailHolder: "Email de registro", forgotNewPassHolder: "Nueva Contraseña"
        },
        en: {
            navHome: "Home", navMarket: "Buy/Sell", navRepair: "Workshop", navGallery: "Gallery", loginBtn: "Login", registerBtn: "Register", logoutBtn: "Logout", profileBtn: "My Profile", configBtn: "Settings", heroTitle: "Absolute precision. Tactical performance.", heroText: "Your vehicle is a tool. We prepare it for any mission.", 
            heroBtn: "Request appointment", marketTitle: "1. Buy/Sell", uploadItemBtn: "+ Upload Item", repairTitle: "2. Repair / Modification Unit", sendBtn: "Send Request", galleryTitle: "Operations (Gallery)", uploadPhotoBtn: "+ Add Photo", cookiesTitle: "Tactical Notice (Cookies)", cookiesText: "We use cookies to improve our services accuracy. Accept?", cookiesAccept: "Affirmative, accept", loginTitle: "Restricted Access", noAccount: "No account?", registerHere: "Register here", registerTitle: "New Recruit", hasAccount: "Already have an account?", profileTitle: "Edit Profile", profileDesc: "Update your credentials.", saveChanges: "Save Changes", configTitle: "Settings", configDesc: "Select interface language.", applyBtn: "Apply", closeBtn: "Close", cancelBtn: "Cancel", uploadItemTitle: "Add to Market", publishBtn: "Publish", uploadPhotoTitle: "Add Photo", addBtn: "Add", cartTitle: "Cart", checkoutBtn: "Confirm Checkout", continueBtn: "Continue Shopping", privacyTitle: "Privacy Protocols & Terms", selectService: "-- Select Service --", optRepair: "Technical Repair", optMod: "Modification & Upgrades", payMethod: "Payment Method:", newEmailLabel: "New Email:", newPassLabel: "New Password (Optional):", currentPassLabel: "* CURRENT Password (Required):", sellerLabel: "Seller", catLabel: "Category", emptyCart: "Your cart is empty.", userHolder: "Username", passHolder: "Password", emailHolder: "Email (Required)", itemNameHolder: "Name", itemCatHolder: "Category", itemPriceHolder: "Price", itemImgHolder: "Image URL", itemDescHolder: "Item description...", cardNum: "Card Number (12 digits)", vehicleHolder: "Vehicle (Brand & Model)", descHolder: "Describe the damage...", benefitsTitle: "Join Advantages", benefit1: "Sell your own items.", benefit2: "Buy exclusive equipment.", benefit3: "Upload photos.", benefit4: "Access to exclusive discounts.", continueRegisterBtn: "Continue to Registration", policyTitle: "Privacy Policy & Cookies", footerPrivacy: "Privacy Protocols & Terms", footerCookiesTitle: "Active Cookie Usage", footerCookiesInfo: "Note: We use essential cookies.", seeMoreBtn: "See all items", seeLessBtn: "See less", chatTitle: "Tactical Support", chatWelcome: "Agent online. How can I help you today?", chatInput: "Type your message...",
            discountsMenu: "My Discounts", discountsSubtitle: "Level up by making purchases.", discountPlaceholder: "Discount code", applyCodeBtn: "Apply", noDiscounts: "No discounts yet. Make purchases in the Market to level up and unlock tactical codes!",
            bronze: "10% store discount.", silver: "15% store discount.", gold: "20% store discount.", elite: "25% absolute discount.", historyMenu: "Order History",
            // RECUPERAR CONTRASEÑA EN INGLES
            forgotPass: "Forgot your password?", forgotTitle: "Recover Password", resetBtn: "Reset Password", backLogin: "Back to Login", forgotUserHolder: "Username", forgotEmailHolder: "Registration Email", forgotNewPassHolder: "New Password"
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

    document.getElementById("btn-menu-discounts")?.addEventListener("click", (e) => {
        e.preventDefault(); 
        popups.discounts.classList.add("active");
        
        const descContainer = document.getElementById("user-discounts-container");
        const compras = usuarioActual.compras || 0;
        const lang = currentLang;
        
        if (compras === 0) {
            descContainer.innerHTML = translations[lang].noDiscounts;
        } else if (compras >= 1 && compras <= 2) {
            descContainer.innerHTML = `<span style="color:#cd7f32; font-size:1.1rem; font-weight:bold;">Rango Bronce:</span> ${translations[lang].bronze} <br><br><span style="color:var(--text-main);">Codigo valido:</span> <strong style="color:var(--primary-color);">BRONCE10</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/3 para ascender a Plata</small>`;
        } else if (compras >= 3 && compras <= 5) {
            descContainer.innerHTML = `<span style="color:#c0c0c0; font-size:1.1rem; font-weight:bold;">Rango Plata:</span> ${translations[lang].silver} <br><br><span style="color:var(--text-main);">Codigo valido:</span> <strong style="color:var(--primary-color);">PLATA15</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/6 para ascender a Oro</small>`;
        } else if (compras >= 6 && compras <= 9) {
            descContainer.innerHTML = `<span style="color:#ffd700; font-size:1.1rem; font-weight:bold;">Rango Oro:</span> ${translations[lang].gold} <br><br><span style="color:var(--text-main);">Codigo valido:</span> <strong style="color:var(--primary-color);">ORO20</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/10 para ascender a Elite</small>`;
        } else {
            descContainer.innerHTML = `<span style="color:#e5e4e2; font-size:1.1rem; font-weight:bold; text-shadow: 0 0 5px #fff;">Rango Elite:</span> ${translations[lang].elite} <br><br><span style="color:var(--text-main);">Codigo valido:</span> <strong style="color:var(--primary-color);">ELITE25</strong><br><br><small style="color:#666;">Agente legendario. Compras totales: ${compras}</small>`;
        }
    });

    // --- POPUP HISTORIAL ---
    document.getElementById("btn-menu-history")?.addEventListener("click", (e) => {
        e.preventDefault();
        popups.history.classList.add("active");
        
        const boxCompras = document.getElementById("history-purchases");
        const boxVentas = document.getElementById("history-sales");
        
        if (!usuarioActual.historialCompras || usuarioActual.historialCompras.length === 0) {
            boxCompras.innerHTML = "<p style='color:var(--text-muted);'>No has realizado compras aun.</p>";
        } else {
            boxCompras.innerHTML = usuarioActual.historialCompras.map(compra => 
                `<div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">
                    <strong style="color:var(--primary-color);">ID Pedido: ${compra.pedido}</strong> <span style="color:#aaa;">(${compra.fecha})</span><br>
                    <span style="color:#aaa;">Articulos:</span> <span style="color:#fff;">${compra.items}</span><br>
                    <span style="color:#aaa;">Total Pagado:</span> <span style="color:#fff;">${compra.total}</span>
                </div>`
            ).reverse().join("");
        }

        const misVentas = mercadoActual.filter(p => p.vendedor === usuarioActual.user);
        if (misVentas.length === 0) {
            boxVentas.innerHTML = "<p style='color:var(--text-muted);'>No has publicado articulos en el mercado.</p>";
        } else {
            boxVentas.innerHTML = misVentas.map(venta => 
                `<div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">
                    <strong style="color:#fff;">${venta.nombre}</strong><br>
                    <span style="color:#aaa;">Precio:</span> <span style="color:var(--primary-color); font-weight:bold;">${formatearPrecio(venta.precio)}</span>
                </div>`
            ).reverse().join("");
        }
    });

    document.getElementById("btn-menu-config")?.addEventListener("click", (e) => { e.preventDefault(); popups.config.classList.add("active"); });
    
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

    // Abrir recuperar contraseña
    document.getElementById("link-forgot-pass")?.addEventListener("click", (e) => {
        e.preventDefault();
        authForms.login.style.display = "none";
        authForms.register.style.display = "none";
        authForms.forgot.style.display = "block";
    });

    // Volver desde recuperar contraseña
    document.getElementById("link-back-login")?.addEventListener("click", (e) => {
        e.preventDefault();
        authForms.forgot.style.display = "none";
        authForms.register.style.display = "none";
        authForms.login.style.display = "block";
    });

    // Cambiar la contraseña
    document.getElementById("btn-reset-pass")?.addEventListener("click", () => {
        const user = document.getElementById("forgot-username").value.trim();
        const email = document.getElementById("forgot-email").value.trim();
        const newPass = document.getElementById("forgot-new-pass").value.trim();
        
        if(!user || !email || !newPass) { 
            alert(currentLang === 'es' ? "Completa todos los campos obligatorios." : "Please fill in all fields."); 
            return; 
        }
        
        let foundUser = usuariosRegistrados.find(u => u.user === user && u.email === email);
        if(foundUser) {
            foundUser.pass = newPass;
            saveUsers();
            alert(currentLang === 'es' ? "Contraseña actualizada con exito." : "Password updated successfully.");
            authForms.forgot.style.display = "none";
            authForms.login.style.display = "block";
            document.getElementById("forgot-username").value = "";
            document.getElementById("forgot-email").value = "";
            document.getElementById("forgot-new-pass").value = "";
        } else {
            alert(currentLang === 'es' ? "Usuario o email incorrectos. No coinciden los datos de registro." : "Incorrect username or email. Registration data does not match.");
        }
    });

    document.getElementById("btn-register")?.addEventListener("click", () => {
        const userVal = document.getElementById("reg-username").value.trim();
        const emailVal = document.getElementById("reg-email").value.trim();
        const passVal = document.getElementById("reg-password").value.trim();
        
        if(emailVal === "" || !emailVal.includes("@")) { alert("Email invalido."); return; }
        if(userVal === "" || passVal === "") { alert("Usuario y contraseña obligatorios."); return; }
        if(usuariosRegistrados.find(u => u.user === userVal)) { alert("Usuario en uso."); return; }

        usuariosRegistrados.push({ user: userVal, pass: passVal, email: emailVal, compras: 0, ultimoUsoCupon: null, ultimoCuponUsado: "", historialCompras: [] });
        saveUsers();
        alert("Cuenta creada con exito.");
        authForms.register.style.display = "none"; authForms.login.style.display = "block";
    });

    document.getElementById("btn-login")?.addEventListener("click", () => {
        const userVal = document.getElementById("username").value.trim();
        const passVal = document.getElementById("password").value.trim();
        const userFound = usuariosRegistrados.find(u => u.user === userVal);

        if(!userFound) { alert("Cuenta no encontrada."); }
        else if(userFound.pass !== passVal) { alert("Contraseña incorrecta."); }
        else {
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
        alert("Sesion cerrada correctamente."); 
    };

    document.getElementById("btn-save-profile")?.addEventListener("click", () => {
        const newEmail = document.getElementById("edit-email").value.trim();
        const newPass = document.getElementById("edit-new-pass").value.trim();
        const currentPassCheck = document.getElementById("edit-current-pass").value.trim();

        if(currentPassCheck !== usuarioActual.pass) { alert("Contraseña actual incorrecta."); return; }
        if(newEmail === "" || !newEmail.includes("@")) { alert("Email invalido."); return; }
        
        usuarioActual.email = newEmail;
        if(newPass !== "") usuarioActual.pass = newPass;
        
        const index = usuariosRegistrados.findIndex(u => u.user === usuarioActual.user);
        usuariosRegistrados[index] = usuarioActual;
        saveUsers();
        localStorage.setItem("tactical_current_user", JSON.stringify(usuarioActual)); 
        
        alert("Perfil actualizado.");
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
            
            contenedor.innerHTML += `
            <div class="card">
                <div class="img-container"><img src="${p.imagen}" alt="${nombre}" onerror="this.onerror=null;this.src='${fallbackImage}';"></div>
                <h3 style="margin-top:5px;">${nombre}</h3>
                <p style="color:#888;font-size:0.9rem;">${catLabel}: ${p.tipo}</p>
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
                    ${verTodosMercado ? (currentLang === 'es' ? 'Ver menos' : 'See less') : (currentLang === 'es' ? 'Ver todos los articulos' : 'See all items')}
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
        if(!usuarioActual) { alert("Inicia sesion para publicar."); popups.login.classList.add("active"); return; }
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

    // --- CARRITO, PAGOS Y CÓDIGOS DE DESCUENTO ---
    let carrito = [];
    const actualizarCarritoUI = () => {
        const cont = document.getElementById("cart-items-container");
        const btnCheckout = document.getElementById("btn-checkout");
        const priceElement = document.getElementById("cart-total-price");
        const discElement = document.getElementById("cart-discounted-price");
        
        cont.innerHTML = ""; let totalP = 0; let totalI = 0;
        
        if(carrito.length === 0) {
            cont.innerHTML = `<p style="color:var(--text-muted);text-align:center;">El carrito esta vacio.</p>`;
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
                cont.innerHTML += `<div class="cart-item"><div class="cart-item-info"><h4>${currentLang === 'en' && item.nombreEn ? item.nombreEn : item.nombre}</h4><p>${formatearPrecio(item.precio)}</p></div><div class="cart-controls"><button class="btn-qty btn-restar" data-id="${item.id}">-</button><span>${item.cantidad}</span><button class="btn-qty btn-sumar" data-id="${item.id}">+</button></div></div>`; 
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
            alert("Debes iniciar sesion para usar descuentos.");
            return;
        }

        const code = document.getElementById("discount-code").value.trim().toUpperCase();
        const compras = usuarioActual.compras || 0;
        let validCodeForUser = "";
        let expDiscount = 0;

        if (compras >= 1 && compras <= 2) { validCodeForUser = "BRONCE10"; expDiscount = 0.10; }
        else if (compras >= 3 && compras <= 5) { validCodeForUser = "PLATA15"; expDiscount = 0.15; }
        else if (compras >= 6 && compras <= 9) { validCodeForUser = "ORO20"; expDiscount = 0.20; }
        else if (compras >= 10) { validCodeForUser = "ELITE25"; expDiscount = 0.25; }

        if (code !== validCodeForUser) {
            alert("Codigo invalido o no corresponde a tu nivel de rango actual.");
            descuentoActual = 0;
            codigoAplicado = "";
            actualizarCarritoUI();
            return;
        }

        if (usuarioActual.ultimoUsoCupon && usuarioActual.ultimoCuponUsado === code) {
            const diasPasados = (Date.now() - usuarioActual.ultimoUsoCupon) / (1000 * 60 * 60 * 24);
            if (diasPasados < 14) {
                const diasRestantes = Math.ceil(14 - diasPasados);
                alert(`Aun no puedes usar de nuevo este cupon. Deben pasar 14 dias entre usos del mismo codigo. Faltan ${diasRestantes} dias.`);
                descuentoActual = 0;
                codigoAplicado = "";
                actualizarCarritoUI();
                return;
            }
        }

        descuentoActual = expDiscount;
        codigoAplicado = code;
        alert("Descuento tactico aplicado: " + (descuentoActual*100) + "%");
        actualizarCarritoUI();
    });

    const modCan = (id, c) => { const pc = carrito.find(i => i.id === id); if(pc) { pc.cantidad += c; if(pc.cantidad <= 0) carrito = carrito.filter(i => i.id !== id); } actualizarCarritoUI(); };
    
    const añadirAlCarrito = (id) => {
        if(!usuarioActual) { alert("Inicia sesion primero."); popups.login.classList.add("active"); return; }
        const pdb = mercadoActual.find(p => p.id === id); if(pdb.vendedor === usuarioActual.user) { alert("No puedes comprar tu propio item."); return; }
        const pc = carrito.find(i => i.id === id); if(pc) pc.cantidad +=1; else carrito.push({...pdb, cantidad:1}); actualizarCarritoUI();
    };
    
    document.getElementById("btn-open-cart")?.addEventListener("click", () => popups.cart.classList.add("active"));

    // EVENTOS DE FORMATO DE PAGO ESTRICTOS (TARJETA A 12 NUMEROS)
    const cardNumInput = document.getElementById("card-num");
    if(cardNumInput) {
        cardNumInput.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, ''); // solo quita lo que no sea numero
            if (v.length > 12) v = v.substring(0, 12); // Restringe a 12 numeros exactos
            // Formatear agrupando cada 4 numeros
            e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        });
    }

    const cardDateInput = document.getElementById("card-date");
    if(cardDateInput) {
        cardDateInput.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 4) v = v.substring(0, 4); // Maximo 4 numeros (MMAA)
            
            if (v.length >= 2) {
                let m = parseInt(v.substring(0,2));
                if (m === 0) m = 1; // El mes no puede ser 00
                if (m > 12) m = 12; // El mes no puede ser mas de 12
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
            if (v.length > 3) v = v.substring(0, 3); // Maximo 3 numeros
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
                const cNum = document.getElementById("card-num").value.replace(/\s/g, ''); // Contar sin espacios
                const cDate = document.getElementById("card-date").value.trim();
                const cCvc = document.getElementById("card-cvc").value.trim();
                // Validacion muy estricta a 12 numeros exactos
                if(cNum.length < 12 || cDate.length < 5 || cCvc.length < 3) {
                    alert(currentLang === 'es' ? "Faltan datos obligatorios de la Tarjeta (12 digitos, Fecha MM/AA, 3 digitos CVC)." : "Missing exact Card data (12 digits, Date MM/YY, 3-digit CVC)."); return;
                }
            } else if(method === "paypal") {
                const pEmail = document.getElementById("paypal-email").value.trim();
                if(pEmail === "" || !pEmail.includes("@")) {
                    alert("Introduce un email valido de PayPal asociado a tu cuenta."); return;
                }
            } else if(method === "cripto") {
                const wAddr = document.getElementById("cripto-wallet").value.trim();
                if(wAddr.length < 10) {
                    alert("Introduce una direccion valida de tu Wallet."); return;
                }
            }

            // CREACIÓN DE PEDIDO E HISTORIAL
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
            
            alert(currentLang === 'es' ? `Transaccion aprobada, ${usuarioActual.user}.\n\nTU NUMERO DE PEDIDO ES: ${orderId}\n\nPor favor, guardalo para cualquier reclamacion. Tus articulos llegaran pronto.` : `Transaction approved, ${usuarioActual.user}.\n\nYOUR ORDER ID IS: ${orderId}\n\nPlease keep it for any claims. Your items will arrive soon.`);
            
            carrito = []; descuentoActual = 0; codigoAplicado = ""; document.getElementById("discount-code").value = "";
            actualizarCarritoUI(); popups.cart.classList.remove("active");
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
        if(!usuarioActual) { alert("Inicia sesion para publicar."); popups.login.classList.add("active"); return; } 
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
            alert("Foto añadida a la galeria con exito.");
        } else { alert("Por favor, introduce una URL valida."); }
    });

    // --- TALLER ---
    document.getElementById("form-servicio")?.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        if(!usuarioActual) { alert("Inicia sesion para solicitar una cita."); popups.login.classList.add("active"); }
        else { alert(`Solicitud enviada, ${usuarioActual.user}. Un mecanico se pondra en contacto contigo.`); e.target.reset(); }
    });

    // ====================================================================
    // --- LÓGICA DEL CHATBOT BILINGÜE Y MANUAL DE INSTRUCCIONES ---
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
                const agentName = usuarioActual ? usuarioActual.user : "Agente";
                welcomeMsg.textContent = currentLang === 'es' ? `Bienvenido al sistema, ${agentName}. ¿En que te ayudo hoy?` : `Welcome, ${agentName}. How can I help you today?`;
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
            // Normalizar texto quitando acentos y mayusculas
            const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
            let reply = "";
            let isHTML = false;
            let name = usuarioActual ? usuarioActual.user : "Agente";

            const incluye = (arr) => arr.some(palabra => cleanText.includes(palabra));
            
            // DETECCION DEL IDIOMA INGLES EN BASE A PALABRAS CLAVE DEL USUARIO
            const isEnglish = incluye(["how", "what", "where", "can i", "my", "history", "buy", "sell", "thank", "hello", "hi ", "logout", "login", "sign", "refund", "return", "issue", "pass", "forgot"]);

            if (isEnglish) {
                name = usuarioActual ? usuarioActual.user : "Agent";
                
                if (incluye(["thank", "thx"])) {
                    reply = `You're welcome, ${name}! Let me know if you need anything else.`;
                
                } else if (incluye(["history", "past order", "previous order"])) {
                    reply = `To check your purchase and sales history, ${name}, click on your name at the top right corner and select 'Historial' (Order History). You will see all your past transactions and order codes there.`;
                
                } else if (incluye(["claim", "return", "refund", "problem", "issue", "complain", "broken"])) {
                    reply = `I'm sorry you have an issue, ${name}. Please fill out our form here: <a href="reclamaciones.html" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Official Support Center</a>. You can find your Order ID in your History.`;
                    isHTML = true;
                
                } else if (incluye(["repair", "fix", "workshop", "modify", "mechanic"])) {
                    reply = `For repairs or modifications, ${name}, please submit a request using the 'Workshop' form on our main page. A mechanic will contact you shortly.`;
                
                } else if (incluye(["gallery", "upload photo", "add photo", "picture"])) {
                    reply = `To upload a photo of your vehicle, ${name}, make sure you are logged in, scroll down to the 'Gallery' section, and click the '+ Add Photo' button.`;
                
                } else if (incluye(["discount", "coupon", "code", "promo", "level", "rank"])) {
                    reply = `You earn discounts by leveling up through purchases, ${name}. Click your name at the top right and select 'Mis Descuentos' to see your rank and active codes. Note: Codes have a 14-day cooldown!`;
                
                } else if (incluye(["buy", "purchase", "pay", "cart", "cost", "price"])) {
                    reply = `To buy items, browse our 'Buy/Sell' section, add products to your cart, and click the Cart button at the top right to checkout. Make sure your card is exactly 12 digits!`;
                
                } else if (incluye(["sell", "add item", "post item"])) {
                    reply = `To sell your own items, ${name}, log in and go to the 'Buy/Sell' market, then click the '+ Upload Item' button.`;
                
                } else if (incluye(["pass", "forgot", "recover"])) {
                    reply = `If you forgot your password, ${name}, click the 'Login' button at the top right, and then click 'Forgot your password?'. Enter your username and registration email to reset it.`;
                
                } else if (incluye(["log out", "logout", "sign out"])) {
                    reply = `To log out, click your name at the top right of the screen and select 'Cerrar Sesion' (Logout).`;
                
                } else if (incluye(["sign up", "register", "create account", "join"])) {
                    reply = `To create an account, click the 'Login' button at the top right, then click 'Register here'. Registration allows you to buy, sell, and earn discounts!`;
                
                } else if (incluye(["log in", "login", "sign in"])) {
                    reply = `To log in, ${name}, click the 'Login' button in the top right navigation bar.`;
                
                } else if (incluye(["hello", "hi", "hey", "greetings"])) {
                    reply = `Hello, ${name}! I can help you with your order history, uploading photos, buying/selling, or password recovery. What do you need?`;
                
                } else {
                    reply = `I am your virtual assistant, ${name}. I can guide you on how to check your history, buy, sell, upload photos, or manage claims. Could you rephrase your question?`;
                }

            } else {
                // LOGICA DEL CHAT EN ESPAÑOL
                if (incluye(["gracia", "mersi"])) {
                    reply = `¡Gracias a ti por confiar en Tactical Reparations, ${name}! Si necesitas algo mas, aqui me tienes.`;
                
                } else if (incluye(["historial", "pedidos", "compras hechas", "he comprado", "pasado", "mis compras", "mis ventas"])) {
                    reply = `Para ver tu historial de compras y ventas, ${name}, haz clic en tu nombre arriba a la derecha y selecciona "Historial". Alli veras tus tickets y codigos de pedido.`;
                
                } else if (incluye(["reclam", "recalam", "devolu", "queja", "sugeren", "problema", "roto", "mal"])) {
                    reply = `Siento mucho tu problema, ${name}. Por favor rellena el formulario en nuestro <a href="reclamaciones.html" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Centro de Soporte Oficial</a>. Necesitaras el codigo de pedido que esta en tu Historial.`;
                    isHTML = true; 
                
                } else if (incluye(["reparar", "taller", "cita", "arreglo", "modificar", "mecanico"])) {
                    reply = `Para modificar o reparar tu vehiculo, ${name}, utiliza el formulario de la seccion 'Taller' indicando tu modelo. Te responderemos al instante.`;
                
                } else if (incluye(["galeria", "subir foto", "añadir foto", "imagen", "poner foto"])) {
                    reply = `Para subir una foto, ${name}, inicia sesion primero. Luego baja a la seccion 'Galeria' y pulsa el boton gris '+ Añadir Foto'.`;
                
                } else if (incluye(["cupon", "codigo", "descuento", "promocion", "nivel", "rango"])) {
                    reply = `Al comprar subes de nivel y ganas descuentos. Abre tu perfil arriba a la derecha y haz clic en "Mis Descuentos" para ver tu codigo. Recuerda que solo se pueden usar 1 vez cada 14 dias habiles.`;
                
                } else if (incluye(["comprar", "carrito", "pagar", "precio", "cuesta", "adquirir"])) {
                    reply = `Para comprar, ${name}, busca el articulo en el mercado y pulsa 'Añadir'. Luego ve al 'Carrito' arriba a la derecha para pagar. La tarjeta debe tener 12 digitos por motivos de seguridad del sistema.`;
                
                } else if (incluye(["vender", "subir articulo", "añadir articulo", "publicar"])) {
                    reply = `Para poner a la venta una pieza, ${name}, inicia sesion, ve a 'Compra/Venta' y pulsa el boton '+ Subir Articulo'.`;
                
                } else if (incluye(["cerrar", "salir", "desconectar", "apagar"]) && incluye(["sesion", "cuenta", "usuario"])) {
                    reply = `Para cerrar tu sesion, ${name}, haz clic en el boton de arriba a la derecha que dice tu nombre y pulsa en "Cerrar Sesion" (en rojo).`;
                
                } else if (incluye(["olvida", "perdi", "recuperar", "contra"])) {
                    reply = `Para recuperar tu contraseña, ${name}, ve al boton de Iniciar Sesion y pincha en "¿Has olvidado tu contraseña?". Introduce tu usuario y correo de registro exactos para cambiarla.`;
                
                } else if (incluye(["registrar", "crear cuenta", "hacer cuenta", "ventaja", "beneficio"])) {
                    reply = `Registrarte te permite subir de nivel, conseguir codigos de descuento, vender piezas, ver tu historial y usar la Galeria. Haz clic en "Iniciar Sesion" y luego en "Registrate aqui".`;
                
                } else if (incluye(["iniciar", "entrar", "acceder", "loguear"]) && incluye(["sesion", "cuenta"])) {
                    reply = `Para iniciar sesion, ${name}, haz clic en el boton verde de "Iniciar Sesion" situado en la barra superior derecha.`;
                
                } else if(incluye(["hola", "buenas", "ey", "saludo", "que tal"])) {
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