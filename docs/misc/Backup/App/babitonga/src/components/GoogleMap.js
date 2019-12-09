import React from 'react';
import { connect } from 'react-redux';
import { initializeMap, onRegionDrawn } from '../map';
import { setAuthenticationState, replaceSatellite, updateStatus, setRegion } from '../actions';
import * as Spacecrafts from '../spacecrafts';

class GoogleMap extends React.Component {
  componentDidMount() {
    var CLIENT_ID = '1084163887653-k8eaa79dehj1if3i1r7o6843ejkgorth.apps.googleusercontent.com';

    this.map = new google.maps.Map(this.mapComponent, {
      center: {lat: -26.9146, lng: -48.6621},
      zoom: 10
    });

    initializeMap(this.map);
    onRegionDrawn((region, coords) => this.props.setRegion(region, coords));

    // Shows a button prompting the user to log in.
    const onImmediateFailed = function() {
      $('.g-sign-in').removeClass('hidden');
      $('.output').text('(Log in to see the result.)');
      $('.g-sign-in .button').click(function() {
        ee.data.authenticateViaPopup(function() {
          $('.g-sign-in').addClass('hidden');
        });
      });
    };

    this.props.updateStatus("Autenticando");

    // Attempt to authenticate using existing credentials.
    ee.data.authenticate(CLIENT_ID, () => {
      ee.initialize();

      this.props.updateStatus(false);
      this.props.setAuthenticationState(true);
      this.props.replaceSatellite(1); // Landsat 5
    }, null, null, () => {
      onImmediateFailed();
      this.props.updateStatus(false);
      this.props.setAuthenticationState(false);
    });
  }

  render() {
    return (
      <div>
        <div className="map" ref={r => this.mapComponent = r}></div>
      </div>
    );
  }
}

const stateMapper = (state) => {
  return {};
};

export default connect(stateMapper, {
  setAuthenticationState, replaceSatellite, updateStatus, setRegion
})(GoogleMap);
