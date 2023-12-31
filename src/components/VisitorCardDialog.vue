<template>
  <q-dialog v-model="showDialog" @hide="handleHide" @keyup.enter="save">
    <q-card class="dialog">
      <q-card-section>
        <div class="text-h6">
          {{ isEditMode ? $t("editVisitor") : $t("addVisitor") }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          v-model="localCard.firstName"
          :label="$t('name')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localCard.iin"
          :label="$t('iin')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localCard.phoneNumber"
          :label="$t('phoneNumber')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localCard.company"
          :label="$t('company')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localCard.position"
          :label="$t('positionTitle')"
          required
        ></q-input>
        <q-select
          filled
          v-model="localCard.type"
          :label="$t('type')"
          :options="[$t('multiEntry'), $t('temporary')]"
          required
        ></q-select>
      </q-card-section>
      <q-card-section>
        <button @click="toggleCamera">
          {{ cameraStream ? "Stop Camera" : "Start Camera" }}
        </button>
        <video v-if="cameraStream" ref="video" autoplay playsinline></video>
        <button v-if="cameraStream" @click="capturePhoto">Capture Photo</button>
        <input type="file" @change="onFileChange" />
        <div class="photo-frame" v-if="imageUrl">
          <cropper
            :src="imageUrl"
            :stencil-props="{
              aspectRatio: 1,
              minWidth: 100,
              minHeight: 100,
              maxWidth: 300,
              maxHeight: 300,
              initialCoordinates: { left: 0, top: 0, width: 300, height: 300 },
            }"
            ref="cropper"
            @change="handleCropChange"
          />
        </div>
        <button v-if="imageUrl" @click="cropImage">Crop Image</button>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="primary"
          @click="cancel"
        ></q-btn>
        <q-btn
          flat
          :label="isEditMode ? $t('edit') : $t('save')"
          color="primary"
          :disabled="!canSave"
          @click="save"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { mapActions } from "vuex";

export default {
  components: {
    Cropper,
  },
  props: {
    show: Boolean,
    visitor: Object,
  },
  data() {
    return {
      showDialog: false,
      localCard: {
        uuid: "",
        no: "",
        name: "",
        group: "",
        upload: null,
        created_at: null,
        begin_at: null,
        end_at: null,
      },
      isEditMode: false,
      imageUrl: null,
      cameraStream: null,
      videoElement: null,
    };
  },
  watch: {
    visitor: {
      handler(val) {
        this.localCard = { ...val };
        this.isEditMode = !!val;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(["createCard"]),
    handleCropChange(coordinates) {
      const canvas = this.$refs.cropper.getCanvas(coordinates);
      this.displayedImageUrl = canvas.toDataURL("image/jpeg");
    },
    cropImage() {
      const canvas = this.$refs.cropper.getCanvas();
      this.imageUrl = canvas.toDataURL("image/jpeg");
    },

    async startCamera() {
      try {
        this.cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.$nextTick(() => {
          this.videoElement = this.$refs.video;
          this.videoElement.srcObject = this.cameraStream;
        });
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    },

    async capturePhoto() {
      const canvas = document.createElement("canvas");
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      this.cameraStream.getTracks().forEach((track) => track.stop()); // Stop the camera stream
      this.cameraStream = null;
      this.imageUrl = canvas.toDataURL("image/jpeg");
    },
    async toggleCamera() {
      if (this.cameraStream) {
        this.stopCamera();
      } else {
        await this.startCamera();
      }
    },
    stopCamera() {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((track) => track.stop());
        this.cameraStream = null;
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleHide() {
      this.$emit("update:show", false);
      this.resetForm();
    },

    cancel() {
      this.dialogVisible = false;
      this.$emit("update:show", false);
      this.resetForm();
    },
    save() {
      this.$emit("update:show", false);
      this.$store
        .dispatch("createCard", this.localCard)
        .then(() => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "info",
            message: "Card created successfully",
          });
          this.resetForm();
        })
        .catch((error) => {
          console.error("Error creating card:", error);
          this.$q.notify({
            color: "red-4",
            textColor: "white",
            icon: "warning",
            message: "Failed to create card",
          });
        });
    },

    resetForm() {
      this.localCard = {
        uuid: "",
        no: "",
        name: "",
        group: "",
        upload: null,
        created_at: null,
        begin_at: null,
        end_at: null,
      };
      this.imageUrl = null;
    },
  },
  computed: {
    canSave() {
      return (
        this.localCard.name &&
        this.localCard.uuid &&
        this.localCard.no &&
        this.localCard.phoneNumber &&
        this.localCard.company &&
        this.localCard.position &&
        this.localCard.type
      );
    },
  },
};
</script>

<style scoped>
.photo-frame {
  width: 400px;
  height: 300px;
  border: 3px solid #3d35a7;
  border-radius: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
