import StatsApi from './api';
import { transformDeviceNode } from './transform';

exports.sourceNodes = async ({ actions, reporter }, options) => {
  try {
    const { createNode } = actions;
    const {
      apiUsername,
      apiPassword,
      pageSize = 1000,
      fetchRecordings = 100
    } = options;
    const api = new StatsApi(apiUsername, apiPassword);

    const fetchPuffs = async (device, results = [], startPuff = 1) => {
      reporter.info(
        `Fetching puffs ${startPuff} to ${startPuff + pageSize} for device ${
          device.id
        }`
      );

      const {
        data: { puffs }
      } = await api.getPuffRange(device.id, startPuff, startPuff + pageSize);

      results.push.apply(results, puffs);

      if (puffs.length === pageSize + 1) {
        return fetchPuffs(device, results, startPuff + pageSize);
      } else {
        return results;
      }
    };

    const {
      data: { devices }
    } = await api.getDevices();

    for (const device of devices) {
      const {
        data: { usage }
      } = await api.getUsage(device.id);

      const puffs = await fetchPuffs(device);

      for (const puff of puffs) {
        if (puff.has_recording && puff.puff > puffs.length - fetchRecordings) {
          reporter.info(`Fetching recording for puff ${puff.puff}`);
          const {
            data: { recording }
          } = await api.getRecording(device.id, puff.puff);

          puff.recording = {
            units: recording.units.map((unit) => ({
              unit: unit.unit,
              displayName: unit.display_name
            })),
            fields: recording.fields.map((field) => ({
              field: field.field,
              displayName: field.display_name
            })),
            samples: recording.samples
          };
        }
      }

      createNode(
        transformDeviceNode({
          ...device,
          usage: usage.map((row) => ({
            startDate: row.start_date,
            endDate: row.end_date,
            countOfDays: row.count_of_days,
            puffs: row.puffs,
            puffsPerDay: row.puffs_per_day,
            percentTempProtected: row.percent_tp,
            energyMean: row.energy_mean,
            energyPerDay: row.energy_per_day,
            timeMean: row.time_mean,
            timePerDay: row.time_per_day,
            powerMean: row.power_mean,
            tempMean: row.temp_mean
          })),
          puffs: puffs.map((puff) => ({
            id: puff.puff,
            puff: puff.puff,
            timestamp: puff.ts,
            temp: puff.temp,
            time: puff.time,
            power: puff.power,
            energy: puff.energy,
            tempSetpoint: puff.temp_sp,
            powerSetpoint: puff.power_sp,
            coilLoss: puff.coil_loss,
            coldOhms: puff.cold_ohms,
            coldTemp: puff.cold_temp,
            roomTemp: puff.room_temp,
            tempPeak: puff.temp_peak,
            boardTemp: puff.board_temp,
            groundOhms: puff.ground_ohms,
            staticOhms: puff.static_ohms,
            snapshotOhms: puff.snapshot_ohms,
            hasRecording: puff.has_recording,
            recording: puff.recording,
            material: puff.material
          }))
        })
      );
    }
  } catch (error) {
    reporter.panicOnBuild(error);
  }

  return;
};
