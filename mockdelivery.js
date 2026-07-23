const mockOrderNow = document.getElementById("mockOrderNow");
const mockDeliveryStart = document.getElementById("mockDeliveryStart");
const mockDeliveryApp = document.getElementById("mockDeliveryApp");
const mockMenuView = document.getElementById("mockMenuView");
const mockSummaryView = document.getElementById("mockSummaryView");
const mockTrackingView = document.getElementById("mockTrackingView");
const mockFoodGrid = document.getElementById("mockFoodGrid");
const mockSummaryList = document.getElementById("mockSummaryList");
const mockAddBag = document.getElementById("mockAddBag");
const mockBagNote = document.getElementById("mockBagNote");
const mockBasketCount = document.getElementById("mockBasketCount");
const mockBasketTotal = document.getElementById("mockBasketTotal");
const mockSubtotal = document.getElementById("mockSubtotal");
const mockDeliveryFee = document.getElementById("mockDeliveryFee");
const mockTotal = document.getElementById("mockTotal");
const mockWalletBalance = document.getElementById("mockWalletBalance");
const mockEta = document.getElementById("mockEta");
const mockMapElement = document.getElementById("mockMap");
const mockBackLink = document.querySelector(".back-to-play");
const mockDeliveryModal = document.getElementById("mockDeliveryModal");
const mockDeliveryComplete = document.getElementById("mockDeliveryComplete");

const MOCK_WALLET_KEY = "mock_delivery_wallet";
const MOCK_WALLET_RESET_MS = 24 * 60 * 60 * 1000;
const MOCK_WALLET_START = 10000;
const MOCK_DELIVERY_FEE = 49;
const MOCK_DELIVERY_NEAR_SECONDS = 90;
const MOCK_DELIVERY_CLOSE_METERS = 50;

const mockFoodItems = [
    { name: "cheese burger", price: 155, image: "assets/food/burger.avif" },
    { name: "chicken bucket", price: 185, image: "assets/food/chicken.avif" },
    { name: "hot latte", price: 95, image: "assets/food/coffee.avif" },
    { name: "oatmeal cookies", price: 120, image: "assets/food/cookies.avif" },
    { name: "cherry muffin", price: 85, image: "assets/food/cupcake.avif" },
    { name: "glazed donut", price: 70, image: "assets/food/donut.avif" },
    { name: "pork dumplings", price: 145, image: "assets/food/dumplings.avif" },
    { name: "large fries", price: 110, image: "assets/food/fries.avif" },
    { name: "matcha latte", price: 130, image: "assets/food/matcha.avif" },
    { name: "flapjacks", price: 165, image: "assets/food/pancake.avif" },
    { name: "pepperoni pizza", price: 220, image: "assets/food/pizza.avif" },
    { name: "chicken salad", price: 135, image: "assets/food/salad.avif" },
    { name: "spaghetti", price: 170, image: "assets/food/spaghetti.avif" },
    { name: "ribeye steak", price: 380, image: "assets/food/steak.avif" },
    { name: "salmon sushi", price: 240, image: "assets/food/sushi.avif" },
];

const selectedFood = new Map();
let mockWallet = getMockWallet();
let currentView = "menu";
let etaTimer = null;
let riderAnimationFrame = null;
let mockMap = null;
let shopMarker = null;
let userMarker = null;
let routeOverlay = null;
let routeOverlayPath = null;
let routeOverlayRider = null;
let currentDisplayedRoutePoints = [];
let currentShopPoint = null;
let currentDropoffPoint = null;
let currentMapFocusState = 1;
let deliveryRunId = 0;
let completedDeliveryRunId = 0;

