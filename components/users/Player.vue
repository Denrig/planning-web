<template lang="pug">
.player-wrapper(:class="{ voted: user.voted }")

  .player
    img.avatar(:src="userImage")
    .name {{user.name}}
  .vote-display(:class="{ active: userVoted }" ref="vote-display")
    .circle
      span {{ user.vote }}
    .handle
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Player',
  props: {
    userId: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters({
      showVotes: 'voting/showVotes',
      player: 'room/getPlayer',
      currentUserId: 'user/currentUserId',
    }),

    displayKickButton() {
      return this.userId !== this.currentUserId;
    },

    user() {
      return this.player(this.userId);
    },

    userVoted() {
      return this.showVotes && this.user.voted === true;
    },

    userImage() {
      return this.user.character_image ? `/characters/${this.user.character_image}` : '';
    },
  },
};
</script>
