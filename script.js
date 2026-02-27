// --- FORMATEO DE MEMORIA SEGURO ---
var usuariosGuardados = localStorage.getItem("tactical_users");
var idiomaGuardado = localStorage.getItem("tactical_lang");
var cookiesAceptadas = localStorage.getItem("tactical_cookies_accepted");
var sesionActual = localStorage.getItem("tactical_current_user");

// NO hacemos localStorage.clear() aquí para no borrar los productos del mercado
if (!localStorage.getItem("tactical_users") && usuariosGuardados) localStorage.setItem("tactical_users", usuariosGuardados);
if (!localStorage.getItem("tactical_lang") && idiomaGuardado) localStorage.setItem("tactical_lang", idiomaGuardado);

// Funciones Helper
function bindEvent(id, ev, cb) {
    var el = document.getElementById(id);
    if (el) { el.addEventListener(ev, cb); }
}

function getClass(cls) {
    return document.querySelectorAll('.' + cls);
}

var tacticalTranslator = function(text, targetLang) {
    if(!text) return "";
    var esToEn = {
        "motor": "engine", "blindado": "armored", "neumatico": "tire", "neumaticos": "tires",
        "llanta": "wheel", "llantas": "wheels", "suspension": "suspension", "reforzada": "reinforced",
        "pintura": "paint", "freno": "brake", "frenos": "brakes", "asiento": "seat",
        "asientos": "seats", "cristal": "glass", "cristales": "glasses", "antibalas": "bulletproof",
        "pistones": "pistons", "juego de": "set of", "para": "for", "tactico": "tactical",
        "coche": "car", "vehiculo": "vehicle", "pieza": "part", "modificacion": "modification",
        "turbo": "turbocharger", "aceite": "oil", "bateria": "battery", "escape": "exhaust",
        "paragolpes": "bumper", "faro": "headlight", "puerta": "door", "de ": "of ", " y ": " and "
    };
    var enToEs = {};
    for(var key in esToEn) enToEs[esToEn[key]] = key;

    var res = text.toLowerCase();
    var dict = (targetLang === 'en') ? esToEn : enToEs;

    for(var k in dict) {
        res = res.split(k).join(dict[k]);
    }
    return res.charAt(0).toUpperCase() + res.slice(1);
};

