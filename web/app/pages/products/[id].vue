<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const base = process.server ? config.apiInternalBase : config.public.apiBase;

const id = route.params.id as string;

const submitting = ref(false);
const submitError = ref<string | null>(null);

const {
  data: product,
  pending,
  error,
  refresh,
} = await useFetch<any>(() => `${base}/products/${id}`, { server: true });

async function submit({ name, description, file }: any) {
  submitError.value = null;

  const fd = new FormData();
  fd.append("name", String(name ?? "").trim());
  fd.append("description", String(description ?? "").trim());
  if (file) fd.append("image", file);

  try {
    submitting.value = true;

    await $fetch(`${base}/products/${id}`, {
      method: "PUT",
      body: fd,
    });

    router.push("/");
  } catch (e: any) {
    submitError.value =
      e?.data?.message || "No se pudo guardar los cambios. Intenta nuevamente.";
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
          <h1 class="pageTitle">Editar producto</h1>
          <p class="pageDesc">Actualiza datos o cambia la imagen cuando lo necesites.</p>
        </div>

        <div class="pageActions">
          <NuxtLink to="/" class="btn btn--ghost">← Volver</NuxtLink>
          <button class="btn" @click="() => refresh()" :disabled="pending || submitting">
            Recargar
          </button>

        </div>
      </div>

      <div class="panel">
        <div v-if="pending" class="skeleton">
          <div class="skeleton__line"></div>
          <div class="skeleton__line"></div>
          <div class="skeleton__line"></div>
        </div>

        <div v-else-if="error" class="alert">
          <strong>No se pudo cargar el producto.</strong>
          <span>Verifica la API y vuelve a intentar.</span>
        </div>

        <template v-else>
          <div v-if="submitError" class="alert">
            <strong>Ocurrió un problema.</strong>
            <span>{{ submitError }}</span>
          </div>

          <ProductForm
            mode="edit"
            :initial="{
              name: product.name,
              description: product.description,
              imageUrl: product.imageUrl,
            }"
            :onSubmit="submit"
            :submitting="submitting"
          />
        </template>
      </div>
    </div>
  </main>
</template>
