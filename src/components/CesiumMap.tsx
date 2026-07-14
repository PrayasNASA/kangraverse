'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Viewer, CameraFlyTo, Entity, BillboardGraphics, ScreenSpaceEventHandler, ScreenSpaceEvent, ImageryLayer, PolylineGraphics, LabelGraphics } from 'resium';
import { Ion, Cartesian3, createWorldTerrainAsync, TerrainProvider, Color, HeightReference, ScreenSpaceEventType, PinBuilder, VerticalOrigin, Math as CesiumMath, ArcGisMapServerImageryProvider, IonImageryProvider, EllipsoidTerrainProvider, JulianDate, createOsmBuildingsAsync, Cartesian2, HorizontalOrigin, LabelStyle, BoundingSphere, HeadingPitchRange } from 'cesium';
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
    showVulnerability,
    setSelectedFeature, 
    flyToLocation, 
    setFlyToLocation,
    selectedFeature,
    timeOfDay,
    showTreks,
    isPlayingTour,
    activeTour,
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
      
      // Because flyToLocation.altitude includes a ~1200m offset from earlier logic, we subtract it to find the ground
      // Alternatively, we just use the raw altitude if it's already close to ground, but let's assume it's offset by 1200.
      const groundAltitude = flyToLocation.altitude > 1200 ? flyToLocation.altitude - 1200 : flyToLocation.altitude;
      const target = Cartesian3.fromDegrees(flyToLocation.lng, flyToLocation.lat, groundAltitude);
      
      viewer.camera.flyToBoundingSphere(new BoundingSphere(target, 0), {
        offset: new HeadingPitchRange(
          CesiumMath.toRadians(0), 
          CesiumMath.toRadians(flyToLocation.pitch), 
          1200 // Range from the target
        ),
        duration: flyToLocation.duration || 2.5,
      });
    }
  }, [flyToLocation]);

  // Handle Time of Day changes
  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      
      const date = new Date();
      const istOffsetHours = 5.5;
      const utcHour = timeOfDay - istOffsetHours;
      
      date.setUTCHours(Math.floor(utcHour));
      date.setUTCMinutes((utcHour % 1) * 60);
      date.setUTCSeconds(0);
      
      viewer.clock.currentTime = JulianDate.fromDate(date);
      viewer.scene.globe.enableLighting = true;
      
      // Add Fog and Atmosphere effects
      viewer.scene.fog.enabled = true;
      viewer.scene.fog.density = 0.0002;
      viewer.scene.fog.screenSpaceErrorFactor = 2.0;
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.hueShift = -0.05;
        viewer.scene.skyAtmosphere.saturationShift = 0.2;
      }
    }
  }, [timeOfDay]);

  // Virtual Tour Logic for Treks
  useEffect(() => {
    if (isPlayingTour && selectedFeature && 'coordinates' in selectedFeature && viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      const trek = selectedFeature as Trek;
      const coords = trek.coordinates;
      
      let stop = false;
      
      const flyToPoint = (index: number) => {
        // If state changed or we reached the end, stop
        if (stop || index >= coords.length || !useStore.getState().isPlayingTour) {
          if (useStore.getState().isPlayingTour) {
            useStore.getState().setIsPlayingTour(false);
          }
          return;
        }
        
        const pt = coords[index];
        const nextPt = index < coords.length - 1 ? coords[index + 1] : null;
        
        // Calculate heading to next point
        let heading = 0;
        if (nextPt) {
          const dy = nextPt[1] - pt[1];
          const dx = Math.cos((Math.PI / 180) * pt[1]) * (nextPt[0] - pt[0]);
          heading = Math.atan2(dx, dy);
        } else if (index > 0) {
          // If it's the last point, keep the previous heading
          const prevPt = coords[index - 1];
          const dy = pt[1] - prevPt[1];
          const dx = Math.cos((Math.PI / 180) * prevPt[1]) * (pt[0] - prevPt[0]);
          heading = Math.atan2(dx, dy);
        }

        viewer.camera.flyTo({
          // Fly closer to the ground (200m above) for a majestic drone view
          destination: Cartesian3.fromDegrees(pt[0], pt[1], (pt[2] || 2500) + 200), 
          orientation: {
            heading: heading,
            // Look forward and slightly down (-10 degrees) to see the massive mountain peaks ahead
            pitch: CesiumMath.toRadians(-10),
            roll: 0,
          },
          duration: 6, // Slower, smoother transition
          complete: () => {
            if (!stop) flyToPoint(index + 1);
          }
        });
      };
      
      flyToPoint(0);
      
      return () => { stop = true; };
    }
  }, [isPlayingTour, selectedFeature]);

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
          altitude: (fullFeature.elevation_m || 1500) + 1200, // Dynamic altitude
          pitch: -35,
          duration: 2.5,
        });
      }
    } else {
      setSelectedFeature(null);
    }
  };

  const getFeatureColor = (feature: HeritageFeature, isSelected: boolean) => {
    if (isSelected) return Color.CYAN;
    
    if (showVulnerability && feature.vulnerability) {
      switch(feature.vulnerability) {
        case 'High': return Color.CRIMSON;
        case 'Moderate': return Color.GOLD;
        case 'Low': return Color.LIMEGREEN;
        default: return Color.WHITE;
      }
    }

    switch(feature.type.toLowerCase()) {
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
            positions={Cartesian3.fromDegreesArrayHeights(trek.coordinates.flat())}
            material={Color.fromCssColorString(trek.color).withAlpha(0.8)}
            width={4}
            clampToGround={true}
          />
        </Entity>
      ))}

      {/* Tour Path */}
      {activeTour && (
        <Entity>
          <PolylineGraphics
            positions={Cartesian3.fromDegreesArray(
              activeTour.stops.flatMap(stopId => {
                const feature = heritageData.find(f => f.id === stopId);
                return feature ? [feature.longitude, feature.latitude] : [];
              })
            )}
            material={Color.fromCssColorString('#6366f1').withAlpha(0.6)}
            width={4}
            clampToGround={showTerrain}
          />
        </Entity>
      )}

      {showMarkers && heritageData.map((feature) => {
        const isSelected = selectedFeature?.id === feature.id;
        return (
          <Entity
            key={feature.id}
            name={feature.name}
            position={Cartesian3.fromDegrees(feature.longitude, feature.latitude, feature.elevation_m || 0)}
            properties={feature}
          >
            <BillboardGraphics
              image={pinBuilder.fromColor(getFeatureColor(feature, isSelected), isSelected ? 56 : 48).toDataURL()}
              verticalOrigin={VerticalOrigin.BOTTOM}
              heightReference={showTerrain ? HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND}
              disableDepthTestDistance={Number.POSITIVE_INFINITY}
            />
            {isSelected && (
              <LabelGraphics
                text={feature.name}
                font="bold 18px sans-serif"
                fillColor={Color.WHITE}
                outlineColor={Color.BLACK}
                outlineWidth={4}
                style={LabelStyle.FILL_AND_OUTLINE}
                verticalOrigin={VerticalOrigin.BOTTOM}
                horizontalOrigin={HorizontalOrigin.CENTER}
                pixelOffset={new Cartesian2(0, -65)}
                heightReference={showTerrain ? HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND}
                disableDepthTestDistance={Number.POSITIVE_INFINITY}
              />
            )}
          </Entity>
        );
      })}

      <ScreenSpaceEventHandler>
        <ScreenSpaceEvent action={handlePointClick} type={ScreenSpaceEventType.LEFT_CLICK} />
      </ScreenSpaceEventHandler>
    </Viewer>
  );
}
