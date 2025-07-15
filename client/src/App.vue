<template>
  <div id="app">
    <router-view /> <!-- Tự động hiển thị component dựa trên route -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Global styles nếu cần */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}
</style>
