import './style.css'

import MapView from "@arcgis/core/views/MapView"
import WebMap from "@arcgis/core/WebMap"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView"
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils"
 
const map = new WebMap({
  portalItem: { 
    id: "4947595256c64673ab5136fe8b183379"
  }
})
let sampleLocationsLayer: FeatureLayer

const view = new MapView({
  map: map,
  container: "viewDiv",
  center: [-118.244, 34.052],
  zoom: 5 
})


view.when(() => {
  console.log('MapView: ', view)
  sampleLocationsLayer = view.map.layers.find(it => it.title === 'Deep Sea Coral and Sponge Observations') as FeatureLayer
  console.log('FeatureLayer: ', sampleLocationsLayer)
  for (let i = 0; i < layerProperties.length; i++) {
    setupLayerPropertiesListener(sampleLocationsLayer, layerProperties[i]);
  }
  
  view.whenLayerView(sampleLocationsLayer)
  .then( layerView => {
    console.log('LayerView: ', layerView)

    for (let i = 0; i < layerViewProperties.length; i++) {
      setupLayerViewPropertiesListener(layerView, layerViewProperties[i]);
    }
    
    reactiveUtils.when(
      () => !layerView.updating, 
      () => {
        // console.log("LayerView finished updating.")
        layerView.queryFeatureCount().then(response => {
          console.log('client-side count: ', response)
        })
        // sampleLocationsLayer.queryFeatureCount().then( response => {
        //   console.log('server-side count: ', response )
        // })
      })
  })
})

// WARNING: property/event name must be unique in all lists
const events = [
  "pointer-enter",
  "pointer-leave",
  "pointer-move",
  "pointer-down",
  "pointer-up",
  "immediate-click",
  "click",
  "immediate-double-click",
  "double-click",
  "mouse-wheel",
  "drag",
  "hold",
  "key-down",
  "key-up",
  "focus",
  "blur",
  "resize"
];

// for the purpose of the sample, this is only a selection of properties,
// but any properties on the View can be watched for
const properties = [
  "focused",
  "interacting",
  "updating",
  "resolution",
  "scale",
  "zoom",
  "stationary"
]

const layerProperties = [
  "loadStatus"
]

const layerViewProperties = [
  "visible",
  "visibleAtCurrentScale"
]

// Dynamically create the table of events and properties from the defined array
function createTables() {
  const eventsTable = document.getElementById("events");
  if (!eventsTable) {
    throw new Error("missing expected HTML element");
  }
  let content = eventsTable.innerHTML;
  for (let i = 0; i < events.length; i++) {
    content += '<div class="event" id="' + events[i] + '">' + events[i];
    content += "</div>";
  }
  eventsTable.innerHTML = content;
  const propertiesTable = document.getElementById("properties");
  if (!propertiesTable) {
    throw new Error("missing expected HTML element");
  }
  content = propertiesTable.innerHTML;
  for (let i = 0; i < properties.length; i++) {
    content += '<div class="property" id="' + properties[i] + '">' + properties[i] + " = </div>";
  }
  propertiesTable.innerHTML = content;

  const layerPropertiesTable = document.getElementById("layerProperties");
  if (!layerPropertiesTable) {
    throw new Error("missing expected HTML element");
  }
  content = layerPropertiesTable.innerHTML;
  for (let i = 0; i < layerProperties.length; i++) {
    content += '<div class="property" id="' + layerProperties[i] + '">' + layerProperties[i] + " = </div>";
  }
  layerPropertiesTable.innerHTML = content;

  const layerViewPropertiesTable = document.getElementById("layerViewProperties");
  if (!layerViewPropertiesTable) {
    throw new Error("missing expected HTML element");
  }
  content = layerViewPropertiesTable.innerHTML;
  for (let i = 0; i < layerViewProperties.length; i++) {
    content += '<div class="property" id="' + layerViewProperties[i] + '">' + layerViewProperties[i] + " = </div>";
  }
  layerViewPropertiesTable.innerHTML = content;

}

function setupEventListener(view: MapView, name) {
  const eventRow = document.getElementById(name);
  if (!eventRow) { throw new Error(`unable to locate element for event ${name}`) }

  view.on(name, () => {
    eventRow.className = "event active";
    if (eventRow.highlightTimeout) {
      clearTimeout(eventRow.highlightTimeout);
    }
    eventRow.highlightTimeout = setTimeout(() => {
      // after a timeout of one second disable the highlight
      eventRow.className = "event inactive";
    }, 1000);
  });
}

function setupPropertiesListener(view: MapView, name: string) {
  const propertiesRow = document.getElementById(name)
  if (!propertiesRow) { throw new Error(`unable to locate element for property ${name}`)};

  view.watch(name, (value) => {
    propertiesRow.className = "property active";
    propertiesRow.innerHTML = propertiesRow.innerHTML.substring(0, propertiesRow.innerHTML.indexOf(" = "));
    // set the text to the received value
    const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
    propertiesRow.innerHTML += " = " + formattedValue.toString();
    if (propertiesRow.highlightTimeout) {
      clearTimeout(propertiesRow.highlightTimeout);
    }
    propertiesRow.highlightTimeout = setTimeout(() => {
      // after a timeout of one second disable the highlight
      propertiesRow.className = "property inactive";
    }, 1000);
  });
}

function setupLayerPropertiesListener(layer: FeatureLayer, name: string) {
  const propertiesRow = document.getElementById(name)
  if (!propertiesRow) { throw new Error(`unable to locate element for property ${name}`) };
  layer.watch(name, (value) => {
    propertiesRow.className = "property active";
    propertiesRow.innerHTML = propertiesRow.innerHTML.substring(0, propertiesRow.innerHTML.indexOf(" = "));
    // set the text to the received value
    const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
    propertiesRow.innerHTML += " = " + formattedValue.toString();
    if (propertiesRow.highlightTimeout) {
      clearTimeout(propertiesRow.highlightTimeout);
    }
    propertiesRow.highlightTimeout = setTimeout(() => {
      // after a timeout of one second disable the highlight
      propertiesRow.className = "property inactive";
    }, 1000);
  });
}

function setupLayerViewPropertiesListener(layerView, name) {
  const propertiesRow = document.getElementById(name)
  if (!propertiesRow) { throw new Error(`unable to locate element for property ${name}`) };
  reactiveUtils.watch(
    () => layerView[name], 
    (value) => {
      propertiesRow.className = "property active";
      propertiesRow.innerHTML = propertiesRow.innerHTML.substring(0, propertiesRow.innerHTML.indexOf(" = "));
      // set the text to the received value
      const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
      propertiesRow.innerHTML += " = " + formattedValue.toString();
      if (propertiesRow.highlightTimeout) {
        clearTimeout(propertiesRow.highlightTimeout);
      }
      propertiesRow.highlightTimeout = setTimeout(() => {
        // after a timeout of one second disable the highlight
        propertiesRow.className = "property inactive";
      }, 1000);  
    },
    {initial: true})
}

// create the tables for the events and properties
createTables();

// Setup all view events defined in the array
for (let i = 0; i < events.length; i++) {
  setupEventListener(view, events[i]);
}

// Setup all watch properties defined in the array
for (let i = 0; i < properties.length; i++) {
  setupPropertiesListener(view, properties[i]);
}
