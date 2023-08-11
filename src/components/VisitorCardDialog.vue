<template lang="pug">
q-dialog(v-model="dialogVisible" @keyup.enter="save")
      q-card(class="dialog")
        q-card-section
          div.text-h6 {{ isEditMode ? "Edit Visitor" : "Add a Visitor" }}
        q-card-section
          q-input(filled v-model="localVisitor.firstName" label="First Name" required)
          q-input(filled v-model="localVisitor.lastName" label="Last Name" required)
          q-input(filled v-model="localVisitor.iin" label="ИИН" required)
          q-input(filled v-model="localVisitor.phoneNumber" label="Phone Number" required)
          q-input(filled v-model="localVisitor.company" label="Company" required)
          q-input(filled v-model="localVisitor.position" label="Position" required)
          q-select(
            filled
            v-model="localVisitor.type"
            label="Type"
            :options="['Многоразовый', 'Временный']"
            required
          )
          input(type="file" @change="onFileChange")
          Cropper(
            ref="cropperRef"
            :src="croppieImage"
            :stencil-props="{ aspectRatio: 1,}"
          )
        q-card-actions(align="right")
          q-btn(flat label="Cancel" color="primary" @click="cancel")
          q-btn(
            flat
            :label="isEditMode ? 'Edit' : 'Save'"
            color="primary"
            :disabled="!canSave"
            @click="save"
           )
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import axios from "axios";

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
      dialogVisible: this.show,
      localVisitor: null,
      isEditMode: false,
      selectedFile: null,
      croppieImage: null,
      croppieInitialized: false,
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
    cancel() {
      this.dialogVisible = false;
      this.$emit("update:show", false);
      this.resetForm();
    },
    save() {
      const image = this.$refs.cropperRef.resultImage;
      const blob = new Blob([image], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", blob, "cropped-image.jpeg");

      axios
        .post("/upload-photo", formData)
        .then((response) => {
          this.localVisitor.photoUrl = response.data.photoUrl;
          this.$emit("update:show", false);
          this.$emit("save", this.localVisitor);
          this.resetForm();
        })
        .catch((error) => {
          console.error("Ошибка при загрузке фотографии:", error);
        });
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
        photo: null,
      };
    },
    onFileChange(event) {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.croppieImage = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      } else {
        console.warn("No file selected or browser doesn’t support File API");
      }
    },
    onCroppieInit() {
      this.croppieInitialized = true;
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
.dialog {
  width: 80vw;
}
</style>
