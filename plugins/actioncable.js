import Vue from 'vue';
import ActionCableVue from 'actioncable-vue';

export default ({ $config }) => {
  if (process.client) {
    Vue.use(ActionCableVue, {
      debug: true,
      debugLevel: 'error',
      connectionUrl: $config.webSocketHost,
      connectImmediately: true,
    });
  }
};
