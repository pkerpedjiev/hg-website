import React from 'react';
import {json} from 'd3-request';
import {HiGlassComponent} from 'higlass';
import 'higlass/dist/higlass.css';

export default class HGViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewConf: null
        }

        json('http://higlass.io/api/v1/viewconfs/?d=default', (error, json) => {
            console.log('json:', json);    
            if (error)
                return;

            this.setState({ viewConf : json})
        })
    }

    render() {
        let hgcComponent = this.state.viewConf ?
            <HiGlassComponent
                options={{bounded: true}}
                viewConfig={this.state.viewConf}
            /> : null;
        return(
                <div style={{"position": "absolute", "top": "30px", "bottom": "0px", "left": "0px", "right": "0px"}}>
                    { hgcComponent }
                </div>
        );
    }
}
