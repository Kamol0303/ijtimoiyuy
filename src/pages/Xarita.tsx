import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { uylar, yerUchastkalari } from "@/data/mock-data";

// Samarqand viloyati approximate bounds
const SAMARQAND_BOUNDS: L.LatLngBoundsExpression = [
  [39.2, 65.5],  // south-west
  [40.2, 68.5],  // north-east
];
const SAMARQAND_CENTER: L.LatLngExpression = [39.65, 66.96];

// District approximate coordinates
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

// Custom marker icons
const createIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const ICONS = {
  band: createIcon("#22c55e"),
  bosh: createIcon("#ef4444"),
  muddat_yaqin: createIcon("#f59e0b"),
  yer_bosh: createIcon("#3b82f6"),
  yer_band: createIcon("#8b5cf6"),
  yer_boshqa: createIcon("#64748b"),
};

// Offset markers slightly so they don't stack
const offset = (coords: [number, number], i: number): [number, number] => [
  coords[0] + (i % 3) * 0.02 - 0.02,
  coords[1] + Math.floor(i / 3) * 0.02 - 0.01,
];

// Component to enforce max bounds
const BoundsEnforcer = () => {
  const map = useMap();
  map.setMaxBounds(SAMARQAND_BOUNDS);
  map.setMinZoom(9);
  map.setMaxZoom(16);
  return null;
};

type FilterType = "barchasi" | "jiloy" | "nejiloy" | "yer";

const Xarita = () => {
  const [filter, setFilter] = useState<FilterType>("barchasi");

  const filteredUylar = useMemo(() => {
    if (filter === "yer") return [];
    if (filter === "barchasi") return uylar;
    return uylar.filter((u) => u.tur === filter);
  }, [filter]);

  const filteredYer = useMemo(() => {
    if (filter === "barchasi" || filter === "yer") return yerUchastkalari;
    return [];
  }, [filter]);

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
              filter === f
                ? "bg-card text-foreground shadow-sm font-medium"
                : "text-muted-foreground"
            }`}
          >
            {f === "barchasi" ? "Barchasi" : f === "jiloy" ? "Jiloy" : f === "nejiloy" ? "Nejiloy" : "Yer uchastkalar"}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success inline-block" /> Band</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-destructive inline-block" /> Bo'sh</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning inline-block" /> Muddat yaqin</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Yer (bo'sh)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500 inline-block" /> Yer (band)</span>
      </div>

      {/* Map */}
      <div className="bg-card rounded-xl border overflow-hidden" style={{ height: 500 }}>
        <MapContainer
          center={SAMARQAND_CENTER}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          maxBounds={SAMARQAND_BOUNDS}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsEnforcer />

          {filteredUylar.map((uy, i) => {
            const base = TUMAN_COORDS[uy.tuman] || SAMARQAND_CENTER;
            const pos = offset(base as [number, number], i);
            const icon =
              uy.status === "band" ? ICONS.band : uy.status === "bosh" ? ICONS.bosh : ICONS.muddat_yaqin;
            return (
              <Marker key={`uy-${uy.id}`} position={pos} icon={icon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{uy.nomi}</p>
                    <p className="text-muted-foreground">{uy.tuman}</p>
                    <p>{uy.manzil}</p>
                    <p>
                      Status:{" "}
                      <span className="font-medium">
                        {uy.status === "band" ? "Band" : uy.status === "bosh" ? "Bo'sh" : "Muddat yaqin"}
                      </span>
                    </p>
                    {uy.xonalar > 0 && <p>{uy.xonalar} xona, {uy.maydon} m²</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {filteredYer.map((yer, i) => {
            const base = TUMAN_COORDS[yer.tuman] || SAMARQAND_CENTER;
            const pos = offset(base as [number, number], i + 20);
            const icon =
              yer.status === "bosh" ? ICONS.yer_bosh : yer.status === "band" ? ICONS.yer_band : ICONS.yer_boshqa;
            return (
              <Marker key={`yer-${yer.id}`} position={pos} icon={icon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{yer.nomi}</p>
                    <p className="text-muted-foreground">{yer.tuman}</p>
                    <p>{yer.maydon} m²</p>
                    <p>
                      Status:{" "}
                      <span className="font-medium">
                        {yer.status === "bosh" ? "Bo'sh" : yer.status === "band" ? "Band" : "Boshqa tashkilot"}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Object list */}
      <div className="bg-card rounded-xl border p-5">
        <h3 className="font-semibold text-foreground mb-3">Xaritadagi obyektlar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {uylar
            .filter((u) => filter === "barchasi" || u.tur === filter)
            .map((uy) => (
              <div key={uy.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div
                  className={`w-3 h-3 rounded-full ${
                    uy.status === "band" ? "bg-success" : uy.status === "bosh" ? "bg-destructive" : "bg-warning"
                  }`}
                />
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
