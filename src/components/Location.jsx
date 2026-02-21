import React, { useState, useEffect, useRef } from "react";
import HousePng from "../logo/House.png"

// Bright/default map style to override any dark theme
const brightStyle = [];

const GoogleMapWithMarkers = ({ sectors }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!sectors || sectors.length === 0) return;

    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src =
          `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initMap();
        };
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    function initMap() {
      const center = sectors.length
        ? { lat: sectors[0].lat, lng: sectors[0].lng }
        : { lat: 19.05, lng: 73.0 };

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center,
        styles: brightStyle, // ✅ Use default bright style
      });

      sectors.forEach(({ name, lat, lng }) => {
        const position = { lat, lng };
        const marker = new window.google.maps.Marker({
          map,
          position,
          title: name,
          label: {
            text: name,
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
          },
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${name}</strong></div>`,
        });

        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });
      });
    }

    loadGoogleMapsScript();
  }, [sectors]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
      }}
    ></div>
  );
};

const Location = () => {
  const [hoveredLocation, setHoveredLocation] = useState({
    title: "Nerul East",
    sector: [
      { name: "GPGS Sector 17", lat: 19.0773, lng: 73.0153 },
      { name: "GPGS Sector 19", lat: 19.0822, lng: 73.0139 },
      { name: "GPGS Sector 21", lat: 19.0868, lng: 73.012 },
    ],
    sectors: [
      { name: "Sector 17", lat: 19.0773, lng: 73.0153 },
      { name: "Sector 19", lat: 19.0822, lng: 73.0139 },
      { name: "Sector 21", lat: 19.0868, lng: 73.012 },
    ],
  });

  const locations = [
    {
      title: "Nerul East",
      sector: [
        { name: "Sector 17", lat: 19.0773, lng: 73.0153 },
        { name: "Sector 19", lat: 19.0822, lng: 73.0139 },
        { name: "Sector 21", lat: 19.0868, lng: 73.012 },
      ],
      sectors: [
        { name: "Sector 17", lat: 19.0773, lng: 73.0153 },
        { name: "Sector 19", lat: 19.0822, lng: 73.0139 },
        { name: "Sector 21", lat: 19.0868, lng: 73.012 },
      ],
    },
    {
      title: "Nerul West",
      sector: [
        { name: "Sector 2", lat: 19.0707, lng: 73.0087 },
        { name: "Sector 14", lat: 19.0731, lng: 73.0104 },
        { name: "Sector 20", lat: 19.0683, lng: 73.0075 },
      ],
      sectors: [
        { name: "Sector 2", lat: 19.0707, lng: 73.0087 },
        { name: "Sector 14", lat: 19.0731, lng: 73.0104 },
        { name: "Sector 20", lat: 19.0683, lng: 73.0075 },
      ],
    },
    {
      title: "CBD Belapur",
      sectors: [
        { name: "Sector 14", lat: 19.0845, lng: 73.017 },
        { name: "Sector 19", lat: 19.0887, lng: 73.0185 },
        { name: "Sector 20", lat: 19.086, lng: 73.015 },
      ],
      sector: [
        { name: "Sector 14", lat: 19.0845, lng: 73.017 },
        { name: "Sector 19", lat: 19.0887, lng: 73.0185 },
        { name: "Sector 20", lat: 19.086, lng: 73.015 },
      ],
    },
    {
      title: "Kharghar",
      // sectors: [
      //   { name: "Sector 3", lat: 19.0401, lng: 73.0715 },
      //   { name: "Sector 10", lat: 19.0429, lng: 73.0733 },
      //   { name: "Sector 12", lat: 19.0457, lng: 73.0708 },
      // ],
      // sector: [
      //   { name: "GPGS Sector 3", lat: 19.0401, lng: 73.0715 },
      //   { name: "GPGS Sector 10", lat: 19.0429, lng: 73.0733 },
      //   { name: "GPGS Sector 12", lat: 19.0457, lng: 73.0708 },
      // ],
       sectors: [
        { name: "Coming soon ....", lat: 19.0401, lng: 73.0715 },
      ],
      sector: [
        { name: "Coming soon ....", lat: 19.0401, lng: 73.0715 },
      ],

    },
    {
      title: "Kopar Khairane",
      sector: [{ name: "Sector 3", lat: 19.1035, lng: 72.9967 }],
      sectors: [{ name: "Sector 3", lat: 19.1035, lng: 72.9967 }],
    },
    {
      title: "Ghansoli",
      sector: [{ name: "Sector 16", lat: 19.1055, lng: 72.9983 }],
      sectors: [{ name: "Sector 16", lat: 19.1055, lng: 72.9983 }],
    },
  ];

  return (
    <section id="locations" className="py-24 bg-[#fbfbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4"style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.0)' }}>
            Locations
          </h2>
          <p className="text-base md:text-xl text-gray-600">
            Navi Mumbai, Maharashtra
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4 sm:p-6">
          {/* Map Box */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 h-full min-h-[300px]">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-map-marker-alt text-gray-900 mr-3"></i>
              Locate us on Map
            </h3>

            {hoveredLocation ? (
              <div className="rounded-lg overflow-hidden w-full h-96">
                <GoogleMapWithMarkers sectors={hoveredLocation.sector} />
              </div>
            ) : (
              <div className="bg-[#fbfbfb] p-6 rounded-lg text-center">
                <i className="fas fa-city text-gray-900 text-3xl md:text-4xl mb-4"></i>
                <p className="font-medium text-gray-900 text-base md:text-lg">
                  Multiple Prime Locations
                </p>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                  Hover over a location to see it on the map.
                </p>
              </div>
            )}
          </div>

          {/* Location Cards */}
          <div className="ombre-container rounded-xl shadow-lg p-6 sm:p-8">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center">
              <i className="fas fa-map-marker-alt text-white mr-3"></i>
              Current Serviceable Locations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="relative group w-full h-32 [perspective:1000px]"
                  onMouseEnter={() => setHoveredLocation(location)}
                >
                  <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front */}
                    <div className="absolute inset-0 bg-white rounded-lg flex flex-col items-center justify-center [backface-visibility:hidden]">
                      {/* <i className="fas fa-building text-indigo-600 text-xl md:text-2xl mb-2"></i> */}
                      <img src={HousePng} alt="" className="h-12 w-12" />
                      <p className="font-medium text-gray-900 text-sm md:text-base">
                        {location.title}
                      </p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 border border-black bg-white rounded-lg flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <ul className="text-xs md:text-sm text-gray-700 space-y-0.5 text-center">
                        {location.sectors.map((sector, i) => (
                          <li key={i}>{sector.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 flex max-w-[73rem] ml-6 justify-center items-center bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start space-x-1">
            <i className="fas fa-info-circle text-black text-lg md:text-xl mt-[-2px]"></i>
            <div>
              <h4 className="font-semibold text-black mb-1 md:mb-2 text-sm md:text-base">
                Important Note
              </h4>
              <p className="text-gray-600 text-sm md:text-base">
                Before you reach any given location, please inform us a minimum
                of 30 minutes in advance for a smooth visit experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default Location;