const MOCK_MAP_STYLE = {
    version: 8,
    sources: {
        "minimal-map": {
            type: "raster",
            tiles: [
                "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                "https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                "https://d.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors © CARTO",
        },
    },
    layers: [
        {
            id: "minimal-map",
            type: "raster",
            source: "minimal-map",
            paint: {
                "raster-saturation": -1,
                "raster-contrast": -0.12,
                "raster-brightness-min": 0.28,
                "raster-brightness-max": 1,
            },
        },
    ],
};

function formatCoins(amount) {
    return `${amount.toLocaleString("en-US")} coins`;
}

function createFreshMockWallet(now = Date.now()) {
    return {
        balance: MOCK_WALLET_START,
        lastResetAt: now,
        updatedAt: now,
    };
}

function getMockWallet() {
    const now = Date.now();
    const stored = localStorage.getItem(MOCK_WALLET_KEY);

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            const lastResetAt = Number(parsed.lastResetAt || parsed.updatedAt || now);

            if (now - lastResetAt < MOCK_WALLET_RESET_MS) {
                return {
                    balance: Number(parsed.balance) || 0,
                    lastResetAt,
                    updatedAt: Number(parsed.updatedAt || lastResetAt),
                };
            }
        } catch (error) {
            localStorage.removeItem(MOCK_WALLET_KEY);
        }
    }

    const freshWallet = createFreshMockWallet(now);
    localStorage.setItem(MOCK_WALLET_KEY, JSON.stringify(freshWallet));
    return freshWallet;
}

function refreshMockWallet() {
    mockWallet = getMockWallet();

    if (mockWalletBalance) {
        mockWalletBalance.textContent = formatCoins(mockWallet.balance);
    }
}

function saveMockWallet() {
    if (!mockWallet.lastResetAt) {
        mockWallet.lastResetAt = Date.now();
    }

    mockWallet.updatedAt = Date.now();
    localStorage.setItem(MOCK_WALLET_KEY, JSON.stringify(mockWallet));
}

function getSelectedItems() {
    return Array.from(selectedFood.values());
}

function getSubtotal() {
    return getSelectedItems().reduce((sum, food) => sum + food.price, 0);
}

function getOrderTotal() {
    return getSubtotal() + MOCK_DELIVERY_FEE;
}

function updateBasketButton() {
    const selectedItems = getSelectedItems();
    const subtotal = getSubtotal();
    const total = getOrderTotal();
    const hasSelection = selectedItems.length > 0;
    const isSummary = currentView === "summary";
    const isTracking = currentView === "tracking";
    const hasEnoughBalance = mockWallet.balance >= total;

    mockDeliveryApp.classList.toggle("has-selection", (hasSelection || isSummary) && !isTracking);
    mockDeliveryApp.classList.toggle("is-tracking", isTracking);
    mockAddBag.classList.toggle("is-insufficient", isSummary && !hasEnoughBalance);
    mockAddBag.hidden = (!hasSelection && !isSummary) || isTracking;
    mockAddBag.disabled = isSummary && !hasEnoughBalance;

    if (isSummary) {
        mockBasketCount.textContent = hasEnoughBalance ? "place order" : "insufficient balance";
        mockBasketTotal.textContent = hasEnoughBalance ? formatCoins(total) : "";
    } else {
        mockBasketCount.textContent = `basket - ${selectedItems.length}`;
        mockBasketTotal.textContent = formatCoins(subtotal);
    }
}

function toggleFood(card, food) {
    if (selectedFood.has(food.name)) {
        selectedFood.delete(food.name);
        card.classList.remove("is-selected");
    } else {
        selectedFood.set(food.name, food);
        card.classList.add("is-selected");
    }

    mockBagNote.textContent = "";
    updateBasketButton();
}

function renderMockFood() {
    mockFoodGrid.innerHTML = "";

    mockFoodItems.forEach((food) => {
        const card = document.createElement("button");
        card.className = "mock-food-card";
        card.type = "button";
        card.setAttribute("aria-pressed", "false");
        card.innerHTML = `
            <div class="mock-food-thumb">
                <img src="${food.image}" alt="${food.name}" loading="lazy">
            </div>
            <p class="mock-food-name">${food.name}</p>
            <p class="mock-food-price">${food.price} coins</p>
        `;
        card.addEventListener("click", () => {
            toggleFood(card, food);
            card.setAttribute("aria-pressed", String(selectedFood.has(food.name)));
        });
        mockFoodGrid.appendChild(card);
    });
}

