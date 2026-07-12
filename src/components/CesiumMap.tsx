'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Viewer, CameraFlyTo, Entity, BillboardGraphics, ScreenSpaceEventHandler, ScreenSpaceEvent, ImageryLayer, PolylineGraphics } from 'resium';
import { Ion, Cartesian3, createWorldTerrainAsync, TerrainProvider, Color, HeightReference, ScreenSpaceEventType, PinBuilder, VerticalOrigin, Math as CesiumMath, ArcGisMapServerImageryProvider, IonImageryProvider, EllipsoidTerrainProvider, JulianDate, createOsmBuildingsAsync } from 'cesium';
import heritageDataRaw from '@/data/heritage.json';
import treksDataRaw from '@/data/treks.json';
import { useStore, HeritageFeature, Trek } from '@/store/useStore';

const heritageData = heritageDataRaw as HeritageFeature[];
const treksData = treksDataRaw as Trek[];

if (typeof window !== 'undefined') {
  // Use unpkg CDN to bypass Vercel static asset routing issues
  (window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL = 'https://unpkg.com/cesium@1.143.0/Build/Cesium';
  Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || '';
}
export default function CesiumMap() {
  const { 
    showTerrain,
    showSatellite,
    showMarkers, 
    setSelectedFeature, 
    flyToLocation, 
    setFlyToLocation,
    selectedFeature,
    timeOfDay,
    showTreks,
  } = useStore();

  const [terrainProvider, setTerrainProvider] = useState<TerrainProvider | null>(null);
  const viewerRef = useRef<import('resium').CesiumComponentRef<import('cesium').Viewer>>(null);
  const isCesiumReady = true;
  const osmAdded = useRef(false);

  // Imagery Providers
  const [baseMapProvider, setBaseMapProvider] = useState<import('cesium').ImageryProvider | null>(null);
  const [satProvider, setSatProvider] = useState<import('cesium').ImageryProvider | null | 'failed'>(null);

  const pinBuilder = useMemo(() => isCesiumReady ? new PinBuilder() : null, [isCesiumReady]);
  const flatTerrainProvider = useMemo(() => isCesiumReady ? new EllipsoidTerrainProvider() : null, [isCesiumReady]);

  useEffect(() => {
    ArcGisMapServerImageryProvider.fromUrl(
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    ).then(provider => setBaseMapProvider(provider));
  }, []);

  useEffect(() => {
    createWorldTerrainAsync().then(provider => {
      setTerrainProvider(provider);
    }).catch((e) => {
      console.warn("Failed to load world terrain (missing Ion token?)", e);
      setTerrainProvider(new EllipsoidTerrainProvider());
    });

    IonImageryProvider.fromAssetId(2).then(provider => {
      setSatProvider(provider);
    }).catch((e) => {
      console.warn("Failed to load satellite imagery (missing Ion token?), using Esri fallback", e);
      ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      ).then(fallbackProvider => setSatProvider(fallbackProvider))
       .catch(() => setSatProvider('failed'));
    });
  }, []);

  // OSM Buildings setup
  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;

    if (!osmAdded.current && isCesiumReady) {
      osmAdded.current = true;
      createOsmBuildingsAsync().then(buildings => {
        viewer.scene.primitives.add(buildings);
      });
    }
  });

  // Handle flyToLocation changes
  useEffect(() => {
    if (flyToLocation && viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(flyToLocation.lng, flyToLocation.lat, flyToLocation.altitude),
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(flyToLocation.pitch),
          roll: 0,
        },
        duration: flyToLocation.duration || 2.5,
      });
    }
  }, [flyToLocation]);

  // Handle Time of Day changes
  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      
      // Base date (we can use today's date)
      const date = new Date();
      // Adjust time based on UTC or local, let's use UTC for predictability
      // Kangra is IST (UTC+5:30), so we might want to offset this so slider feels local
      const istOffsetHours = 5.5;
      const utcHour = timeOfDay - istOffsetHours;
      
      date.setUTCHours(Math.floor(utcHour));
      date.setUTCMinutes((utcHour % 1) * 60);
      date.setUTCSeconds(0);
      
      viewer.clock.currentTime = JulianDate.fromDate(date);
      viewer.scene.globe.enableLighting = true;
    }
  }, [timeOfDay]);

  const handlePointClick = (movement: { position: import('cesium').Cartesian2 } | { startPosition: import('cesium').Cartesian2; endPosition: import('cesium').Cartesian2 }) => {
    if (!('position' in movement)) return;
    
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;

    const pickedObject = viewer.scene.pick(movement.position);
    if (pickedObject && pickedObject.id && pickedObject.id.properties) {
      const props = pickedObject.id.properties.getValue(viewer.clock.currentTime);
      const featureId = props.id;
      
      let fullFeature: HeritageFeature | Trek | undefined = heritageData.find(f => f.id === featureId);
      if (!fullFeature) {
        fullFeature = treksData.find(t => t.id === featureId);
      }
      
      if (fullFeature) {
        setSelectedFeature(fullFeature);
        const isTrek = 'coordinates' in fullFeature;
        setFlyToLocation({
          lng: isTrek ? (fullFeature as Trek).coordinates[0][0] : (fullFeature as HeritageFeature).longitude,
          lat: isTrek ? (fullFeature as Trek).coordinates[0][1] : (fullFeature as HeritageFeature).latitude,
          altitude: 1500,
          pitch: -45,
          duration: 1.5,
        });
      }
    } else {
      setSelectedFeature(null);
    }
  };

  const getFeatureColor = (type: string, isSelected: boolean) => {
    if (isSelected) return Color.CYAN;
    switch(type.toLowerCase()) {
      case 'temple': return Color.RED;
      case 'fort': return Color.SLATEGRAY;
      case 'monastery': return Color.ORANGE;
      case 'lake': return Color.CORNFLOWERBLUE;
      case 'village': return Color.GREEN;
      default: return Color.YELLOW;
    }
  };

  const destination = Cartesian3.fromDegrees(76.4, 32.125, 70000);

  if (!terrainProvider || !baseMapProvider || satProvider === null || !pinBuilder || !flatTerrainProvider) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-4 font-medium tracking-wide">Loading 3D Environment...</span>
      </div>
    );
  }

  // The toggles for showTerrain and showSatellite come directly from the store now.

  return (
    <Viewer
      ref={viewerRef}
      full
      shadows={true}
      terrainProvider={showTerrain ? terrainProvider : flatTerrainProvider}
      baseLayer={false}
      baseLayerPicker={false}
      geocoder={false}
      homeButton={false}
      navigationHelpButton={false}
      animation={false}
      timeline={false}
      fullscreenButton={false}
      sceneModePicker={false}
      infoBox={false}
      selectionIndicator={false} // Custom handling via Zustand
      className="absolute inset-0 z-0"
    >
      {!flyToLocation && (
        <CameraFlyTo 
          duration={3} 
          destination={destination}
        />
      )}

      {showSatellite && satProvider && satProvider !== 'failed' && <ImageryLayer imageryProvider={satProvider} />}
      {!showSatellite && baseMapProvider && <ImageryLayer imageryProvider={baseMapProvider} />}

      {showTreks && treksData.map((trek) => (
        <Entity
          key={trek.id}
          name={trek.name}
          description={trek.description}
          properties={trek}
        >
          <PolylineGraphics
            positions={Cartesian3.fromDegreesArray(trek.coordinates.flat())}
            material={Color.fromCssColorString(trek.color).withAlpha(0.8)}
            width={4}
            clampToGround={true}
          />
        </Entity>
      ))}

      {showMarkers && heritageData.map((feature) => {
        const isSelected = selectedFeature?.id === feature.id;
        return (
          <Entity
            key={feature.id}
            name={feature.name}
            position={Cartesian3.fromDegrees(feature.longitude, feature.latitude)}
            properties={feature}
          >
            <BillboardGraphics
              image={pinBuilder.fromColor(getFeatureColor(feature.type, isSelected), isSelected ? 56 : 48).toDataURL()}
              verticalOrigin={VerticalOrigin.BOTTOM}
              heightReference={showTerrain ? HeightReference.CLAMP_TO_GROUND : HeightReference.NONE}
            />
          </Entity>
        );
      })}

      <ScreenSpaceEventHandler>
        <ScreenSpaceEvent action={handlePointClick} type={ScreenSpaceEventType.LEFT_CLICK} />
      </ScreenSpaceEventHandler>
    </Viewer>
  );
}
