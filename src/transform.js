import { createNodeHelpers } from 'gatsby-node-helpers';

export const types = {
  device: 'Device',
  puff: 'Puff'
};

export const getTransforms = (createNodeId, createContentDigest) => {
  const { createNodeFactory } = createNodeHelpers({
    typePrefix: 'ECigStats',
    createNodeId,
    createContentDigest
  });

  return {
    transformDevice: createNodeFactory(types.device, (device) => device),
    transformPuff: createNodeFactory(types.puff, (puff) => puff)
  };
};