function showMockApp() {
    refreshMockWallet();
    renderMockFood();
    selectedFood.clear();
    currentView = "menu";
    mockMenuView.hidden = false;
    mockSummaryView.hidden = true;
    mockTrackingView.hidden = true;
    mockBagNote.textContent = "";
    updateBasketButton();
    mockDeliveryStart.hidden = true;
    mockDeliveryApp.hidden = false;
}

function renderSummary() {
    refreshMockWallet();
    const selectedItems = getSelectedItems();
    const subtotal = getSubtotal();
    const total = getOrderTotal();

    mockSummaryList.innerHTML = selectedItems.map((food) => `
        <article class="mock-summary-item">
            <img src="${food.image}" alt="${food.name}">
            <p>${food.name}</p>
            <strong>${formatCoins(food.price)}</strong>
        </article>
    `).join("");

    mockSubtotal.textContent = formatCoins(subtotal);
    mockDeliveryFee.textContent = formatCoins(MOCK_DELIVERY_FEE);
    mockTotal.textContent = formatCoins(total);
    mockWalletBalance.textContent = formatCoins(mockWallet.balance);
}

function showOrderSummary() {
    if (!selectedFood.size) return;

    currentView = "summary";
    renderSummary();
    mockMenuView.hidden = true;
    mockSummaryView.hidden = false;
    mockBagNote.textContent = "";
    mockDeliveryApp.scrollTo({ top: 0, behavior: "smooth" });
    updateBasketButton();
}

function showMenuFromSummary() {
    if (currentView !== "summary") return;

    currentView = "menu";
    mockMenuView.hidden = false;
    mockSummaryView.hidden = true;
    mockBagNote.textContent = "";
    updateBasketButton();
}

function formatEta(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function showDeliveryCompleteModal(runId) {
    if (runId !== deliveryRunId || completedDeliveryRunId === runId) return;

    completedDeliveryRunId = runId;
    mockEta.textContent = "rider arrived with nothing";

    if (etaTimer) {
        clearInterval(etaTimer);
        etaTimer = null;
    }

    if (riderAnimationFrame) {
        cancelAnimationFrame(riderAnimationFrame);
        riderAnimationFrame = null;
    }

    mockDeliveryModal.hidden = false;
}

function startTrackingTimer(durationSeconds) {
    let remainingSeconds = durationSeconds;
    const runId = deliveryRunId;

    if (etaTimer) {
        clearInterval(etaTimer);
    }

    mockEta.textContent = `arriving in ${formatEta(remainingSeconds)}`;
    etaTimer = setInterval(() => {
        remainingSeconds = Math.max(0, remainingSeconds - 1);
        mockEta.textContent = remainingSeconds > 0
            ? `arriving in ${formatEta(remainingSeconds)}`
            : "rider arrived with nothing";

        if (remainingSeconds === 0) {
            showDeliveryCompleteModal(runId);
        }
    }, 1000);
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createLineFeature(coordinates) {
    return {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates,
        },
    };
}

function getDeviceLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve([position.coords.longitude, position.coords.latitude]),
            () => resolve(null),
            {
                enableHighAccuracy: false,
                timeout: 4500,
                maximumAge: 10 * 60 * 1000,
            }
        );
    });
}

async function getIpLocation() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) return null;
        const data = await response.json();
        if (typeof data.longitude !== "number" || typeof data.latitude !== "number") return null;
        return [data.longitude, data.latitude];
    } catch (error) {
        return null;
    }
}

async function getMapCenter() {
    const deviceLocation = await getDeviceLocation();
    if (deviceLocation) return deviceLocation;

    const ipLocation = await getIpLocation();
    if (ipLocation) return ipLocation;

    return [120.9842, 14.5995];
}

