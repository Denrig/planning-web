import { TYPES } from './votingTypes';
import { notifyRequestError } from '~/utils/notificationsUtils.js';

export const state = () => ({
  showVotes: false,
});

export const getters = {
  showVotes: (state) => state.showVotes,
};

export const actions = {
  // WebSocket actions
  playerVoted({ commit }, data) {
    commit('room/PLAYER_VOTED', { ...data, voted: true }, { root: true });
  },

  playerCanceledVote({ commit }, userId) {
    commit('room/PLAYER_VOTED', { vote: { user_id: userId, vote: null }, voted: false }, { root: true });
  },

  // Api requests
  voteTask({ commit }, vote) {
    return this.$api.tasks
      .vote(vote)
      .catch((errors) => commit(TYPES.VOTE_ERROR, errors));
  },

  cancelVote({ commit }, payload) {
    return this.$api.tasks
      .cancelVote(payload)
      .catch((errors) => commit(TYPES.VOTE_ERROR, errors));
  },
};

export const mutations = {

  [TYPES.VOTE_ERROR](errors) {
    notifyRequestError(this, errors.response);
  },

  [TYPES.SET_SHOW_VOTES](state, value) {
    state.showVotes = value;
  },
};