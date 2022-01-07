<template lang="pug">
.create-user-modal
  Modal(
    size="medium",
    modal-title="Create User",
    modal-description="Create User",
    v-show="userModal",
    :showCloseButton="false"
  )
    template(v-slot:modal-header)
      h1.info-text User Info
    template(v-slot:modal-body)
      ValidationObserver(v-slot="{ handleSubmit }")
        form(@submit.prevent="handleSubmit(handleUserAction)")
          b-container
            b-row
              ValidationProvider.input-group.text(
                rules="required",
                name="roomsName",
                v-slot="{ errors, invalid, dirty }",
                tag="div"
              )
                input.w-100(
                  type="string",
                  v-model="form.name",
                  placeholder="Your Name",
                  :class="{ invalid: invalid && dirty }"
                )
          b-row
            label.info-text Choose Your Character Image
            HorizontalSelect.character-select(
              :items="characterImages",
              @itemSelected="handlePhotoChange",
              ref="characterSelect"
            )
              template(v-slot:default="props")
                img(
                  :src="require(`~/assets/images/characters/${props.item}`)",
                  height=150,
                  width=100
                )

          b-row(v-if="withRoles")
            label.info-text Choose Your Role
            HorizontalSelect.role-select(
              :items="userRoles",
              @itemSelected="handleRoleSelect"
            )
              template(v-slot:default="props")
                img(
                  :src="require(`~/assets/images/roles/${props.item.image}`)",
                  height=100,
                  width=100
                )
                .role-name {{ props.item.role }}
          b-row
            button.app-button.w-100.start-voting(@click="handleUserAction") Let's Go!
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Modal from '@/components/common/Modal.vue';
import HorizontalSelect from '@/components/common/HorizontalSelect.vue';
import CHARACTER_IMAGES from '@/utils/character-utils.js';

export default {
  name: 'UserModal',

  components: {
    Modal,
    HorizontalSelect,
  },

  props: {
    withRoles: {
      type: Boolean,
      default: true,
    },
    action: {
      type: String,
      default: 'create',
    },
  },

  data() {
    return {
      form: {},
      characterImages: CHARACTER_IMAGES,
      userRoles: [
        {
          role: 'player',
          image: 'player.png',
        },
        {
          role: 'spectator',
          image: 'spectator.png',
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      userModal: 'modal/userModal',
      currentUser: 'user/currentUser',
      currentRoom: 'room/currentRoom',
    }),
  },

  watch: {
    userModal() {
      if (this.action === 'update') {
        this.getCurrentUser().then(() => {
          this.form = JSON.parse(JSON.stringify(this.currentUser));
          this.$refs.characterSelect.selectByIndex(
            CHARACTER_IMAGES.indexOf(this.form.character_image),
          );
        });
      }
    },
  },

  methods: {
    ...mapActions({
      createUser: 'user/createUser',
      updateUser: 'user/updateUser',
      getCurrentUser: 'user/getCurrentUser',
      handleUserModalState: 'modal/handleUserModal',
      joinRoom: 'room/joinRoom',
    }),

    handleUserAction() {
      let action = null;
      if (this.action === 'create') {
        action = this.createUser({ user: this.form });
      } else {
        action = this.updateUser({ user: this.form });
      }

      action.then(() => {
        if (this.withRoles) this.joinRoomWithRole(action);
        this.$emit('completed');
      });
    },

    handlePhotoChange(image) {
      this.form.character_image = image;
    },

    handleRoleSelect(role) {
      this.form.role = role.role;
    },

    joinRoomWithRole() {
      const joinRoomPayload = {
        user_id: this.currentUser.id,
        room_id: this.currentRoom.id,
        role: this.form.role,
      };

      this.joinRoom(joinRoomPayload);
    },
  },
};
</script>
<style lang="scss">
.role-select {
  justify-content: center;
  .item {
    flex-direction: column;
  }
  .role-name {
    font-size: $medium-text;
    font-weight: $bold;

    &::first-letter {
      text-transform: capitalize;
    }
  }
}
</style>