function offsetCoordinate(center, eastMeters, northMeters) {
    const [lng, lat] = center;
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLng = 111320 * Math.cos((lat * Math.PI) / 180);

    return [
        lng + eastMeters / metersPerDegreeLng,
        lat + northMeters / metersPerDegreeLat,
    ];
}

function offsetByDistance(center, distanceMeters, bearingRadians) {
    return offsetCoordinate(
        center,
        Math.cos(bearingRadians) * distanceMeters,
        Math.sin(bearingRadians) * distanceMeters
    );
}

function generateRoutePoints(center) {
    const destination = offsetCoordinate(center, randomBetween(-80, 80), randomBetween(-90, 80));
    const shopDistance = randomBetween(300, 3000);
    const shopBearing = randomBetween(0, Math.PI * 2);
    const shop = offsetByDistance(destination, shopDistance, shopBearing);
    const turnA = offsetCoordinate(destination, randomBetween(80, 150), randomBetween(0, 30));
    const turnB = offsetCoordinate(turnA, 0, randomBetween(120, 210));
    const turnC = offsetCoordinate(shop, randomBetween(-160, 160), 0);
    const turnD = [turnC[0], turnB[1]];

    return {
        shop,
        destination,
        fallbackRoutePoints: [shop, turnC, turnD, turnB, turnA, destination],
    };
}

async function getRoadRoute(shop, destination) {
    const coordinates = `${shop[0]},${shop[1]};${destination[0]},${destination[1]}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&alternatives=false&steps=false`;

    try {
        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        const route = data.routes?.[0]?.geometry?.coordinates;
        if (!Array.isArray(route) || route.length < 2) return null;

        return route;
    } catch (error) {
        return null;
    }
}

function createMarker(className, text = "") {
    const marker = document.createElement("span");
    marker.className = className;
    marker.innerHTML = text;
    return marker;
}

function cleanupMapMarkers() {
    mockMapElement
        .querySelectorAll(".mock-location-marker")
        .forEach((marker) => marker.closest(".maplibregl-marker")?.remove());
}

function setGeoJsonSource(sourceId, feature) {
    const source = mockMap.getSource(sourceId);
    if (source) {
        source.setData(feature);
    }
}

function setLayerPaint(layerId, property, value) {
    if (mockMap.getLayer(layerId)) {
        mockMap.setPaintProperty(layerId, property, value);
    }
}

function moveLayerIfExists(layerId) {
    if (mockMap.getLayer(layerId)) {
        mockMap.moveLayer(layerId);
    }
}

function ensureRouteOverlay() {
    if (routeOverlay && routeOverlayPath && routeOverlayRider) return;

    routeOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    routeOverlay.classList.add("mock-map-route-overlay");
    routeOverlay.setAttribute("aria-hidden", "true");

    routeOverlayPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    routeOverlayPath.classList.add("mock-map-route-path");

    routeOverlayRider = document.createElementNS("http://www.w3.org/2000/svg", "g");
    routeOverlayRider.classList.add("mock-map-rider-svg");

    const riderGlow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    riderGlow.classList.add("mock-map-rider-glow");
    riderGlow.setAttribute("r", "17");

    const riderCore = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    riderCore.classList.add("mock-map-rider-core");
    riderCore.setAttribute("r", "8");

    routeOverlayRider.append(riderGlow, riderCore);
    routeOverlay.appendChild(routeOverlayPath);
    routeOverlay.appendChild(routeOverlayRider);
    mockMapElement.appendChild(routeOverlay);
}

