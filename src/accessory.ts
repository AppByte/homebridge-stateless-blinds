import {
  Service,
  AccessoryPlugin,
  Logging,
  AccessoryConfig,
  API,
} from 'homebridge';

/*eslint-disable */
const fetch = require('node-fetch');
/*eslint-enable */

export = (api: API) => {
  api.registerAccessory('StatelessBlinds', StatelessBlindAccessory);
};

/**
 * @description Available network options.
 * */
interface IStatelessBlindAccessoryRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
    /*eslint-disable */
    body: Record<string, any>;
    /*eslint-enable */
}

/**
 * @description Describes the contents of a stateless blind accessory.
 * */
interface IStatelessBlindAccessoryConfig extends AccessoryConfig {
    'up': {
        'name': string;
        'active': boolean;
        'request': IStatelessBlindAccessoryRequest;
    };
    'down': {
        'name': string;
        'active': boolean;
        'request': IStatelessBlindAccessoryRequest;
    };
    'stop': {
        'request': IStatelessBlindAccessoryRequest;
    };
}

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
  private readonly config: IStatelessBlindAccessoryConfig;

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

    this.upService = new this.api.hap.Service.Switch(this.config.up.name, 'up');
    this.downService = new this.api.hap.Service.Switch(this.config.down.name, 'down');

    this.upService.name = this.config.up.name;
    this.downService.name = this.config.down.name;

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
      this.sendRequest('up');
      return;
    }

    this.sendRequest('stop');
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
      this.sendRequest('down');
      return;
    }

    this.sendRequest('stop');
  }

  /**
     * Sends a network request
     *
     * @param {string} command Contains the command to send.
     * */
  private sendRequest(command: 'stop' | 'up' | 'down') {
    const requestInformation = this.config[command].request;

    if (requestInformation.method.toUpperCase() === 'GET') {
      return fetch(requestInformation.url, {
        method: requestInformation.method,
        headers: requestInformation.headers,
      });
    }

    return fetch(requestInformation.url, {
      method: requestInformation.method,
      headers: requestInformation.headers,
      body: JSON.stringify(requestInformation.body),
    });
  }
}
