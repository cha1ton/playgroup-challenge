<template>
  <div>
    <header class="header">
      <div class="container header__inner">
        <NuxtLink to="/" class="brand" aria-label="Playgroup Latam">
          <img class="brand__logo" src="/playgroup-lgt.png" alt="Playgroup Latam" />
        </NuxtLink>

        <nav class="nav" aria-label="Navegación">
          <NuxtLink to="/" class="nav__link">Productos</NuxtLink>
          <NuxtLink to="/products/new" class="btn btn--primary">Nuevo producto</NuxtLink>
        </nav>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>
