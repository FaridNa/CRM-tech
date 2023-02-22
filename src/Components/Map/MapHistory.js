import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline, Circle } from "google-maps-react";
import { Component } from "react";
import styles from "./Maps.module.scss"
import MapHistoryNav from "./mapHistoryNav";
import Check from '../../img/check.png'

const mapStyle = [
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

const colors = {
    view: '#336692',
    call: '#AA2F30',
    start: '#FB9700',
    finish: '#31A291'
}

const icons = {
    view: 'https://volga24bot.com/icons/dem.png',
    call: 'https://volga24bot.com/icons/mon.png',
    start: 'https://volga24bot.com/icons/req.png',
    finish: 'https://volga24bot.com/icons/so.png'
}


const center = {
    lat: 46.3375031,
    lng: 48.02041759999999
}

const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
}



class WithMarkers extends Component {
    state = {
        activeMarker: {},
        activePolyline: {},
        selectedPlace: {},
        showingInfoWindow: false,
        showingPolylineInfoWindow: false
    };

    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            showingInfoWindow: true
        });

    onPolylineClick = (props, polyline) =>
        this.setState({
            activePolyline: polyline,
            selectedPlace: props,
            showingPolylineInfoWindow: true
        });
    ;

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };


    _mapLoaded(mapProps, map) {
        map.setOptions({
            styles: mapStyle
        })

        console.log(this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el => ({
            lat: el.location.split('/')[0],
            lng: el.location.split('/')[1]
        })))

        console.log([
            { lat: 37.772, lng: -122.214 },
            { lat: 21.291, lng: -157.821 },
            { lat: -18.142, lng: 178.431 },
            { lat: -27.467, lng: 153.027 },
        ])
    }

    handleClick = () => {
        // console.log('значение this:', this);
    }
    render() {
        //console.log(this.props)
        if (!this.props.loaded) return <div>Loading...</div>;

        return (
            <Map
                className="map"
                google={this.props.google}
                onClick={this.onMapClicked}
                style={{ height: '80%', width: '100%' }}
                zoom={15}
                gestureHandling={"greedy"}
                onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
                initialCenter={{
                    lat: 46.3375031,
                    lng: 48.02041759999999
                }}
            >

                <Circle
                    // required
                    center={center}
                    // required
                    options={options}
                />

                {this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el => {
                    return <Marker icon={icons[el.type]} key={el.date} name={el.user} type={el.type} address={""} problem={el.value} dateCreate={el.date} onClick={this.onMarkerClick}
                        position={{ lat: el.location.split('/')[0], lng: el.location.split('/')[1] }} optimized={true} />
                })}

                {/* <Polyline
                    path={this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el => ({
                        lat: parseFloat(el.location.split('/')[0]),
                        lng: parseFloat(el.location.split('/')[1])
                    }))}
                    options={{ strokeColor: 'orange' }}
                /> */}

                {this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map((el, i, arr) =>
                    i < arr.length - 1 ?
                        <Polyline
                            path={[
                                { lat: parseFloat(el.location.split('/')[0]), lng: parseFloat(el.location.split('/')[1]) },
                                { lat: parseFloat(arr[i + 1].location.split('/')[0]), lng: parseFloat(arr[i + 1].location.split('/')[1]) }
                            ]}
                            options={{ strokeColor: colors[el.type] }}
                            key={el.date} name={el.user} type={el.type} address={""} problem={el.value} dateCreate={el.date} onClick={this.onPolylineClick}
                        />
                        : null)}

                {this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el => 
                        <Circle
                            options={{ strokeColor: "red", fillColor: "red", fillOpacity: "90" }}
                            center={{
                                lat: parseFloat(el.location.split('/')[0]), lng: parseFloat(el.location.split('/')[1])
                            }}
                            radius={30} 
                            />)}

                <InfoWindow
                    marker={this.state.activeMarker}
                    onClose={this.onInfoWindowClose}
                    visible={this.state.showingInfoWindow}
                >
                    <div className={styles.infoWrapper} >
                        <p className={styles.type}>{this.state.selectedPlace.type}</p>
                        <p className={styles.name}>{this.state.selectedPlace.name}</p>
                        <p className={styles.address}>{this.state.selectedPlace.address}</p>
                        <p className={styles.problem}>{this.state.selectedPlace.problem}</p>
                        <p className={styles.time}>{this.state.selectedPlace.dateCreate}</p>

                    </div>



                </InfoWindow>

                <InfoWindow onClick={console.log(this.state.activePolyline)}
                    onClose={this.onPolylineInfoWindowClose}
                    visible={this.state.showingPolylineInfoWindow}
                >
                    <div className={styles.infoWrapper} >
                        <p>HEY HEY</p>

                    </div>



                </InfoWindow>

                <ul className={styles.mapNav}>
                    {this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el => <li>{el.type}</li>)}
                </ul>





            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDJD4IPwg38XT_FSzy6dSELiXZJqT0ysyk",
    language: 'ru'
})(WithMarkers)