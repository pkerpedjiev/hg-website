import Resumable from 'resumablejs';
import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes as T } from 'prop-types';
import AuthService from 'utils/AuthService'
import {HiGlassComponent} from 'higlass';

let viewConf = {
  "editable": true,
  "zoomFixed": false,
  "trackSourceServers": [
    "http://higlass.io/api/v1"
  ],
  "exportViewUrl": "http://higlass.io/api/v1/viewconfs/",
  "views": [
    {
      "uid": "aa",
      "initialXDomain": [
        1796142508.3343146,
        1802874737.269993
      ],
      "initialYDomain": [
        1795888772.6557815,
        1806579890.9341388
      ],
      "autocompleteSource": "http://higlass.io/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&",
      "genomePositionSearchBoxVisible": true,
      "chromInfoPath": "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
      "tracks": {
        "top": [
          {
            "filetype": "hitile",
            "name": "wgEncodeSydhTfbsGm12878Rad21IggrabSig.hitile",
            "server": "http://higlass.io/api/v1",
            "tilesetUid": "F2vbUeqhS86XkxuO1j2rPA",
            "type": "horizontal-line",
            "options": {
              "labelColor": "red",
              "labelPosition": "hidden",
              "axisPositionHorizontal": "right",
              "lineStrokeColor": "blue",
              "name": "wgEncodeSydhTfbsGm12878Rad21IggrabSig.hitile",
              "valueScaling": "log"
            },
            "width": 20,
            "height": 20,
            "position": "top",
            "uid": "line1"
          }
        ],
        "left": [],
        "center": [
          {
            "uid": "c1",
            "type": "combined",
            "height": 200,
            "contents": [
              {
                "server": "http://higlass.io/api/v1",
                "tilesetUid": "CQMd6V_cRw6iCI_-Unl3PQ",
                "type": "heatmap",
                "position": "center",
                "options": {
                  "colorRange": [
                    "white",
                    "rgba(245,166,35,1.0)",
                    "rgba(208,2,27,1.0)",
                    "black"
                  ],
                  "colorbarPosition": "topLeft",
                  "colorbarOrientation": "vertical",
                  "colorbarLabelsPosition": "outside",
                  "maxZoom": null,
                  "labelPosition": "bottomRight",
                  "name": "Rao et al. (2014) GM12878 MboI (allreps) 1kb"
                },
                "uid": "heatmap1",
                "name": "Rao et al. (2014) GM12878 MboI (allreps) 1kb",
                "binsPerDimension": 256
              },
              {
                "type": "2d-chromosome-grid",
                "local": true,
                "orientation": "2d",
                "name": "Chromosome Grid (hg19)",
                "chromInfoPath": "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
                "thumbnail": null,
                "server": "",
                "tilesetUid": "TIlwFtqxTX-ndtM7Y9k1bw",
                "uid": "LUVqXXu2QYiO8XURIwyUyA",
                "options": {
                  "gridStrokeWidth": 1,
                  "gridStrokeColor": "grey"
                },
                "position": "center"
              }
            ],
            "position": "center",
            "options": {}
          }
        ],
        "right": [],
        "bottom": []
      },
      "layout": {
        "w": 5,
        "h": 12,
        "x": 0,
        "y": 0,
        "i": "aa",
        "moved": false,
        "static": false
      }
    },
    {
      "uid": "view2",
      "initialXDomain": [
        1796142508.3343008,
        1802874737.270007
      ],
      "initialYDomain": [
        1795888772.6557593,
        1806579890.9341605
      ],
      "autocompleteSource": "http://higlass.io/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&",
      "genomePositionSearchBoxVisible": true,
      "chromInfoPath": "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
      "tracks": {
        "top": [
          {
            "filetype": "hitile",
            "name": "wgEncodeSydhTfbsGm12878Ctcfsc15914c20StdSig.hitile",
            "server": "http://higlass.io/api/v1",
            "tilesetUid": "b6qFe7fOSnaX-YkP2kzN1w",
            "uid": "line2",
            "type": "horizontal-line",
            "options": {
              "labelColor": "black",
              "labelPosition": "topLeft",
              "axisPositionHorizontal": "left",
              "lineStrokeColor": "blue",
              "valueScaling": "linear",
              "name": "wgEncodeSydhTfbsGm12878Ctcfsc15914c20StdSig.hitile"
            },
            "width": 20,
            "height": 20,
            "position": "top"
          }
        ],
        "left": [],
        "center": [
          {
            "uid": "c2",
            "type": "combined",
            "contents": [
              {
                "filetype": "cooler",
                "name": "Dixon et al. (2015) H1_TB HindIII (allreps) 1kb",
                "server": "http://higlass.io/api/v1",
                "tilesetUid": "clU7yGb-S7eY4yNbdDlj9w",
                "uid": "heatmap2",
                "type": "heatmap",
                "options": {
                  "labelPosition": "bottomRight",
                  "colorRange": [
                    "white",
                    "rgba(245,166,35,1.0)",
                    "rgba(208,2,27,1.0)",
                    "black"
                  ],
                  "maxZoom": null,
                  "colorbarLabelsPosition": "outside",
                  "colorbarPosition": "topLeft",
                  "name": "Dixon et al. (2015) H1_TB HindIII (allreps) 1kb"
                },
                "width": 20,
                "height": 20,
                "binsPerDimension": 256,
                "position": "center"
              }
            ],
            "position": "center",
            "options": {}
          }
        ],
        "right": [],
        "bottom": []
      },
      "layout": {
        "w": 6,
        "h": 12,
        "x": 6,
        "y": 0,
        "i": "view2",
        "moved": false,
        "static": false
      }
    }
  ],
  "zoomLocks": {
    "locksByViewUid": {
      "view2": "JAFSZPdmSWe72WgTnVDtbA",
      "aa": "JAFSZPdmSWe72WgTnVDtbA"
    },
    "locksDict": {
      "JAFSZPdmSWe72WgTnVDtbA": {
        "view2": [
          1812727561.5083356,
          1873757116.378131,
          475954.14177536964
        ],
        "aa": [
          1812727561.5083356,
          1873757116.378131,
          475954.14177536964
        ]
      }
    }
  },
  "locationLocks": {
    "locksByViewUid": {
      "view2": "fRq4SRH8TSyVveKqebWsxw",
      "aa": "fRq4SRH8TSyVveKqebWsxw"
    },
    "locksDict": {
      "fRq4SRH8TSyVveKqebWsxw": {
        "view2": [
          1812727561.5083356,
          1873757116.378131,
          475954.14177536964
        ],
        "aa": [
          1812727561.5083356,
          1873757116.378131,
          475954.14177536964
        ]
      }
    }
  }
}

export default class HGViewer extends React.Component {
    constructor() {
        super();
    }

  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  componentDidMount() {

  }

  render() {
    return (
        <div style={{width: "500px", height: "500px"}}>
            <HiGlassComponent
              viewConfig={viewConf}
              options={{bounded: true}}
            >

            </HiGlassComponent>
        </div>
    );
  }
}