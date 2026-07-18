document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // SLIDE NAVIGATION
    // -------------------------------------------------------------
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideNumDisplay = document.getElementById('slide-number-display');
    const dotsContainer = document.getElementById('progress-dots-container');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Generate progress dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.progress-dot');

    function updateNavigation() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        slideNumDisplay.textContent = `Slide ${currentSlide + 1} of ${totalSlides}`;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateNavigation();
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateNavigation();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateNavigation();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateNavigation();
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            if (currentSlide > 0) {
                currentSlide--;
                updateNavigation();
            }
        }
    });

    // -------------------------------------------------------------
    // SLIDE 5: TRIAD DIAGRAM INTERACTION
    // -------------------------------------------------------------
    const triadNodes = document.querySelectorAll('.part-node');
    const triadTitle = document.getElementById('triad-detail-title');
    const triadDesc = document.getElementById('triad-detail-desc');

    const triadData = {
        abilities: {
            title: "Abilities — What can it do?",
            desc: "The set of actions or transformations an Entity is capable of executing. <br><strong>Examples:</strong><br>• <i>Payment Microservice:</i> Ability to charge credit cards.<br>• <i>Inventory System:</i> Ability to check product stock.<br>• <i>Human Manager:</i> Ability to approve large refund requests."
        },
        knowledge: {
            title: "Knowledge — What does it keep private?",
            desc: "The private database state or information that conditions how an Entity behaves. ECP rules state that Knowledge is never shared directly.<br><strong>Examples:</strong><br>• <i>Database Node:</i> User credentials, transaction history.<br>• <i>Pricing Service:</i> Discount rules and formulas."
        },
        interfaces: {
            title: "Interfaces — How do others contact it?",
            desc: "The declared entry points (like API endpoints or UI buttons) that other Entities use to interact. <br><strong>Examples:</strong><br>• <i>Web Server:</i> API routes like <code>POST /checkout</code>.<br>• <i>System Boundary:</i> The input validator gatekeeper checks all incoming data before passing it inside."
        }
    };

    triadNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeKey = node.getAttribute('data-node');
            if (nodeKey && triadData[nodeKey]) {
                triadNodes.forEach(n => n.classList.remove('selected'));
                node.classList.add('selected');

                triadTitle.innerHTML = triadData[nodeKey].title;
                triadDesc.innerHTML = triadData[nodeKey].desc;
            }
        });
    });

    // -------------------------------------------------------------
    // SLIDE 6: BOUNDARY TOGGLE INTERACTION
    // -------------------------------------------------------------
    const boundaryToggle = document.getElementById('boundary-toggle');
    const boundaryRing = document.getElementById('boundary-visual-ring');
    const boundaryStatus = document.getElementById('boundary-status');
    const boundaryCore = document.getElementById('boundary-core');

    boundaryToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            boundaryRing.classList.add('active');
            boundaryStatus.textContent = "ACTIVE (SECURED)";
            boundaryStatus.style.color = "var(--accent-green)";
            boundaryCore.textContent = "SECURE";
            boundaryCore.style.borderColor = "var(--accent-green)";
            boundaryCore.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.2)";
        } else {
            boundaryRing.classList.remove('active');
            boundaryStatus.textContent = "BYPASSED (VULNERABLE)";
            boundaryStatus.style.color = "var(--accent-red)";
            boundaryCore.textContent = "EXPOSED";
            boundaryCore.style.borderColor = "var(--accent-red)";
            boundaryCore.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.2)";
        }
    });

    // -------------------------------------------------------------
    // SLIDE 8: DEPENDENCY VISUALIZER INTERACTION
    // -------------------------------------------------------------
    const depEntities = document.querySelectorAll('.dep-entity');
    const arrow1 = document.getElementById('arrow-1');
    const arrow2 = document.getElementById('arrow-2');
    const depSummary = document.getElementById('dep-summary');

    depEntities.forEach(ent => {
        ent.addEventListener('click', () => {
            depEntities.forEach(e => e.classList.remove('active'));
            arrow1.classList.remove('active');
            arrow2.classList.remove('active');

            const entId = ent.id;
            if (entId === 'dep-user') {
                ent.classList.add('active');
                arrow1.classList.add('active');
                document.getElementById('dep-user').classList.add('active');
                document.getElementById('dep-service').classList.add('active');
                depSummary.innerHTML = "<strong style='color: var(--accent-purple);'>Outgoing Dependency (from Billing perspective):</strong> The User Entity depends on the Billing Service to fulfill the checkout role. This represents the service's outward influence.";
            } else if (entId === 'dep-service' || entId === 'dep-service2') {
                document.getElementById('dep-service').classList.add('active');
                document.getElementById('dep-service2').classList.add('active');
                arrow2.classList.add('active');
                document.getElementById('dep-db').classList.add('active');
                depSummary.innerHTML = "<strong style='color: var(--accent-cyan);'>Incoming Dependency (from Billing perspective):</strong> The Billing Service depends on the Database Node to fetch state (Knowledge). The service requires this connection to operate.";
            } else if (entId === 'dep-db') {
                ent.classList.add('active');
                depSummary.innerHTML = "<strong style='color: var(--accent-green);'>Storage Node:</strong> Retains database state. Guarded by an Interface Boundary, other services cannot tamper with database files directly; they must request access via exposed APIs.";
            }
        });
    });

    // -------------------------------------------------------------
    // SLIDE 11: PHILOSOPHICAL TABS INTERACTION (REUSED FOR OOP VS ECP)
    // -------------------------------------------------------------
    const tabContainers = document.querySelectorAll('.tabs-container');
    tabContainers.forEach(container => {
        const btns = container.querySelectorAll('.tab-btn');
        const contents = container.querySelectorAll('.tab-content');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabTarget = btn.getAttribute('data-tab');
                btns.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const targetContent = document.getElementById(tabTarget);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    });

    // -------------------------------------------------------------
    // SLIDE 12: CHECKOUT WORKFLOW SIMULATOR
    // -------------------------------------------------------------
    const simBtns = document.querySelectorAll('.sim-step-btn');
    const simLogDisplay = document.getElementById('sim-log-display');

    const checkoutLogs = {
        'sim-btn-1': [
            "&gt; [Human User Entity] clicks 'Buy Now' inside the web browser.",
            "&gt; [User Interface Boundary] captures click event coordinates.",
            "&gt; [Shopping Cart Entity] checks items (Knowledge): 1x Shirt.",
            "&gt; Cart Entity invokes checkPrice() Ability.",
            "&gt; Cart sends checkout request message to Back-end API."
        ],
        'sim-btn-2': [
            "&gt; Request hits API Gateway Interface Boundary.",
            "&gt; [Gateway Interface Boundary] acts as Bouncer: requests verification from User Auth service.",
            "&gt; [Auth Service Entity] checks session credentials in DB (Knowledge).",
            "&gt; Auth Service verifies token is active and valid.",
            "&gt; [Gateway Interface Boundary] opens door, routing request to Order Service."
        ],
        'sim-btn-3': [
            "&gt; [Order Service Entity] receives checkout order.",
            "&gt; Order Service calls [Inventory Service Entity] via gRPC interface.",
            "&gt; [Inventory Entity] inspects stock database (Knowledge): Stock level = 45.",
            "&gt; Inventory invokes reserveStock() Ability.",
            "&gt; Stock reserves successfully. Inventory emits 'StockReserved' event message."
        ],
        'sim-btn-4': [
            "&gt; [Billing Service Entity] detects stock reserve event.",
            "&gt; Billing Service contacts [External Stripe API Entity] via secure proxy.",
            "&gt; [Stripe API Interface Boundary] enforces PCI-DSS security checks.",
            "&gt; Transaction processed securely. stripe returns Payment Success token."
        ],
        'sim-btn-5': [
            "&gt; [Monitoring Service Entity] logs trace audit lines.",
            "&gt; Logs transaction metrics: Time = 240ms, Status = SUCCESS.",
            "&gt; [User UI Entity] updates display: 'Order complete! Check your email.'",
            "&gt; All Entity state data persisted safely. Checkout completed successfully."
        ]
    };

    simBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnId = btn.id;

            simBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (checkoutLogs[btnId]) {
                simLogDisplay.innerHTML = '';
                checkoutLogs[btnId].forEach((log, index) => {
                    const logLine = document.createElement('div');
                    logLine.classList.add('sim-log-line');
                    logLine.style.animationDelay = `${index * 150}ms`;
                    
                    let styledLog = log.replace(/\[(.*?)\]/g, '<span style="color: var(--accent-purple); font-weight: 600;">[$1]</span>');
                    styledLog = styledLog.replace(/Ability check:|Ability:|Interface:|Ability/g, '<span style="color: var(--accent-cyan);">$&</span>');
                    styledLog = styledLog.replace(/Knowledge/g, '<span style="color: var(--accent-blue);">Knowledge</span>');
                    styledLog = styledLog.replace(/Interface Boundary|Boundary/g, '<span style="color: var(--accent-green);">$&</span>');
                    
                    logLine.innerHTML = styledLog;
                    simLogDisplay.appendChild(logLine);
                });
            }
        });
    });
});
