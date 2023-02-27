import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline, Circle } from "google-maps-react";
import { Component, useEffect } from "react";
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

const typeNames = {
    view: 'Просмотрел',
    call: 'Созвонился',
    start: 'Начал работу',
    finish: 'Завершил работу'
}

const getAddress = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDJD4IPwg38XT_FSzy6dSELiXZJqT0ysyk`;
    const res = await fetch(`${url}`);
    const address = await res.json();
    return address.results[0].address_components[1].short_name + " " + address.results[0].address_components[0].short_name ;
}

class WithMarkers extends Component {
    state = {
        activeMarker: {},
        selectedPlace: {},
        selectedAddress: '',
        showingInfoWindow: false,
        center: {
            lat: 46.3375031,
            lng: 48.02041759999999
        }
    };

    onMarkerClick = async (props, marker) => {
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            selectedAddress: await getAddress( props.position.lat, props.position.lng ),
            showingInfoWindow: true
        }
        );
    }

    onPolylineClick = (props, polyline) => {
        console.log(polyline.getPath().getArray()[0].toJSON().lat)
        this.setState({
            center: {
                lat: polyline.getPath().getArray()[0].toJSON().lat,
                lng: polyline.getPath().getArray()[0].toJSON().lng
            }
        })
    }

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            selectedAddress: '',
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

        // console.log(this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el => ({
        //     lat: el.location.split('/')[0],
        //     lng: el.location.split('/')[1]
        // })))

        // console.log([
        //     { lat: 37.772, lng: -122.214 },
        //     { lat: 21.291, lng: -157.821 },
        //     { lat: -18.142, lng: 178.431 },
        //     { lat: -27.467, lng: 153.027 },
        // ])
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
                disableDefaultUI="true"
                zoomControl="true"
                onClick={this.onMapClicked}
                style={{ height: '88%', width: '100%' }}
                zoom={15}
                gestureHandling={"greedy"}
                onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
                initialCenter={{
                    lat: parseFloat(this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null)[0].location.split('/')[0]),
                    lng: parseFloat(this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null)[0].location.split('/')[1])
                }}
                center={this.state.center}
            >

                {this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el => {
                    return <Marker icon={icons[el.type]} key={el.date} name={el.user} type={el.type} address={""} problem={el.value} dateCreate={el.date} onClick={this.onMarkerClick}
                        position={{ lat: el.location.split('/')[0], lng: el.location.split('/')[1] }} optimized={true} />
                })}

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
                        radius={50}
                        strokeColor={colors[el.type]}
                        fillColor={colors[el.type]}
                    />)}

                <InfoWindow
                    marker={this.state.activeMarker}
                    onClose={this.onInfoWindowClose}
                    visible={this.state.showingInfoWindow}
                >
                    <div className={styles.infoWrapper} >
                        <p style={{ color: colors[this.state.selectedPlace.type] }} className={styles.type}>{typeNames[this.state.selectedPlace.type]}</p>
                        <p style={{fontWeight: 'bold'}} className={styles.address}>{this.state.selectedAddress}</p>
                        <p className={styles.name}>{this.state.selectedPlace.name}</p>
                        <p className={styles.problem}>{this.state.selectedPlace.problem}</p>
                        <p className={styles.time}>{this.state.selectedPlace.dateCreate}</p>

                    </div>
                </InfoWindow>

                <ul className={styles.mapNav}>
                    {this.props.items.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null).map(el =>
                        <li className={styles.typeName} onClick={e => this.setState({ center: { lat: el.location.split('/')[0], lng: el.location.split('/')[1] } })}>
                            <img src={icons[el.type]} />
                            <p style={{ color: colors[el.type] }}>{typeNames[el.type]}</p>
                        </li>)}
                </ul>





            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDJD4IPwg38XT_FSzy6dSELiXZJqT0ysyk",
    language: 'ru'
})(WithMarkers)