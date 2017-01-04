import React, { PropTypes } from 'react';
import EntitiesPricingModelResponse from 'gonebusy-nodejs-client/lib/Models/EntitiesPricingModelResponse';

const currencySymbol = function currencySymbol(currency) {
  switch (currency) {
    case 'USD':
      return '$';
    default:
      return currency;
  }
};

const pricingModelText = function pricingModelText(model) {
  const price = `${currencySymbol(model.currency)}${model.price}`;

  switch (model.pricingModelType) {
    case 'Activity':
      return 'Free of charge';
    case 'FixedPrice':
      return price;
    case 'ByTheHour':
      return `${price} / hour`;
    case 'ByTheMinute':
      return `${price} / minute`;
    default:
      return 'undefined';
  }
};

const PricingModelDetails = function PricingModelDetails(props) {
  return (
    <div className="pricing-model-details">
      {pricingModelText(props.pricingModel)}
    </div>
  );
};

PricingModelDetails.propTypes = {
  pricingModel: PropTypes.instanceOf(EntitiesPricingModelResponse).isRequired
};

export default PricingModelDetails;