function updateRouteOverlay(routePoints = currentDisplayedRoutePoints, runId = deliveryRunId) {
    if (runId !== deliveryRunId) return;
    if (!mockMap || !routePoints.length) return;

    ensureRouteOverlay();
    currentDisplayedRoutePoints = routePoints;

    const { width, height } = mockMapElement.getBoundingClientRect();
    routeOverlay.setAttribute("viewBox", `0 0 ${width} ${height}`);
    routeOverlay.setAttribute("width", width);
    routeOverlay.setAttribute("height", height);

    const projectedPoints = routePoints.map((coordinate) => mockMap.project(coordinate));
    const pathData = projectedPoints.map((point, index) => {
        return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    }).join(" ");

    routeOverlayPath.setAttribute("d", pathData);

    const riderPoint = projectedPoints[0];
    routeOverlayRider.setAttribute(
        "transform",
        `translate(${riderPoint.x.toFixed(2)} ${riderPoint.y.toFixed(2)})`
    );
}

function interpolatePoint(points, elapsed) {
    const segmentLengths = [];
    const totalLength = points.slice(0, -1).reduce((sum, point, index) => {
        const next = points[index + 1];
        const length = Math.hypot(next[0] - point[0], next[1] - point[1]);
        segmentLengths.push(length);
        return sum + length;
    }, 0);
    let travel = totalLength * elapsed;

    for (let index = 0; index < segmentLengths.length; index += 1) {
        const length = segmentLengths[index];
        if (travel <= length) {
            const start = points[index];
            const end = points[index + 1];
            const local = length === 0 ? 0 : travel / length;
            return {
                point: [
                    start[0] + (end[0] - start[0]) * local,
                    start[1] + (end[1] - start[1]) * local,
                ],
                remainingPoints: [end, ...points.slice(index + 2)],
            };
        }

        travel -= length;
    }

    return {
        point: points[points.length - 1],
        remainingPoints: [],
    };
}

function getRouteDistanceMeters(points) {
    return points.slice(0, -1).reduce((sum, point, index) => (
        sum + getDistanceMeters(point, points[index + 1])
    ), 0);
}

