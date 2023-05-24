<template>
  <div>
    <template v-if="!errorCode">
      <el-menu
        default-active="/address/0x00fDe51cC2EE327F2cB7f85EF13947f4d6E4574F"
        class="el-menu-demo"
        mode="horizontal"
        :router="true"
      >
        <el-menu-item
          index="/address/0x00fDe51cC2EE327F2cB7f85EF13947f4d6E4574F"
          >Home</el-menu-item
        >
      </el-menu>
      <Nuxt
    /></template>
    <template v-else>
      <div class="container">
        <h1>Page not found</h1>
        <h1>{{ ERROR_CODE[errorCode] }}</h1>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ERROR_CODE } from '@/constants/error'
export default {
  data() {
    return {
      ERROR_CODE,
    }
  },
  computed: {
    ...mapState(['errorCode']),
  },
}
</script>
<style scoped>
.el-menu {
  position: sticky;
  top: 0;
}
.container {
  margin: auto;
  text-align: center;
}
</style>
