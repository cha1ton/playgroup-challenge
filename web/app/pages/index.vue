<script setup lang="ts">
const config = useRuntimeConfig();
const base = process.server ? config.apiInternalBase : config.public.apiBase;

const q = ref("");

const { data: products, refresh, pending, error } = await useFetch<any[]>(
  () => `${base}/products`,
  { server: true }
);

const filteredProducts = computed(() => {
  const term = q.value.trim().toLowerCase();
  const list = products.value || [];
  if (!term) return list;
  return list.filter((p) =>
    `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase().includes(term)
  );
});

async function onDelete(id: string) {
  if (!confirm("¿Eliminar este producto?")) return;
  await $fetch(`${base}/products/${id}`, { method: "DELETE" });
  await refresh();
}
</script>

<template>
  <main>
    <section class="hero">
      <div class="container hero__grid">
        <div>
          <p class="badge">Playgroup Latam</p>
          <h1 class="hero__title">Catálogo de productos</h1>
          <p class="hero__subtitle">
            Crea, edita y organiza productos de forma rápida, con imágenes y una vista clara para tu equipo.
          </p>
        </div>

        <div class="hero__mascot" aria-hidden="true">
          <img
            src="/banner-home-image.png"
            alt=""
            width="420"
            height="420"
            style="max-width: min(420px, 100%); height: auto;"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>

    <section class="container page">
      <div class="section__top">
        <div>
          <h2 class="section__title">Productos</h2>
          <p class="section__meta" v-if="pending">Cargando...</p>
          <p class="section__meta" v-else>
            {{ filteredProducts.length }} item(s)
            <span v-if="q.trim()"> • filtrado</span>
          </p>
        </div>

        <div class="toolbar">
          <div class="search">
            <input
              v-model="q"
              class="search__input"
              type="search"
              placeholder="Buscar por nombre o descripción..."
              aria-label="Buscar producto"
            />
          </div>

        </div>
      </div>

      <div v-if="error" class="alert">
        <strong>No se pudo cargar la lista.</strong>
        <span>Revisa que la API esté corriendo en {{ base }}.</span>
      </div>

      <div v-else-if="!products?.length && !pending" class="empty">
        <div class="empty__card">
          <h3>Sin productos todavía</h3>
          <p>Empieza creando el primero para armar tu catálogo.</p>
          <NuxtLink to="/products/new" class="btn btn--primary">Crear producto</NuxtLink>
        </div>
      </div>

      <div v-else class="grid">
        <article v-for="p in filteredProducts" :key="p._id" class="card">
          <div class="productCard__imgWrap">
            <img class="productCard__img" :src="p.imageUrl" :alt="p.name" loading="lazy" />
          </div>

          <div class="productCard__body">
            <h3 class="productCard__title">{{ p.name }}</h3>
            <p class="productCard__desc">{{ p.description }}</p>

            <div class="productCard__actions">
              <NuxtLink :to="`/products/${p._id}`" class="btn btn--soft">Editar</NuxtLink>
              <button class="btn btn--danger" @click="onDelete(p._id)">Eliminar</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
