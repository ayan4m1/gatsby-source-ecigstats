import createNodeHelpers from 'gatsby-node-helpers';

export const types = {
  device: 'Device',
  puff: 'Puff',
  recording: 'Recording'
};

const { createNodeFactory } = createNodeHelpers({
  typePrefix: 'ECigStats'
});

export const transformDeviceNode = createNodeFactory(
  types.device,
  (device) => device
);

export const transformPuffNode = createNodeFactory(types.puff, (puff) => puff);

export const transformRecordingNode = createNodeFactory(
  types.recording,
  (recording) => recording
);
