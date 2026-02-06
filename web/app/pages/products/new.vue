<script setup lang="ts">
const router = useRouter();
const config = useRuntimeConfig();
const base = process.server ? config.apiInternalBase : config.public.apiBase;

const submitting = ref(false);
const submitError = ref<string | null>(null);

async function submit({ name, description, file }: any) {
  submitError.value = null;

  if (!file) {
    submitError.value = "Selecciona una imagen.";
    return;
  }

  const fd = new FormData();
  fd.append("name", String(name ?? "").trim());
  fd.append("description", String(description ?? "").trim());
  fd.append("image", file);

  try {
    submitting.value = true;

    await $fetch(`${base}/products`, {
      method: "POST",
      body: fd,
    });

    router.push("/");
  } catch (e: any) {
    submitError.value =
      e?.data?.message || "No se pudo crear el producto. Intenta nuevamente.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="page">
    <div class="container">
      <div class="pageHead">
        <div>
          <p class="pageKicker">Productos</p>
          <h1 class="pageTitle">Nuevo producto</h1>
          <p class="pageDesc">Agrega un producto al catálogo con su imagen y descripción.</p>
        </div>

        <div class="pageActions">
          <NuxtLink to="/" class="btn btn--ghost">← Volver</NuxtLink>
        </div>
      </div>

      <div class="panel">
        <div v-if="submitError" class="alert">
          <strong>Ocurrió un problema.</strong>
          <span>{{ submitError }}</span>
        </div>

        <ProductForm mode="create" :onSubmit="submit" :submitting="submitting" />
      </div>
    </div>
  </main>
</template>
