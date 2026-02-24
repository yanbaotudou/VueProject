<template>
  <div class="page-header page-card flex-between">
    <div>
      <h2 class="title">{{ title }}</h2>
      <p v-if="description" class="desc">{{ description }}</p>
    </div>
    <div class="actions">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.page-header {
  padding: 16px 20px;
  margin-bottom: 16px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.desc {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

@media (max-width: 992px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
  }

  .title {
    font-size: 18px;
  }

  .actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
