import {
  Service,
  AccessoryPlugin,
  Logging,
  AccessoryConfig,
  API,
} from 'homebridge';

/*eslint-disable */
const fetch = require('node-fetch');

export = (api: API) => {
  api.registerAccessory('StatelessBlinds', StatelessBlindAccessory);
};

/**
 * @description Available network options.
 * */
interface IStatelessBlindAccessoryRequest {
    delay?: number,
    url: string;
    method: string;
    headers: Record<string, string>;
    body: Record<string, any>;
}

/**
 * @description Describes the contents of a stateless blind accessory.
 * */
interface IStatelessBlindAccessoryConfig extends AccessoryConfig {
    up: {
        'name': string;
        'active': boolean;
        'request': IStatelessBlindAccessoryRequest;
    };
    down: {
        'name': string;
        'active': boolean;
        'request': IStatelessBlindAccessoryRequest;
    };
    stop: {
        'request': IStatelessBlindAccessoryRequest;
    };
}
/*eslint-enable */

/**
 * @description Represents the stateless blind accessory.
 * */
class StatelessBlindAccessory implements AccessoryPlugin {

  /**
     * @description Contains the reference to the up switch.
     * */
  private readonly upService: Service;

  /**
     * @description Contains the reference to the down switch.
     * */
  private readonly downService: Service;

  /**
     * Contains the reference for to the logging instance.
     * */
  private readonly log: Logging;

  /**
     * @description Contains the reference to the information service.
     * */
  private readonly informationService: Service;

  /**
     * @description Contains the reference to the accessory config.
     * */
  private readonly config: AccessoryConfig;

  /**
     * @description Contains the reference to the api.
     * */
  private readonly api: API;

  /**
     * Initializes a new instance of the {@link StatelessBlindAccessory} class.
     *
     * @param {Logging} log Contains the reference to the logging instance.
     * @param {AccessoryConfig} config Contains the reference to the config of the accessory.
     * @param {API} api Contains the reference to the apis.
     * */
  constructor(log: Logging, config: AccessoryConfig, api: API) {

    this.log = log;
    this.api = api;
    this.config = config;

    const upName = `${this.config.name} ${this.config.up.name}`;
    const downName = `${this.config.name} ${this.config.down.name}`;

    this.upService = new this.api.hap.Service.Switch(upName, 'up');
    this.downService = new this.api.hap.Service.Switch(downName, 'down');

    this.upService.setCharacteristic(this.api.hap.Characteristic.Name, upName);
    this.downService.setCharacteristic(this.api.hap.Characteristic.Name, downName);

    this.upService.getCharacteristic(this.api.hap.Characteristic.On)
      .onGet(this.handleOnUpGet.bind(this))
      .onSet(this.handleOnUpSet.bind(this));
    this.downService.getCharacteristic(this.api.hap.Characteristic.On)
      .onGet(this.handleOnDownGet.bind(this))
      .onSet(this.handleOnDownSet.bind(this));


    this.informationService = new this.api.hap.Service.AccessoryInformation()
      .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Stateless Blinds Inc')
      .setCharacteristic(this.api.hap.Characteristic.Model, 'Stateless Blinds')
      .setCharacteristic(this.api.hap.Characteristic.Version, '1.0.0');
  }

  /**
     * @description Gets the list of available services.
     * */
  getServices(): Service[] {
    return [
      this.informationService,
      this.downService,
      this.upService,
    ];
  }

  /**
     * @description Gets the initial state of the up switch.
     */
  handleOnUpGet() {
    return this.config.up.active;
  }

  /**
     * @description Handles the state change of the up switch.
     */
  handleOnUpSet(value) {
    if (value) {
      this.sendCommand('up');
      return;
    }

    this.sendCommand('stop');
  }

  /**
     * @description Gets the initial state of the down switch.
     */
  handleOnDownGet() {
    return this.config.down.active;
  }

  /**
     * @description Handles the state change of the down switch.
     */
  handleOnDownSet(value) {
    if (value) {
      this.sendCommand('down');
      return;
    }

    this.sendCommand('stop');
  }

  /**
     * Sends a command.
     *
     * @param {string} command Contains the command to send.
     * */
  private sendCommand(command: 'stop' | 'up' | 'down') {
    const requestInformation: IStatelessBlindAccessoryRequest = this.config[command].request;

    if (requestInformation.delay) {
      setTimeout(() => this.sendRequest(requestInformation), requestInformation.delay);
      return;
    }

    this.sendRequest(requestInformation);
  }

  /**
   * Sends a network request
   *
   * @param {IStatelessBlindAccessoryRequest} request Contains the request details in order to send it.
   * */
  private sendRequest(request: IStatelessBlindAccessoryRequest) {
    if (request.method.toUpperCase() === 'GET') {
      return fetch(request.url, {
        method: request.method,
        headers: request.headers,
      });
    }

    return fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(request.body),
    });
  }
}
