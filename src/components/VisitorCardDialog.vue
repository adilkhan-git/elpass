<template lang="pug">
q-dialog(v-model="dialogVisible" @hide="handleHide" @keyup.enter="save")
    q-card(class="dialog")
      q-card-section
        div.text-h6 {{ isEditMode ? $t('editVisitor') : $t('addVisitor') }}
  
      q-card-section
        q-input(filled v-model="localVisitor.firstName" :label="$t('firstName')" required)
        q-input(filled v-model="localVisitor.lastName" :label="$t('lastName')" required)
        q-input(filled v-model="localVisitor.iin" :label="$t('iin')" required)
        q-input(filled v-model="localVisitor.phoneNumber" :label="$t('phoneNumber')" required)
        q-input(filled v-model="localVisitor.company" :label="$t('company')" required)
        q-input(filled v-model="localVisitor.position" :label="$t('positionTitle')" required)
        q-select(
          filled
          v-model="localVisitor.type"
          :label="$t('type')"
          :options="[$t('multiEntry'), $t('temporary')]"
          required
        )
        input(type="file" @change="onFileChange")
        Cropper(
          ref="cropperRef"
          :src="croppieImage"
          :stencil-props="{ aspectRatio: 1,}"
        )
      q-card-actions(align="right")
        q-btn(flat :label="$t('cancel')" color="primary" @click="cancel")
        q-btn(
          flat
          :label="isEditMode ? $t('edit') : $t('save')"
          color="primary"
          :disabled="!canSave"
          @click="save"
        )
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import axios from "axios";
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
    ...mapActions(["addCard", "updateCard"]),
    handleHide() {
      this.$emit("update:show", false);
    },
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

      // Имитация успешного ответа сервера
      this.localVisitor.photoUrl = this.croppieImage;
      this.$emit("update:show", false);
      this.$emit("save", this.localVisitor);
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
        photo: null,
      };
    },
    onFileChange(event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const fileTypes = ["image/jpeg", "image/png", "image/gif"];
        if (fileTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.croppieImage = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          console.warn("Invalid file type. Please select an image file.");
        }
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
