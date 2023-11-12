import React, { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM' ;
import {fromLonLat} from 'ol/proj';

import './Map.css';
 
const Mapp = props => {

    const ref = useRef();
  const mapRef = useRef();

  const { center, zoom } = props;
  useEffect(() => {
    if(ref.current && !mapRef.current){
        mapRef.current=new Map({
        target: ref.current,
        layers: [
            new TileLayer({
            source: new OSM(),
            })
        ],
        view: new View({
            center: fromLonLat([center.lng, center.lat]),
            zoom: zoom
        })
        });
    }
  }, [ref, mapRef]);
 useEffect(()=>{
    mapRef.current?.getView().setZoom(zoom);
 },[mapRef,zoom])
  return (
    <div
      ref={ref}
      className={`map ${props.className}`}
      style={props.style}
      id="map"
    >    
    </div>
  );
};
 
export default Mapp;