<script setup lang="ts">
const props = defineProps<{
  mode: "create" | "edit";
  initial?: { name: string; description: string; imageUrl?: string };
  onSubmit: (payload: { name: string; description: string; file?: File }) => Promise<void>;
  submitting?: boolean;
}>();

const name = ref(props.initial?.name || "");
const description = ref(props.initial?.description || "");
const file = ref<File | undefined>(undefined);

const localPreviewUrl = ref<string | null>(null);

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const f = input.files?.[0];
  file.value = f;

  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
  localPreviewUrl.value = f ? URL.createObjectURL(f) : null;
}

onBeforeUnmount(() => {
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
});
</script>

<template>
  <form class="form" @submit.prevent="onSubmit({ name, description, file })">
    <div class="form__grid">
      <label class="field">
        <span class="field__label">Nombre</span>
        <input
          class="field__input"
          v-model="name"
          required
          :disabled="submitting"
          placeholder="Ej: Producto X"
        />
      </label>

      <label class="field">
        <span class="field__label">Descripción</span>
        <textarea
          class="field__input field__input--textarea"
          v-model="description"
          required
          :disabled="submitting"
          placeholder="Describe el producto..."
        />
      </label>

      <div class="formRow">
        <label class="field">
          <span class="field__label">
            Imagen <span class="hint">{{ mode === "create" ? "(obligatoria)" : "(opcional)" }}</span>
          </span>
          <input
            class="field__file"
            type="file"
            accept="image/*"
            :required="mode === 'create'"
            :disabled="submitting"
            @change="onFileChange"
          />
        </label>

        <br>

        <div class="preview" v-if="localPreviewUrl || initial?.imageUrl">
          <div class="preview__text">
            <small v-if="localPreviewUrl">Vista previa (nuevo archivo)</small>
            <small v-else>Imagen actual</small>
          </div>
          <br>
          <img
            class="preview__img"
            :src="localPreviewUrl || initial?.imageUrl"
            alt="Vista previa de imagen"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <div class="form__actions">
      <button class="btn btn--primary" type="submit" :disabled="submitting">
        <span v-if="submitting">Guardando...</span>
        <span v-else>{{ mode === "create" ? "Crear producto" : "Guardar cambios" }}</span>
      </button>
    </div>
  </form>
</template>
