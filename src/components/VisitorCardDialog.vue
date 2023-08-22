<template>
  <q-dialog v-model="dialogVisible" @hide="handleHide" @keyup.enter="save">
    <q-card class="dialog">
      <q-card-section>
        <div class="text-h6">
          {{ isEditMode ? $t("editVisitor") : $t("addVisitor") }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          v-model="localVisitor.firstName"
          :label="$t('firstName')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localVisitor.lastName"
          :label="$t('lastName')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localVisitor.iin"
          :label="$t('iin')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localVisitor.phoneNumber"
          :label="$t('phoneNumber')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localVisitor.company"
          :label="$t('company')"
          required
        ></q-input>
        <q-input
          filled
          v-model="localVisitor.position"
          :label="$t('positionTitle')"
          required
        ></q-input>
        <q-select
          filled
          v-model="localVisitor.type"
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
          <img :src="imageUrl" />
        </div>
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
export default {
  props: {
    show: Boolean,
    visitor: Object,
  },
  data() {
    return {
      dialogVisible: this.show,
      localVisitor: null,
      isEditMode: false,
      imageUrl: null,
      cameraStream: null,
      videoElement: null,
    };
  },
  watch: {
    show(val) {
      this.dialogVisible = val;
    },
    visitor: {
      handler(val) {
        this.localVisitor = { ...val };
        this.isEditMode = !!val;
      },
      immediate: true,
    },
  },
  methods: {
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
      this.resetForm(); // Добавьте эту строку
    },

    cancel() {
      this.dialogVisible = false;
      this.$emit("update:show", false);
      this.resetForm();
    },
    save() {
      this.$emit("update:show", false);
      this.$emit("save", {
        ...this.localVisitor,
        photoUrl: this.imageUrl,
      });
      this.resetForm();
    },
    resetForm() {
      this.localVisitor = {
        firstName: "",
        lastName: "",
        iin: "",
        phoneNumber: "",
        company: "",
        position: "",
        type: "",
      };
      this.imageUrl = null;
    },
  },
  computed: {
    canSave() {
      return (
        this.localVisitor.firstName &&
        this.localVisitor.lastName &&
        this.localVisitor.iin &&
        this.localVisitor.phoneNumber &&
        this.localVisitor.company &&
        this.localVisitor.position &&
        this.localVisitor.type
      );
    },
  },
};
</script>

<style scoped>
.photo-frame {
  width: 300px;
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