function getDistanceMeters(start, end) {
    const earthRadius = 6371000;
    const startLat = start[1] * Math.PI / 180;
    const endLat = end[1] * Math.PI / 180;
    const latDelta = (end[1] - start[1]) * Math.PI / 180;
    const lngDelta = (end[0] - start[0]) * Math.PI / 180;
    const a = Math.sin(latDelta / 2) ** 2
        + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fitMapToRoute(routePoints, focusState, animated = true, runId = deliveryRunId) {
    if (runId !== deliveryRunId) return;
    if (!mockMap || routePoints.length < 2) return;

    const bounds = new maplibregl.LngLatBounds();
    routePoints.forEach((point) => bounds.extend(point));
    [currentShopPoint, currentDropoffPoint].forEach((point) => {
        if (point) bounds.extend(point);
    });

    const settings = {
        1: { padding: 76, maxZoom: 16.2 },
        2: { padding: 94, maxZoom: 17.45 },
        3: { padding: 112, maxZoom: 18.1 },
    }[focusState];

    mockMap.fitBounds(bounds, {
        padding: settings.padding,
        maxZoom: settings.maxZoom,
        duration: animated ? 650 : 0,
    });

    window.setTimeout(() => updateRouteOverlay(currentDisplayedRoutePoints, runId), animated ? 700 : 0);
}

function updateMapFocusState(remainingRoutePoints, remainingSeconds, runId) {
    if (runId !== deliveryRunId) return;
    const remainingDistance = getRouteDistanceMeters(remainingRoutePoints);
    const nextState = remainingDistance < MOCK_DELIVERY_CLOSE_METERS
        ? 3
        : remainingSeconds <= MOCK_DELIVERY_NEAR_SECONDS
            ? 2
            : 1;

    if (nextState === currentMapFocusState) return;

    currentMapFocusState = nextState;
    fitMapToRoute(remainingRoutePoints, currentMapFocusState, true, runId);
}

function moveRiderOnRoute(routePoints, durationSeconds, runId) {
    const startedAt = performance.now();

    if (riderAnimationFrame) {
        cancelAnimationFrame(riderAnimationFrame);
        riderAnimationFrame = null;
    }

    function tick(now) {
        if (runId !== deliveryRunId) return;
        const elapsed = Math.min(1, (now - startedAt) / (durationSeconds * 1000));
        const { point, remainingPoints } = interpolatePoint(routePoints, elapsed);
        const remainingSeconds = Math.ceil(durationSeconds * (1 - elapsed));
        const remainingRoutePoints = remainingPoints.length ? [point, ...remainingPoints] : [point, point];
        updateMapFocusState(remainingRoutePoints, remainingSeconds, runId);
        updateRouteOverlay(remainingRoutePoints, runId);
        setGeoJsonSource("mock-route-remaining", createLineFeature(remainingRoutePoints));

        if (elapsed < 1) {
            riderAnimationFrame = requestAnimationFrame(tick);
            return;
        }

        riderAnimationFrame = null;
        showDeliveryCompleteModal(runId);
    }

    riderAnimationFrame = requestAnimationFrame(tick);
}

async function renderMapLibreTracking(durationSeconds, runId) {
    if (riderAnimationFrame) {
        cancelAnimationFrame(riderAnimationFrame);
        riderAnimationFrame = null;
    }
    currentDisplayedRoutePoints = [];
    if (routeOverlayPath) {
        routeOverlayPath.setAttribute("d", "");
    }
    if (routeOverlayRider) {
        routeOverlayRider.setAttribute("transform", "translate(-9999 -9999)");
    }
    if (!window.maplibregl) return null;

    const center = await getMapCenter();
    const { shop, destination, fallbackRoutePoints } = generateRoutePoints(center);
    const roadRoute = await getRoadRoute(shop, destination);
    const routePoints = roadRoute || fallbackRoutePoints;
    currentShopPoint = routePoints[0];
    currentDropoffPoint = routePoints[routePoints.length - 1];
    currentMapFocusState = 1;

    if (!mockMap) {
        mockMap = new maplibregl.Map({
            container: mockMapElement,
            style: MOCK_MAP_STYLE,
            center,
            zoom: 15,
            attributionControl: false,
            interactive: false,
        });
        await new Promise((resolve) => mockMap.once("load", resolve));
        mockMap.on("move", () => updateRouteOverlay(currentDisplayedRoutePoints, deliveryRunId));
        mockMap.on("resize", () => updateRouteOverlay(currentDisplayedRoutePoints, deliveryRunId));
    }

    mockMap.resize();
    currentDisplayedRoutePoints = routePoints;
    fitMapToRoute(routePoints, currentMapFocusState, false, runId);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    if (shopMarker) shopMarker.remove();
    if (userMarker) userMarker.remove();
    cleanupMapMarkers();

    shopMarker = new maplibregl.Marker({
        element: createMarker("mock-location-marker", '<i class="hgi hgi-stroke hgi-rounded hgi-store-location-02"></i>'),
        anchor: "center",
    }).setLngLat(routePoints[0]).addTo(mockMap);

    userMarker = new maplibregl.Marker({
        element: createMarker("mock-location-marker", '<i class="hgi hgi-stroke hgi-rounded hgi-real-estate-01"></i>'),
        anchor: "center",
    }).setLngLat(routePoints[routePoints.length - 1]).addTo(mockMap);

    const routeFeature = createLineFeature(routePoints);

    if (!mockMap.getSource("mock-route-shadow")) {
        mockMap.addSource("mock-route-shadow", {
            type: "geojson",
            data: routeFeature,
        });
        mockMap.addLayer({
            id: "mock-route-shadow-line",
            type: "line",
            source: "mock-route-shadow",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "rgba(28, 28, 28, 0.08)",
                "line-width": 2,
            },
        });
    } else {
        setGeoJsonSource("mock-route-shadow", routeFeature);
    }

    if (!mockMap.getLayer("mock-route-shadow-line")) {
        mockMap.addLayer({
            id: "mock-route-shadow-line",
            type: "line",
            source: "mock-route-shadow",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "rgba(28, 28, 28, 0.08)",
                "line-width": 2,
            },
        });
    }

    if (!mockMap.getSource("mock-route-remaining")) {
        mockMap.addSource("mock-route-remaining", {
            type: "geojson",
            data: routeFeature,
        });
        mockMap.addLayer({
            id: "mock-route-remaining-glow",
            type: "line",
            source: "mock-route-remaining",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "#32ff00",
                "line-width": 11,
                "line-opacity": 0.24,
                "line-blur": 4,
            },
        });
        mockMap.addLayer({
            id: "mock-route-remaining-line",
            type: "line",
            source: "mock-route-remaining",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "#32ff00",
                "line-width": 4,
                "line-opacity": 1,
            },
        });
    } else {
        setGeoJsonSource("mock-route-remaining", routeFeature);
    }

    if (!mockMap.getLayer("mock-route-remaining-glow")) {
        mockMap.addLayer({
            id: "mock-route-remaining-glow",
            type: "line",
            source: "mock-route-remaining",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "#32ff00",
                "line-width": 11,
                "line-opacity": 0.24,
                "line-blur": 4,
            },
        });
    }

    if (!mockMap.getLayer("mock-route-remaining-line")) {
        mockMap.addLayer({
            id: "mock-route-remaining-line",
            type: "line",
            source: "mock-route-remaining",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "#32ff00",
                "line-width": 4,
                "line-opacity": 1,
            },
        });
    }

    setLayerPaint("mock-route-shadow-line", "line-color", "rgba(28, 28, 28, 0.08)");
    setLayerPaint("mock-route-shadow-line", "line-width", 2);
    setLayerPaint("mock-route-remaining-glow", "line-color", "#32ff00");
    setLayerPaint("mock-route-remaining-glow", "line-width", 11);
    setLayerPaint("mock-route-remaining-glow", "line-opacity", 0);
    setLayerPaint("mock-route-remaining-glow", "line-blur", 4);
    setLayerPaint("mock-route-remaining-line", "line-color", "#32ff00");
    setLayerPaint("mock-route-remaining-line", "line-width", 4);
    setLayerPaint("mock-route-remaining-line", "line-opacity", 0);

    moveLayerIfExists("mock-route-shadow-line");
    moveLayerIfExists("mock-route-remaining-glow");
    moveLayerIfExists("mock-route-remaining-line");
    updateRouteOverlay(routePoints, runId);

    return routePoints;
}

