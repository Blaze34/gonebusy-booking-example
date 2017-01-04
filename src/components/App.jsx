import React, { Component } from 'react';
import { Breadcrumb, Image } from 'react-bootstrap';
import gonebusy from 'gonebusy-nodejs-client';
import { Promise } from 'bluebird';
import _ from 'lodash';

import ServiceDetails from './Services/Details';
import PricingModelDetails from './PricingModel/Details';
import dogWalker from './DogWalker.svg';
import './App.css';

const ServicesController = Promise.promisifyAll(gonebusy.ServicesController);
const PricingModelsController = Promise.promisifyAll(gonebusy.PricingModelsController);

// global configs
gonebusy.configuration.BASEURI = 'http://sandbox.gonebusy.com/api/v1';
gonebusy.configuration.authorization = 'Token ac98ed08b5b0a9e7c43a233aeba841ce';

const pricingModelData = { name: 'Dog Walking', type: 'ByTheHour', price: 10, currency: 'USD' };

const getPricingModel = function getPricingModel() {
  const params = _.pick(gonebusy.configuration, 'authorization');

  return new Promise((resolve, reject) => {
    PricingModelsController.getPricingModelsAsync(params).then((indexResponse) => {
      const pricingModel = _.find(
        indexResponse.pricingModels,
        _.chain(pricingModelData).omit('type').assign({ pricingModelType: pricingModelData.type }).value()
      );

      if (pricingModel) resolve(pricingModel);
      else {
        params.createPricingModelBody = pricingModelData;

        // now work incorrect - return keys with null values
        PricingModelsController.createPricingModelAsync(params).then((createResponse) => {
          resolve(createResponse.priceModels);
        }).catch(reject);
      }
    }).catch(reject);
  });
};

class App extends Component {
  constructor() {
    super();

    this.state = { service: null, pricingModel: null };
  }

  componentDidMount() {
    this.getServiceData();
  }

  getServiceData() {
    const serviceShortName = 'BookingExampleService';
    const params = _.pick(gonebusy.configuration, 'authorization');

    ServicesController.getServicesAsync(params).then((response) => {
      const service = _.find(response.services, { shortName: serviceShortName });

      if (service) {
        this.setState({ service });

        if (service.priceModelId)
          PricingModelsController.getPricingModelsAsync(params).then((pmResponse) => {
            const pricingModel = _.find(pmResponse.pricingModels, { id: service.priceModelId });
            if (pricingModel) this.setState({ pricingModel });
          });
      } else this.createService(serviceShortName);
    });
  }

  createService(shortName) {
    getPricingModel().then((pricingModel) => {
      this.setState({ pricingModel });

      const params = _.chain(gonebusy.configuration).pick('authorization').assign({
        createServiceBody: {
          name: 'Shauna\'s Best in Show Dog Walking Service',
          duration: 15,
          short_name: shortName,
          price_model_id: pricingModel.id,
          is_active: true,
          description: 'Some description'
        }
      }).value();

      ServicesController.createServiceAsync(params).then((response) => {
        this.setState({ service: response.service });
      });
    });
  }

  render() {
    const { service, pricingModel } = this.state;

    return (
      <div className="container">
        <div className="site-detail">
          <h1>GigVillage.com</h1>

          <Breadcrumb>
            <Breadcrumb.Item>Services</Breadcrumb.Item>
            <Breadcrumb.Item>Pet</Breadcrumb.Item>
            <Breadcrumb.Item active>Dog Walking</Breadcrumb.Item>
          </Breadcrumb>

          {service ? (
            <div className="row site-content">
              <div className="col-md-8">
                <ServiceDetails service={service} />
              </div>
              <div className="col-md-4">
                { pricingModel ? (
                  <div>
                    <PricingModelDetails pricingModel={pricingModel} />
                    <Image src={dogWalker} responsive thumbnail />
                  </div>
                ) : (
                  <div className="text-center">Pricing Model loading... Please wait</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">Service loading... Please wait</div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
