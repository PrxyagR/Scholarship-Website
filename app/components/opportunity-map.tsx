'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getOpportunityCoordinates, type Opportunity } from '../data/opportunities';

export function OpportunityMap({ opportunities }: { opportunities: Opportunity[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mappableOpportunities = useMemo(
    () =>
      opportunities.flatMap((opportunity) => {
        const coordinates = getOpportunityCoordinates(opportunity);
        return coordinates ? [{ opportunity, coordinates }] : [];
      }),
    [opportunities],
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [-96, 56],
      zoom: 3.1,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const markers = mappableOpportunities.map(({ opportunity, coordinates }) => {
      const popupContent = document.createElement('div');
      popupContent.className = 'opportunity-map-popup';

      const title = document.createElement('strong');
      title.textContent = opportunity.title;
      popupContent.appendChild(title);

      const provider = document.createElement('span');
      provider.textContent = opportunity.provider;
      popupContent.appendChild(provider);

      const link = document.createElement('a');
      link.href = `/opportunities/${opportunity.id}`;
      link.textContent = 'View details →';
      popupContent.appendChild(link);

      const popup = new maplibregl.Popup({ offset: 18, closeButton: true }).setDOMContent(popupContent);
      return new maplibregl.Marker({ color: '#c53a2a' })
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(popup)
        .addTo(map);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [mappableOpportunities]);

  return (
    <div className="opportunity-map-shell">
      <div ref={mapContainerRef} className="opportunity-map" aria-label="Opportunity locations map" />
      <div className="opportunity-map-note">
        <span>{mappableOpportunities.length} mapped listings</span>
        <span>Remote listings remain in the list view.</span>
      </div>
    </div>
  );
}
