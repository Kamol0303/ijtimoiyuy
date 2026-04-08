import { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { uylar, yerUchastkalari } from "@/data/mock-data";

const SAMARQAND_CENTER: L.LatLngExpression = [39.6542, 66.9597];
const SAMARQAND_BOUNDS = L.latLngBounds([39.2, 65.5], [40.2, 68.5]);

const TUMAN_COORDS: Record<string, [number, number]> = {
  "Samarqand tumani": [39.654, 66.96],
  "Kattaqo'rg'on tumani": [39.90, 66.26],
  "Urgut tumani": [39.40, 67.25],
  "Pastdarg'om tumani": [39.72, 66.56],
  "Ishtixon tumani": [39.72, 66.52],
  "Payariq tumani": [39.82, 67.16],
  "Bulung'ur tumani": [39.76, 67.40],
  "Jomboy tumani": [39.70, 67.05],
  "Nurobod tumani": [39.55, 67.55],
  "Qo'shrabot tumani": [40.05, 65.80],
  "Oqdaryo tumani": [39.92, 67.00],
  "Toyloq tumani": [39.45, 67.55],
};

const makeIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const ICONS = {
  band: makeIcon("#22c55e"),
  bosh: makeIcon("#ef4444"),
  muddat_yaqin: makeIcon("#f59e0b"),
  yer_bosh: makeIcon("#3b82f6"),
  yer_band: makeIcon("#8b5cf6"),
  yer_boshqa: makeIcon("#64748b"),
};

const offset = (coords: [number, number], i: number): [number, number] => [
  coords[0] + (i % 3) * 0.02 - 0.02,
  coords[1] + Math.floor(i / 3) * 0.02 - 0.01,
];

type FilterType = "barchasi" | "jiloy" | "nejiloy" | "yer";

const Xarita = () => {
  const [filter, setFilter] = useState<FilterType>("barchasi");
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const filteredUylar = useMemo(() => {
    if (filter === "yer") return [];
    if (filter === "barchasi") return uylar;
    return uylar.filter((u) => u.tur === filter);
  }, [filter]);

  const filteredYer = useMemo(() => {
    if (filter === "barchasi" || filter === "yer") return yerUchastkalari;
    return [];
  }, [filter]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: SAMARQAND_CENTER,
      zoom: 10,
      maxBounds: SAMARQAND_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 9,
      maxZoom: 16,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Update markers on filter change
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    filteredUylar.forEach((uy, i) => {
      const base = TUMAN_COORDS[uy.tuman] || [39.654, 66.96];
      const pos = offset(base, i);
      const icon = uy.status === "band" ? ICONS.band : uy.status === "bosh" ? ICONS.bosh : ICONS.muddat_yaqin;

      L.marker(pos, { icon })
        .bindPopup(
          `<div style="font-size:13px"><b>${uy.nomi}</b><br/>${uy.tuman}<br/>${uy.manzil}<br/>Status: <b>${
            uy.status === "band" ? "Band" : uy.status === "bosh" ? "Bo'sh" : "Muddat yaqin"
          }</b>${uy.xonalar > 0 ? `<br/>${uy.xonalar} xona, ${uy.maydon} m²` : ""}</div>`
        )
        .addTo(markersRef.current!);
    });

    filteredYer.forEach((yer, i) => {
      const base = TUMAN_COORDS[yer.tuman] || [39.654, 66.96];
      const pos = offset(base, i + 20);
      const icon = yer.status === "bosh" ? ICONS.yer_bosh : yer.status === "band" ? ICONS.yer_band : ICONS.yer_boshqa;

      L.marker(pos, { icon })
        .bindPopup(
          `<div style="font-size:13px"><b>${yer.nomi}</b><br/>${yer.tuman}<br/>${yer.maydon} m²<br/>Status: <b>${
            yer.status === "bosh" ? "Bo'sh" : yer.status === "band" ? "Band" : "Boshqa tashkilot"
          }</b></div>`
        )
        .addTo(markersRef.current!);
    });
  }, [filteredUylar, filteredYer]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Xarita (GIS)</h1>
        <p className="page-subtitle">Samarqand viloyati — uylar va yer uchastkalari xaritada</p>
      </div>

      <div className="flex flex-wrap gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["barchasi", "jiloy", "nejiloy", "yer"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              filter === f ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"
            }`}
          >
            {f === "barchasi" ? "Barchasi" : f === "jiloy" ? "Jiloy" : f === "nejiloy" ? "Nejiloy" : "Yer uchastkalar"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success inline-block" /> Band</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-destructive inline-block" /> Bo'sh</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning inline-block" /> Muddat yaqin</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Yer (bo'sh)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500 inline-block" /> Yer (band)</span>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden" style={{ height: 500 }}>
        <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
      </div>

      <div className="bg-card rounded-xl border p-5">
        <h3 className="font-semibold text-foreground mb-3">Xaritadagi obyektlar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {uylar
            .filter((u) => filter === "barchasi" || u.tur === filter)
            .map((uy) => (
              <div key={uy.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-3 h-3 rounded-full ${uy.status === "band" ? "bg-success" : uy.status === "bosh" ? "bg-destructive" : "bg-warning"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{uy.nomi}</p>
                  <p className="text-xs text-muted-foreground">{uy.tuman}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Xarita;