document.addEventListener("DOMContentLoaded", function() {
    
    var descuentoActual = 0; 
    var codigoAplicado = "";
    var currentLang = localStorage.getItem("tactical_lang") || "es";
    var EUR_TO_USD_RATE = 1.18125;

    if (!document.getElementById("custom-alert-box")) {
        var alertHTML = 
        '<div id="custom-alert-box" class="overlay" style="z-index: 99999;">' +
            '<div class="popup-box" style="max-width: 420px; padding: 30px; border-top: 4px solid var(--primary-color);">' +
                '<h3 id="custom-alert-title" style="color: var(--primary-color); margin-bottom: 15px; font-size: 1.4rem;">Aviso del Sistema</h3>' +
                '<p id="custom-alert-msg" style="color: #fff; margin-bottom: 25px; font-size: 1rem; line-height: 1.5;"></p>' +
                '<button id="custom-alert-btn" class="btn-primary" style="width: 100%;">ENTENDIDO</button>' +
            '</div>' +
        '</div>';
        document.body.insertAdjacentHTML('beforeend', alertHTML);
    }

    window.showAlert = function(msg, callback) {
        var box = document.getElementById("custom-alert-box");
        document.getElementById("custom-alert-title").textContent = currentLang === 'en' ? "System Notice" : "Soporte Tactico";
        document.getElementById("custom-alert-msg").innerHTML = msg; 
        document.getElementById("custom-alert-btn").textContent = currentLang === 'en' ? "UNDERSTOOD" : "ENTENDIDO";

        box.classList.add("active");

        var btn = document.getElementById("custom-alert-btn");
        var newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener("click", function() {
            box.classList.remove("active");
            if(callback) callback();
        });
    };

    var logos = getClass('clickable-logo');
    for (var l = 0; l < logos.length; l++) {
        logos[l].addEventListener('click', function() {
            if(window.location.pathname.indexOf('marketplace.html') !== -1 || window.location.pathname.indexOf('reclamaciones.html') !== -1) {
                window.location.href = "index.html";
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    var popups = {
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
    
    var mainContent = document.getElementById("main-content");
    var authForms = {
        login: document.getElementById("login-form-container"),
        register: document.getElementById("register-form-container"),
        forgot: document.getElementById("forgot-form-container")
    };
    var nav = {
        loginBtn: document.getElementById("btn-nav-login"),
        userDropdown: document.getElementById("user-controls"),
        userTrigger: document.getElementById("btn-user-menu-trigger"),
        userContent: document.getElementById("user-dropdown-content"),
        navMenu: document.getElementById("nav-menu")
    };

    var usuariosRegistrados = JSON.parse(localStorage.getItem("tactical_users")) || [];
    var usuarioActual = JSON.parse(localStorage.getItem("tactical_current_user")) || null;
    
    if (usuarioActual && nav.loginBtn && nav.userDropdown && nav.userTrigger) {
        nav.loginBtn.style.display = "none";
        nav.userDropdown.style.display = "block";
        nav.userTrigger.textContent = usuarioActual.user;
    }

    var translations = {
        es: {
            navHome: "Inicio", navMarket: "Compra/Venta", navRepair: "Taller", navGallery: "Galeria", loginBtn: "Iniciar Sesion", registerBtn: "Registrar Cuenta", logoutBtn: "Cerrar Sesion", profileBtn: "Mi Perfil", configBtn: "Configuracion", privacyMenuBtn: "Condiciones de Privacidad", heroTitle: "Precision absoluta. Rendimiento tactico.", heroText: "Tu vehiculo no es solo un transporte; es tu mejor herramienta.", 
            heroBtn: "Solicitar cita previa", marketTitle: "Catálogo de Equipamiento", uploadItemBtn: "+ Subir Articulo", repairTitle: "2. Unidad de Reparacion / Modificacion", sendBtn: "Enviar Solicitud", galleryTitle: "Operaciones (Galeria)", uploadPhotoBtn: "+ Añadir Foto", cookiesTitle: "Aviso Tactico (Cookies)", cookiesText: "Utilizamos cookies para mejorar la precision de nuestros servicios. ¿Aceptas?", cookiesAccept: "Afirmativo, aceptar", loginTitle: "Acceso Restringido", noAccount: "¿No tienes cuenta?", registerHere: "Registrate aqui", registerTitle: "Nuevo Recluta", hasAccount: "¿Ya tienes cuenta?", profileTitle: "Editar Perfil", profileDesc: "Actualiza tus credenciales.", saveChanges: "Guardar Cambios", configTitle: "Configuracion", configDesc: "Selecciona el idioma.", applyBtn: "Aplicar", closeBtn: "Cerrar", cancelBtn: "Cancelar", uploadItemTitle: "Añadir al Mercado", publishBtn: "Publicar", uploadPhotoTitle: "Añadir Foto", addBtn: "Añadir", cartTitle: "Carrito", checkoutBtn: "Confirmar Transaccion", continueBtn: "Seguir Comprando", privacyTitle: "Politica de Privacidad, Cookies y Aviso Legal", selectService: "-- Selecciona el Servicio --", optRepair: "Reparacion Tecnica", optMod: "Modificacion y Mejoras", payMethod: "Metodo de Pago:", newEmailLabel: "Nuevo Email:", newPassLabel: "Nueva Contraseña (Opcional):", currentPassLabel: "* Contraseña ACTUAL (Requerida):", sellerLabel: "Vendedor", catLabel: "Categoria", emptyCart: "El carrito esta vacio.", userHolder: "Usuario", passHolder: "Contraseña", emailHolder: "Email (Obligatorio)", itemNameHolder: "Nombre", itemCatHolder: "Categoria", itemPriceHolder: "Precio Base (€)", itemImgHolder: "URL Imagen", itemDescHolder: "Descripcion del articulo...", cardNum: "Numero Tarjeta (12 digitos)", vehicleHolder: "Vehiculo (Marca y Modelo)", descHolder: "Describe el daño o las modificaciones requeridas...", benefitsTitle: "Ventajas de Unirte", benefit1: "Vender tus propios articulos en el Mercado.", benefit2: "Comprar equipamiento exclusivo.", benefit3: "Subir fotos a la Galeria.", benefit4: "Acceso a descuentos exclusivos.", benefit5: "Bono exclusivo del 20% de bienvenida en tu primera compra.", continueRegisterBtn: "Continuar al Registro", footerPrivacy: "Protocolos de Privacidad y Terminos", footerCookiesTitle: "Uso de Cookies Activo", footerCookiesInfo: "Nota: Usamos cookies indispensables.", seeMoreBtn: "Ver todos los articulos", chatTitle: "Soporte Tactico", chatWelcome: "Agente en linea. ¿En que puedo ayudarte hoy?", chatInput: "Escribe tu mensaje...", chatSendBtn: "ENVIAR",
            discountsMenu: "Mis Descuentos", discountsSubtitle: "Aumenta tu rango realizando compras.", discountPlaceholder: "Codigo de descuento", applyCodeBtn: "Aplicar", noDiscounts: "Aun no tienes descuentos.",
            welcomeDiscount: "20% de descuento en tu primer pedido.", bronze: "10% de descuento en la tienda.", silver: "15% de descuento en la tienda.", gold: "20% de descuento en la tienda.", elite: "25% de descuento absoluto.", historyMenu: "Historial",
            forgotPass: "¿Has olvidado tu contraseña?", forgotTitle: "Recuperar Contraseña", resetBtn: "Cambiar Contraseña", backLogin: "Volver a Iniciar Sesion", forgotUserHolder: "Usuario", forgotEmailHolder: "Email de registro", forgotNewPassHolder: "Nueva Contraseña",
            payOptCard: "Tarjeta de Credito/Debito", payOptPayPal: "PayPal", payOptCrypto: "Criptomonedas", paypalHolder: "Email de PayPal asociado", cryptoHolder: "Direccion de tu Wallet (BTC/ETH)", cartTotalLabel: "Total:",
            historyDesc: "Tus operaciones en Tactical Reparations.", historyMyPurchases: "Mis Compras", historyMySales: "Mis Ventas (Mercado)", alertTitle: "Aviso del Sistema", alertBtn: "ENTENDIDO", footerContact: "Contacto:", claimBack: "Volver al Inicio",
            policyLegalTitle: "1. Aviso Legal", policyLegalText: "Tactical Reparations es una plataforma virtual dedicada a la prestacion de servicios automotrices avanzados. Todos los derechos reservados.", policyDataTitle: "2. Uso de Datos (Privacidad)", policyDataText: "Recopilamos la informacion estrictamente necesaria para gestionar tu cuenta de Agente, procesar tus pedidos y ofrecer soporte tecnico. Tus credenciales se procesan de forma segura. No vendemos informacion a terceros.", policyCookiesTitle: "3. Politica de Cookies", policyCookiesText: "Utilizamos cookies tecnicas y de sesion (Local Storage) indispensables para mantener tu inventario en el carrito, aplicar descuentos, conservar tu historial y recordar tu idioma. No usamos rastreadores publicitarios externos.", copyrightText: "© 2026 Tactical Reparations. Todos los derechos reservados."
        },
        en: {
            navHome: "Home", navMarket: "Buy/Sell", navRepair: "Workshop", navGallery: "Gallery", loginBtn: "Login", registerBtn: "Register", logoutBtn: "Logout", profileBtn: "My Profile", configBtn: "Settings", heroTitle: "Absolute precision. Tactical performance.", heroText: "Your vehicle is a tool. We prepare it for any mission.", 
            heroBtn: "Request appointment", marketTitle: "Equipment Catalog", uploadItemBtn: "+ Upload Item", repairTitle: "2. Repair / Modification Unit", sendBtn: "Send Request", galleryTitle: "Operations (Gallery)", uploadPhotoBtn: "+ Add Photo", cookiesTitle: "Tactical Notice (Cookies)", cookiesText: "We use cookies to improve our services accuracy. Accept?", cookiesAccept: "Affirmative, accept", loginTitle: "Restricted Access", noAccount: "No account?", registerHere: "Register here", registerTitle: "New Recruit", hasAccount: "Already have an account?", profileTitle: "Edit Profile", profileDesc: "Update your credentials.", saveChanges: "Save Changes", configTitle: "Settings", configDesc: "Select interface language.", applyBtn: "Apply", closeBtn: "Close", cancelBtn: "Cancel", uploadItemTitle: "Add to Market", publishBtn: "Publish", uploadPhotoTitle: "Add Photo", addBtn: "Add", cartTitle: "Cart", checkoutBtn: "Confirm Checkout", continueBtn: "Continue Shopping", privacyTitle: "Privacy Policy, Cookies & Legal Notice", selectService: "-- Select Service --", optRepair: "Technical Repair", optMod: "Modification & Upgrades", payMethod: "Payment Method:", newEmailLabel: "New Email:", newPassLabel: "New Password (Optional):", currentPassLabel: "* CURRENT Password (Required):", sellerLabel: "Seller", catLabel: "Category", emptyCart: "The cart is empty.", userHolder: "Username", passHolder: "Password", emailHolder: "Email (Required)", itemNameHolder: "Name", itemCatHolder: "Category", itemPriceHolder: "Base Price (€)", itemImgHolder: "Image URL", itemDescHolder: "Item description...", cardNum: "Card Number (12 digits)", vehicleHolder: "Vehicle (Brand & Model)", descHolder: "Describe the damage...", benefitsTitle: "Join Advantages", benefit1: "Sell your own items.", benefit2: "Buy exclusive equipment.", benefit3: "Upload photos.", benefit4: "Access to exclusive discounts.", benefit5: "Exclusive 20% welcome bonus on your first purchase.", continueRegisterBtn: "Continue to Registration", footerPrivacy: "Privacy Protocols & Terms", footerCookiesTitle: "Active Cookie Usage", footerCookiesInfo: "Note: We use essential cookies.", seeMoreBtn: "See all items", chatTitle: "Tactical Support", chatWelcome: "Agent online. How can I help you today?", chatInput: "Type your message...", chatSendBtn: "SEND",
            discountsMenu: "My Discounts", discountsSubtitle: "Level up by making purchases.", discountPlaceholder: "Discount code", applyCodeBtn: "Apply", noDiscounts: "No discounts yet.",
            welcomeDiscount: "20% discount on your first order.", bronze: "10% store discount.", silver: "15% store discount.", gold: "20% store discount.", elite: "25% absolute discount.", historyMenu: "Order History",
            forgotPass: "Forgot your password?", forgotTitle: "Recover Password", resetBtn: "Reset Password", backLogin: "Back to Login", forgotUserHolder: "Username", forgotEmailHolder: "Registration Email", forgotNewPassHolder: "New Password",
            payOptCard: "Credit/Debit Card", payOptPayPal: "PayPal", payOptCrypto: "Cryptocurrency", paypalHolder: "Linked PayPal Email", cryptoHolder: "Wallet Address (BTC/ETH)", cartTotalLabel: "Total:",
            historyDesc: "Your operations at Tactical Reparations.", historyMyPurchases: "My Purchases", historyMySales: "My Sales (Market)", alertTitle: "System Notice", alertBtn: "UNDERSTOOD", footerContact: "Contact:", claimBack: "Back to Home",
            policyLegalTitle: "1. Legal Notice", policyLegalText: "Tactical Reparations is a virtual platform dedicated to providing advanced automotive services. All rights reserved.", policyDataTitle: "2. Data Usage (Privacy)", policyDataText: "We collect strictly necessary information to manage your Agent account, process your orders, and provide technical support. Your credentials are processed securely. We do not sell information to third parties.", policyCookiesTitle: "3. Cookies Policy", policyCookiesText: "We use essential technical and session cookies (Local Storage) to maintain your cart inventory, apply discounts, keep your history, and remember your language. We do not use external advertising trackers.", copyrightText: "© 2026 Tactical Reparations. All rights reserved."
        }
    };

    var applyLanguage = function(lang) {
        var els = document.querySelectorAll("[data-i18n]");
        for(var i=0; i<els.length; i++) {
            var key = els[i].getAttribute("data-i18n");
            if(translations[lang][key]) els[i].textContent = translations[lang][key];
        }
        var elsPl = document.querySelectorAll("[data-i18n-placeholder]");
        for(var j=0; j<elsPl.length; j++) {
            var pKey = elsPl[j].getAttribute("data-i18n-placeholder");
            if(translations[lang][pKey]) elsPl[j].placeholder = translations[lang][pKey];
        }
        var langSel = document.getElementById("language-selector");
        if(langSel) langSel.value = lang;
        
        renderizarMercado();
        actualizarCarritoUI(); 
    };

    var closeAllPopups = function() {
        for (var key in popups) {
            if (popups[key] && popups[key].classList) popups[key].classList.remove("active");
        }
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    };
    
    var closeBtns = getClass('btn-close-popup');
    for(var k=0; k<closeBtns.length; k++){
        closeBtns[k].addEventListener("click", closeAllPopups);
    }

    bindEvent("mobile-menu-btn", "click", function() {
        if(nav.navMenu) nav.navMenu.classList.toggle("mobile-active");
    });
    
    var navLinks = getClass('nav-link');
    for(var m=0; m<navLinks.length; m++){
        navLinks[m].addEventListener('click', function() {
            if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
        });
    }

    if (localStorage.getItem("tactical_cookies_accepted") === "true") {
        if(popups.cookie) popups.cookie.classList.remove("active");
        if(mainContent) mainContent.style.display = "block";
    }

    bindEvent("btn-accept-cookies", "click", function() {
        localStorage.setItem("tactical_cookies_accepted", "true");
        if(popups.cookie) popups.cookie.classList.remove("active");
        if(mainContent) mainContent.style.display = "block";
        if(typeof swiper !== 'undefined' && swiper) swiper.update();
    });

    bindEvent("btn-nav-login", "click", function() {
        if(popups.login) popups.login.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });
    bindEvent("link-footer-privacy", "click", function(e) { 
        e.preventDefault(); 
        if(popups.privacyPolicy) popups.privacyPolicy.classList.add("active"); 
    });
    
    if (nav.userTrigger && nav.userContent) {
        nav.userTrigger.addEventListener("click", function(e) { 
            e.stopPropagation(); 
            nav.userContent.classList.toggle("show"); 
        });
    }
    
    window.addEventListener("click", function(e) {
        if (!e.target.matches('#btn-user-menu-trigger') && nav.userContent) {
            nav.userContent.classList.remove('show');
        }
    });

    bindEvent("btn-menu-profile", "click", function(e) {
        e.preventDefault(); 
        if(popups.editProfile) popups.editProfile.classList.add("active");
        var em = document.getElementById("edit-email");
        if(em && usuarioActual) em.value = usuarioActual.email;
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });

    bindEvent("btn-menu-discounts", "click", function(e) {
        e.preventDefault(); 
        if(popups.discounts) popups.discounts.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
        
        var descContainer = document.getElementById("user-discounts-container");
        var compras = usuarioActual ? (usuarioActual.compras || 0) : 0;
        var lang = currentLang;
        
        if(descContainer) {
            if (compras === 0) {
                descContainer.innerHTML = '<span style="color:#00ffcc; font-size:1.1rem; font-weight:bold;">' + (lang==='es'?'Rango Novato':'Rookie Rank') + ':</span> ' + translations[lang].welcomeDiscount + ' <br><br><span style="color:var(--text-main);">' + (lang==='es'?'Codigo valido':'Valid Code') + ':</span> <strong style="color:var(--primary-color);">WELCOME20</strong><br><br><small style="color:#666;">' + (lang==='es'?'Haz tu primera compra para desbloquear los niveles de socio.':'Make your first purchase to unlock membership tiers.') + '</small>';
            } else if (compras >= 1 && compras <= 2) {
                descContainer.innerHTML = '<span style="color:#cd7f32; font-size:1.1rem; font-weight:bold;">' + (lang==='es'?'Rango Bronce':'Bronze Rank') + ':</span> ' + translations[lang].bronze + ' <br><br><span style="color:var(--text-main);">' + (lang==='es'?'Codigo valido':'Valid Code') + ':</span> <strong style="color:var(--primary-color);">BRONCE10</strong><br><br><small style="color:#666;">' + (lang==='es'? ('Compras realizadas: ' + compras + '/3 para ascender a Plata') : ('Purchases: ' + compras + '/3 to reach Silver Rank')) + '</small>';
            } else if (compras >= 3 && compras <= 5) {
                descContainer.innerHTML = '<span style="color:#c0c0c0; font-size:1.1rem; font-weight:bold;">' + (lang==='es'?'Rango Plata':'Silver Rank') + ':</span> ' + translations[lang].silver + ' <br><br><span style="color:var(--text-main);">' + (lang==='es'?'Codigo valido':'Valid Code') + ':</span> <strong style="color:var(--primary-color);">PLATA15</strong><br><br><small style="color:#666;">' + (lang==='es'? ('Compras realizadas: ' + compras + '/6 para ascender a Oro') : ('Purchases: ' + compras + '/6 to reach Gold Rank')) + '</small>';
            } else if (compras >= 6 && compras <= 9) {
                descContainer.innerHTML = '<span style="color:#ffd700; font-size:1.1rem; font-weight:bold;">' + (lang==='es'?'Rango Oro':'Gold Rank') + ':</span> ' + translations[lang].gold + ' <br><br><span style="color:var(--text-main);">' + (lang==='es'?'Codigo valido':'Valid Code') + ':</span> <strong style="color:var(--primary-color);">ORO20</strong><br><br><small style="color:#666;">' + (lang==='es'? ('Compras realizadas: ' + compras + '/10 para ascender a Elite') : ('Purchases: ' + compras + '/10 to reach Elite Rank')) + '</small>';
            } else {
                descContainer.innerHTML = '<span style="color:#e5e4e2; font-size:1.1rem; font-weight:bold; text-shadow: 0 0 5px #fff;">' + (lang==='es'?'Rango Elite':'Elite Rank') + ':</span> ' + translations[lang].elite + ' <br><br><span style="color:var(--text-main);">' + (lang==='es'?'Codigo valido':'Valid Code') + ':</span> <strong style="color:var(--primary-color);">ELITE25</strong><br><br><small style="color:#666;">' + (lang==='es'? ('Agente legendario. Compras totales: ' + compras) : ('Legendary Agent. Total purchases: ' + compras)) + '</small>';
            }
        }
    });

    bindEvent("btn-menu-history", "click", function(e) {
        e.preventDefault();
        if(popups.history) popups.history.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
        
        var boxCompras = document.getElementById("history-purchases");
        var boxVentas = document.getElementById("history-sales");
        var lang = currentLang;
        
        if(boxCompras && boxVentas && usuarioActual) {
            if (!usuarioActual.historialCompras || usuarioActual.historialCompras.length === 0) {
                boxCompras.innerHTML = "<p style='color:var(--text-muted);'>" + (lang==='es'?'No has realizado compras aun.':'You have not made any purchases yet.') + "</p>";
            } else {
                boxCompras.innerHTML = usuarioActual.historialCompras.map(function(compra) {
                    var itemsText = "";
                    if (compra.cartOriginal) {
                        itemsText = compra.cartOriginal.map(function(item) {
                            var n = lang === 'en' && item.nombreEn ? item.nombreEn : item.nombre;
                            return "<span style='color:#fff;'>" + n + " (x" + item.cantidad + ")</span>";
                        }).join(", ");
                    } else {
                        itemsText = "<span style='color:#fff;'>" + compra.items + "</span>"; 
                    }

                    var totalMostrado = compra.totalMostradoOriginal; 
                    if(compra.totalBase) {
                        totalMostrado = (lang === 'en') ? "$" + (compra.totalBase * EUR_TO_USD_RATE).toLocaleString("en-US", {maximumFractionDigits: 0}) : compra.totalBase.toLocaleString("es-ES") + "€";
                    }

                    return '<div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">' +
                        '<strong style="color:var(--primary-color);">' + (lang==='es'?'ID Pedido:':'Order ID:') + ' ' + compra.pedido + '</strong> <span style="color:#aaa;">(' + compra.fecha + ')</span><br>' +
                        '<span style="color:#aaa;">' + (lang==='es'?'Articulos:':'Items:') + '</span> ' + itemsText + '<br>' +
                        '<span style="color:#aaa;">' + (lang==='es'?'Total Pagado:':'Total Paid:') + '</span> <span style="color:#fff;">' + totalMostrado + '</span>' +
                    '</div>';
                }).reverse().join("");
            }

            var misVentas = mercadoActual.filter(function(p) { return p.vendedor === usuarioActual.user; });
            if (misVentas.length === 0) {
                boxVentas.innerHTML = "<p style='color:var(--text-muted);'>" + (lang==='es'?'No has publicado articulos en el mercado.':'You have not published any items in the market.') + "</p>";
            } else {
                boxVentas.innerHTML = misVentas.map(function(venta) {
                    var nombreItem = lang === 'en' && venta.nombreEn ? venta.nombreEn : venta.nombre;
                    var precioVenta = (lang === 'en') ? "$" + (venta.precio * EUR_TO_USD_RATE).toLocaleString("en-US", {maximumFractionDigits: 0}) : venta.precio.toLocaleString("es-ES") + "€";
                    return '<div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">' +
                        '<strong style="color:#fff;">' + nombreItem + '</strong><br>' +
                        '<span style="color:#aaa;">' + (lang==='es'?'Precio:':'Price:') + '</span> <span style="color:var(--primary-color); font-weight:bold;">' + precioVenta + '</span>' +
                    '</div>';
                }).reverse().join("");
            }
        }
    });

    bindEvent("btn-menu-config", "click", function(e) { 
        e.preventDefault(); 
        if(popups.config) popups.config.classList.add("active"); 
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });
    
    var logout = function() { 
        usuarioActual = null; 
        localStorage.removeItem("tactical_current_user"); 
        if(nav.userDropdown) nav.userDropdown.style.display = "none"; 
        if(nav.loginBtn) nav.loginBtn.style.display = "block"; 
        window.showAlert(currentLang === 'es' ? "Sesion cerrada correctamente." : "Logged out successfully."); 
    };

    bindEvent("btn-menu-logout", "click", function(e) { 
        e.preventDefault(); 
        logout(); 
    });

    var saveUsers = function() { localStorage.setItem("tactical_users", JSON.stringify(usuariosRegistrados)); };

    bindEvent("link-to-register-start", "click", function(e) { 
        e.preventDefault(); 
        if(popups.login) popups.login.classList.remove("active"); 
        if(popups.benefits) popups.benefits.classList.add("active"); 
    });
    
    bindEvent("btn-continue-register", "click", function() { 
        if(popups.benefits) popups.benefits.classList.remove("active"); 
        if(authForms.login) authForms.login.style.display = "none"; 
        if(authForms.forgot) authForms.forgot.style.display = "none";
        if(authForms.register) authForms.register.style.display = "block"; 
        if(popups.login) popups.login.classList.add("active"); 
    });
    
    bindEvent("link-to-login", "click", function(e) { 
        e.preventDefault(); 
        if(authForms.register) authForms.register.style.display = "none"; 
        if(authForms.forgot) authForms.forgot.style.display = "none";
        if(authForms.login) authForms.login.style.display = "block"; 
    });

    bindEvent("link-forgot-pass", "click", function(e) {
        e.preventDefault();
        if(authForms.login) authForms.login.style.display = "none";
        if(authForms.register) authForms.register.style.display = "none";
        if(authForms.forgot) authForms.forgot.style.display = "block";
    });

    bindEvent("link-back-login", "click", function(e) {
        e.preventDefault();
        if(authForms.forgot) authForms.forgot.style.display = "none";
        if(authForms.register) authForms.register.style.display = "none";
        if(authForms.login) authForms.login.style.display = "block";
    });

    bindEvent("btn-reset-pass", "click", function() {
        var user = document.getElementById("forgot-username").value.trim();
        var email = document.getElementById("forgot-email").value.trim();
        var newPass = document.getElementById("forgot-new-pass").value.trim();
        
        if(!user || !email || !newPass) { 
            window.showAlert(currentLang === 'es' ? "Completa todos los campos obligatorios." : "Please fill in all fields."); 
            return; 
        }
        
        var foundUser = false;
        for(var i=0; i<usuariosRegistrados.length; i++){
            if(usuariosRegistrados[i].user === user && usuariosRegistrados[i].email === email) {
                usuariosRegistrados[i].pass = newPass;
                foundUser = true;
                break;
            }
        }

        if(foundUser) {
            saveUsers();
            window.showAlert(currentLang === 'es' ? "Contraseña actualizada con exito." : "Password updated successfully.", function() {
                if(authForms.forgot) authForms.forgot.style.display = "none";
                if(authForms.login) authForms.login.style.display = "block";
                document.getElementById("forgot-username").value = "";
                document.getElementById("forgot-email").value = "";
                document.getElementById("forgot-new-pass").value = "";
            });
        } else {
            window.showAlert(currentLang === 'es' ? "Usuario o email incorrectos. No coinciden los datos de registro." : "Incorrect username or email. Registration data does not match.");
        }
    });

    bindEvent("btn-register", "click", function() {
        var userVal = document.getElementById("reg-username").value.trim();
        var emailVal = document.getElementById("reg-email").value.trim().toLowerCase();
        var passVal = document.getElementById("reg-password").value.trim();
        
        if(userVal === "" || passVal === "") { window.showAlert(currentLang === 'es' ? "Usuario y contraseña obligatorios." : "Username and password required."); return; }
        
        // VALIDACION ESTRICTA DE CORREO ELECTRONICO
        var validDomains = ["@gmail.com", "@outlook.es", "@outlook.com", "@yahoo.es", "@yahoo.com"];
        var isValidDomain = false;
        for(var d=0; d<validDomains.length; d++) {
            var domain = validDomains[d];
            if(emailVal.indexOf(domain) !== -1 && emailVal.indexOf(domain) === emailVal.length - domain.length) {
                isValidDomain = true;
                break;
            }
        }
        
        if(!isValidDomain) {
            window.showAlert(currentLang === 'es' ? "El correo debe terminar obligatoriamente en @gmail.com, @outlook.com, @outlook.es, @yahoo.com o @yahoo.es" : "Email must end exactly in @gmail.com, @outlook.com/.es or @yahoo.com/.es");
            return;
        }

        var isUsed = false;
        for(var j=0; j<usuariosRegistrados.length; j++){
            if(usuariosRegistrados[j].user === userVal) isUsed = true;
        }
        if(isUsed) { window.showAlert(currentLang === 'es' ? "Ese usuario ya existe." : "Username already exists."); return; }

        usuariosRegistrados.push({ user: userVal, pass: passVal, email: emailVal, compras: 0, ultimoUsoCupon: null, ultimoCuponUsado: "", historialCompras: [] });
        saveUsers();
        window.showAlert(currentLang === 'es' ? "Cuenta creada con exito. Ahora puedes iniciar sesion." : "Account created successfully. You can now log in.", function() {
            if(authForms.register) authForms.register.style.display = "none"; 
            if(authForms.login) authForms.login.style.display = "block";
        });
    });

    bindEvent("btn-login", "click", function() {
        var userVal = document.getElementById("username").value.trim();
        var passVal = document.getElementById("password").value.trim();
        var userFound = null;

        for(var k=0; k<usuariosRegistrados.length; k++){
            if(usuariosRegistrados[k].user === userVal) userFound = usuariosRegistrados[k];
        }

        if(!userFound || userFound.pass !== passVal) { 
            window.showAlert(currentLang === 'es' ? "Usuario o contraseña incorrectos." : "Incorrect username or password."); 
        } else {
            usuarioActual = userFound;
            if(!usuarioActual.historialCompras) usuarioActual.historialCompras = [];
            localStorage.setItem("tactical_current_user", JSON.stringify(usuarioActual)); 
            closeAllPopups();
            if(nav.loginBtn) nav.loginBtn.style.display = "none";
            if(nav.userDropdown) nav.userDropdown.style.display = "block";
            if(nav.userTrigger) nav.userTrigger.textContent = usuarioActual.user;
        }
    });

    bindEvent("btn-save-profile", "click", function() {
        var newEmail = document.getElementById("edit-email").value.trim();
        var newPass = document.getElementById("edit-new-pass").value.trim();
        var currentPassCheck = document.getElementById("edit-current-pass").value.trim();

        if(currentPassCheck !== usuarioActual.pass) { window.showAlert(currentLang === 'es' ? "Contraseña actual incorrecta." : "Current password incorrect."); return; }
        if(newEmail === "" || newEmail.indexOf("@") === -1) { window.showAlert(currentLang === 'es' ? "Email invalido." : "Invalid email."); return; }
        
        usuarioActual.email = newEmail;
        if(newPass !== "") usuarioActual.pass = newPass;
        
        for(var x=0; x<usuariosRegistrados.length; x++){
            if(usuariosRegistrados[x].user === usuarioActual.user) {
                usuariosRegistrados[x] = usuarioActual;
            }
        }
        saveUsers();
        localStorage.setItem("tactical_current_user", JSON.stringify(usuarioActual)); 
        
        window.showAlert(currentLang === 'es' ? "Perfil actualizado correctamente." : "Profile updated successfully.", function() {
            if(popups.editProfile) popups.editProfile.classList.remove("active");
            document.getElementById("edit-current-pass").value = "";
            document.getElementById("edit-new-pass").value = "";
        });
    });

    bindEvent("btn-save-config", "click", function() {
        var selector = document.getElementById("language-selector");
        if(selector) currentLang = selector.value;
        localStorage.setItem("tactical_lang", currentLang);
        applyLanguage(currentLang);
        if(popups.config) popups.config.classList.remove("active");
    });

    // --- MERCADO ---
    var fallbackImage = "https://placehold.co/600x400/111111/7ab317?text=Articulo+Tactico";

    var productosBase = [
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
    
    var mercadoActual = JSON.parse(localStorage.getItem("tactical_mercado_100")) || productosBase;
    if (!localStorage.getItem("tactical_mercado_100")) localStorage.setItem("tactical_mercado_100", JSON.stringify(productosBase));
    
    var formatearPrecio = function(pBase) {
        if (currentLang === 'en') {
            return "$" + (pBase * EUR_TO_USD_RATE).toLocaleString("en-US", {minimumFractionDigits: 0, maximumFractionDigits: 0});
        } else {
            return pBase.toLocaleString("es-ES") + "€"; 
        }
    };

    window.añadirAlCarrito = function(id) {
        if(!usuarioActual) { window.showAlert(currentLang === 'es' ? "Inicia sesion primero." : "Log in first."); if(popups.login) popups.login.classList.add("active"); return; }
        
        var pdb = null;
        for(var i=0; i<mercadoActual.length; i++) { if(mercadoActual[i].id === id) pdb = mercadoActual[i]; }
        
        if(pdb.vendedor === usuarioActual.user) { window.showAlert(currentLang === 'es' ? "No puedes comprar tu propio item." : "You can't buy your own item."); return; }
        
        var pc = null;
        for(var j=0; j<carrito.length; j++) { if(carrito[j].id === id) pc = carrito[j]; }

        if(pc) { pc.cantidad +=1; } else { 
            var nP = JSON.parse(JSON.stringify(pdb));
            nP.cantidad = 1;
            carrito.push(nP); 
        } 
        window.actualizarCarritoUI();
    };

    var renderizarMercado = function() {
        var contenedor = document.getElementById("productos-db");
        var contenedorFull = document.getElementById("productos-db-full");
        
        var catLabel = currentLang === 'es' ? "Categoria" : "Category";
        var sellerLabel = currentLang === 'es' ? "Vendedor" : "Seller";
        var btnText = currentLang === 'es' ? "Añadir" : "Add";

        var buildHTML = function(p) {
            var nombre = currentLang === 'en' && p.nombreEn ? p.nombreEn : p.nombre;
            var desc = currentLang === 'en' && p.descripcionEn ? p.descripcionEn : p.descripcion;
            var tipo = currentLang === 'en' && p.tipoEn ? p.tipoEn : p.tipo;
            
            return '<div class="card">' +
                '<div class="img-container"><img src="'+p.imagen+'" alt="'+nombre+'" onerror="this.onerror=null;this.src=\''+fallbackImage+'\';"></div>' +
                '<h3 style="margin-top:5px;">'+nombre+'</h3>' +
                '<p style="color:#888;font-size:0.9rem;">'+catLabel+': '+tipo+'</p>' +
                '<div class="card-details-hidden">' +
                    '<p style="font-size:0.8rem; margin-bottom:10px; color:#aaa;">'+sellerLabel+': <span style="color:var(--primary-color);">'+p.vendedor+'</span></p>' +
                    '<p style="font-size:0.95rem; color:#fff; margin-bottom:15px; line-height:1.4; text-align: left;">'+desc+'</p>' +
                    '<p class="price" style="font-size: 1.8rem; font-weight: bold; margin-bottom: 15px; color: white;">'+formatearPrecio(p.precio)+'</p>' +
                    '<button class="btn-primary btn-add-cart" data-id="'+p.id+'" style="width:100%; padding:12px;">'+btnText+'</button>' +
                '</div>' +
            '</div>';
        };

        if(contenedor) {
            contenedor.innerHTML = "";
            var itemsAMostrar = mercadoActual.slice(0, 8); // EN EL INICIO SOLO LOS 8 PRIMEROS
            for(var i=0; i<itemsAMostrar.length; i++) {
                contenedor.innerHTML += buildHTML(itemsAMostrar[i]);
            }
        }

        if(contenedorFull) {
            contenedorFull.innerHTML = "";
            for(var j=0; j<mercadoActual.length; j++) { // EN EL MARKETPLACE TODO EL MERCADO
                contenedorFull.innerHTML += buildHTML(mercadoActual[j]);
            }
        }

        var addBtns = getClass('btn-add-cart');
        for(var k=0; k<addBtns.length; k++) {
            addBtns[k].addEventListener('click', function(e) {
                window.añadirAlCarrito(parseInt(e.target.dataset.id));
            });
        }
    };

    bindEvent("btn-open-upload-item", "click", function() {
        if(!usuarioActual) { window.showAlert(currentLang === 'es' ? "Inicia sesion para publicar." : "Log in to publish."); if(popups.login) popups.login.classList.add("active"); return; }
        if(popups.uploadItem) popups.uploadItem.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });
    
    bindEvent("btn-submit-item", "click", function() {
        var nombre = document.getElementById("new-item-name").value; 
        var tipo = document.getElementById("new-item-type").value;
        var precio = parseFloat(document.getElementById("new-item-price").value); 
        var imagen = document.getElementById("new-item-img").value;
        var descripcion = document.getElementById("new-item-desc").value;

        if(nombre && precio && imagen) {
            var nombreEn = tacticalTranslator(nombre, 'en');
            var descEn = tacticalTranslator(descripcion, 'en');
            var tipoEn = tacticalTranslator(tipo, 'en');

            mercadoActual.push({ 
                id: Date.now(), 
                nombre: nombre, nombreEn: nombreEn,
                tipo: tipo, tipoEn: tipoEn,
                precio: precio, 
                vendedor: usuarioActual.user, 
                imagen: imagen, 
                descripcion: descripcion, descripcionEn: descEn
            });
            localStorage.setItem("tactical_mercado_100", JSON.stringify(mercadoActual));
            
            renderizarMercado();
            
            if(popups.uploadItem) popups.uploadItem.classList.remove("active");
            
            document.getElementById("new-item-name").value = "";
            document.getElementById("new-item-type").value = "";
            document.getElementById("new-item-price").value = "";
            document.getElementById("new-item-img").value = "";
            document.getElementById("new-item-desc").value = "";
            
            window.showAlert(currentLang === 'es' ? "Articulo publicado con exito en el Mercado." : "Item published successfully.");
        } else { window.showAlert(currentLang === 'es' ? "Faltan campos obligatorios." : "Missing required fields."); }
    });

    // --- CARRITO Y PAGOS ---
    var carrito = [];
    window.actualizarCarritoUI = function() {
        var cont = document.getElementById("cart-items-container");
        var btnCheckout = document.getElementById("btn-checkout");
        var priceElement = document.getElementById("cart-total-price");
        var discElement = document.getElementById("cart-discounted-price");
        
        if(!cont) return;
        cont.innerHTML = ""; var totalBase = 0; var totalI = 0;
        
        if(carrito.length === 0) {
            cont.innerHTML = '<p style="color:var(--text-muted);text-align:center;">'+translations[currentLang].emptyCart+'</p>';
            if(document.getElementById("payment-section")) document.getElementById("payment-section").style.display = "none";
            if(document.getElementById("discount-section")) document.getElementById("discount-section").style.display = "none";
            if(btnCheckout) btnCheckout.style.display = "none";
            descuentoActual = 0;
            codigoAplicado = "";
        } else {
            if(document.getElementById("payment-section")) document.getElementById("payment-section").style.display = "block";
            if(document.getElementById("discount-section")) document.getElementById("discount-section").style.display = "flex";
            if(btnCheckout) btnCheckout.style.display = "block";
            for(var i=0; i<carrito.length; i++) {
                var item = carrito[i];
                totalBase += (item.precio * item.cantidad); totalI += item.cantidad;
                var nom = currentLang === 'en' && item.nombreEn ? item.nombreEn : item.nombre;
                cont.innerHTML += '<div class="cart-item"><div class="cart-item-info"><h4>'+nom+'</h4><p>'+formatearPrecio(item.precio)+'</p></div><div class="cart-controls"><button class="btn-qty btn-restar" data-id="'+item.id+'">-</button><span>'+item.cantidad+'</span><button class="btn-qty btn-sumar" data-id="'+item.id+'">+</button></div></div>'; 
            }
        }

        var totalFinalBase = totalBase - (totalBase * descuentoActual);
        
        if(priceElement && discElement) {
            if(descuentoActual > 0) {
                priceElement.style.textDecoration = "line-through";
                priceElement.style.color = "var(--text-muted)";
                priceElement.textContent = formatearPrecio(totalBase);
                discElement.style.display = "inline";
                discElement.textContent = formatearPrecio(totalFinalBase);
            } else {
                priceElement.style.textDecoration = "none";
                priceElement.style.color = "var(--primary-color)";
                priceElement.textContent = formatearPrecio(totalBase);
                discElement.style.display = "none";
            }
        }

        var cCount = document.getElementById("cart-count");
        if(cCount) cCount.textContent = totalI;

        var btnSumar = getClass('btn-sumar');
        for(var j=0; j<btnSumar.length; j++) { btnSumar[j].addEventListener('click', function(e) { modCan(parseInt(e.target.dataset.id), 1); }); }
        var btnRestar = getClass('btn-restar');
        for(var k=0; k<btnRestar.length; k++) { btnRestar[k].addEventListener('click', function(e) { modCan(parseInt(e.target.dataset.id), -1); }); }
    };
    
    bindEvent("btn-apply-discount", "click", function() {
        if(!usuarioActual) {
            window.showAlert(currentLang === 'es' ? "Debes iniciar sesion para usar descuentos." : "You must log in to use discounts.");
            return;
        }

        var codeInp = document.getElementById("discount-code");
        if(!codeInp) return;
        var code = codeInp.value.trim().toUpperCase();
        var compras = usuarioActual.compras || 0;
        var validCodeForUser = "";
        var expDiscount = 0;

        if (compras === 0 && code === "WELCOME20") { validCodeForUser = "WELCOME20"; expDiscount = 0.20; }
        else if (compras >= 1 && compras <= 2) { validCodeForUser = "BRONCE10"; expDiscount = 0.10; }
        else if (compras >= 3 && compras <= 5) { validCodeForUser = "PLATA15"; expDiscount = 0.15; }
        else if (compras >= 6 && compras <= 9) { validCodeForUser = "ORO20"; expDiscount = 0.20; }
        else if (compras >= 10) { validCodeForUser = "ELITE25"; expDiscount = 0.25; }

        if (code !== validCodeForUser) {
            window.showAlert(currentLang === 'es' ? "Codigo invalido o no corresponde a tu nivel actual." : "Invalid code or doesn't match your current rank.");
            descuentoActual = 0;
            codigoAplicado = "";
            window.actualizarCarritoUI();
            return;
        }

        if (usuarioActual.ultimoUsoCupon && usuarioActual.ultimoCuponUsado === code) {
            var diasPasados = (Date.now() - usuarioActual.ultimoUsoCupon) / (1000 * 60 * 60 * 24);
            if (diasPasados < 14) {
                var diasRestantes = Math.ceil(14 - diasPasados);
                window.showAlert(currentLang === 'es' ? "Aun no puedes usar de nuevo este cupon. Faltan " + diasRestantes + " dias." : "You cannot reuse this coupon yet. " + diasRestantes + " days remaining.");
                descuentoActual = 0;
                codigoAplicado = "";
                window.actualizarCarritoUI();
                return;
            }
        }

        descuentoActual = expDiscount;
        codigoAplicado = code;
        window.showAlert(currentLang === 'es' ? "Descuento tactico aplicado: " + (descuentoActual*100) + "%" : "Tactical discount applied: " + (descuentoActual*100) + "%");
        window.actualizarCarritoUI();
    });

    var modCan = function(id, c) { 
        var pc = null;
        for(var i=0; i<carrito.length; i++) { if(carrito[i].id === id) pc = carrito[i]; }
        if(pc) { 
            pc.cantidad += c; 
            if(pc.cantidad <= 0) {
                var newC = [];
                for(var j=0; j<carrito.length; j++) { if(carrito[j].id !== id) newC.push(carrito[j]); }
                carrito = newC;
            }
        } 
        window.actualizarCarritoUI(); 
    };

    bindEvent("btn-open-cart", "click", function() {
        if(popups.cart) popups.cart.classList.add("active");
        if(nav.navMenu) nav.navMenu.classList.remove("mobile-active");
    });

    bindEvent("card-num", "input", function(e) {
        var v = e.target.value.replace(/\D/g, ''); 
        if (v.length > 12) v = v.substring(0, 12); 
        e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    });

    bindEvent("card-date", "input", function(e) {
        var v = e.target.value.replace(/\D/g, '');
        if (v.length > 4) v = v.substring(0, 4); 
        if (v.length >= 2) {
            var m = parseInt(v.substring(0,2));
            if (m === 0) m = 1; 
            if (m > 12) m = 12; 
            var mStr = m.toString();
            if (mStr.length === 1) mStr = "0" + mStr;
            e.target.value = mStr + '/' + v.substring(2);
        } else {
            e.target.value = v;
        }
    });

    bindEvent("card-cvc", "input", function(e) {
        var v = e.target.value.replace(/\D/g, '');
        if (v.length > 3) v = v.substring(0, 3); 
        e.target.value = v;
    });

    bindEvent("payment-method", "change", function(e) { 
        var cd = document.getElementById("card-details");
        var pd = document.getElementById("paypal-details");
        var cd2 = document.getElementById("cripto-details");

        if(cd) cd.style.display = "none";
        if(pd) pd.style.display = "none";
        if(cd2) cd2.style.display = "none";

        if(e.target.value === "tarjeta" && cd) cd.style.display = "block";
        else if(e.target.value === "paypal" && pd) pd.style.display = "block";
        else if(e.target.value === "cripto" && cd2) cd2.style.display = "block";
    });

    bindEvent("btn-checkout", "click", function() {
        if(carrito.length > 0) {
            
            var pSel = document.getElementById("payment-method");
            var method = pSel ? pSel.value : "tarjeta";

            if(method === "tarjeta") {
                var cNum = document.getElementById("card-num") ? document.getElementById("card-num").value.replace(/\s/g, '') : ""; 
                var cDate = document.getElementById("card-date") ? document.getElementById("card-date").value.trim() : "";
                var cCvc = document.getElementById("card-cvc") ? document.getElementById("card-cvc").value.trim() : "";
                if(cNum.length < 12 || cDate.length < 5 || cCvc.length < 3) {
                    window.showAlert(currentLang === 'es' ? "Faltan datos obligatorios de la Tarjeta (12 digitos, Fecha MM/AA, 3 digitos CVC)." : "Missing exact Card data (12 digits, Date MM/YY, 3-digit CVC)."); return;
                }
            } else if(method === "paypal") {
                var pEmail = document.getElementById("paypal-email") ? document.getElementById("paypal-email").value.trim() : "";
                if(pEmail === "" || pEmail.indexOf("@") === -1) {
                    window.showAlert(currentLang === 'es' ? "Introduce un email valido de PayPal." : "Enter a valid PayPal email."); return;
                }
            } else if(method === "cripto") {
                var wAddr = document.getElementById("cripto-wallet") ? document.getElementById("cripto-wallet").value.trim() : "";
                if(wAddr.length < 10) {
                    window.showAlert(currentLang === 'es' ? "Introduce una direccion valida de tu Wallet." : "Enter a valid Wallet address."); return;
                }
            }

            var totalBase = 0;
            for(var i=0; i<carrito.length; i++) { totalBase += (carrito[i].precio * carrito[i].cantidad); }
            var totalFinalBase = totalBase - (totalBase * descuentoActual);
            
            var orderId = "TR-" + Math.floor(100000 + Math.random() * 900000);
            var dateStr = new Date().toLocaleDateString();

            if (!usuarioActual.historialCompras) usuarioActual.historialCompras = [];
            
            usuarioActual.historialCompras.push({
                pedido: orderId,
                fecha: dateStr,
                totalBase: totalFinalBase, 
                cartOriginal: JSON.parse(JSON.stringify(carrito))
            });

            if (descuentoActual > 0 && codigoAplicado !== "") {
                usuarioActual.ultimoUsoCupon = Date.now();
                usuarioActual.ultimoCuponUsado = codigoAplicado;
            }

            usuarioActual.compras = (usuarioActual.compras || 0) + 1;
            
            for(var j=0; j<usuariosRegistrados.length; j++){
                if(usuariosRegistrados[j].user === usuarioActual.user) {
                    usuariosRegistrados[j] = usuarioActual;
                }
            }
            saveUsers();
            localStorage.setItem("tactical_current_user", JSON.stringify(usuarioActual));
            
            var successMsg = currentLang === 'es' 
                ? "Transaccion aprobada, " + usuarioActual.user + ".<br><br><span style='color:var(--primary-color);'>TU NUMERO DE PEDIDO ES: <strong>" + orderId + "</strong></span><br><br>Por favor, guardalo para cualquier reclamacion. Tus articulos llegaran pronto."
                : "Transaction approved, " + usuarioActual.user + ".<br><br><span style='color:var(--primary-color);'>YOUR ORDER ID IS: <strong>" + orderId + "</strong></span><br><br>Please keep it for any claims. Your items will arrive soon.";
            
            window.showAlert(successMsg, function() {
                carrito = []; descuentoActual = 0; codigoAplicado = ""; 
                var dc = document.getElementById("discount-code");
                if(dc) dc.value = "";
                window.actualizarCarritoUI(); 
                if(popups.cart) popups.cart.classList.remove("active");
            });
        }
    });

    // --- GALERÍA INFINITA REPARADA ---
    var galeriaBase = ["https://espirituracer.com/archivos/2017/11/Ringbrothers-Ford-Mustang-Mach-1-Patriarc-15.webp","https://i.ytimg.com/vi/uIIaNGFAy6o/sddefault.jpg","https://www.schairerklassiker.de/wp-content/gallery/mb-220-seb-coupe-w111/MB_220SEbC_Fahrerseite.jpg","https://i.pinimg.com/736x/a1/44/1b/a1441b9424550332aa4c96c7b1d2b9b9.jpg","https://d1gl66oyi6i593.cloudfront.net/wp-content/uploads/2022/10/subasta-replica-DeLorean-DMC-12-7.jpg","https://hips.hearstapps.com/hmg-prod/images/porsche-911-gt3-r-101-1659114035.jpg?crop=1xw:0.920416250624064xh;center,top&resize=1200:*"];
    var galeriaActual = JSON.parse(localStorage.getItem("tactical_galeria_100")) || galeriaBase;
    
    var swiper;
    var renderizarGaleria = function() {
        var wrapper = document.getElementById("gallery-wrapper"); if(!wrapper) return; 
        wrapper.innerHTML = "";
        
        // TRUCO PARA BUCLE INFINITO SEGURO: Duplicar la galeria varias veces
        var galeriaRender = galeriaActual.concat(galeriaActual).concat(galeriaActual).concat(galeriaActual);

        for(var i=0; i<galeriaRender.length; i++){
            wrapper.innerHTML += '<div class="swiper-slide"><img src="'+galeriaRender[i]+'" onerror="this.src=\''+fallbackImage+'\';"></div>';
        }
        
        if(swiper) { swiper.destroy(true, true); }
        setTimeout(function() {
            if(typeof Swiper !== 'undefined') {
                swiper = new Swiper(".mySwiper", { 
                    effect: "coverflow", 
                    grabCursor: true, 
                    centeredSlides: true, 
                    slidesPerView: "auto", 
                    loop: true, 
                    loopedSlides: galeriaActual.length, // Define la cantidad real para un loop perfecto
                    coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false }, 
                    pagination: { el: ".swiper-pagination", clickable: true}, 
                    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } 
                });
            }
        }, 50);
    };

    bindEvent("btn-open-upload-photo", "click", function() { 
        if(!usuarioActual) { window.showAlert(currentLang === 'es' ? "Inicia sesion para publicar." : "Log in to publish."); if(popups.login) popups.login.classList.add("active"); return; } 
        if(popups.uploadPhoto) popups.uploadPhoto.classList.add("active"); 
    });

    bindEvent("btn-submit-photo", "click", function() { 
        var urlInput = document.getElementById("new-photo-url");
        var url = urlInput ? urlInput.value.trim() : ""; 
        if(url) { 
            galeriaActual.push(url); 
            localStorage.setItem("tactical_galeria_100", JSON.stringify(galeriaActual)); 
            renderizarGaleria(); 
            if(popups.uploadPhoto) popups.uploadPhoto.classList.remove("active"); 
            if(urlInput) urlInput.value = ""; 
            window.showAlert(currentLang === 'es' ? "Foto añadida a la galeria con exito." : "Photo successfully added to the gallery.");
        } else { window.showAlert(currentLang === 'es' ? "Por favor, introduce una URL valida." : "Please enter a valid URL."); }
    });

    bindEvent("form-servicio", "submit", function(e) { 
        e.preventDefault(); 
        if(!usuarioActual) { window.showAlert(currentLang === 'es' ? "Inicia sesion para solicitar una cita." : "Log in to request an appointment."); if(popups.login) popups.login.classList.add("active"); }
        else { 
            window.showAlert(currentLang === 'es' ? "Solicitud enviada, " + usuarioActual.user + ". Un mecanico se pondra en contacto contigo." : "Request sent, " + usuarioActual.user + ". A mechanic will contact you."); 
            e.target.reset(); 
        }
    });

    // ====================================================================
    // --- LÓGICA DEL CHATBOT ---
    // ====================================================================
    var chatToggle = document.getElementById('chat-toggle');
    var chatWindow = document.getElementById('chat-window');
    var closeChat = document.getElementById('close-chat');
    var chatInput = document.getElementById('chat-input');
    var chatSend = document.getElementById('chat-send');
    var chatMessages = document.getElementById('chat-messages');

    if (chatToggle && chatWindow) {
        
        chatToggle.addEventListener('click', function() { 
            chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
            if(chatWindow.style.display === 'flex' && chatMessages.children.length === 1) {
                var welcomeMsg = document.getElementById("chat-welcome");
                var agentName = usuarioActual ? usuarioActual.user : (currentLang === 'es' ? "Agente" : "Agent");
                if(welcomeMsg) welcomeMsg.textContent = currentLang === 'es' ? "Bienvenido al sistema, " + agentName + ". ¿En que te ayudo hoy?" : "Welcome to the system, " + agentName + ". How can I help you today?";
            }
        });
        
        if(closeChat) closeChat.addEventListener('click', function() { chatWindow.style.display = 'none'; });

        var addMessage = function(text, sender, isHTML) {
            var msg = document.createElement('div');
            msg.className = sender === 'user' ? 'msg-user' : 'msg-bot';
            if(isHTML) { msg.innerHTML = text; } else { msg.textContent = text; }
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        var botReply = function(text) {
            var cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
            var reply = "";
            var isHTML = false;
            var name = usuarioActual ? usuarioActual.user : (currentLang === 'es' ? "Agente" : "Agent");

            var check = function(keywords) {
                for(var i=0; i<keywords.length; i++) {
                    if(cleanText.indexOf(keywords[i]) !== -1) return true;
                }
                return false;
            };
            
            if (currentLang === 'en') {
                if (check(["thank", "thx"])) {
                    reply = "You're welcome, " + name + "! Let me know if you need anything else.";
                } else if (check(["history", "past order", "previous order", "my order", "purchases"])) {
                    reply = "To check your purchase and sales history, " + name + ", click on your name at the top right corner and select 'Order History'. You will see all your past transactions and order codes there.";
                } else if (check(["claim", "return", "refund", "problem", "issue", "complain", "broken", "reclamation"])) {
                    reply = "I'm sorry you have an issue, " + name + ". Please fill out our form here: <a href='reclamaciones.html' style='color:var(--primary-color); font-weight:bold; text-decoration:underline;'>Official Support Center</a>. You can find your Order ID in your History.";
                    isHTML = true;
                } else if (check(["repair", "fix", "workshop", "modify", "mechanic"])) {
                    reply = "For repairs or modifications, " + name + ", please submit a request using the 'Workshop' form on our main page. A mechanic will contact you shortly.";
                } else if (check(["gallery", "upload photo", "add photo", "picture"])) {
                    reply = "To upload a photo of your vehicle, " + name + ", make sure you are logged in, scroll down to the 'Gallery' section, and click the '+ Add Photo' button.";
                } else if (check(["discount", "coupon", "code", "promo", "level", "rank"])) {
                    reply = "You earn discounts by leveling up through purchases, " + name + ". Click your name at the top right and select 'My Discounts' to see your rank and active codes. Note: Codes have a 14-day cooldown!";
                } else if (check(["buy", "purchase", "pay", "cart", "cost", "price"])) {
                    reply = "To buy items, browse our 'Buy/Sell' market, add products to your cart, and click the Cart button at the top right to checkout. Make sure your card is exactly 12 digits!";
                } else if (check(["sell", "add item", "post item"])) {
                    reply = "To sell your own items, " + name + ", log in and go to the 'Buy/Sell' market, then click the '+ Upload Item' button.";
                } else if (check(["pass", "forgot", "recover", "lost"])) {
                    reply = "If you forgot your password, " + name + ", click the 'Login' button at the top right, and then click 'Forgot your password?'. Enter your username and registration email to reset it.";
                } else if (check(["log out", "logout", "sign out"])) {
                    reply = "To log out, click your name at the top right of the screen and select 'Logout' in red.";
                } else if (check(["sign up", "register", "create account", "join"])) {
                    reply = "To create an account, click the 'Login' button at the top right, then click 'Register here'. Registration allows you to buy, sell, and earn discounts!";
                } else if (check(["log in", "login", "sign in", "enter"])) {
                    reply = "To log in, " + name + ", click the 'Login' button in the top right navigation bar.";
                } else if (check(["product", "info", "item", "engine", "motor", "tire", "suspension", "paint", "armor", "light", "brake", "seat", "glass", "catalog", "piston", "wheel"])) {
                    reply = "We offer top-tier tactical gear: Armored V8 Engines, Off-Road Tires, Reinforced Suspensions, Radar-Absorbent Paint, Door Armor, LED Lights, Ceramic Brakes, Recaro Seats, and Bulletproof Glass. Check the 'Buy/Sell' section to see everything!";
                } else if (check(["how to use", "how this works", "what is this", "guide"])) {
                    reply = "This is Tactical Reparations, " + name + ". You can Buy/Sell tactical vehicle parts, request Workshop repairs, upload photos to the Gallery, and earn Discounts by leveling up your account with purchases!";
                } else if (check(["hello", "hi", "hey", "greetings"])) {
                    reply = "Hello, " + name + "! I can help you with your order history, uploading photos, buying/selling, catalog info or password recovery. What do you need?";
                } else {
                    reply = "I am your virtual assistant, " + name + ". I can guide you on how to check your history, buy, sell, upload photos, or manage claims. Could you rephrase your question using different keywords?";
                }

            } else {
                if (check(["gracia", "mersi"])) {
                    reply = "¡Gracias a ti por confiar en Tactical Reparations, " + name + "! Si necesitas algo mas, aqui me tienes.";
                } else if (check(["historial", "pedidos", "compras hechas", "he comprado", "pasado", "mis compras", "mis ventas", "ver mis pedidos", "mis pedidos"])) {
                    reply = "Para ver tu historial de compras y ventas, " + name + ", haz clic en tu nombre arriba a la derecha y selecciona 'Historial'. Alli veras tus tickets y codigos de pedido.";
                } else if (check(["reclam", "recalam", "devolu", "queja", "sugeren", "problema", "roto", "mal", "incidencia"])) {
                    reply = "Siento mucho tu problema, " + name + ". Por favor rellena el formulario en nuestro <a href='reclamaciones.html' style='color:var(--primary-color); font-weight:bold; text-decoration:underline;'>Centro de Soporte Oficial</a>. Necesitaras el codigo de pedido que esta en tu Historial.";
                    isHTML = true; 
                } else if (check(["reparar", "taller", "cita", "arreglo", "modificar", "mecanico"])) {
                    reply = "Para modificar o reparar tu vehiculo, " + name + ", utiliza el formulario de la seccion 'Taller' indicando tu modelo. Te responderemos al instante.";
                } else if (check(["galeria", "subir foto", "añadir foto", "imagen", "poner foto"])) {
                    reply = "Para subir una foto, " + name + ", inicia sesion primero. Luego baja a la seccion 'Galeria' y pulsa el boton gris '+ Añadir Foto'.";
                } else if (check(["cupon", "codigo", "descuento", "promocion", "nivel", "rango"])) {
                    reply = "Al comprar subes de nivel y ganas descuentos. Abre tu perfil arriba a la derecha y haz clic en 'Mis Descuentos' para ver tu codigo. Recuerda que solo se pueden usar 1 vez cada 14 dias habiles.";
                } else if (check(["comprar", "carrito", "pagar", "precio", "cuesta", "adquirir", "tienda"])) {
                    reply = "Para comprar, " + name + ", busca el articulo en el mercado y pulsa 'Añadir'. Luego ve al 'Carrito' arriba a la derecha para pagar. La tarjeta debe tener 12 digitos exactos por motivos de seguridad del sistema.";
                } else if (check(["vender", "subir articulo", "añadir articulo", "publicar"])) {
                    reply = "Para poner a la venta una pieza, " + name + ", inicia sesion, ve a 'Compra/Venta' y pulsa el boton '+ Subir Articulo'.";
                } else if (check(["cerrar", "salir", "desconectar", "apagar", "sesion"])) {
                    if (check(["iniciar", "entrar", "acceder", "loguear"])) {
                        reply = "Para iniciar sesion, " + name + ", haz clic en el boton verde de 'Iniciar Sesion' situado en la barra superior derecha.";
                    } else {
                        reply = "Para cerrar tu sesion, " + name + ", haz clic en el boton de arriba a la derecha que dice tu nombre y pulsa en 'Cerrar Sesion' (en rojo).";
                    }
                } else if (check(["olvida", "perdi", "recuperar", "contra"])) {
                    reply = "Para recuperar tu contraseña, " + name + ", ve al boton de Iniciar Sesion y pincha en '¿Has olvidado tu contraseña?'. Introduce tu usuario y correo de registro exactos para cambiarla.";
                } else if (check(["registrar", "crear cuenta", "hacer cuenta", "ventaja", "beneficio"])) {
                    reply = "Registrarte te permite subir de nivel, conseguir codigos de descuento de hasta el 25%, vender piezas, ver tu historial y usar la Galeria. Haz clic en 'Iniciar Sesion' y luego en 'Registrate aqui'.";
                } else if (check(["iniciar", "entrar", "acceder", "loguear"])) {
                    reply = "Para iniciar sesion, " + name + ", haz clic en el boton verde de 'Iniciar Sesion' situado en la barra superior derecha.";
                } else if (check(["producto", "info", "articulo", "motor", "neumatico", "rueda", "suspension", "pintura", "blindaje", "luce", "freno", "asiento", "cristal", "catalogo", "piston", "vende", "pieza"])) {
                    reply = "Ofrecemos equipo tactico de elite: Motores V8 Blindados, Neumaticos Off-Road, Suspension Reforzada, Pintura Absorbe-Radar, Blindaje, Luces LED, Frenos Ceramicos, Asientos Recaro y Cristales Antibalas. ¡Visita la seccion 'Compra/Venta' para ver el catalogo completo!";
                } else if (check(["como se usa", "como funciona", "que es esto", "guia"])) {
                    reply = "Esto es Tactical Reparations, " + name + ". Aqui puedes Comprar/Vender piezas tacticas, pedir cita en el Taller, subir fotos a la Galeria y ganar Descuentos subiendo de nivel con tus compras a lo largo del tiempo.";
                } else if(check(["hola", "buenas", "ey", "saludo", "que tal"])) {
                    reply = "¡Hola, " + name + "! Preguntame como ver tu historial, subir una foto, sobre nuestro catalogo de productos, recuperar contraseñas o hacer devoluciones.";
                } else {
                    reply = "Soy la IA de soporte, " + name + ". Entiendo preguntas sobre como ver tu historial, subir fotos a la galeria, info de productos, el taller o reclamaciones. ¿Me lo dices de otra manera?";
                }
            }
            
            setTimeout(function(){ addMessage(reply, 'bot', isHTML); }, 800);
        }

        var sendMessage = function() {
            var text = chatInput.value.trim();
            if(!text) return;
            addMessage(text, 'user', false);
            chatInput.value = '';
            botReply(text);
        };

        if(chatSend) chatSend.addEventListener('click', sendMessage);
        if(chatInput) {
            chatInput.addEventListener('keypress', function(e) { 
                if(e.key === 'Enter') sendMessage(); 
            });
        }
    }

    applyLanguage(currentLang);
    renderizarGaleria();
    renderizarMercado();
    if(typeof window.actualizarCarritoUI === 'function') window.actualizarCarritoUI();
});