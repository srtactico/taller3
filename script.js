document.addEventListener("DOMContentLoaded", () => {
    
    let verTodosMercado = false; 
    let descuentoActual = 0;

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

    let currentLang = localStorage.getItem("tactical_lang") || "es";
    
    // Diccionario base reducido para no alargar el código aquí (tienes el resto en HTML)
    const translations = {
        es: { emptyCart: "Tu carrito está vacío.", seeMoreBtn: "Ver todos los artículos", seeLessBtn: "Ver menos" },
        en: { emptyCart: "Your cart is empty.", seeMoreBtn: "See all items", seeLessBtn: "See less" }
    };

    const applyLanguage = (lang) => {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if(translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
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
        
        if (compras === 0) {
            descContainer.innerHTML = "Aún no tienes descuentos. ¡Realiza compras en el Mercado para subir de nivel y desbloquear códigos tácticos!";
        } else if (compras >= 1 && compras <= 2) {
            descContainer.innerHTML = `<span style="color:#cd7f32; font-size:1.1rem; font-weight:bold;">★ Rango Bronce:</span> 10% de descuento en tienda.<br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">BRONCE10</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/3 para ascender a Plata</small>`;
        } else if (compras >= 3 && compras <= 5) {
            descContainer.innerHTML = `<span style="color:#c0c0c0; font-size:1.1rem; font-weight:bold;">★★ Rango Plata:</span> 15% de descuento en tienda.<br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">PLATA15</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/6 para ascender a Oro</small>`;
        } else if (compras >= 6 && compras <= 9) {
            descContainer.innerHTML = `<span style="color:#ffd700; font-size:1.1rem; font-weight:bold;">★★★ Rango Oro:</span> 20% de descuento en tienda.<br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">ORO20</strong><br><br><small style="color:#666;">Compras realizadas: ${compras}/10 para ascender a Élite</small>`;
        } else {
            descContainer.innerHTML = `<span style="color:#e5e4e2; font-size:1.1rem; font-weight:bold; text-shadow: 0 0 5px #fff;">🏆 Rango Élite:</span> 25% de descuento absoluto.<br><br><span style="color:var(--text-main);">Código válido:</span> <strong style="color:var(--primary-color);">ELITE25</strong><br><br><small style="color:#666;">Agente legendario. Compras totales: ${compras}</small>`;
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

        usuariosRegistrados.push({ user: userVal, pass: passVal, email: emailVal, compras: 0, ultimoUsoCupon: null });
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

    const logout = () => { usuarioActual = null; nav.userDropdown.style.display = "none"; nav.loginBtn.style.display = "block"; alert("Sesión cerrada correctamente."); };

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
        { id: 1, nombre: "Motor V8 Blindado", nombreEn: "Armored V8 Engine", tipo: "Mecánica Pesada", tipoEn: "Heavy Mechanics", precio: 4500, vendedor: "Tactical HQ", imagen: "https://media.istockphoto.com/id/528918828/es/foto/motor-de-automoci%C3%B3n-3d-ilustraci%C3%B3n.jpg?s=612x612&w=0&k=20&c=o5ejIooVV10-5hFTbCv1l1IETRzSaHqupWhT-LRPbGc=", descripcion: "Motor de bloque grande optimizado para resistir impactos y mantener el rendimiento en condiciones extremas." },
        { id: 2, nombre: "Neumáticos Tácticos Off-Road", nombreEn: "Tactical Off-Road Tires", tipo: "Movilidad", tipoEn: "Mobility", precio: 800, vendedor: "Tactical HQ", imagen: "https://img.freepik.com/psd-gratis/neumaticos-agresivos-todo-terreno-caucho-duradero-todo-terreno_191095-90385.jpg?semt=ais_user_personalization&w=740&q=80", descripcion: "Juego de 4 neumáticos de compuesto militar con diseño de banda de rodadura agresivo para barro y roca." },
        { id: 3, nombre: "Kit de Suspensión Reforzada", nombreEn: "Reinforced Suspension Kit", tipo: "Modificación", tipoEn: "Upgrades", precio: 1200, vendedor: "Tactical HQ", imagen: "https://www.tot4x4.com/2269-large_default/kit-de-suspension-reforzada-30mm-efs-diesel.jpg", descripcion: "Sistema de suspensión de largo recorrido con amortiguadores de nitrógeno presurizado." },
        { id: 4, nombre: "Pintura Absorbe-Radar (Mate)", nombreEn: "Radar-Absorbent Paint (Matte)", tipo: "Estética / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 1500, vendedor: "Tactical HQ", imagen: "https://montopinturas.com/public/Image/2023/7/502230.png", descripcion: "Recubrimiento cerámico avanzado con propiedades de absorción de ondas de radar." },
        { id: 5, nombre: "Blindaje Ligero de Puertas", nombreEn: "Light Door Armor", tipo: "Defensa", tipoEn: "Defense", precio: 2100, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1592853625601-bb9d23da12fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Paneles de blindaje compuesto de nivel III+ para instalación interna en puertas de vehículos." },
        { id: 6, nombre: "Luces LED de Alta Intensidad", nombreEn: "High-Intensity LED Lights", tipo: "Visión", tipoEn: "Vision", precio: 450, vendedor: "Tactical HQ", imagen: "https://asxstore.com/cdn/shop/files/pop-up.png?v=1685366963&width=1080", descripcion: "Barra de luz LED de grado táctico con una salida combinada de 30,000 lúmenes." },
        { id: 7, nombre: "Kit de Frenos Cerámicos", nombreEn: "Ceramic Brake Kit", tipo: "Mecánica Pesada", tipoEn: "Heavy Mechanics", precio: 1800, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1486262715619-67081010dd13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Discos de freno carbono-cerámicos perforados y ventilados. Resisten temperaturas extremas." },
        { id: 8, nombre: "Asientos Tácticos Recaro", nombreEn: "Tactical Recaro Seats", tipo: "Estética / Camuflaje", tipoEn: "Aesthetics / Camo", precio: 950, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Asientos deportivos tipo baquet con arneses de 5 puntos. Tejido ignífugo." },
        { id: 9, nombre: "Cristales Antibalas Nivel 4", nombreEn: "Level 4 Bulletproof Glass", tipo: "Defensa", tipoEn: "Defense", precio: 3200, vendedor: "Tactical HQ", imagen: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", descripcion: "Juego de cristales de policarbonato laminado ultragrueso. Capaces de detener impactos de calibres pesados." }
    ];
    
    let mercadoActual = JSON.parse(localStorage.getItem("tactical_mercado_100")) || productosBase;
    
    const formatearPrecio = (p) => p.toLocaleString(currentLang === 'es' ? "es-ES" : "en-US") + (currentLang === 'es' ? "€" : "$");

    const renderizarMercado = () => {
        const contenedor = document.getElementById("productos-db");
        if(!contenedor) return; contenedor.innerHTML = "";
        
        const catLabel = currentLang === 'es' ? "Categoría" : "Category";
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
                    ${verTodosMercado ? (currentLang === 'es' ? 'Ver menos' : 'See less') : (currentLang === 'es' ? 'Ver todos los artículos' : 'See all items')}
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
    
    // --- CARRITO, PAGOS Y CÓDIGOS DE DESCUENTO ---
    let carrito = [];
    const actualizarCarritoUI = () => {
        const cont = document.getElementById("cart-items-container");
        const btnCheckout = document.getElementById("btn-checkout");
        const priceElement = document.getElementById("cart-total-price");
        const discElement = document.getElementById("cart-discounted-price");
        
        cont.innerHTML = ""; let totalP = 0; let totalI = 0;
        
        if(carrito.length === 0) {
            cont.innerHTML = `<p style="color:var(--text-muted);text-align:center;">El carrito está vacío.</p>`;
            document.getElementById("payment-section").style.display = "none";
            document.getElementById("discount-section").style.display = "none";
            btnCheckout.style.display = "none";
            descuentoActual = 0;
        } else {
            document.getElementById("payment-section").style.display = "block";
            document.getElementById("discount-section").style.display = "flex";
            btnCheckout.style.display = "block";
            carrito.forEach(item => { 
                totalP += (item.precio * item.cantidad); totalI += item.cantidad;
                cont.innerHTML += `<div class="cart-item"><div class="cart-item-info"><h4>${item.nombre}</h4><p>${formatearPrecio(item.precio)}</p></div><div class="cart-controls"><button class="btn-qty btn-restar" data-id="${item.id}">-</button><span>${item.cantidad}</span><button class="btn-qty btn-sumar" data-id="${item.id}">+</button></div></div>`; 
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
    
    // VALIDACIÓN DE CÓDIGO DE DESCUENTO CON COOLDOWN (14 DÍAS)
    document.getElementById("btn-apply-discount")?.addEventListener("click", () => {
        if(!usuarioActual) {
            alert("⚠️ Debes iniciar sesión para usar descuentos.");
            return;
        }

        // Check Cooldown
        if (usuarioActual.ultimoUsoCupon) {
            const diasPasados = (Date.now() - usuarioActual.ultimoUsoCupon) / (1000 * 60 * 60 * 24);
            if (diasPasados < 14) {
                const diasRestantes = Math.ceil(14 - diasPasados);
                alert(`⏳ Aún no puedes usar otro cupón. Deben pasar 14 días entre usos. Faltan ${diasRestantes} días.`);
                return;
            }
        }

        const code = document.getElementById("discount-code").value.trim().toUpperCase();
        if(code === "BRONCE10") descuentoActual = 0.10;
        else if(code === "PLATA15") descuentoActual = 0.15;
        else if(code === "ORO20") descuentoActual = 0.20;
        else if(code === "ELITE25") descuentoActual = 0.25;
        else {
            alert("❌ Código inválido o no reconocido.");
            descuentoActual = 0;
        }
        
        if(descuentoActual > 0) {
            alert(`✅ ¡Descuento aplicado con éxito del ${descuentoActual*100}%!`);
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

    // Ocultar/Mostrar campos de pago
    document.getElementById("payment-method")?.addEventListener("change", (e) => { 
        document.getElementById("card-details").style.display = "none";
        document.getElementById("paypal-details").style.display = "none";
        document.getElementById("cripto-details").style.display = "none";

        if(e.target.value === "tarjeta") document.getElementById("card-details").style.display = "block";
        else if(e.target.value === "paypal") document.getElementById("paypal-details").style.display = "block";
        else if(e.target.value === "cripto") document.getElementById("cripto-details").style.display = "block";
    });

    // Pagar y Validar
    document.getElementById("btn-checkout")?.addEventListener("click", () => {
        if(carrito.length > 0) {
            
            const method = document.getElementById("payment-method").value;
            if(method === "tarjeta") {
                const cNum = document.getElementById("card-num").value.trim();
                const cDate = document.getElementById("card-date").value.trim();
                const cCvc = document.getElementById("card-cvc").value.trim();
                if(cNum.length < 16 || cDate.length < 5 || cCvc.length < 3) {
                    alert("❌ Faltan datos obligatorios de la Tarjeta (16 dígitos, Fecha MM/AA, CVC)."); return;
                }
            } else if(method === "paypal") {
                const pEmail = document.getElementById("paypal-email").value.trim();
                if(pEmail === "" || !pEmail.includes("@")) {
                    alert("❌ Introduce un email válido de PayPal asociado a tu cuenta."); return;
                }
            } else if(method === "cripto") {
                const wAddr = document.getElementById("cripto-wallet").value.trim();
                if(wAddr.length < 10) {
                    alert("❌ Introduce una dirección válida de tu Wallet."); return;
                }
            }

            // Si se usó descuento, guardamos la fecha de hoy para el Cooldown
            if (descuentoActual > 0) {
                usuarioActual.ultimoUsoCupon = Date.now();
            }

            // Aumentar compras y guardar
            usuarioActual.compras = (usuarioActual.compras || 0) + 1;
            const index = usuariosRegistrados.findIndex(u => u.user === usuarioActual.user);
            usuariosRegistrados[index] = usuarioActual;
            saveUsers();
            
            alert(`✅ Transacción aprobada, ${usuarioActual.user}. Tus artículos llegarán pronto.`);
            
            carrito = []; descuentoActual = 0; document.getElementById("discount-code").value = "";
            actualizarCarritoUI(); popups.cart.classList.remove("active");
        }
    });

    // --- GALERÍA ---
    const galeriaBase = ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1503376763066-2067ee4e9b69?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800","https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800"];
    let galeriaActual = JSON.parse(localStorage.getItem("tactical_galeria_100")) || galeriaBase;
    
    let swiper;
    const renderizarGaleria = () => {
        const wrapper = document.getElementById("gallery-wrapper"); if(!wrapper) return; wrapper.innerHTML = "";
        galeriaActual.forEach(url => { wrapper.innerHTML += `<div class="swiper-slide"><img src="${url}" onerror="this.src='${fallbackImage}';"></div>`; });
        if(swiper) swiper.destroy(true, true);
        swiper = new Swiper(".mySwiper", { effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", loop: true });
    };

    // --- LÓGICA DEL CHATBOT SUPER INTELIGENTE (VERSIÓN 3.0) ---
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
                welcomeMsg.textContent = `¡Bienvenido al sistema, ${agentName}! ¿En qué te ayudo hoy?`;
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
            let name = usuarioActual ? usuarioActual.user : "Agente";

            // INTELIGENCIA DEL BOT (Detecta palabras clave exactas de tus problemas)
            
            if (cleanText.includes("gracia") || cleanText.includes("mersi") || cleanText.includes("thank")) {
                reply = `¡Gracias a ti por visitar Tactical Reparations, ${name}! Si necesitas algo más, aquí me tienes.`;
            
            } else if (cleanText.includes("iniciar sesion") || cleanText.includes("entrar") || cleanText.includes("loguear")) {
                reply = `Para iniciar sesión, ${name}, haz clic en el botón verde de "Iniciar Sesión" situado en la barra de arriba a la derecha. Ahí podrás meter tus datos o registrarte.`;
            
            } else if (cleanText.includes("cerrar sesion") || cleanText.includes("salir") || cleanText.includes("desloguear")) {
                reply = `Para cerrar tu sesión de forma segura, haz clic en el botón arriba a la derecha que dice "${name}" y, en el menú que se despliega, pulsa en "Cerrar Sesión" (el texto rojo).`;
            
            } else if (cleanText.includes("nivel") || cleanText.includes("rango") || cleanText.includes("cuantas compras")) {
                if(usuarioActual) {
                    reply = `Ahora mismo tienes un total de ${usuarioActual.compras || 0} compras registradas en el sistema, ${name}. Ve a tu perfil y haz clic en "Mis Descuentos" para ver qué nivel eres y qué códigos tienes disponibles.`;
                } else {
                    reply = "Para consultar tu rango de fidelidad y número de compras, primero debes iniciar sesión en la plataforma.";
                }
            
            } else if (cleanText.includes("registrar") || cleanText.includes("ventaja") || cleanText.includes("beneficio")) {
                reply = `Registrarte es vital, ${name}. Te permite subir de nivel (Bronce, Plata, Oro, Élite) al hacer compras y conseguir códigos de descuento de hasta el 25% para el mercado. ¡Además podrás subir fotos a la Galería!`;
            
            } else if (cleanText.includes("reclamacion") || cleanText.includes("devolucion") || cleanText.includes("queja") || cleanText.includes("sugerencia") || cleanText.includes("problema")) {
                reply = `Siento mucho que hayas tenido un problema, ${name}. Para tramitar reclamaciones, devoluciones o darnos sugerencias, por favor rellena el formulario oficial en nuestro <a href="reclamaciones.html" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Centro de Soporte y Reclamaciones</a>.`;
                isHTML = true; // Permite que se dibuje el enlace clickeable
            
            } else if (cleanText.includes("precio") || cleanText.includes("comprar") || cleanText.includes("cuesta") || cleanText.includes("catalogo")) {
                reply = "Puedes adquirir o vender artículos en la sección 'Compra/Venta' (Unidad 1). Recuerda que ahora no se te permite pagar si no rellenas los datos bancarios correctamente, ¡es por tu seguridad!";
            
            } else if (cleanText.includes("reparar") || cleanText.includes("taller") || cleanText.includes("cita")) {
                reply = `Para modificar o reparar tu vehículo, ${name}, utiliza el formulario de la sección 'Taller' indicando tu modelo y lo que necesitas. Te responderemos al instante.`;
            
            } else if (cleanText.includes("cupon") || cleanText.includes("codigo") || cleanText.includes("descuento")) {
                reply = "Tienes un código de descuento? Mételo en el Carrito de la compra antes de pagar. Recuerda la norma del cuartel: ¡Los códigos solo se pueden usar 1 vez cada 14 días!";
            
            } else if(cleanText.includes("hola") || cleanText.includes("buenas") || cleanText.includes("ey")) {
                reply = `¡Hola de nuevo, ${name}! Puedes preguntarme cómo cerrar sesión, qué nivel eres, o si tienes algún problema para mandarte a Reclamaciones.`;
            
            } else {
                reply = `Soy la IA de soporte, ${name}. Entiendo preguntas sobre iniciar/cerrar sesión, niveles de cuenta, devoluciones, reclamaciones, compras y el taller. ¿Me lo dices de otra manera?`;
            }
            
            setTimeout(() => addMessage(reply, 'bot', isHTML), 1000);
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