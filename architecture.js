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
    // 3. ARCHITECTURE PATTERN VISUALIZER
    // ----------------------------------------------------
    const archContainer = document.getElementById('arch-visual-container');
    const btnMono = document.getElementById('btn-arch-mono');
    const btnMicro = document.getElementById('btn-arch-micro');
    const btnServerless = document.getElementById('btn-arch-serverless');
    const archTitle = document.getElementById('arch-detail-title');
    const archDesc = document.getElementById('arch-detail-desc');

    function renderArchVisual(mode) {
        if (!archContainer) return;
        archContainer.innerHTML = '';

        if (mode === 'monolith') {
            archTitle.textContent = "Monolith Layout";
            archDesc.textContent = "One single large Entity. Internal modules directly share database tables (Knowledge) without any security gatekeepers.";

            // Draw single big container
            const outer = document.createElement('div');
            outer.style.position = 'absolute';
            outer.style.width = '90%';
            outer.style.height = '85%';
            outer.style.border = '2px dashed var(--accent-purple)';
            outer.style.borderRadius = '10px';
            outer.style.background = 'rgba(168, 85, 247, 0.05)';
            outer.style.display = 'flex';
            outer.style.justifyContent = 'space-around';
            outer.style.alignItems = 'center';
            outer.innerHTML = '<span style="position:absolute; top:5px; font-size:0.7rem; color:var(--accent-purple); font-weight:bold;">MONOLITHIC ENTITY BOUNDARY</span>';

            const m1 = document.createElement('div');
            m1.style.border = '1px solid var(--border-color)';
            m1.style.background = 'var(--bg-card)';
            m1.style.padding = '0.5rem';
            m1.style.borderRadius = '6px';
            m1.style.fontSize = '0.75rem';
            m1.style.textAlign = 'center';
            m1.innerHTML = '<strong>UI Module</strong><br><span style="font-size:0.6rem; color:var(--text-secondary);">Interface</span>';

            const m2 = document.createElement('div');
            m2.style.border = '1px solid var(--border-color)';
            m2.style.background = 'var(--bg-card)';
            m2.style.padding = '0.5rem';
            m2.style.borderRadius = '6px';
            m2.style.fontSize = '0.75rem';
            m2.style.textAlign = 'center';
            m2.innerHTML = '<strong>Business Logic</strong><br><span style="font-size:0.6rem; color:var(--text-secondary);">Ability</span>';

            const m3 = document.createElement('div');
            m3.style.border = '1px solid var(--border-color)';
            m3.style.background = 'var(--bg-card)';
            m3.style.padding = '0.5rem';
            m3.style.borderRadius = '6px';
            m3.style.fontSize = '0.75rem';
            m3.style.textAlign = 'center';
            m3.innerHTML = '<strong>Shared DB</strong><br><span style="font-size:0.6rem; color:var(--text-secondary);">Knowledge</span>';

            outer.appendChild(m1);
            outer.appendChild(m2);
            outer.appendChild(m3);
            archContainer.appendChild(outer);

        } else if (mode === 'micro') {
            archTitle.textContent = "Microservices Layout";
            archDesc.textContent = "Each service functions as a standalone Entity, containing its own Knowledge (private DB). Gateways act as Interface Boundaries.";

            // Draw API Gateway
            const gw = document.createElement('div');
            gw.classList.add('visual-element');
            gw.style.left = '10%';
            gw.style.top = '40%';
            gw.style.borderColor = 'var(--accent-cyan)';
            gw.innerHTML = '<strong>API Gateway</strong><span style="font-size:0.6rem; color:var(--accent-cyan);">Boundary</span>';

            // Service 1
            const s1 = document.createElement('div');
            s1.classList.add('visual-element');
            s1.style.left = '55%';
            s1.style.top = '15%';
            s1.style.borderColor = 'var(--accent-purple)';
            s1.style.width = '120px';
            s1.innerHTML = '<strong>Order Service</strong><span style="font-size:0.55rem; color:var(--text-secondary);">(A) Abilities<br>(K) Private DB</span>';

            // Service 2
            const s2 = document.createElement('div');
            s2.classList.add('visual-element');
            s2.style.left = '55%';
            s2.style.top = '65%';
            s2.style.borderColor = 'var(--accent-blue)';
            s2.style.width = '120px';
            s2.innerHTML = '<strong>Payment Service</strong><span style="font-size:0.55rem; color:var(--text-secondary);">(A) Abilities<br>(K) Private DB</span>';

            archContainer.appendChild(gw);
            archContainer.appendChild(s1);
            archContainer.appendChild(s2);

            // Connectors
            createConnector(10, 40, 55, 15);
            createConnector(10, 40, 55, 65);

        } else {
            archTitle.textContent = "Serverless Layout";
            archDesc.textContent = "Abilities are ephemeral, event-triggered functions (instantiated on demand). Knowledge is completely externalized in a cloud database.";

            // Trigger
            const trigger = document.createElement('div');
            trigger.classList.add('visual-element');
            trigger.style.left = '10%';
            trigger.style.top = '40%';
            trigger.style.borderColor = 'var(--accent-purple)';
            trigger.innerHTML = '<strong>Event Trigger</strong><span style="font-size:0.6rem; color:var(--text-secondary);">HTTP/Queue</span>';

            // Ephemeral Function
            const fn = document.createElement('div');
            fn.classList.add('visual-element');
            fn.style.left = '50%';
            fn.style.top = '40%';
            fn.style.borderColor = 'var(--accent-cyan)';
            fn.style.borderStyle = 'dotted';
            fn.innerHTML = '<strong>Function Instance</strong><span style="font-size:0.55rem; color:var(--text-secondary);">Ephemeral (A)</span>';

            // State store
            const db = document.createElement('div');
            db.classList.add('visual-element');
            db.style.left = '85%';
            db.style.top = '40%';
            db.style.borderColor = 'var(--accent-blue)';
            db.innerHTML = '<strong>Cloud DB</strong><span style="font-size:0.6rem; color:var(--accent-blue);">(K) External State</span>';

            archContainer.appendChild(trigger);
            archContainer.appendChild(fn);
            archContainer.appendChild(db);

            // Connectors
            createConnector(10, 40, 50, 40);
            createConnector(50, 40, 85, 40, true);
        }
    }

    function createConnector(x1, y1, x2, y2, isDashed = false) {
        const line = document.createElement('div');
        line.classList.add('visual-connector');
        if (isDashed) line.classList.add('dashed');

        const w = archContainer.clientWidth;
        const h = archContainer.clientHeight;
        const px1 = (x1 / 100) * w;
        const py1 = (y1 / 100) * h;
        const px2 = (x2 / 100) * w;
        const py2 = (y2 / 100) * h;

        const dist = Math.sqrt((px2 - px1)**2 + (py2 - py1)**2);
        const angle = Math.atan2(py2 - py1, px2 - px1) * 180 / Math.PI;

        line.style.width = `${dist}px`;
        line.style.left = `${x1}%`;
        line.style.top = `${y1}%`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = 'left center';

        archContainer.appendChild(line);
    }

    // Toggle patterns
    if (btnMono && btnMicro && btnServerless) {
        btnMono.addEventListener('click', () => {
            [btnMono, btnMicro, btnServerless].forEach(b => b.classList.remove('active'));
            btnMono.classList.add('active');
            renderArchVisual('monolith');
        });

        btnMicro.addEventListener('click', () => {
            [btnMono, btnMicro, btnServerless].forEach(b => b.classList.remove('active'));
            btnMicro.classList.add('active');
            renderArchVisual('micro');
        });

        btnServerless.addEventListener('click', () => {
            [btnMono, btnMicro, btnServerless].forEach(b => b.classList.remove('active'));
            btnServerless.classList.add('active');
            renderArchVisual('serverless');
        });
    }

    // Render initial layout
    renderArchVisual('monolith');


    // ----------------------------------------------------
    // 4. TOPOLOGY FAILURE SIMULATOR
    // ----------------------------------------------------
    const topoContainer = document.getElementById('topo-sim-container');
    const btnCentral = document.getElementById('btn-topo-central');
    const btnFederated = document.getElementById('btn-topo-federated');
    const btnP2P = document.getElementById('btn-topo-p2p');
    const topoTitle = document.getElementById('topo-detail-title');
    const topoDesc = document.getElementById('topo-detail-desc');

    let currentTopo = 'central';
    let topoFailed = false;

    function renderTopology() {
        if (!topoContainer) return;
        topoContainer.innerHTML = '';
        topoFailed = false;

        if (currentTopo === 'central') {
            topoTitle.textContent = "Centralized Topology";
            topoTitle.style.color = "var(--accent-purple)";
            topoDesc.textContent = "Click on the central Hub node in the center to crash the central core API.";

            const nodes = [
                { id: 'hub', label: 'Hub', x: 50, y: 50, isHub: true },
                { id: 'c1', label: 'Client A', x: 20, y: 20 },
                { id: 'c2', label: 'Client B', x: 20, y: 80 },
                { id: 'c3', label: 'Client C', x: 80, y: 50 }
            ];

            // Render lines
            nodes.forEach(n => {
                if (n.isHub) return;
                createTopoLine('hub', n.id, 50, 50, n.x, n.y);
            });

            // Render nodes
            nodes.forEach(n => {
                createTopoNode(n);
            });

        } else if (currentTopo === 'federated') {
            topoTitle.textContent = "Federated Topology";
            topoTitle.style.color = "var(--accent-blue)";
            topoDesc.textContent = "Click Hub 1 on the left side to crash it. Hub 2 and its clients will remain online.";

            const nodes = [
                { id: 'hub1', label: 'Hub 1', x: 30, y: 50, isHub: true },
                { id: 'hub2', label: 'Hub 2', x: 70, y: 50, isHub: true },
                { id: 'c1', label: 'Client 1', x: 15, y: 20 },
                { id: 'c2', label: 'Client 2', x: 15, y: 80 },
                { id: 'c3', label: 'Client 3', x: 85, y: 20 },
                { id: 'c4', label: 'Client 4', x: 85, y: 80 }
            ];

            // Render lines
            createTopoLine('hub1', 'hub2', 30, 50, 70, 50);
            createTopoLine('hub1', 'c1', 30, 50, 15, 20);
            createTopoLine('hub1', 'c2', 30, 50, 15, 80);
            createTopoLine('hub2', 'c3', 70, 50, 85, 20);
            createTopoLine('hub2', 'c4', 70, 50, 85, 80);

            // Render nodes
            nodes.forEach(n => {
                createTopoNode(n);
            });

        } else {
            topoTitle.textContent = "Peer-to-Peer Topology";
            topoTitle.style.color = "var(--accent-cyan)";
            topoDesc.textContent = "Click Node A. Because all peers coordinate symmetrically, Node B and C remain active.";

            const nodes = [
                { id: 'nodeA', label: 'Node A', x: 25, y: 30, isHub: true },
                { id: 'nodeB', label: 'Node B', x: 75, y: 30 },
                { id: 'nodeC', label: 'Node C', x: 50, y: 75 }
            ];

            // Render lines
            createTopoLine('nodeA', 'nodeB', 25, 30, 75, 30);
            createTopoLine('nodeB', 'nodeC', 75, 30, 50, 75);
            createTopoLine('nodeC', 'nodeA', 50, 75, 25, 30);

            // Render nodes
            nodes.forEach(n => {
                createTopoNode(n);
            });
        }
    }

    function createTopoNode(n) {
        const nodeEl = document.createElement('div');
        nodeEl.classList.add('topo-node');
        nodeEl.id = `topo-node-${n.id}`;
        nodeEl.textContent = n.label;
        nodeEl.style.left = `${n.x}%`;
        nodeEl.style.top = `${n.y}%`;
        nodeEl.style.transform = 'translate(-50%, -50%)';

        if (n.isHub) {
            nodeEl.style.cursor = 'pointer';
            nodeEl.addEventListener('click', () => handleTopoNodeClick(n.id));
        }

        topoContainer.appendChild(nodeEl);
    }

    function createTopoLine(fromId, toId, x1, y1, x2, y2) {
        const lineEl = document.createElement('div');
        lineEl.classList.add('topo-line');
        lineEl.id = `topo-line-${fromId}-${toId}`;

        const w = topoContainer.clientWidth;
        const h = topoContainer.clientHeight;
        const px1 = (x1 / 100) * w;
        const py1 = (y1 / 100) * h;
        const px2 = (x2 / 100) * w;
        const py2 = (y2 / 100) * h;

        const dist = Math.sqrt((px2 - px1)**2 + (py2 - py1)**2);
        const angle = Math.atan2(py2 - py1, px2 - px1) * 180 / Math.PI;

        lineEl.style.width = `${dist}px`;
        lineEl.style.left = `${x1}%`;
        lineEl.style.top = `${y1}%`;
        lineEl.style.transform = `rotate(${angle}deg)`;

        topoContainer.appendChild(lineEl);
    }

    function handleTopoNodeClick(id) {
        if (topoFailed) return;
        topoFailed = true;

        if (currentTopo === 'central') {
            document.getElementById('topo-node-hub').classList.add('failed');
            document.getElementById('topo-node-hub').textContent = 'OFFLINE';

            // Crash all clients
            setTimeout(() => {
                ['c1', 'c2', 'c3'].forEach(c => {
                    document.getElementById(`topo-node-${c}`).classList.add('affected');
                    document.getElementById(`topo-node-${c}`).textContent = 'OFFLINE';
                });
                document.querySelectorAll('.topo-line').forEach(line => {
                    line.classList.add('failed');
                });

                topoTitle.textContent = "WHOLE NETWORK DOWN!";
                topoTitle.style.color = "var(--accent-red)";
                topoDesc.textContent = "The central Hub crashed. Because all dependencies concentrated here, all Clients were knocked offline.";
            }, 300);

        } else if (currentTopo === 'federated') {
            document.getElementById('topo-node-hub1').classList.add('failed');
            document.getElementById('topo-node-hub1').textContent = 'OFFLINE';

            // Crash Hub 1's clients and inter-hub connection
            setTimeout(() => {
                ['c1', 'c2'].forEach(c => {
                    document.getElementById(`topo-node-${c}`).classList.add('affected');
                    document.getElementById(`topo-node-${c}`).textContent = 'OFFLINE';
                });
                
                document.getElementById('topo-line-hub1-c1').classList.add('failed');
                document.getElementById('topo-line-hub1-c2').classList.add('failed');
                document.getElementById('topo-line-hub1-hub2').classList.add('failed');

                topoTitle.textContent = "PARTIAL OUTAGE (FEDERATED)";
                topoTitle.style.color = "var(--accent-blue)";
                topoDesc.textContent = "Hub 1 failed, taking down Client 1 & 2. However, Hub 2 and its Clients remain fully operational!";
            }, 300);

        } else {
            document.getElementById('topo-node-nodeA').classList.add('failed');
            document.getElementById('topo-node-nodeA').textContent = 'FAILED';

            // Break Node A's links
            setTimeout(() => {
                document.getElementById('topo-line-nodeA-nodeB').classList.add('failed');
                document.getElementById('topo-line-nodeC-nodeA').classList.add('failed');

                topoTitle.textContent = "PEER OUTAGE (RESILIENT)";
                topoTitle.style.color = "var(--accent-green)";
                topoDesc.textContent = "Node A failed. Because peers coordinate symmetrically, Node B and C remain active and coordinate without disruption.";
            }, 300);
        }
    }

    // Toggle Topologies
    if (btnCentral && btnFederated && btnP2P) {
        btnCentral.addEventListener('click', () => {
            [btnCentral, btnFederated, btnP2P].forEach(b => b.classList.remove('active'));
            btnCentral.classList.add('active');
            currentTopo = 'central';
            renderTopology();
        });

        btnFederated.addEventListener('click', () => {
            [btnCentral, btnFederated, btnP2P].forEach(b => b.classList.remove('active'));
            btnFederated.classList.add('active');
            currentTopo = 'federated';
            renderTopology();
        });

        btnP2P.addEventListener('click', () => {
            [btnCentral, btnFederated, btnP2P].forEach(b => b.classList.remove('active'));
            btnP2P.classList.add('active');
            currentTopo = 'p2p';
            renderTopology();
        });
    }

    // Initial render of topology
    renderTopology();

    // Resize handlers
    window.addEventListener('resize', () => {
        renderArchVisual(document.querySelector('.arch-switcher .active').id.replace('btn-arch-', ''));
        renderTopology();
    });
});
