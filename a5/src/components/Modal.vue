<template>
  <div class="modal-backdrop">
    <div class="modal">
        <v-card outlined style="height:100%;">
            <v-card-title>
                Edit Freet
            </v-card-title>

            <div class="d-flex justify-center">
                <v-form ref="form" style="width:90%;">
                <v-textarea
                outlined
                v-model="newContent"
                ref="modalTextBox"
                no-resize
                ></v-textarea>
            </v-form>
            </div>
            <v-spacer></v-spacer>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="error"
                @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                color="primary"
                @click="submit"
                >
                    Update Freet
                </v-btn>

            </v-card-actions>
        </v-card>

    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";

export default {
    name: "Modal",
    props: ["freetId", "oldContent"],
    data() {
        return {
            newContent: this.oldContent,
        }
    },
    methods: {
        submit() {
            eventBus.$emit('modal-update-freet', this.freetId, this.$refs.modalTextBox.value);
        },
        close() {
            this.$emit('modal-close');
        },
    },
    created() {
    },
};
</script>

<style scoped>
#edit-text-input {
    width: 10%;
    height: 10%;
    resize: none;
    border-color: white;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    position: relative;
    width: 30vw;
    height: 28vh;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>
