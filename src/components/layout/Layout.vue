<template>
  <el-container>
    <el-header style="padding: 0">
      <Header/>
    </el-header>
    <el-main style="padding: 0">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import Header from "@/components/layout/Header";

export default {
  name: "Layout",
  components: {Header},
}
</script>

<style scoped>
.el-main {
  overflow: auto;
}
</style>
