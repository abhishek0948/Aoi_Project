import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default as any).prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const center: LatLngExpression = [17.6599, 75.9064];


const { BaseLayer, Overlay } = LayersControl;

const Map: React.FC = () => {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <Overlay checked name="Satellite WMS (NRW-like)">
            <TileLayer
              url="https://www.wms.nrw.de/geobasis/wms_nw_dop"
              params={{
                SERVICE: "WMS",
                REQUEST: "GetMap",
                VERSION: "1.1.1",
                LAYERS: "OSM-WMS", 
                FORMAT: "image/png",
                TRANSPARENT: false
              }}
            />
          </Overlay>
        </LayersControl>

        <Marker position={center}>
          <Popup>
            React + Leaflet + WMS layer 🎯
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
