document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. BASE SLIDE NAVIGATION ENGINE
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideNumDisplay = document.getElementById('slide-number-display');
    const progressDotsContainer = document.getElementById('progress-dots-container');

    let currentSlideIndex = 0;

    // Generate dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        progressDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.progress-dot');

    function updateControls() {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlideIndex);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlideIndex);
        });

        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;

        slideNumDisplay.textContent = `Slide ${currentSlideIndex + 1} of ${slides.length}`;
    }

    function goToSlide(index) {
        if (index >= 0 && index < slides.length) {
            currentSlideIndex = index;
            updateControls();
        }
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1);
            }
        }
    });

    // Initialize nav states
    updateControls();

    // ----------------------------------------------------
    // 2. SCOPED TAB SELECTION SYSTEM
    // ----------------------------------------------------
    document.querySelectorAll('.tabs-container').forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTabId = btn.getAttribute('data-tab');

                tabButtons.forEach(b => b.classList.toggle('active', b === btn));
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.id === targetTabId);
                });
            });
        });
    });

    // ----------------------------------------------------
    // 3. FAILURE CUT-SET SIMULATOR
    // ----------------------------------------------------
    const cutContainer = document.getElementById('cutset-sim-container');
    const btnResetCutset = document.getElementById('btn-reset-cutset');
    const cutTitle = document.getElementById('cut-detail-title');
    const cutDesc = document.getElementById('cut-detail-desc');

    const cutNodes = [
        { id: 'user', label: 'User', x: 15, y: 50, critical: false },
        { id: 'gateway', label: 'Gateway', x: 40, y: 50, critical: true },
        { id: 'billing', label: 'Billing', x: 68, y: 25, critical: false },
        { id: 'inventory', label: 'Inventory', x: 68, y: 75, critical: false },
        { id: 'db', label: 'DB Node', x: 90, y: 50, critical: false }
    ];

    const cutEdges = [
        { from: 'user', to: 'gateway', fx: 15, fy: 50, tx: 40, ty: 50 },
        { from: 'gateway', to: 'billing', fx: 40, fy: 50, tx: 68, ty: 25 },
        { from: 'gateway', to: 'inventory', fx: 40, fy: 50, tx: 68, ty: 75 },
        { from: 'billing', to: 'db', fx: 68, fy: 25, tx: 90, ty: 50 },
        { from: 'inventory', to: 'db', fx: 68, fy: 75, tx: 90, ty: 50 }
    ];

    let failedNodes = [];

    function renderCutsetGraph() {
        if (!cutContainer) return;
        cutContainer.innerHTML = '';

        // Draw edges
        cutEdges.forEach(e => {
            const isSevered = failedNodes.includes(e.from) || failedNodes.includes(e.to);
            createCutEdge(e, isSevered);
        });

        // Draw nodes
        cutNodes.forEach(n => {
            const state = failedNodes.includes(n.id) ? 'failed' : (isDisconnected(n.id) ? 'isolated' : 'active');
            createCutNode(n, state);
        });
    }

    function createCutNode(n, state) {
        const el = document.createElement('div');
        el.classList.add('cut-node');
        el.id = `cutnode-${n.id}`;
        el.textContent = n.label;
        el.style.left = `${n.x}%`;
        el.style.top = `${n.y}%`;
        el.style.transform = 'translate(-50%, -50%)';

        if (state === 'failed') {
            el.classList.add('failed');
            el.textContent = 'CRASHED';
        } else if (state === 'isolated') {
            el.classList.add('isolated');
        }

        // Click handler to trigger failure
        el.addEventListener('click', () => {
            if (n.id === 'user' || n.id === 'db') return; // Cannot crash user or db
            if (failedNodes.includes(n.id)) return;

            failedNodes.push(n.id);
            evaluateGraphOutage();
            renderCutsetGraph();
        });

        cutContainer.appendChild(el);
    }

    function createCutEdge(e, isSevered) {
        const line = document.createElement('div');
        line.classList.add('cut-edge');
        if (isSevered) line.classList.add('severed');

        const w = cutContainer.clientWidth;
        const h = cutContainer.clientHeight;
        const px1 = (e.fx / 100) * w;
        const py1 = (e.fy / 100) * h;
        const px2 = (e.tx / 100) * w;
        const py2 = (e.ty / 100) * h;

        const dist = Math.sqrt((px2 - px1)**2 + (py2 - py1)**2);
        const angle = Math.atan2(py2 - py1, px2 - px1) * 180 / Math.PI;

        line.style.width = `${dist}px`;
        line.style.left = `${e.fx}%`;
        line.style.top = `${e.fy}%`;
        line.style.transform = `rotate(${angle}deg)`;

        cutContainer.appendChild(line);
    }

    function isDisconnected(nodeId) {
        if (nodeId === 'user') return false;
        // User cannot reach nodeId if gateway is failed
        if (failedNodes.includes('gateway')) {
            return nodeId !== 'gateway';
        }
        // If billing and inventory are failed, DB is disconnected
        if (nodeId === 'db' && failedNodes.includes('billing') && failedNodes.includes('inventory')) {
            return true;
        }
        // If billing is failed, billing is isolated but inventory remains connected
        if (nodeId === 'billing' && failedNodes.includes('billing')) return true;
        if (nodeId === 'inventory' && failedNodes.includes('inventory')) return true;
        return false;
    }

    function evaluateGraphOutage() {
        if (failedNodes.includes('gateway')) {
            cutTitle.textContent = "SYSTEM PARTITIONED!";
            cutTitle.style.color = "var(--accent-red)";
            cutDesc.innerHTML = "Gateway failed. All paths connecting User to DB Node are severed. <br><strong>Minimal Cut Set triggered:</strong> <code>{ Edge(User -> Gateway) }</code>.";
        } else if (failedNodes.includes('billing') && failedNodes.includes('inventory')) {
            cutTitle.textContent = "SYSTEM PARTITIONED!";
            cutTitle.style.color = "var(--accent-red)";
            cutDesc.innerHTML = "Both Billing and Inventory failed. The DB is disconnected from the Gateway. <br><strong>Minimal Cut Set triggered:</strong> <code>{ Edge(Gateway -> Billing), Edge(Gateway -> Inventory) }</code>.";
        } else if (failedNodes.includes('billing')) {
            cutTitle.textContent = "DEGRADED STATE (STILL ACTIVE)";
            cutTitle.style.color = "var(--accent-cyan)";
            cutDesc.innerHTML = "Billing crashed. However, because we have a redundant path through Inventory, the user can still reach the database. <strong>System remains 100% operational.</strong>";
        } else if (failedNodes.includes('inventory')) {
            cutTitle.textContent = "DEGRADED STATE (STILL ACTIVE)";
            cutTitle.style.color = "var(--accent-cyan)";
            cutDesc.innerHTML = "Inventory crashed. However, because we have a redundant path through Billing, the user can still reach the database. <strong>System remains 100% operational.</strong>";
        } else {
            cutTitle.textContent = "Active Network";
            cutTitle.style.color = "var(--accent-purple)";
            cutDesc.innerHTML = "All nodes active. Minimal cut-set to disconnect User from DB: <code>{ Edge(Gateway -> Billing) }</code>";
        }
    }

    if (btnResetCutset) {
        btnResetCutset.addEventListener('click', () => {
            failedNodes = [];
            evaluateGraphOutage();
            renderCutsetGraph();
        });
    }

    // Initialize Cut-set Graph
    renderCutsetGraph();

    // ----------------------------------------------------
    // 5. DYNAMIC LATENCY TIMELINE SIMULATOR
    // ----------------------------------------------------
    const chartContainer = document.getElementById('perf-chart-container');
    const btnLoad = document.getElementById('btn-perf-load');
    const btnDelay = document.getElementById('btn-perf-delay');
    const btnResetPerf = document.getElementById('btn-perf-reset');
    const perfTitle = document.getElementById('perf-detail-title');
    const perfDesc = document.getElementById('perf-detail-desc');

    const maxPoints = 15;
    let latencyTimeline = Array(maxPoints).fill(20); // starts at 20ms

    function renderPerfChart() {
        if (!chartContainer) return;
        chartContainer.innerHTML = '';

        latencyTimeline.forEach(val => {
            const bar = document.createElement('div');
            bar.classList.add('chart-bar');
            
            // Map ms value to height percentage (max is 300ms)
            const pct = Math.min((val / 300) * 100, 100);
            bar.style.height = `${pct}%`;

            if (val > 100) {
                bar.classList.add('alert-latency');
            }

            // Tooltip or text overlay inside bar for readability
            bar.setAttribute('title', `${val}ms`);

            chartContainer.appendChild(bar);
        });
    }

    function addLatencyValue(newVal) {
        latencyTimeline.shift();
        latencyTimeline.push(newVal);
        renderPerfChart();
    }

    if (btnLoad) {
        btnLoad.addEventListener('click', () => {
            const spike = Math.floor(Math.random() * 40) + 110; // 110ms - 150ms
            addLatencyValue(spike);
            perfTitle.textContent = "Traffic Spike: High Load";
            perfTitle.style.color = "var(--accent-purple)";
            perfDesc.textContent = `API Gateway request rates spiked. Queues are bottlenecking. Response time rose to ${spike}ms.`;
        });
    }

    if (btnDelay) {
        btnDelay.addEventListener('click', () => {
            const delay = Math.floor(Math.random() * 50) + 220; // 220ms - 270ms
            addLatencyValue(delay);
            perfTitle.textContent = "Downstream DB Query Block";
            perfTitle.style.color = "var(--accent-red)";
            perfDesc.textContent = `Database read transaction blocked. Downstream latency propagated back to Client. Response time soared to ${delay}ms.`;
        });
    }

    if (btnResetPerf) {
        btnResetPerf.addEventListener('click', () => {
            latencyTimeline = Array(maxPoints).fill(20);
            renderPerfChart();
            perfTitle.textContent = "Traffic: Standard";
            perfTitle.style.color = "var(--accent-purple)";
            perfDesc.textContent = "System response time: 20ms. Queues cleared.";
        });
    }

    // Initialize Chart
    renderPerfChart();

    // Resize handler
    window.addEventListener('resize', () => {
        renderCutsetGraph();
        renderPerfChart();
    });
});
