import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './Api';
import LogEntryForm from './LogentryForm';
function App() {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [currentCoor, setCurrentCoord] = useState({
    latitude: null,
    longitude: null,
  });
  const [addEntryLocation, setAddEntryLocation] = useState(null);

  const [viewport, setViewport] = useState({
    width: '100ve',
    height: '100vh',
    latitude: currentCoor.latitude || 41.9027835,
    longitude: currentCoor.longitude || 12.4963655,
    zoom: 6,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentCoord({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <>
      <nav>
        <h3>Fai doppio click sulla mappa per segnalare una nuova farmacia</h3>
      </nav>
      <main className="App">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/vincenzino92/ckdqenm2z02ms1aoyzl65dvhx"
          onViewportChange={(viewport) => setViewport(viewport)}
          onDblClick={showAddMarkerPopup}
        >
          {logEntries.map((entry) => {
            return (
              <React.Fragment key={entry._id}>
                <Marker
                  key={entry._id}
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  offsetLeft={-12}
                  offsetTop={-24}
                >
                  <div
                    onClick={() =>
                      setShowPopup({
                        //   ...showPopup,
                        [entry._id]: true,
                      })
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                      stroke="red"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div>{entry.title}</div>
                  </div>
                </Marker>
                {showPopup[entry._id] ? (
                  <Popup
                    latitude={entry.latitude}
                    longitude={entry.longitude}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setShowPopup({})}
                    anchor="top"
                  >
                    <br />
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                    <br />
                    <a
                      className="link__toMaps"
                      href={`https://maps.google.com/?q=${entry.latitude},${entry.longitude}`}
                      target="__blank"
                    >
                      Portami li
                    </a>
                    <small>
                      Segnalato il:&nbsp;
                      {new Date(entry.visitDate).toLocaleDateString()}
                    </small>
                  </Popup>
                ) : null}
              </React.Fragment>
            );
          })}
          {addEntryLocation ? (
            <>
              <Marker
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                offsetLeft={-12}
                offsetTop={-24}
              >
                <div style={{ cursor: 'pointer' }}>
                  <svg
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
              </Marker>
              <Popup
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setAddEntryLocation(null)}
                anchor="top"
                className="popup"
              >
                <h3>Segnala una nuova farmacia:</h3>
                <LogEntryForm
                  onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }}
                  location={addEntryLocation}
                />
              </Popup>
            </>
          ) : null}
        </ReactMapGL>
      </main>
      <footer>This is an open source project feel free to reach me out</footer>
    </>
  );
}

export default App;
