import React, { PropTypes } from 'react';
import { Image } from 'react-bootstrap';
import EntitiesServiceResponse from 'gonebusy-nodejs-client/lib/Models/EntitiesServiceResponse';

import dogWalker from '../DogWalker.svg';

const ServiceDetails = function ServiceDetails(props) {
  return (
    <div className="service-details">
      <h2 className="service-title">{props.service.name}</h2>
      <Image src={dogWalker} responsive thumbnail />
    </div>
  );
};

ServiceDetails.propTypes = {
  service: PropTypes.instanceOf(EntitiesServiceResponse).isRequired
};

export default ServiceDetails;
