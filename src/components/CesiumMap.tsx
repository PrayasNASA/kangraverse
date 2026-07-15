'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Viewer, CameraFlyTo, Entity, BillboardGraphics, ScreenSpaceEventHandler, ScreenSpaceEvent, ImageryLayer, PolylineGraphics, LabelGraphics, CustomDataSource } from 'resium';
import { Ion, Cartesian3, createWorldTerrainAsync, TerrainProvider, Color, HeightReference, ScreenSpaceEventType, PinBuilder, VerticalOrigin, Math as CesiumMath, ArcGisMapServerImageryProvider, IonImageryProvider, EllipsoidTerrainProvider, JulianDate, createOsmBuildingsAsync, Cartesian2, HorizontalOrigin, LabelStyle, BoundingSphere, HeadingPitchRange, ShadowMode, EntityCluster, CallbackProperty } from 'cesium';
import { Compass, Plus, Minus, Maximize } from 'lucide-react';
import heritageDataRaw from '@/data/heritage.json';
import treksDataRaw from '@/data/treks.json';
import { useStore, HeritageFeature, Trek } from '@/store/useStore';
import { getMarkerSVG } from '@/utils/markers';
import PlaceImage from '@/components/PlaceImage';

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

  // Hover state
  const [hoveredFeature, setHoveredFeature] = useState<HeritageFeature | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Camera heading for compass
  const [cameraHeading, setCameraHeading] = useState(0);

  // Imagery Providers
  const [baseMapProvider, setBaseMapProvider] = useState<import('cesium').ImageryProvider | null>(null);
  const [satProvider, setSatProvider] = useState<import('cesium').ImageryProvider | null | 'failed'>(null);

  const flatTerrainProvider = useMemo(() => isCesiumReady ? new EllipsoidTerrainProvider() : null, [isCesiumReady]);

  const clusterOptions = useMemo(() => {
    if (!isCesiumReady) return undefined;
    return new EntityCluster({
      enabled: true,
      pixelRange: 40,
      minimumClusterSize: 3,
      clusterBillboards: true,
      clusterLabels: true,
      clusterPoints: true
    });
  }, [isCesiumReady]);

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
      
      // Camera tracker for compass
      viewer.scene.preRender.addEventListener(() => {
        setCameraHeading(CesiumMath.toDegrees(viewer.camera.heading));
      });
    }
  });

  // Handle flyToLocation changes
  useEffect(() => {
    if (flyToLocation && viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      
      const groundAltitude = flyToLocation.altitude > 1200 ? flyToLocation.altitude - 1200 : flyToLocation.altitude;
      const target = Cartesian3.fromDegrees(flyToLocation.lng, flyToLocation.lat, groundAltitude);
      
      viewer.camera.flyToBoundingSphere(new BoundingSphere(target, 0), {
        offset: new HeadingPitchRange(
          CesiumMath.toRadians(0), 
          CesiumMath.toRadians(flyToLocation.pitch), 
          1200 // Range from the target
        ),
        duration: flyToLocation.duration || 3.5, // Slightly longer, smoother cinematic duration
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
      
      // Cinematic environment settings
      viewer.scene.highDynamicRange = true;
      if ('terrainExaggeration' in viewer.scene.globe as any) {
        (viewer.scene.globe as any).terrainExaggeration = 1.2;
      }
      
      // Add Fog and Atmosphere effects
      viewer.scene.fog.enabled = true;
      viewer.scene.fog.density = 0.0001; // Reduced per request
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

  const handleMouseMove = (movement: { position?: import('cesium').Cartesian2; endPosition?: import('cesium').Cartesian2 }) => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;

    const endPos = movement.endPosition || movement.position;
    if (!endPos) return;

    const pickedObject = viewer.scene.pick(endPos);
    if (pickedObject && pickedObject.id && pickedObject.id.properties) {
      const props = pickedObject.id.properties.getValue(viewer.clock.currentTime);
      const featureId = props.id || props.ID; // Handle cluster points too if needed
      
      const fullFeature = heritageData.find(f => f.id === featureId);
      if (fullFeature) {
        setHoveredFeature(fullFeature);
        setHoverPosition({ x: endPos.x, y: endPos.y });
        document.body.style.cursor = 'pointer';
        return;
      }
    }
    setHoveredFeature(null);
    setHoverPosition(null);
    document.body.style.cursor = 'default';
  };

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
          duration: 3.5, // Slower duration for cinematic effect
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
    return Color.WHITE;
  };

  const handleZoomIn = () => {
    viewerRef.current?.cesiumElement?.camera.zoomIn(1000);
  };

  const handleZoomOut = () => {
    viewerRef.current?.cesiumElement?.camera.zoomOut(1000);
  };

  const handleCompassClick = () => {
    const viewer = viewerRef.current?.cesiumElement;
    if (viewer) {
      viewer.camera.flyTo({
        destination: viewer.camera.position,
        orientation: {
          heading: 0,
          pitch: viewer.camera.pitch,
          roll: 0,
        },
        duration: 1.5,
      });
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    window.addEventListener('map-zoom-in', handleZoomIn);
    window.addEventListener('map-zoom-out', handleZoomOut);
    window.addEventListener('map-reset-north', handleCompassClick);
    window.addEventListener('map-fullscreen', handleFullscreen);
    return () => {
      window.removeEventListener('map-zoom-in', handleZoomIn);
      window.removeEventListener('map-zoom-out', handleZoomOut);
      window.removeEventListener('map-reset-north', handleCompassClick);
      window.removeEventListener('map-fullscreen', handleFullscreen);
    };
  }, []);

  const destination = Cartesian3.fromDegrees(76.4, 32.125, 84000);

  if (!terrainProvider || !baseMapProvider || satProvider === null || !flatTerrainProvider) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        <span className="ml-4 font-medium tracking-wide">Loading 3D Environment...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Viewer
        ref={viewerRef}
        full
        shadows={true}
        terrainShadows={1} // ENABLED
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
        selectionIndicator={false}
        className="absolute inset-0 z-0"
      >
        {!flyToLocation && (
          <CameraFlyTo 
            duration={4} 
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
              width={6}
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
              width={6}
              clampToGround={showTerrain}
            />
          </Entity>
        )}

        <CustomDataSource
          name="heritageMarkers"
          clustering={clusterOptions}
        >
          {showMarkers && heritageData.map((feature) => {
            const isSelected = selectedFeature?.id === feature.id;
            const isHovered = hoveredFeature?.id === feature.id;
            
            // Generate standard icon size
            const baseScale = isSelected ? 1.4 : (isHovered ? 1.2 : 1.0);
            
            // Create a pulsing effect for the selected marker
            const scaleProperty = new CallbackProperty(() => {
              if (isSelected) {
                // Pulse smoothly between 1.3 and 1.5
                return 1.4 + Math.sin(Date.now() / 200) * 0.1;
              }
              return baseScale;
            }, false);

            return (
              <Entity
                key={feature.id}
                name={feature.name}
                position={Cartesian3.fromDegrees(feature.longitude, feature.latitude, feature.elevation_m || 0)}
                properties={feature}
              >
                <BillboardGraphics
                  image={getMarkerSVG(feature.type, isSelected)}
                  scale={scaleProperty}
                  verticalOrigin={VerticalOrigin.BOTTOM}
                  heightReference={showTerrain ? HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  color={getFeatureColor(feature, isSelected)}
                  eyeOffset={new Cartesian3(0, 0, -50)} // Pushes the marker slightly towards the camera
                />
              </Entity>
            );
          })}
        </CustomDataSource>

        <ScreenSpaceEventHandler>
          <ScreenSpaceEvent action={handlePointClick} type={ScreenSpaceEventType.LEFT_CLICK} />
          <ScreenSpaceEvent action={handleMouseMove} type={ScreenSpaceEventType.MOUSE_MOVE} />
        </ScreenSpaceEventHandler>
      </Viewer>

      {/* Floating Hover Popup */}
      {hoveredFeature && hoverPosition && (
        <div 
          className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-4 transition-all duration-100 ease-out"
          style={{ left: hoverPosition.x, top: hoverPosition.y - 48 }}
        >
          <div className="glass-panel p-3 rounded-2xl shadow-2xl flex flex-col items-center w-[220px] border border-white/40 overflow-hidden">
            {hoveredFeature.image_url ? (
              <div className="relative w-full h-28 mb-3 rounded-xl overflow-hidden bg-slate-100">
                <PlaceImage 
                  src={hoveredFeature.image_url} 
                  alt={hoveredFeature.name} 
                  type={hoveredFeature.type}
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
            ) : (
              <div className="relative w-full h-28 mb-3 rounded-xl overflow-hidden bg-slate-100">
                 <PlaceImage 
                  src={null} 
                  alt={hoveredFeature.name} 
                  type={hoveredFeature.type}
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
            )}
            <div className="w-full text-center">
              <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">{hoveredFeature.name}</h4>
              <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">{hoveredFeature.type}</p>
            </div>
            {/* Triangle pointer */}
            <div className="absolute -bottom-[8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/80 filter drop-shadow-md"></div>
          </div>
        </div>
      )}
    </div>
  );
}
