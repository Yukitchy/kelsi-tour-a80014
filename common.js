// shared by the 5 mockups: route map, city map, language toggle
const KDX = {
  maps: q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q),
  tiles: {
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    voyager: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  },
  map(el, pts, o) {
    const m = L.map(el, { scrollWheelZoom: false, zoomControl: false, attributionControl: false });
    L.tileLayer(KDX.tiles[o.tiles || 'light'], { maxZoom: 18 }).addTo(m);
    const ll = pts.map(p => [p.lat, p.lng]);
    if (o.line) L.polyline(ll, o.line).addTo(m);
    pts.forEach((p, i) => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: '', html: o.pin(p, i), iconSize: o.size || [28, 28], iconAnchor: o.anchor || [14, 14] })
    }).addTo(m));
    m.fitBounds(ll, { padding: o.pad || [24, 24], maxZoom: o.maxZoom || 16 });
    return m;
  },
  lang() {
    document.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => {
      document.documentElement.lang = b.dataset.lang;
      document.querySelectorAll('[data-lang]').forEach(x => x.classList.toggle('on', x === b));
    });
  },
  // city <details>: draw the city map the first time it opens (Leaflet needs a visible box)
  cityMaps(o) {
    document.querySelectorAll('details[data-city]').forEach(d => {
      const draw = () => {
        const el = d.querySelector('.citymap');
        if (!el || el._done) return;
        el._done = true;
        setTimeout(() => KDX.map(el, KD.spots, Object.assign({ maxZoom: 15 }, o)), 50);
      };
      d.addEventListener('toggle', () => d.open && draw());
      if (d.open) draw();
    });
  },
};
