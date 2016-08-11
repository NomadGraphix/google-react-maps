import React from 'react';
import ReactDom from 'react-dom';

/** The component designed to implement the google.maps.InfoWindow class. This component can be the child of either the `<Map />` or `<Marker />` components, but if you decide to put it within the `<Map />` component you must set its coordinate property so that it has an anchor point.
* @memberof Map
* 
* @property {object} props
* @property {google.maps} props.maps Required.
* @property {google.maps.Map} props.map Required.
* @property {google.maps.MVCObject} props.anchor Required if coordinates aren't provided.
* @property {object} props.coords Required if anchor isn't provided.
* @property {number} props.coords.lng
* @property {number} props.coords.lat
* @property {bool} props.disableAutopan
* @property {number} props.maxWidth
* @property {object} props.pixelOffset
* @property {object} props.pixelOffset.width
* @property {object} props.pixelOffset.height
* @property {google.maps.InfoWindowOptions} props.options These will overwrite any of the convenience props above. See [google.maps.InfoWindowOptions]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindowOptions} documentation for all the options.
* @property {bool} props.open Allows you to open and close a window without fully unmounting it.
* @property {object} state
* @property {google.maps.InfoWindow} state.infoWindow The internal instance of the infoWindow.
* @property {function} props.onCloseClick Use this to listen for the close click event. When someone tries to close the infowindow. Implement closing.
*/

class InfoWindow extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'InfoWindow';
        this.state = {
        	infoWindow : null,
        	anchor : null
        }

        this.loadInfoWindowContent = this.loadInfoWindowContent.bind(this);
        this.node = null;
    }
    componentWillMount() {
    	  var {maps, map, anchor, coords} = this.props;
          if(maps && map) {
          	var options = {
          		position : anchor? undefined : coords
          	}          	
          	var infoWindow = new maps.InfoWindow(options)

          	infoWindow.open(map, anchor);
          	//Don't let the infowindow do it's default thing when a user tries to close it.
    		maps.event.addListener(infoWindow, 'closeclick', e => {
    			if(this.props.open)
	    			infoWindow.open(map, anchor);
	    		if(this.props.onCloseClick)
	    			this.props.onCloseClick
    		});

          	this.setState({infoWindow})
          }
          else {
          	console.error("InfoWindow must live inside of a <Map /> component context.")
          }
    }
	/** Load rendered children into infoWindow.
	* @return {undefined} 
	*/
    loadInfoWindowContent() {
    	if(this.state.infoWindow) {

	    	this.node = ReactDom.findDOMNode(this.refs.infoWindowChildren);
    		this.state.infoWindow.setContent(this.node); //Set infowindow content

    	}

    }
    /** Place rendered children back into their normal location to await their destruction.
    * @return {undefined}
    */
    cleanInfoWindowContentForUnmount() {
    	//Undo our previous dom manipulation.
      	var parent = ReactDom.findDOMNode(this);
      	var child = this.node;
      	parent.appendChild(child);
    }
    componentDidMount() {
    	console.log("IW: Mounted Info window.");
    	this.loadInfoWindowContent()
    }
    componentWillUnmount() {
    	if(this.state.infoWindow)
	    	this.state.infoWindow.open(null);
        this.setState({infoWindow : null});
        this.cleanInfoWindowContentForUnmount();
        console.log("IW: Unmounted info window.")
    }
    componentDidUpdate(prevProps, prevState) {
    	if(this.props.infoWindow) {
    		if(this.props.open)
		      	this.props.infoWindow.open(this.props.map);
	    	else
	    		this.props.infoWindow.open(null);
    	}
    }
    render() {
    	console.log("IW: Rendered infowindow")
        return <div><div ref="infoWindowChildren">{this.props.children}</div></div>;
    }
}

InfoWindow.propTypes = {
	maps : React.PropTypes.object,
	map : React.PropTypes.object,
	coords : React.PropTypes.object,
	onCloseClick : React.PropTypes.func
}

export default InfoWindow;
