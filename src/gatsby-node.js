import StatsApi from './api';
import { transformDeviceNode } from './transform';

exports.sourceNodes = async ({ actions, reporter }, options) => {
  try {
    const { createNode } = actions;
    const { apiUsername, apiPassword } = options;
    const api = new StatsApi(apiUsername, apiPassword);

    const {
      data: { devices }
    } = await api.getDevices();

    for (const device of devices) {
      const {
        data: { usage }
      } = await api.getUsage(device.id);

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
          }))
        })
      );
    }
  } catch (error) {
    reporter.panicOnBuild(error);
  }

  return;
};
