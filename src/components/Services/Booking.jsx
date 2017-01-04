import React, { Component, PropTypes } from 'react';
import EntitiesPricingModelResponse from 'gonebusy-nodejs-client/lib/Models/EntitiesPricingModelResponse';
import EntitiesServiceResponse from 'gonebusy-nodejs-client/lib/Models/EntitiesServiceResponse';

import gonebusy from 'gonebusy-nodejs-client';
// import { Promise } from 'bluebird';
import moment from 'moment';
import _ from 'lodash';

const ServicesController = Promise.promisifyAll(gonebusy.ServicesController);

class ServiceBooking extends Component {
  static propTypes = {
    priceModel: PropTypes.instanceOf(EntitiesPricingModelResponse).isRequired,
    service: PropTypes.instanceOf(EntitiesServiceResponse).isRequired
  };

  constructor() {
    super();

    this.state = { date: moment() };
  }

  componentDidMount() {
    this.getAvailableSlots();
  }

  getAvailableSlots() {
    const params = _.pick(gonebusy.configuration, 'authorization');

    ServicesController.getServicesAsync(params).then((response) => {

    });
  }

  render() {
    // const { service, pricingModel } = this.props;

    return (
      <div className="service-booking">

      </div>
    );
  }
}

export default ServiceBooking;
