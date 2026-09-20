'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getOpportunityCoordinates, type Opportunity } from '../data/opportunities';

const OPEN_STREET_MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

function createPopupContent(opportunity: Opportunity) {
  const popupContent = document.createElement('div');
  popupContent.className = 'opportunity-map-popup';

  const typeBadge = document.createElement('span');
  typeBadge.className = 'card-type-badge';
  typeBadge.style.fontSize = '10px';
  typeBadge.style.padding = '1px 6px';
  typeBadge.style.width = 'fit-content';
  typeBadge.textContent = opportunity.type;
  popupContent.appendChild(typeBadge);

  const title = document.createElement('strong');
  title.textContent = opportunity.title;
  popupContent.appendChild(title);

  const provider = document.createElement('span');
  provider.textContent = opportunity.provider;
  popupContent.appendChild(provider);

  const deadline = document.createElement('small');
  deadline.style.color = 'var(--ink-muted)';
  deadline.textContent = `Deadline: ${opportunity.deadline.label}`;
  popupContent.appendChild(deadline);

  const link = document.createElement('a');
  link.href = `/opportunities/${opportunity.id}`;
  link.textContent = 'View details →';
  popupContent.appendChild(link);

  return popupContent;
}

export function OpportunityMap({ opportunities }: { opportunities: Opportunity[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Marker[]>([]);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const mappableOpportunities = useMemo(
    () =>
      opportunities.flatMap((opportunity) => {
        const coordinates = getOpportunityCoordinates(opportunity);
        return coordinates ? [{ opportunity, coordinates }] : [];
      }),
    [opportunities],
  );

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: LeafletMap | null = null;
    setMapError(false);
    setMapReady(false);

    import('leaflet')
      .then((leafletModule) => {
        if (cancelled || !container) return;

        const Leaflet = leafletModule.default ?? leafletModule;
        map = Leaflet.map(container, {
          zoomControl: false,
          attributionControl: false,
          preferCanvas: true,
        }).setView([56, -96], 3.1);

        setMapReady(true);
        Leaflet.control.zoom({ position: 'topright' }).addTo(map);
        Leaflet.control
          .attribution({ prefix: false, position: 'bottomright' })
          .addAttribution('&copy; OpenStreetMap contributors')
          .addTo(map);

        const tileLayer = Leaflet.tileLayer(OPEN_STREET_MAP_TILE_URL, {
          maxZoom: 19,
          tileSize: 256,
          crossOrigin: true,
        }).addTo(map);

        tileLayer.on('tileerror', () => setMapError(true));

        markerRefs.current = mappableOpportunities.map(({ opportunity, coordinates }) => {
          const marker = Leaflet.marker([coordinates.lat, coordinates.lng], {
            icon: Leaflet.divIcon({
              className: 'opportunity-map-marker',
              html: '<span aria-hidden="true"></span>',
              iconSize: [20, 20],
              iconAnchor: [10, 20],
              popupAnchor: [0, -18],
            }),
            title: opportunity.title,
          })
            .bindPopup(createPopupContent(opportunity), { offset: [0, -6] })
            .addTo(map as LeafletMap);

          return marker;
        });

        if (mappableOpportunities.length > 1) {
          const bounds = Leaflet.latLngBounds(
            mappableOpportunities.map(({ coordinates }) => [coordinates.lat, coordinates.lng] as [number, number]),
          );
          map.fitBounds(bounds, { padding: [28, 28], maxZoom: 6 });
        }

        window.requestAnimationFrame(() => map?.invalidateSize());
      })
      .catch(() => {
        if (!cancelled) setMapError(true);
      });

    return () => {
      cancelled = true;
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      map?.remove();
      setMapReady(false);
    };
  }, [mappableOpportunities]);

  return (
    <div className="opportunity-map-shell">
      <div
        ref={mapContainerRef}
        className="opportunity-map"
        aria-label="Opportunity locations map"
        aria-busy={!mapError && !mapReady}
      />
      {!mappableOpportunities.length ? (
        <div className="opportunity-map-empty" role="status">
          <strong>No mapped locations in this selection</strong>
          <span>Try the list view for online and multi-location opportunities.</span>
        </div>
      ) : null}
      {mapError ? (
        <div className="opportunity-map-error" role="status">
          <strong>The map tiles could not load</strong>
          <span>Use the list view to browse every matching opportunity.</span>
        </div>
      ) : null}
      <div className="opportunity-map-note">
        <span>{mappableOpportunities.length} of {opportunities.length} listings mapped</span>
        <span>Online and multi-location listings remain in the list view.</span>
      </div>
    </div>
  );
}