async function showTracking() {
    deliveryRunId += 1;
    const runId = deliveryRunId;
    const durationSeconds = Math.floor(180 + Math.random() * 301);

    mockDeliveryModal.hidden = true;
    currentView = "tracking";
    mockMenuView.hidden = true;
    mockSummaryView.hidden = true;
    mockTrackingView.hidden = false;
    mockBagNote.textContent = "";
    mockDeliveryApp.scrollTo({ top: 0, behavior: "smooth" });
    startTrackingTimer(durationSeconds);
    updateBasketButton();

    const routePoints = await renderMapLibreTracking(durationSeconds, runId);
    if (routePoints && runId === deliveryRunId) {
        moveRiderOnRoute(routePoints, durationSeconds, runId);
    }
}

function placeMockOrder() {
    refreshMockWallet();
    const total = getOrderTotal();
    if (mockWallet.balance < total) return;

    mockWallet.balance -= total;
    saveMockWallet();
    mockWalletBalance.textContent = formatCoins(mockWallet.balance);
    showTracking();
}

function handleBasketClick() {
    if (currentView === "summary") {
        placeMockOrder();
        return;
    }

    showOrderSummary();
}

function handleBackClick(event) {
    if (currentView !== "summary") return;

    event.preventDefault();
    showMenuFromSummary();
}

mockOrderNow.addEventListener("click", showMockApp);
mockAddBag.addEventListener("click", handleBasketClick);
mockBackLink.addEventListener("click", handleBackClick);
mockDeliveryComplete.addEventListener("click", () => {
    window.location.href = "play.html";
});
