import axios from 'axios';

export default class StatsApi {
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.request = this.request.bind(this);
    this.getAllUsage = this.getAllUsage.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.getPuff = this.getPuff.bind(this);
    this.getPuffRange = this.getPuffRange.bind(this);
    this.getUsage = this.getUsage.bind(this);
  }

  async request(url, data = null) {
    const authHeader = Buffer.from(
      `${this.username}:${this.password}`
    ).toString('base64');

    return await axios(url, {
      data,
      headers: {
        Authorization: `Basic ${authHeader}`
      },
      method: 'GET'
    });
  }

  getDevices() {
    return this.request(
      'https://api.ecigstats.org/v1/devices/?account=current&format=json'
    );
  }

  getAllUsage() {
    return this.request(
      'https://api.ecigstats.org/v1/usage/?account=current&format=json'
    );
  }

  getUsage(deviceId) {
    return this.request(
      `https://api.ecigstats.org/v1/usage/?device=${deviceId}&format=json`
    );
  }

  getPuffRange(deviceId, startPuff, endPuff) {
    return this.request(
      `https://api.ecigstats.org/v1/puffs/?device=${deviceId}&start=${startPuff}&end=${endPuff}&format=json`
    );
  }

  getPuff(deviceId, puffId) {
    return this.request(
      `https://api.ecigstats.org/v1/recordings/?device=${deviceId}&puff=${puffId}&format=json`
    );
  }

  getRecording(deviceId, puffId) {
    return this.request(
      `https://api.ecigstats.org/v1/recordings/?device=${deviceId}&puff=${puffId}&format=json`
    );
  }

  getMaterial(deviceId, materialName) {
    return this.request(
      `https://api.ecigstats.org/v1/materials/?device=${deviceId}&material=${materialName}&format=json`
    );
  }
}
