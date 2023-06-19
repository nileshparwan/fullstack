import React, { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibmlsZXNocGFyd2FuIiwiYSI6ImNqbmhsb2lxejBkd2szcnRsYm1hd2xkazIifQ.X8Gf7CIPCxOH3SGBmXX3Sw';

const Map = (props) => {
    const { center, zoom } = props;

    const mapContainerRef = useRef(null);

    // Initialize map when component mounts
    React.useEffect(() => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: center,
        zoom: zoom,
      });
  
      // Create default markers
      new mapboxgl.Marker().setLngLat(center).addTo(map)
  
      // Add navigation control (the +/- zoom buttons)
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
  
      // Clean up on unmount
      return () => map.remove();
    }, [zoom, center]);

    return (
        <div className={`map ${props.className}`} style={props.style} ref={mapContainerRef} />
    );
};

export default Map;